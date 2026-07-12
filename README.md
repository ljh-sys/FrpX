# FrpX

> 🚀 frp 轻量级桌面客户端 — 单文件即用，告别命令行

[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square&logo=go)](https://go.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows-0078D4?style=flat-square&logo=windows)](https://www.microsoft.com/windows)
[![Release](https://img.shields.io/github/v/release/yourname/FrpX?style=flat-square)](https://github.com/yourname/FrpX/releases)

[English](#english) | 简体中文

---

## ✨ 特性

<table>
<tr>
<td width="50%">

### 🎯 核心功能
- 一键启动/停止 frpc 内网穿透
- 内置 TOML 编辑器，语法高亮 + 格式校验
- 自动获取 GitHub 最新 frpc 版本
- 实时日志查看，支持着色显示

</td>
<td width="50%">

### 🛠️ 高级特性
- 系统代理自动检测
- 开机自启（注册表）
- 系统托盘模式
- 窗口最小尺寸锁定

</td>
</tr>
</table>

---

## 📦 安装

### 方式一：直接下载（推荐）

1. 前往 [Releases](https://github.com/yourname/FrpX/releases) 下载最新版
2. 解压到任意目录
3. 双击 `FrpX.exe` 启动

### 方式二：从源码编译

```bash
# 克隆仓库
git clone https://github.com/yourname/FrpX.git
cd FrpX

# 编译（需要 Go 1.21+ 和 GCC）
export CGO_ENABLED=1
go build -ldflags "-s -w -H windowsgui" -o FrpX.exe .
```

---

## 🚀 快速开始

```
1. 双击 FrpX.exe 启动应用
2. 点击「版本」→ 下载最新版 frpc
3. 点击「配置」→ 填写你的 frp 服务器信息
4. 点击「主页」→ 启动 frpc
```

---

## 📸 界面预览

<table>
<tr>
<td align="center"><b>主页</b></td>
<td align="center"><b>配置编辑器</b></td>
<td align="center"><b>版本管理</b></td>
</tr>
<tr>
<td><img src="docs/home.png" width="280"></td>
<td><img src="docs/config.png" width="280"></td>
<td><img src="docs/versions.png" width="280"></td>
</tr>
<tr>
<td align="center"><b>日志查看</b></td>
<td align="center"><b>设置</b></td>
<td align="center"><b>系统托盘</b></td>
</tr>
<tr>
<td><img src="docs/logs.png" width="280"></td>
<td><img src="docs/settings.png" width="280"></td>
<td><img src="docs/tray.png" width="280"></td>
</tr>
</table>

---

## ⚙️ 配置说明

FrpX 使用标准的 frpc.toml 配置文件：

```toml
serverAddr = "your-server.com"
serverPort = 7000

auth.method = "token"
auth.token = "your-token"

[[proxies]]
name = "my_service"
type = "tcp"
localIp = "localhost"
localPort = 25565
remotePort = 1000
```

### 配置校验

编辑器内置 TOML 格式校验：
- ✅ 保存时自动校验
- ✅ 实时错误提示（行号 + 错误描述）
- ✅ 支持嵌套键名（如 `auth.method`）

---

## 🏗️ 架构

```
┌─────────────────────────────────────────────────────────┐
│                      FrpX.exe                           │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌──────────────────────────┐ │
│  │    Go Backend       │  │      WebView2 UI         │ │
│  │                     │  │                          │ │
│  │  • HTTP API Server  │←→│  • 主页（启停控制）      │ │
│  │  • 进程管理         │  │  • 配置（CodeMirror）    │ │
│  │  • GitHub 客户端    │  │  • 版本（下载管理）      │ │
│  │  • 代理检测         │  │  • 日志（实时查看）      │ │
│  │                     │  │  • 设置（自启/托盘）     │ │
│  └─────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  frpc.exe   │
                  │  (子进程)   │
                  └─────────────┘
```

### API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/status` | GET | 获取 frpc 运行状态 |
| `/api/start` | POST | 启动 frpc（自动清理旧进程） |
| `/api/stop` | POST | 停止 frpc（强制终止） |
| `/api/config` | GET/POST | 读写 frpc.toml |
| `/api/versions` | GET | 从 GitHub 获取版本列表 |
| `/api/download` | POST | 下载指定版本 frpc |
| `/api/logs` | GET | 获取 frpc 运行日志 |

---

## 🔧 开发

### 环境要求

- **Go** 1.21 或更高版本
- **GCC** (MSYS2 mingw64)
- **WebView2 Runtime** (Windows 10/11 自带)

### 编译

```bash
# 设置环境
export PATH="$HOME/sdk/go/bin:$HOME/go/bin:/c/msys64/mingw64/bin:$PATH"
export CGO_ENABLED=1

# 编译
go build -ldflags "-s -w -H windowsgui" -o FrpX.exe .

# 或使用 build.bat（Windows）
.\build.bat
```

### 项目结构

```
FrpX/
├── main.go              # 入口 + HTTP API + WebView
├── frpc.go              # frpc 进程管理
├── update.go            # GitHub API + 下载
├── winicon.go           # 窗口图标 (CGO)
├── frontend/            # 嵌入式前端
│   ├── index.html
│   ├── style.css
│   └── app.js
└── build.bat            # 一键编译
```

---

## 🐛 常见问题

<details>
<summary><b>Q: frpc.exe 被杀毒软件拦截怎么办？</b></summary>

将 `frpc.exe` 添加到 Windows Defender 排除项：

1. 打开 Windows 安全中心
2. 病毒和威胁防护 → 管理设置
3. 排除项 → 添加文件 → 选择 `frpc.exe`

</details>

<details>
<summary><b>Q: 启动时弹出黑色命令行窗口？</b></summary>

所有系统命令已设置 `HideWindow: true`。如仍出现，请检查是否使用了最新版本。

</details>

<details>
<summary><b>Q: 无法连接 GitHub 下载 frpc？</b></summary>

FrpX 自动检测系统代理。如需手动配置：

```powershell
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"
```

</details>

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 🙏 致谢

- [frp](https://github.com/fatedier/frp) - 高性能反向代理应用
- [webview](https://github.com/webview/webview) - 跨平台 WebView 库
- [CodeMirror](https://codemirror.net/) - 代码编辑器

---

<p align="center">如果觉得有用，请给个 ⭐ Star 支持一下！</p>
