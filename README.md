<div align="center">

# 🪟 aero7 — Flare Stack Blog 主题

**Windows 7 / Frutiger Aero 风格博客主题**

基于 [7.css](https://github.com/khang-nd/7.css) 打造，视觉样式对齐 [hexo-theme-aero](https://github.com/5h1nnN/hexo-theme-aero)，
为 [Flare Stack Blog](https://github.com/du2333/flare-stack-blog) 框架实现的完整主题。

半透明磨砂玻璃 · Aero 蓝主色 (#3c7fb1) · 玻璃高光渐变 · Segoe UI · 原生 Win7 表单控件

</div>

---

## ✨ 特性

- **完整实现主题契约**：首页、文章列表、文章详情、友链、搜索、认证页、个人资料等全部页面及骨架屏。
- **Frutiger Aero 玻璃质感**：半透明磨砂面板（backdrop-filter blur + saturate）、白内描边 + 深蓝外描边 + 投影，浮在壁纸之上。
- **仿 Windows 7 窗口标题栏导航**：顶部导航栏使用 Aero 玻璃高光渐变 + 标签页式菜单。
- **7.css 原生控件**：按钮、输入框、复选框等沿用 Windows 7 原生外观。
- **深色模式（夜空磨砂）**：内置"夜空磨砂"变体——窗口 / 任务栏 / 卡片一律改用**浅灰半透明玻璃**（`rgba(74,80,90,.22)` + 更高 `backdrop-filter` 模糊），比纯黑更通透、更接近 Win7 Aero 夜空；并在自定义壁纸上叠加一层中性灰透明罩（`rgba(50,54,62,.5)`），压暗背景、提升磨砂玻璃对比。
- **顶部任务栏**：Windows 任务栏固定在**屏幕顶部**（非 Win7 传统的底部），语言切换等弹出菜单向下展开；左侧站点 Orb + 圆形头像（hover 弹出签名 tooltip），右侧语言切换沿用 7.css 原生 `[role="menu"]`。
- **后台可配置**：主题强调色（accentColor）、首页独立壁纸（homeBg）与背景壁纸均可在后台"设置"页运行时调整。
- **暗/亮双主题**：跟随框架的 dark / light variant。

## 📦 目录结构

```
flare-stack-blog-theme-aero7/
├── theme/aero7/          # 主题源码 → 复制到 src/features/theme/themes/aero7
├── integration/          # 需要改动的框架文件（完整参考版，逐处对照修改）
│   ├── registry.ts                       # 注册主题
│   ├── blog.config.ts                    # 主题默认配置
│   ├── site-config.schema.ts             # 运行时配置 schema
│   ├── config.service.ts                 # resolveSiteConfig 合并 aero7 配置
│   ├── site-config.helpers.ts            # 背景图解析
│   ├── site-settings-section.tsx         # 后台设置区路由
│   └── themes/aero7-theme-settings.tsx   # 后台 aero7 设置面板（新增文件）
├── messages/             # i18n 增量键（合并进 messages/zh.json、en.json）
│   ├── zh.aero7.json
│   └── en.aero7.json
├── public/images/aero-wallpaper.jpg      # 默认壁纸
└── README.md
```

## 🔧 安装步骤

> 前提：已有一份 [Flare Stack Blog](https://github.com/du2333/flare-stack-blog) 源码（`main` 分支）。

### 1. 放入主题源码

将 `theme/aero7/` 整个目录复制到框架的主题目录：

```bash
cp -r theme/aero7 <flare-stack-blog>/src/features/theme/themes/aero7
```

### 2. 放入壁纸资源

```bash
cp public/images/aero-wallpaper.jpg <flare-stack-blog>/public/images/
```

### 3. 注册主题 `src/features/theme/registry.ts`

```ts
export const themeNames = ["default", "fuwari", "aero7"] as const;

export const themes: Record<ThemeName, ThemeRouterConfig> = {
  // ...existing...
  aero7: {
    viewTransition: false,
    pendingMs: 1000,
  },
};
```

> `vite.config.ts` 会自动从 `registry.ts` 同步主题列表，无需手动修改 Vite 配置。
> **注意**：不要修改 `vite.config.ts` 里 `THEME` 的默认值（保持 `default`），通过环境变量应用本主题即可。

### 4. 应用框架层改动

参照 `integration/` 目录内的完整文件，逐处合并到你的框架（均为**增量**修改，不影响其它主题）：

| 文件 | 改动 |
| :-- | :-- |
| `src/blog.config.ts` | 在 `theme` 下新增 `aero7`，并给 `theme.default` 增加复用的 `background` 配置 |
| `src/features/config/site-config.schema.ts` | 新增 `aero7` 的 schema（`homeBg`、`accentColor`）并注册到 `theme` |
| `src/features/config/service/config.service.ts` | `resolveSiteConfig` 合并 `theme.aero7`，并为 default background 增加兜底 |
| `src/features/theme/site-config.helpers.ts` | `getThemeBackgroundImages` 增加 `aero7` 分支 |
| `src/features/config/components/site-settings-section.tsx` | 后台设置区新增 `aero7` → `<Aero7ThemeSettings />` |
| `src/features/config/components/themes/aero7-theme-settings.tsx` | **新增**后台设置面板文件 |

### 5. 合并 i18n 文案

把 `messages/zh.aero7.json`、`messages/en.aero7.json` 里的键分别合并进框架的 `messages/zh.json`、`messages/en.json`：

```json
{
  "settings_site_field_accent_color": "主题强调色",
  "settings_site_field_accent_color_hint": "控制 Windows 7 Aero 窗口主色与链接、按钮高亮色。填写十六进制颜色，如 #2a7fd0。"
}
```

### 6. 应用主题（不改默认主题）

本主题通过环境变量 `THEME` 应用，**无需**修改框架默认主题：

- **本地开发**：`.env` 中写 `THEME=aero7`，再 `bun run dev`。
- **构建**：`THEME=aero7 bun run build`。
- **GitHub Actions（Cloudflare Workers 部署）**：在仓库 `Settings → Secrets and variables → Actions → Variables` 中新增变量 `THEME=aero7`，推送后自动构建部署。

## 🎨 配置项

登录后台 → **设置** → 主题设置（当前主题为 aero7 时显示）：

- **主题强调色 accentColor**：Aero 窗口主色 + 链接/按钮高亮，默认 `#3c7fb1`（后台若误存白色 / `#fff` 会自动回落默认蓝，避免主题"看起来没应用"）。
- **首页壁纸 homeBg**（aero7 专属）：仅首页使用的独立壁纸；留空则回落到下方 default 背景。
- **背景壁纸**：复用 default 主题的 `background`（`homeImage` / `globalImage`、模糊、透明度），作为 `homeBg` 留空时的兜底，以及非首页的通用壁纸。

> **壁纸读取优先级**：`theme.aero7.homeBg` → `theme.default.background.homeImage`（首页）/ `globalImage`（其它页）→ 内置兜底 `aero-wallpaper.jpg`。

## 🙏 致谢

- [7.css](https://github.com/khang-nd/7.css) — Windows 7 CSS 框架（原生控件外观素材）。
- [hexo-theme-aero](https://github.com/5h1nnN/hexo-theme-aero) — 视觉样式与 Frutiger Aero 配色参考。
- [Flare Stack Blog](https://github.com/du2333/flare-stack-blog) — 主题所依附的博客框架。

## 📄 许可

MIT
