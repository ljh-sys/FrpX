package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
)

// App holds all application state and methods exposed to the frontend.
type App struct {
	ctx     context.Context
	dataDir string
	frpc    *Frpc
}

// NewApp creates the application instance.
func NewApp() *App {
	return &App{}
}

// startup is called when the frontend is ready.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	exePath, _ := os.Executable()
	exeDir := filepath.Dir(exePath)
	a.dataDir = filepath.Join(exeDir, "data")
	os.MkdirAll(a.dataDir, 0755)

	// Init frpc
	a.frpc = NewFrpc(a.dataDir)

	// Ensure default config
	cfgPath := filepath.Join(a.dataDir, "frpc.toml")
	if _, err := os.Stat(cfgPath); os.IsNotExist(err) {
		os.WriteFile(cfgPath, []byte(defaultConfig), 0644)
	}

	// Load settings
	loadSettings()

	// Auto-start frpc if configured
	if settings.AutoStartFrpc {
		go func() {
			if err := a.frpc.Start(); err != nil {
				fmt.Printf("auto-start frpc failed: %v\n", err)
			}
		}()
	}
}

// shutdown is called when the app is closing.
func (a *App) shutdown(ctx context.Context) {
	if a.frpc != nil {
		a.frpc.Stop()
	}
}

// ── Frontend Bindings ──

// GetStatus returns frpc running state.
func (a *App) GetStatus() map[string]interface{} {
	running := a.frpc.Running()
	resp := map[string]interface{}{
		"running": running,
	}
	if running {
		resp["frpc_version"] = GetLocalVersion(a.dataDir)
		cfgPath := filepath.Join(a.dataDir, "frpc.toml")
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
	return resp
}

// StartFrpc starts the frpc process.
func (a *App) StartFrpc() map[string]interface{} {
	err := a.frpc.Start()
	if err != nil {
		return map[string]interface{}{"ok": false, "error": err.Error()}
	}
	return map[string]interface{}{"ok": true}
}

// StopFrpc stops the frpc process.
func (a *App) StopFrpc() map[string]interface{} {
	err := a.frpc.Stop()
	if err != nil {
		return map[string]interface{}{"ok": false, "error": err.Error()}
	}
	return map[string]interface{}{"ok": true}
}

// GetConfig reads frpc.toml content.
func (a *App) GetConfig() map[string]interface{} {
	cfgPath := filepath.Join(a.dataDir, "frpc.toml")
	data, err := os.ReadFile(cfgPath)
	if err != nil {
		return map[string]interface{}{"content": ""}
	}
	return map[string]interface{}{"content": string(data)}
}

// SaveConfig writes frpc.toml content.
func (a *App) SaveConfig(content string) map[string]interface{} {
	cfgPath := filepath.Join(a.dataDir, "frpc.toml")
	if err := os.WriteFile(cfgPath, []byte(content), 0644); err != nil {
		return map[string]interface{}{"ok": false, "error": err.Error()}
	}
	return map[string]interface{}{"ok": true}
}

// GetVersions fetches frpc releases from GitHub.
func (a *App) GetVersions() map[string]interface{} {
	releases, err := FetchReleases()
	if err != nil {
		return map[string]interface{}{"error": err.Error()}
	}

	current := GetLocalVersion(a.dataDir)
	var latest string
	var versionItems []map[string]interface{}

	for _, rel := range releases {
		asset, ok := FindWinAmd64Asset(rel)
		if !ok {
			continue
		}
		if latest == "" {
			latest = stripV(rel.TagName)
		}
		versionItems = append(versionItems, map[string]interface{}{
			"tag":  stripV(rel.TagName),
			"url":  asset.BrowserDownloadURL,
			"date": rel.PublishedAt,
		})
	}

	return map[string]interface{}{
		"latest":   latest,
		"current":  current,
		"versions": versionItems,
	}
}

// DownloadVersion downloads and extracts a specific frpc version.
func (a *App) DownloadVersion(tag, url string) map[string]interface{} {
	a.frpc.Stop()
	if err := DownloadAndExtract(url, tag, a.dataDir); err != nil {
		return map[string]interface{}{"ok": false, "error": err.Error()}
	}
	return map[string]interface{}{"ok": true}
}

// HasFrpc checks if frpc.exe exists.
func (a *App) HasFrpc() map[string]interface{} {
	_, err := os.Stat(filepath.Join(a.dataDir, "frpc.exe"))
	return map[string]interface{}{"exists": err == nil}
}

// UninstallFrpc removes frpc.exe and version marker.
func (a *App) UninstallFrpc() map[string]interface{} {
	a.frpc.Stop()
	os.Remove(filepath.Join(a.dataDir, "frpc.exe"))
	os.Remove(filepath.Join(a.dataDir, "frpc.version"))
	return map[string]interface{}{"ok": true}
}

// GetLogs returns recent frpc logs.
func (a *App) GetLogs() []logEntry {
	return a.frpc.GetLogs()
}

// ClearLogs clears the log buffer.
func (a *App) ClearLogs() {
	a.frpc.ClearLogs()
}

// GetSettings returns app settings.
func (a *App) GetSettings() Settings {
	settingsMu.RLock()
	defer settingsMu.RUnlock()
	return settings
}

// SaveSettings persists app settings.
func (a *App) SaveSettings(s Settings) map[string]interface{} {
	settingsMu.Lock()
	settings = s
	settingsMu.Unlock()

	if err := saveSettingsFile(); err != nil {
		return map[string]interface{}{"ok": false, "error": err.Error()}
	}

	// Apply autostart registry
	exePath, _ := os.Executable()
	if s.Autostart {
		enableAutoStart(exePath)
	} else {
		disableAutoStart()
	}

	return map[string]interface{}{"ok": true}
}
