package main

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"syscall"
	"time"
)

const githubAPI = "https://api.github.com/repos/fatedier/frp/releases"

// Release represents a GitHub release.
type Release struct {
	TagName     string  `json:"tag_name"`
	PublishedAt string  `json:"published_at"`
	Assets      []Asset `json:"assets"`
}

// Asset represents a downloadable file in a release.
type Asset struct {
	Name               string `json:"name"`
	BrowserDownloadURL string `json:"browser_download_url"`
	Size               int64  `json:"size"`
}

// newHTTPClient creates an HTTP client with optional proxy.
func newHTTPClient(timeout time.Duration, proxyURL *url.URL) *http.Client {
	transport := &http.Transport{
		Proxy: http.ProxyURL(proxyURL),
		DialContext: (&net.Dialer{
			Timeout:   10 * time.Second,
			KeepAlive: 10 * time.Second,
		}).DialContext,
		TLSHandshakeTimeout: 10 * time.Second,
	}
	return &http.Client{
		Timeout:   timeout,
		Transport: transport,
	}
}

// checkNetwork tests if GitHub is reachable, returns best HTTP client.
func checkNetwork() (*http.Client, error) {
	// 1. Check proxy settings
	proxyURL := getSystemProxy()
	if proxyURL != nil {
		client := newHTTPClient(10*time.Second, proxyURL)
		if testConnection(client) {
			return client, nil
		}
	}

	// 2. Try direct connection
	client := newHTTPClient(10*time.Second, nil)
	if testConnection(client) {
		return client, nil
	}

	// 3. Both failed
	return nil, fmt.Errorf("网络连接失败，请检查网络或代理设置")
}

// testConnection quickly tests if frp releases page is reachable.
func testConnection(client *http.Client) bool {
	resp, err := client.Get("https://github.com/fatedier/frp/releases")
	if err != nil {
		return false
	}
	resp.Body.Close()
	return resp.StatusCode == 200
}

// getSystemProxy reads the proxy from Windows registry and environment.
func getSystemProxy() *url.URL {
	// 1. Check HTTP_PROXY / HTTPS_PROXY environment variables first
	if p := os.Getenv("HTTPS_PROXY"); p != "" {
		if u, err := url.Parse(p); err == nil {
			return u
		}
	}
	if p := os.Getenv("HTTP_PROXY"); p != "" {
		if u, err := url.Parse(p); err == nil {
			return u
		}
	}

	// 2. Read from Windows registry: HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings
	val, err := readRegistryString(`Software\Microsoft\Windows\CurrentVersion\Internet Settings`, "ProxyServer")
	if err == nil && val != "" {
		// Could be "http=proxy:8080;https=proxy:8080" or just "proxy:8080"
		val = strings.TrimSpace(val)
		if !strings.Contains(val, "=") {
			// Simple format: "host:port"
			if u, err := url.Parse("http://" + val); err == nil {
				return u
			}
		} else {
			// Parse "https=host:port" part
			for _, part := range strings.Split(val, ";") {
				part = strings.TrimSpace(part)
				if strings.HasPrefix(part, "https=") {
					if u, err := url.Parse("http://" + strings.TrimPrefix(part, "https=")); err == nil {
						return u
					}
				}
			}
		}
	}

	return nil
}

