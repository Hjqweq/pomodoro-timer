# Rust 安装指南（Windows）

## 方法一：使用 rustup（推荐）

### 1. 下载安装程序
访问 https://rustup.rs 下载 `rustup-init.exe`

### 2. 使用中国镜像加速（重要）

打开 PowerShell 执行：

```powershell
$env:RUSTUP_DIST_SERVER="https://rsproxy.cn"
$env:RUSTUP_UPDATE_ROOT="https://rsproxy.cn/rustup-release"
rustup-init.exe
```

或者直接下载带镜像参数的安装器：
```powershell
Invoke-WebRequest "https://rsproxy.cn/rustup-init.exe" -OutFile "rustup-init.exe"
.\rustup-init.exe
```

### 3. 按提示安装
- 按 Enter 选择默认安装
- 安装路径通常为 `C:\Users\lenovo\.cargo\`

### 4. 添加环境变量
重启 PowerShell 后，Rust 会自动添加到 PATH。如果不行，手动添加：
- 搜索 "环境变量" -> "系统环境变量" -> "Path"
- 添加：`C:\Users\lenovo\.cargo\bin`

### 5. 验证安装
```powershell
rustc --version
cargo --version
```

## 快速安装命令

复制这段 PowerShell 命令一键安装：

```powershell
$env:RUSTUP_DIST_SERVER="https://rsproxy.cn"
$env:RUSTUP_UPDATE_ROOT="https://rsproxy.cn/rustup-release"
Invoke-WebRequest "https://rsproxy.cn/rustup-init.exe" -OutFile "rustup-init.exe"
.\rustup-init.exe -y
```

## 常见问题

### 安装失败
确保关闭了杀毒软件和防火墙临时

### 找不到 cargo/rustc
- 关闭并重新打开 PowerShell
- 检查 PATH 环境变量是否包含 `C:\Users\lenovo\.cargo\bin`

## 安装完成后

```powershell
# 验证
rustc --version
cargo --version

# 构建番茄钟
cd C:\cc\pomodoro-timer
npm install
npm run tauri:dev
```
