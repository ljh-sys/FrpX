# FrpX

> 🚀 frp 轻量级桌面客户端，告别命令行

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square&logo=go)](https://go.dev/)
[![Wails](https://img.shields.io/badge/Wails-v2-DF0000?style=flat-square&logo=wails)](https://wails.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)
[![Windows](https://img.shields.io/badge/Windows-10%2F11-0078D4?style=flat-square&logo=windows)](https://www.microsoft.com/windows)

---

## ✨ 特性

- 🎯 **一键启停** — 启动/停止 frpc 内网穿透
- 📝 **配置编辑** — 内置 TOML 编辑器，语法高亮 + 格式校验
- 🔄 **版本管理** — 自动获取 GitHub 最新 frpc 版本，一键下载
- 📊 **实时日志** — 查看 frpc 运行日志，支持着色显示
- 🌐 **代理支持** — 自动检测系统代理，国内外通用
- 🔧 **开机自启** — 支持 Windows 注册表自启动

---

## 📦 安装

### 下载

前往 [Releases](https://gitee.com/liujiahong528/frpx/releases) 下载最新版，解压后双击 `FrpX.exe` 启动。

### 从源码编译

```bash
git clone https://gitee.com/liujiahong528/frpx.git && cd frpx
go install github.com/wailsapp/wails/v2/cmd/wails@latest
wails build -ldflags "-s -w -H windowsgui"
```

---

## 🚀 快速开始

1. 双击 `FrpX.exe` 启动
2. 进入「版本」页面，下载最新版 frpc
3. 进入「配置」页面，填写 frp 服务器信息
4. 返回「主页」，点击启动按钮

---

## 📸 界面预览

<table>
<tr>
<td><img src="docs/主页.png" width="280"></td>
<td><img src="docs/配置.png" width="280"></td>
<td><img src="docs/版本.png" width="280"></td>
</tr>
<tr>
<td><img src="docs/日志.png" width="280"></td>
<td><img src="docs/设置.png" width="280"></td>
</tr>
</table>

---

## ⚙️ 开发

```bash
wails dev                    # 开发模式（热重载）
wails build -ldflags "-s -w -H windowsgui"   # 生产编译
wails build -platform windows/amd64           # 交叉编译
```

详见 [CLAUDE.md](CLAUDE.md) 了解项目架构和 Wails 绑定 API。

## 🐛 常见问题

| 问题               | 解决方案                                  |
| ---------------- | ------------------------------------- |
| frpc.exe 被杀毒软件拦截 | 将 `frpc.exe` 添加到 Windows Defender 排除项 |
| 无法连接 GitHub      | FrpX 自动检测系统代理，或设置 `HTTP_PROXY` 环境变量   |
| 版本获取失败           | 检查网络连接，确认代理设置正确                       |
| 编译报错              | 必须用 `wails build`，不能直接用 `go build`    |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [frp](https://github.com/fatedier/frp) — 高性能反向代理
- [Wails](https://wails.io) — Go + WebView2 桌面框架
- [CodeMirror](https://codemirror.net/) — 代码编辑器

---

<p align="center">如果觉得有用，请给个 ⭐ Star 支持一下！</p>
