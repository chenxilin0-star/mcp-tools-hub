# MCP工具导航站 - 技术方案
> 更新：2026-03-22

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Next.js 14 (App Router) | React框架 |
| 样式 | Tailwind CSS | 原子化CSS |
| 部署 | Cloudflare Pages | CDN加速 |
| 数据 | GitHub API | ISR增量更新 |

## 数据流程

```
构建时（海外服务器）→ GitHub API 获取 MCP 工具列表 → 静态生成页面
                                                      ↓
用户访问 ──────────────────────────────────────────── CDN 缓存
```

## 页面结构

```
/                   首页：工具列表 + 筛选 + 搜索
/tool/[name]        工具详情页
```

## 功能模块

### 1. 工具列表
- 卡片展示：图标、名称、描述、stars
- 分类标签：Database / File System / API / AI / Productivity
- 排序：按stars / 按最新

### 2. 筛选系统
- 分类筛选（多选）
- 搜索（名称/描述关键词）

### 3. 工具详情
- GitHub地址跳转
- 详细描述
- 使用说明

## ISR 策略

- Revalidate: 21600秒（6小时）
- 构建时全量拉取GitHub数据
- 增量更新，用户无感知

## 环境变量

```
GITHUB_TOKEN=   # GitHub API Token（可选，提升rate limit）
```

## 竞品差异化

| 现有竞品 | 我们的优势 |
|----------|-----------|
| mcp.microsoft.com | 中文界面 + 社区维护 |
| GitHub Awesome | 可搜索 + 分类 + 美观UI |
