package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"

	"github.com/getlantern/systray"
	"github.com/webview/webview_go"
)

//go:embed frontend/*
var frontendFiles embed.FS
var frontendFS fs.FS

func init() {
	var err error
	frontendFS, err = fs.Sub(frontendFiles, "frontend")
	if err != nil {
		panic(err)
	}
}

// ── Settings ──

type Settings struct {
	CloseBehavior string `json:"close_behavior"` // "exit" or "tray"
	Autostart     bool   `json:"autostart"`
	AutoStartFrpc bool   `json:"auto_start_frpc"`
}

var (
	exeDir     string
	dataDir    string // data/ 子目录，存放运行时文件
	settings   Settings
	settingsMu sync.RWMutex
	frpc       *Frpc
)

const settingsFile = "frpx_settings.json"
const defaultConfig = `serverAddr = "127.0.0.1"
serverPort = 7200

auth.method = "token"
auth.token = ""

[[proxies]]
name = "my_service"
type = "tcp"
localIp = "127.0.0.1"
localPort = 25565
remotePort = 1000
`

func loadSettings() {
	settingsMu.Lock()
	defer settingsMu.Unlock()

	settings = Settings{
		CloseBehavior: "exit",
	}

	data, err := os.ReadFile(filepath.Join(dataDir, settingsFile))
	if err != nil {
		return
	}
	json.Unmarshal(data, &settings)
}

func saveSettingsFile() error {
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(dataDir, settingsFile), data, 0644)
}

func ensureDefaults() {
	cfgPath := filepath.Join(dataDir, "frpc.toml")
	if _, err := os.Stat(cfgPath); os.IsNotExist(err) {
		os.WriteFile(cfgPath, []byte(defaultConfig), 0644)
	}
}

// ── Main ──

func main() {
	var err error
	exePath, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}
	exeDir = filepath.Dir(exePath)
	dataDir = filepath.Join(exeDir, "data")
	os.MkdirAll(dataDir, 0755)

	loadSettings()
	ensureDefaults()
	frpc = NewFrpc(dataDir)

	// Auto-start frpc if configured
	if settings.AutoStartFrpc {
		go func() {
			if err := frpc.Start(); err != nil {
				log.Printf("auto-start frpc failed: %v", err)
			}
		}()
	}

	// Start HTTP server
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.FS(frontendFS)))
	mux.HandleFunc("/api/status", handleStatus)
	mux.HandleFunc("/api/start", handleStart)
	mux.HandleFunc("/api/stop", handleStop)
	mux.HandleFunc("/api/config", handleConfig)
	mux.HandleFunc("/api/versions", handleVersions)
	mux.HandleFunc("/api/download", handleDownload)
	mux.HandleFunc("/api/logs", handleLogs)
	mux.HandleFunc("/api/has_frpc", handleHasFrpc)
	mux.HandleFunc("/api/uninstall", handleUninstall)
	mux.HandleFunc("/api/settings", handleSettings)
	mux.HandleFunc("/api/apply_settings", handleApplySettings)

	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		log.Fatal(err)
	}
	port := listener.Addr().(*net.TCPAddr).Port
	go http.Serve(listener, mux)

	url := fmt.Sprintf("http://127.0.0.1:%d", port)

	if settings.CloseBehavior == "tray" {
		go func() {
			w := webview.New(false)
			w.SetTitle("FrpX")
			w.SetSize(720, 580, webview.HintNone)
			w.SetSize(720, 580, webview.HintMin)
			w.Navigate(url)	
			w.Dispatch(func() {
				applyWindowIcon(w, dataDir, frontendFS)
			})
			w.Run()
		}()
		systray.Run(onTrayReady, onTrayExit)
	} else {
		w := webview.New(false)
		defer w.Destroy()
		w.SetTitle("FrpX")
		w.SetSize(720, 580, webview.HintNone)
		w.SetSize(720, 580, webview.HintMin)
		w.Navigate(url)
		w.Dispatch(func() {
			applyWindowIcon(w, dataDir, frontendFS)
		})
		w.Run()
	}
}

// ── API Handlers ──

func handleStatus(w http.ResponseWriter, r *http.Request) {
	running := frpc.Running()
	resp := map[string]interface{}{
		"running": running,
	}

	if running {
		resp["frpc_version"] = GetLocalVersion(dataDir)

		cfgPath := filepath.Join(dataDir, "frpc.toml")
		data, _ := os.ReadFile(cfgPath)
		content := string(data)
		server := extractTOMLValue(content, "serverAddr")
		port := extractTOMLValue(content, "serverPort")
		if server != "" {
			resp["config"] = map[string]string{
				"server": server + ":" + port,
			}
		}
	}

	writeJSON(w, resp)
}

func handleStart(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		writeJSON(w, map[string]interface{}{"ok": false, "error": "POST required"})
		return
	}
	err := frpc.Start()
	if err != nil {
		writeJSON(w, map[string]interface{}{"ok": false, "error": err.Error()})
		return
	}
	writeJSON(w, map[string]interface{}{"ok": true})
}