// readRegistryString reads a string value from Windows registry.
func readRegistryString(keyPath, valueName string) (string, error) {
	cmd := exec.Command("reg", "query", `HKCU\`+keyPath, "/v", valueName)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	out, err := cmd.CombinedOutput()
	if err != nil {
		return "", err
	}

	for _, line := range strings.Split(string(out), "\n") {
		line = strings.TrimSpace(line)
		if strings.Contains(line, valueName) {
			parts := strings.SplitN(line, "REG_SZ", 2)
			if len(parts) == 2 {
				return strings.TrimSpace(parts[1]), nil
			}
		}
	}
	return "", fmt.Errorf("not found")
}

// FetchReleases gets recent releases from GitHub.
func FetchReleases() ([]Release, error) {
	// Check network first
	client, err := checkNetwork()
	if err != nil {
		return nil, err
	}

	apiURL := githubAPI + "?per_page=10"
	req, _ := http.NewRequest("GET", apiURL, nil)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("User-Agent", "FrpX/1.0")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("网络连接失败: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 2*1024*1024))
	if err != nil {
		return nil, fmt.Errorf("读取数据失败")
	}

	if resp.StatusCode == 403 || resp.StatusCode == 429 {
		return nil, fmt.Errorf("GitHub API 请求过于频繁，请稍后重试")
	}

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("GitHub API 返回错误 (%d)", resp.StatusCode)
	}

	var releases []Release
	if err := json.Unmarshal(body, &releases); err != nil {
		return nil, fmt.Errorf("解析版本数据失败")
	}

	return releases, nil
}

// GetLocalVersion reads the locally stored frpc version.
func GetLocalVersion(exeDir string) string {
	data, err := os.ReadFile(filepath.Join(exeDir, "frpc.version"))
	if err != nil {
		return ""
	}
	return strings.TrimSpace(string(data))
}

// SetLocalVersion writes the local frpc version marker.
func SetLocalVersion(exeDir, version string) error {
	return os.WriteFile(filepath.Join(exeDir, "frpc.version"), []byte(version), 0644)
}

// DownloadAndExtract downloads a frp release zip and extracts frpc.exe.
func DownloadAndExtract(downloadURL, version, exeDir string) error {
	// Check network first
	client, err := checkNetwork()
	if err != nil {
		return err
	}

	resp, err := client.Get(downloadURL)
	if err != nil {
		return fmt.Errorf("download failed: %w", err)
	}
	defer resp.Body.Close()

	zipData, err := io.ReadAll(io.LimitReader(resp.Body, 100*1024*1024))
	if err != nil {
		return fmt.Errorf("read zip failed: %w", err)
	}

	zipReader, err := zip.NewReader(bytes.NewReader(zipData), int64(len(zipData)))
	if err != nil {
		return fmt.Errorf("zip open failed: %w", err)
	}

	// Find frpc.exe in the zip
	for _, f := range zipReader.File {
		if strings.HasSuffix(f.Name, "frpc.exe") || strings.HasSuffix(f.Name, "frpc") {
			return extractFrpc(f, exeDir, version)
		}
	}

	return fmt.Errorf("frpc.exe not found in release archive")
}

func extractFrpc(f *zip.File, exeDir, version string) error {
	rc, err := f.Open()
	if err != nil {
		return err
	}
	defer rc.Close()

	destPath := filepath.Join(exeDir, "frpc.exe")
	tmpPath := destPath + ".tmp"

	// Always clean up .tmp file when done
	defer os.Remove(tmpPath)

	out, err := os.Create(tmpPath)
	if err != nil {
		return err
	}
	defer out.Close()

	if _, err := io.Copy(out, rc); err != nil {
		return err
	}
	out.Close()

	// Replace old frpc.exe
	os.Remove(destPath)
	if err := os.Rename(tmpPath, destPath); err != nil {
		return err
	}

	// Write version marker
	return os.WriteFile(filepath.Join(exeDir, "frpc.version"), []byte(version), 0644)
}

// FindWinAmd64Asset finds the Windows amd64 asset in a release.
func FindWinAmd64Asset(release Release) (Asset, bool) {
	for _, a := range release.Assets {
		name := strings.ToLower(a.Name)
		if strings.Contains(name, "windows") && strings.Contains(name, "amd64") && strings.HasSuffix(name, ".zip") {
			return a, true
		}
	}
	return Asset{}, false
}

// CurrentPlatform returns a string like "windows_amd64".
func CurrentPlatform() string {
	return runtime.GOOS + "_" + runtime.GOARCH
}
