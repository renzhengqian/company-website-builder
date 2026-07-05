# 高端体育器材企业官网

这是一个按照 PRD 实现的企业官网首版原型，包含定制前台、后台内容管理、中文/英文切换、产品展示、商务询盘、移动端自适应和 1688 店铺跳转。

## 启动

在 PowerShell 中运行：

```powershell
.\start-dev.ps1
```

访问：

- 前台官网：http://localhost:5173/
- 后台管理：http://localhost:5173/admin
- API 服务：http://localhost:4000/api/content

## 已实现范围

- 首页：Banner、品牌定位、实力数据、产品中心、智造实力、AI 智能生产、大数据中心、研发资质、新闻、商务询盘。
- 产品中心：分类筛选、搜索、产品卡片、详情弹窗、询盘和 1688 跳转。
- 后台管理：基础信息、Banner、产品、资质、新闻、询盘记录、SEO 与高级 JSON 编辑。
- 中英文：前台语言切换，后台可维护中英文内容字段。
- 询盘：表单提交后保存到 `server/data/content.json`。
- 素材：使用客户画册渲染页作为产品、工厂和资质视觉素材。

## 技术结构

- 前端：Vite + React
- 后端：Express API
- 数据：JSON 文件存储，后续可迁移到 Strapi、Directus、Payload CMS 或数据库
- 样式：响应式 CSS，支持 PC 与移动端布局

## 后续建议

- 替换正式 Logo、工厂视频和高清产品图。
- 将 JSON 文件存储迁移为正式 CMS + MySQL/PostgreSQL。
- 接入邮件提醒、WhatsApp 跳转、图片上传管理和管理员登录权限。
