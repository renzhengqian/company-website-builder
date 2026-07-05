# 高端体育器材企业官网

这是一个按照 PRD 实现的高端体育器材企业官网，包含定制前台、后台登录、内容管理、图片上传、中文/英文切换、产品展示、商务询盘、移动端自适应和 1688 店铺跳转。

## 启动

在 PowerShell 中运行：

```powershell
.\start-dev.ps1
```

访问：

- 前台官网：http://localhost:5173/
- 后台管理：http://localhost:5173/admin
- API 服务：http://localhost:4000/api/content

默认后台账号：

- 账号：`admin`
- 密码：`admin123456`

生产环境请通过环境变量覆盖：

```powershell
$env:ADMIN_USER="your-admin"
$env:ADMIN_PASSWORD="your-strong-password"
.\start-dev.ps1
```

## 已实现范围

- 首页：Banner、品牌定位、实力数据、产品中心、智造实力、AI 智能生产、大数据中心、研发资质、新闻、商务询盘。
- 产品中心：分类筛选、搜索、产品卡片、详情弹窗、询盘和 1688 跳转。
- 后台管理：登录权限、基础信息、Banner、产品、资质、新闻、询盘记录、SEO、高级 JSON 编辑和图片上传。
- 中英文：前台语言切换，后台可维护中英文内容字段。
- 询盘：表单提交后保存到 SQLite 数据库。
- 素材：使用客户画册渲染页和 1688 店铺图片作为产品、工厂和资质视觉素材。

## 技术结构

- 前端：Vite + React
- 后端：Express API
- 数据：SQLite 文件数据库，默认生成在 `server/data/site.db`
- 初始化数据：`server/data/content.json` 仅作为首次初始化种子
- 上传图片：保存到 `server/uploads/images/`，通过 `/uploads/images/...` 访问
- 样式：响应式 CSS，支持 PC 与移动端布局

## 后续建议

- 替换正式 Logo、工厂视频和高清产品图。
- 正式上线时使用 PM2、Nginx、HTTPS 和服务器防火墙。
- 接入邮件提醒或企业微信/WhatsApp 询盘通知。
- 如后续数据规模扩大，可从 SQLite 迁移到 MySQL/PostgreSQL。
