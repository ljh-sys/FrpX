package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
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
	CloseBehavior string `json:"close_behavior"`
	Autostart     bool   `json:"autostart"`
	AutoStartFrpc bool   `json:"auto_start_frpc"`
}

var (
	settings   Settings
	settingsMu sync.RWMutex
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

	exePath, _ := os.Executable()
	exeDir := filepath.Dir(exePath)
	dataDir := filepath.Join(exeDir, "data")

	data, err := os.ReadFile(filepath.Join(dataDir, settingsFile))
	if err != nil {
		return
	}
	json.Unmarshal(data, &settings)
}

func saveSettingsFile() error {
	exePath, _ := os.Executable()
	exeDir := filepath.Dir(exePath)
	dataDir := filepath.Join(exeDir, "data")
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(dataDir, settingsFile), data, 0644)
}

// ── Main ──

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "FrpX",
		Width:  720,
		Height: 580,
		MinWidth:  720,
		MinHeight: 580,
		AssetServer: &assetserver.Options{
			Assets: frontendFS,
		},
		OnStartup:  app.startup,
		OnShutdown: app.shutdown,
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
		},
	})

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
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

func stripV(tag string) string {
	return strings.TrimPrefix(tag, "v")
}
