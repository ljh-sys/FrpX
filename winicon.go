package main

// #cgo LDFLAGS: -luser32
// #include <windows.h>
//
// void setHwndIcon(HWND hwnd, const char* iconPath) {
//     HICON hIcon = (HICON)LoadImageA(NULL, iconPath, IMAGE_ICON, 0, 0, LR_LOADFROMFILE | LR_DEFAULTSIZE);
//     if (hIcon) {
//         SendMessage(hwnd, WM_SETICON, ICON_BIG, (LPARAM)hIcon);
//         SendMessage(hwnd, WM_SETICON, ICON_SMALL, (LPARAM)hIcon);
//     }
// }
import "C"
import (
	"io/fs"
	"os"
	"path/filepath"
	"unsafe"

	"github.com/webview/webview_go"
)

// applyWindowIcon extracts the embedded icon and sets it on the webview window.
func applyWindowIcon(w webview.WebView, exeDir string, frontendFS fs.FS) {
	iconPath := filepath.Join(exeDir, ".frpx_icon.ico")

	// Write embedded icon to disk if not already there
	if _, err := os.Stat(iconPath); os.IsNotExist(err) {
		data, err := fs.ReadFile(frontendFS, "icon.ico")
		if err != nil {
			return
		}
		os.WriteFile(iconPath, data, 0644)
	}

	hwnd := w.Window()
	if hwnd == nil {
		return
	}
	cPath := C.CString(iconPath)
	defer C.free(unsafe.Pointer(cPath))
	C.setHwndIcon((C.HWND)(hwnd), cPath)
}
