# UI 样式统一与焦点/发光处理 SOP（通用）

本 SOP 适用于所有前端项目，目标是：
- 统一视觉语言（Design Tokens 语义驱动），消除硬编码与魔法数
- 组件“最小风格化”，将颜色/边框/焦点交给调用方或主题
- 全局可控的焦点与发光策略，保障一致体验与可访问性

---

## 1. 语义化设计令牌（Design Tokens）

- 在主题文件（如 `src/app/theme.css`）定义语义变量：
  - 颜色类：`--background`、`--foreground`、`--card`、`--card-foreground`、`--popover`、`--border`、`--input`、`--ring` 等
  - 阴影/圆角/字体：`--shadow-*`、`--radius`、`--font-*`
- 在样式层导出语义类（如 Tailwind 使用 `@theme` 或 CSS 变量映射）：
  - 例：`bg-card` → `var(--card)`，`bg-input` → `var(--input)`
- 原则：组件使用语义类，不直接写颜色值；视觉统一在 token 层完成。

建议约定：输入域与卡片一致时，将 `--input: var(--card)`；需要层次时，给相近但不同值，但仍保持语义不变。

---

## 2. 组件“最小风格化”（去样式化）

- 原子组件（如 `Button`、`Input`、`Textarea`）不内置具体颜色/边框/焦点 ring，仅保留：
  - 尺寸与排版（`display/flex`、`padding`、`font-size`）
  - 占位符可读性/禁用态透明度
- 样式交由外部 `className` 或上层容器控制。
- 示例（`src/components/ui/textarea.tsx`）：移除 `border/bg/focus-visible:ring`，仅保留尺寸与占位符；颜色通过调用方传入类名设置。

---

## 3. 全局焦点基线策略（无发光默认）

- 在全局样式（如 `src/app/globals.css`）统一禁用输入焦点发光：
  - `input:focus, select:focus, textarea:focus { @apply ring-0 shadow-none outline-none; box-shadow: none; }`
- 若个别组件需要焦点强调（如关键操作按钮），在组件处“显式添加”所需 ring/ring-offset，不在全局默认开启。

可访问性注意：对于键盘导航用户，建议保留 `:focus-visible` 的清晰可见样式，或为关键交互元素提供替代高亮（例如细边框或背景轻微变化）。

---

## 4. 浏览器 UA 默认样式兜底

为避免不同浏览器在聚焦时出现默认黑边/高亮，对输入类组件增加兜底类：
- `appearance-none border-transparent !border-0 outline-none !focus:outline-none !focus:ring-0 focus:!shadow-none focus:border-transparent`
- 如仍有差异，可增加 `focus-visible:border-transparent` 与 `!focus-visible:ring-0 !focus-visible:ring-offset-0`

---

## 5. 容器与输入的对齐策略

- 容器用 `bg-card`（或 `bg-popover`），输入用 `bg-input`
- 需要视觉一致：在 `theme.css` 将 `--input: var(--card)`
- 需要层次区分：`--input` 相对 `--card` 略浅/略深，但仍保持语义变量

避免使用硬编码透明度（如 `bg-white/10`）；若临时过渡，必须加注释并尽快回归语义 token。

---

## 6. 实施步骤（Checklist）

1) 检查/补全主题 token（`theme.css`）：卡片、输入、边框、ring、阴影等
2) 业务组件替换硬编码颜色为语义类（如 `bg-white/10` → `bg-card`）
3) 原子组件去样式化：移除内置颜色/边框/ring，仅保留尺寸
4) 全局焦点基线：统一禁用输入发光（`globals.css`）
5) 需要一致时对齐 token（`--input = var(--card)`），需要层次时设置相近值
6) 兜底类处理浏览器默认样式（`appearance-none`/`outline-none`/`border-transparent`）
7) 视觉验收：明/暗色、Hover/Focus、禁用态、占位符可读性、键盘可达性

---

## 7. 常用类片段（可复制）

- 输入（无边框/无发光/可读占位符）
  ```html
  class="bg-input text-foreground placeholder:text-muted-foreground appearance-none border-transparent !border-0 outline-none !focus:outline-none !focus:ring-0 focus:!shadow-none focus:border-transparent !focus-visible:ring-0 !focus-visible:ring-offset-0 focus-visible:border-transparent"
  ```
- 容器（语义化卡片）
  ```html
  class="bg-card border border-border text-foreground rounded-xl"
  ```
- 强调焦点（按需显式添加）
  ```html
  class="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  ```

---

## 8. 团队规范与工具

- 将本 SOP 链接加入到团队规范（如 `docs/golden-rules-of-front.txt`）
- 为编辑器配置 Tailwind/原子 CSS 插件，减少 `@theme` 等语法告警
- 代码评审 Checklist：
  - 是否使用语义 token 而非硬编码？
  - 原子组件是否“最小风格化”？
  - 是否禁用了不必要的焦点发光？关键交互是否保留可见焦点？
  - 是否考虑了明/暗色兼容与可访问性？

---

## 9. 版本化与主题切换建议

- 多主题支持时仅改 token 值，不改组件
- 按环境/品牌切换主题变量文件或 root 作用域（如 `.dark`）
- 复杂场景可使用 CSS 变量层级覆盖（页面/容器局部主题）

---

最后：坚持“语义优先、最小风格、全局基线、按需显式”的四原则，能显著降低样式维护成本，提升跨项目一致性与可演进性。
