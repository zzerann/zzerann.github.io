# Zeran Su — Personal Website

## 文件在哪里

**主目录（推荐用这个）：**
```
/home/ps/zeran-su.github.io/
├── index.html          # 主页
├── figures/            # 图片、视频（含头像 ZeranSu.jpg）
├── src/
│   ├── index.css
│   └── index.js
├── .nojekyll           # GitHub Pages 需要
└── serve.sh            # 本地预览脚本
```

**备份副本：**
```
/home/ps/文档/申请材料/zeran-su.github.io/
```

## 本地预览

```bash
cd /home/ps/zeran-su.github.io
bash serve.sh
```

浏览器打开：**http://127.0.0.1:8080**

## 发布到网上（GitHub Pages）

### 第一步：注册 / 登录 GitHub
https://github.com

### 第二步：新建仓库
- 仓库名必须是：**你的GitHub用户名.github.io**
  - 你的账号是 `zzerann`，仓库应命名为 **`zzerann.github.io`**
- 选 **Public**
- 不要勾选 README（避免冲突）

### 第三步：上传文件

在终端执行（把 `你的用户名` 换成真实 GitHub 用户名）：

```bash
cd /home/ps/zeran-su.github.io
git init
git add index.html figures/ src/ .nojekyll .gitignore
git commit -m "Initial personal website"
git branch -M main
git remote add origin https://github.com/zzerann/zzerann.github.io.git
git push -u origin main
```

### 第四步：开启 GitHub Pages
1. 打开仓库 → **Settings** → **Pages**
2. Source 选 **Deploy from a branch**
3. Branch 选 **main**，文件夹选 **/ (root)**
4. 点 Save

### 第五步：访问
等 1～5 分钟，打开：

```
https://zzerann.github.io
```

## 以后更新网站

改完 `index.html` 或其他文件后：

```bash
cd /home/ps/zeran-su.github.io
git add .
git commit -m "Update website"
git push
```

几分钟后线上自动更新。