func handleStop(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		writeJSON(w, map[string]interface{}{"ok": false, "error": "POST required"})
		return
	}
	err := frpc.Stop()
	if err != nil {
		writeJSON(w, map[string]interface{}{"ok": false, "error": err.Error()})
		return
	}
	writeJSON(w, map[string]interface{}{"ok": true})
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	cfgPath := filepath.Join(dataDir, "frpc.toml")

	if r.Method == "GET" {
		data, err := os.ReadFile(cfgPath)
		if err != nil {
			writeJSON(w, map[string]interface{}{"content": ""})
			return
		}
		writeJSON(w, map[string]interface{}{"content": string(data)})
		return
	}

	if r.Method == "POST" {
		body, _ := io.ReadAll(r.Body)
		var req struct {
			Content string `json:"content"`
		}
		json.Unmarshal(body, &req)

		if err := os.WriteFile(cfgPath, []byte(req.Content), 0644); err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "error": err.Error()})
			return
		}
		writeJSON(w, map[string]interface{}{"ok": true})
		return
	}

	writeJSON(w, map[string]interface{}{"ok": false, "error": "method not allowed"})
}

func handleVersions(w http.ResponseWriter, r *http.Request) {
	// Fetch from GitHub
	releases, err := FetchReleases()
	if err != nil {
		writeJSON(w, map[string]interface{}{
			"error": err.Error(),
		})
		return
	}

	current := GetLocalVersion(dataDir)
	var latest string
	var versionItems []map[string]interface{}

	for _, rel := range releases {
		asset, ok := FindWinAmd64Asset(rel)
		if !ok {
			continue
		}
		if latest == "" {
			latest = strings.TrimPrefix(rel.TagName, "v")
		}

		versionItems = append(versionItems, map[string]interface{}{
			"tag":  strings.TrimPrefix(rel.TagName, "v"),
			"url":  asset.BrowserDownloadURL,
			"date": rel.PublishedAt,
		})
	}

	writeJSON(w, map[string]interface{}{
		"latest":   latest,
		"current":  current,
		"versions": versionItems,
	})
}

func handleDownload(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		writeJSON(w, map[string]interface{}{"ok": false, "error": "POST required"})
		return
	}

	body, _ := io.ReadAll(r.Body)
	var req struct {
		Tag string `json:"tag"`
		URL string `json:"url"`
	}
	json.Unmarshal(body, &req)

	frpc.Stop()

	if err := DownloadAndExtract(req.URL, req.Tag, dataDir); err != nil {
		writeJSON(w, map[string]interface{}{"ok": false, "error": err.Error()})
		return
	}

	writeJSON(w, map[string]interface{}{"ok": true})
}

func handleLogs(w http.ResponseWriter, r *http.Request) {
	if r.Method == "DELETE" {
		frpc.ClearLogs()
		writeJSON(w, map[string]interface{}{"ok": true})
		return
	}
	logs := frpc.GetLogs()
	writeJSON(w, map[string]interface{}{"logs": logs})
}

func handleHasFrpc(w http.ResponseWriter, r *http.Request) {
	_, err := os.Stat(filepath.Join(dataDir, "frpc.exe"))
	writeJSON(w, map[string]interface{}{
		"exists": err == nil,
	})
}

func handleUninstall(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		writeJSON(w, map[string]interface{}{"ok": false, "error": "POST required"})
		return
	}

	frpc.Stop()

	frpcPath := filepath.Join(dataDir, "frpc.exe")
	verPath := filepath.Join(dataDir, "frpc.version")

	os.Remove(frpcPath)
	os.Remove(verPath)

	writeJSON(w, map[string]interface{}{"ok": true})
}

func handleSettings(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		settingsMu.RLock()
		defer settingsMu.RUnlock()
		writeJSON(w, settings)
		return
	}

	if r.Method == "POST" {
		body, _ := io.ReadAll(r.Body)
		var s Settings
		if err := json.Unmarshal(body, &s); err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "error": err.Error()})
			return
		}

		settingsMu.Lock()
		settings = s
		settingsMu.Unlock()

		if err := saveSettingsFile(); err != nil {
			writeJSON(w, map[string]interface{}{"ok": false, "error": err.Error()})
			return
		}
		writeJSON(w, map[string]interface{}{"ok": true})
		return
	}

	writeJSON(w, map[string]interface{}{"ok": false, "error": "method not allowed"})
}

func handleApplySettings(w http.ResponseWriter, r *http.Request) {
	settingsMu.RLock()
	auto := settings.Autostart
	settingsMu.RUnlock()

	exePath := filepath.Join(exeDir, "FrpX.exe")

	if auto {
		enableAutoStart(exePath)
	} else {
		disableAutoStart()
	}

	writeJSON(w, map[string]interface{}{"ok": true})
}

// ── Systray ──

func onTrayReady() {
	systray.SetTitle("FrpX")
	iconData, _ := fs.ReadFile(frontendFS, "icon.ico")
	if len(iconData) > 0 {
		systray.SetIcon(iconData)
	}
	mQuit := systray.AddMenuItem("退出", "")
	go func() {
		for range mQuit.ClickedCh {
			frpc.Stop()
			systray.Quit()
		}
	}()
}

func onTrayExit() {
	frpc.Stop()
}

// ── Registry Helpers ──

func enableAutoStart(exePath string) {
	cmd := exec.Command("reg", "add",
		`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`,
		"/v", "FrpX",
		"/t", "REG_SZ",
		"/d", fmt.Sprintf(`"%s"`, exePath),
		"/f",
	)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	cmd.Run()
}

func disableAutoStart() {
	cmd := exec.Command("reg", "delete",
		`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`,
		"/v", "FrpX",
		"/f",
	)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	cmd.Run()
}

// ── Helpers ──

func writeJSON(w http.ResponseWriter, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func extractTOMLValue(content, key string) string {
	for _, line := range strings.Split(content, "\n") {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, key) && strings.Contains(line, "=") {
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				val := strings.TrimSpace(parts[1])
				val = strings.Trim(val, `"`)
				return val
			}
		}
	}
	return ""
}
