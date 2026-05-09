# 🍅 番茄钟

一个简洁美观的番茄钟应用，支持网页版和桌面版。

## 功能特性

- **三种模式**：专注模式（25 分钟）、短休息（5 分钟）、长休息（15 分钟）
- **全屏模式**：双击时间显示进入沉浸式专注体验
- **键盘快捷键**：
  - `空格键`：开始/暂停计时
  - `M` 键：切换静音
  - `Enter` 键：进入/退出全屏
- **声音提醒**：计时结束时播放悦耳提示音
- **持久化存储**：自动保存今日专注轮次
- **响应式设计**：深色主题，渐变背景，流畅动画

## 快速开始

### 使用网页版（无需安装）

直接用浏览器打开 `web-pomodoro.html` 即可使用。

### 部署为在线网站

**GitHub Pages 部署步骤：**

1. 在 GitHub 创建新仓库
2. 将 `pomodoro-timer` 目录下的文件推送到仓库
3. 进入仓库 Settings → Pages
4. 选择部署分支（如 main）并保存
5. 访问 `https://用户名.github.io/仓库名/web-pomodoro.html`

### 构建桌面应用

需要安装以下依赖：
- Node.js 16+
- Rust（通过 [rustup](https://rustup.rs) 安装）

```bash
# 安装依赖
npm install

# 开发模式运行
npm run tauri:dev

# 构建发布版本
npm run tauri build
```

## 文件结构

```
pomodoro-timer/
├── src/                    # Tauri 前端代码
│   ├── index.html          # 主页面
│   ├── styles.css          # 样式文件
│   └── main.js             # 逻辑代码
├── src-tauri/              # Tauri 后端（Rust）
│   ├── src/
│   │   └── main.rs         # Rust 后端入口
│   └── tauri.conf.json     # 应用配置
├── web-pomodoro.html       # 纯网页版主页面
├── web-pomodoro.js         # 网页版逻辑
└── package.json            # NPM 配置
```

## 技术栈

- **前端**：原生 HTML/CSS/JavaScript
- **桌面框架**：Tauri 2.0
- **后端**：Rust

## 自定义配置

在 `tauri.conf.json` 中可以修改：
- 窗口大小
- 应用名称
- 图标等配置

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
