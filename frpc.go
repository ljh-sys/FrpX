package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"
	"time"
)

// Frpc manages the frpc.exe child process.
type Frpc struct {
	mu       sync.Mutex
	cmd      *exec.Cmd
	dataDir  string
	running  bool
	logs     []logEntry
	logMu    sync.RWMutex
	logWg    sync.WaitGroup
	logIndex int64 // monotonically increasing
}

type logEntry struct {
	Index int64  `json:"index"`
	Time  string `json:"time"`
	Level string `json:"level"`
	Text  string `json:"text"`
}

var (
	logBufSize = 500
	logTimeFmt = "15:04:05"
)

func NewFrpc(dataDir string) *Frpc {
	return &Frpc{dataDir: dataDir}
}

// killAllFrpc force-kills all frpc.exe processes on the system.
func killAllFrpc() {
	kill := exec.Command("taskkill", "/F", "/IM", "frpc.exe")
	kill.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	kill.Run()
}

// Start kills all existing frpc processes, then launches a fresh one.
func (f *Frpc) Start() error {
	f.mu.Lock()
	defer f.mu.Unlock()

	// Kill all frpc processes first
	killAllFrpc()
	f.running = false
	f.cmd = nil

	frpcPath := filepath.Join(f.dataDir, "frpc.exe")
	cfgPath := filepath.Join(f.dataDir, "frpc.toml")

	if _, err := os.Stat(frpcPath); os.IsNotExist(err) {
		return fmt.Errorf("frpc.exe not found")
	}

	f.cmd = exec.Command(frpcPath, "-c", cfgPath)
	f.cmd.Dir = f.dataDir
	f.cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}

	stdout, _ := f.cmd.StdoutPipe()
	stderr, _ := f.cmd.StderrPipe()

	if err := f.cmd.Start(); err != nil {
		return fmt.Errorf("failed to start frpc: %w", err)
	}

	f.running = true
	f.logWg.Add(2)

	go func() {
		defer f.logWg.Done()
		f.readLog(stdout)
	}()
	go func() {
		defer f.logWg.Done()
		f.readLog(stderr)
	}()

	go func() {
		f.cmd.Wait()
		f.logWg.Wait()
		f.mu.Lock()
		f.running = false
		f.cmd = nil
		f.mu.Unlock()
	}()

	return nil
}

func (f *Frpc) readLog(r io.Reader) {
	buf := make([]byte, 4096)
	for {
		n, err := r.Read(buf)
		if n > 0 {
			lines := strings.Split(string(buf[:n]), "\n")
			for _, line := range lines {
				// Strip ANSI escape codes
				line = stripANSI(line)
				line = strings.TrimSpace(line)
				if line != "" {
					f.addLog(line)
				}
			}
		}
		if err != nil {
			break
		}
	}
}

func stripANSI(s string) string {
	var result []byte
	inEscape := false
	for i := 0; i < len(s); i++ {
		if s[i] == '\x1b' {
			inEscape = true
			continue
		}
		if inEscape {
			if (s[i] >= 'a' && s[i] <= 'z') || (s[i] >= 'A' && s[i] <= 'Z') {
				inEscape = false
			}
			continue
		}
		result = append(result, s[i])
	}
	return string(result)
}

func (f *Frpc) addLog(text string) {
	f.logMu.Lock()
	defer f.logMu.Unlock()

	f.logIndex++
	f.logs = append(f.logs, logEntry{
		Index: f.logIndex,
		Time:  time.Now().Format(logTimeFmt),
		Level: detectLevel(text),
		Text:  text,
	})

	// Trim old logs
	if len(f.logs) > logBufSize {
		f.logs = f.logs[len(f.logs)-logBufSize:]
	}
}

// GetLogs returns recent log lines.
func (f *Frpc) GetLogs() []logEntry {
	f.logMu.RLock()
	defer f.logMu.RUnlock()
	result := make([]logEntry, len(f.logs))
	copy(result, f.logs)
	return result
}

// GetLogsSince returns log entries with index > since.
func (f *Frpc) GetLogsSince(since int64) []logEntry {
	f.logMu.RLock()
	defer f.logMu.RUnlock()
	var result []logEntry
	for _, e := range f.logs {
		if e.Index > since {
			result = append(result, e)
		}
	}
	return result
}

// ClearLogs clears the log buffer and resets the index counter.
func (f *Frpc) ClearLogs() {
	f.logMu.Lock()
	defer f.logMu.Unlock()
	f.logs = nil
	f.logIndex = 0
}

// detectLevel extracts log level from frpc log output.
// frpc uses [I]/[W]/[E]/[D] markers and log-level keywords.
func detectLevel(text string) string {
	upper := text
	if len(upper) > 50 {
		upper = upper[:50]
	}
	upper = strings.ToUpper(upper)
	if strings.Contains(upper, "[E]") || strings.Contains(upper, "ERROR") || strings.Contains(upper, "FATAL") {
		return "error"
	}
	if strings.Contains(upper, "[W]") || strings.Contains(upper, "WARN") {
		return "warn"
	}
	if strings.Contains(upper, "[I]") || strings.Contains(upper, "INFO") {
		return "info"
	}
	if strings.Contains(upper, "[D]") || strings.Contains(upper, "DEBUG") {
		return "debug"
	}
	return ""
}

// Stop force-kills all frpc processes and waits for cleanup.
func (f *Frpc) Stop() error {
	f.mu.Lock()
	defer f.mu.Unlock()

	// Kill all frpc processes
	killAllFrpc()

	// Wait for our managed process to exit
	if f.running && f.cmd != nil {
		done := make(chan struct{})
		go func() {
			f.cmd.Wait()
			close(done)
		}()
		select {
		case <-done:
		case <-time.After(3 * time.Second):
		}
		f.logWg.Wait()
	}

	f.running = false
	f.cmd = nil
	return nil
}

func (f *Frpc) Running() bool {
	f.mu.Lock()
	defer f.mu.Unlock()
	return f.running
}
