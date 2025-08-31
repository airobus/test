# React Hooks 与 Next.js Image 使用规范

本规范用于统一团队在 React/Next.js 项目中的 Hooks 编写、图片组件使用与 ESLint 规则遵循。所有代码必须遵守此规范。

## 1. React Hooks 规则

### React Hooks规则：dpscomputing

- ✅ 只在React函数组件或自定义Hook中调用
- ✅ 只在函数顶层调用，不在循环、条件或嵌套函数中调用
- ✅ 组件名以大写字母开头，Hook名以"use"开头
- ✅ 依赖数组只包含实际使用的变量

- 必须：Hooks 不得置于条件/循环/嵌套函数内部。始终在组件/Hook 顶层调用。
- 必须：避免“提前 return”在 Hooks 之前。将提前返回移动到所有必要 Hooks 之后。

```tsx
// BAD
if (enabled) {
  const [state, setState] = useState(0);
}
useEffect(() => {
  fetchUser(); // 缺少 fetchUser 依赖
}, [status]);

// GOOD
const [state, setState] = useState(0);
const fetchUser = useCallback(() => { /* ... */ }, []);
useEffect(() => {
  if (!enabled) return;
  fetchUser();
}, [enabled, fetchUser]);
```

## 2. useEffect 依赖与稳定回调

- 将在 Effect 中使用的函数用 `useCallback` 包装，保持依赖稳定：

```tsx
const handleLogin = useCallback(() => { /* ... */ }, [dep1, dep2]);
useEffect(() => {
  if (!enabled) return;
  handleLogin();
}, [enabled, handleLogin]);
```

- 状态 setter（如 `setTheme`）作为依赖是安全的，应按规则加入。

## 3. Next.js `<Image />` 使用

- 必须：禁止使用原生 `<img>`。使用 `next/image` 的 `<Image />` 组件。
- 必须：提供 `alt` 文本；若无可用文案，使用空字符串 `""` 但需确认无可访达信息丢失。
- 必须：为 `<Image />` 提供尺寸：
  - 固定尺寸：传 `width` 与 `height`（像素）。
  - 自适应容器：使用 `fill` 并让父容器具备定位与尺寸（如 `relative` + 高度/比例盒）。
- 必须：避免传递 `undefined` 的 `src`。在渲染前进行守卫：

```tsx
{item.image?.src && (
  <Image src={item.image.src} alt={item.image.alt || item.title || ""} width={112} height={28} />
)}
```

- 建议：需要立即通过 Lint 且不配置远程域名时，可临时添加 `unoptimized`，后续在 `next.config.mjs` 中配置 `images.domains` 或使用自定义 loader 再移除。
- 建议：配合 `sizes` 优化响应式：`sizes="(max-width: 768px) 100vw, 33vw"`。

示例：轮播/全幅图

```tsx
<div className="relative h-64">
  <Image src={url} alt="banner" fill priority sizes="100vw" className="object-cover" />
</div>
```

示例：头像/Logo（固定尺寸）

```tsx
<Image src={logo} alt="brand" width={32} height={32} className="w-8 h-8 object-contain" />
```

## 4. ESLint 策略

- 默认不禁用以下规则：
  - `@next/next/no-img-element`
  - `react-hooks/exhaustive-deps`
- 如确需局部豁免，需书面理由与代码注释，并仅限具体行：

```tsx
// eslint-disable-next-line @next/next/no-img-element -- 理由：XXXX（需明确）
```

## 5. 远程图片与优化

- 若使用远程图片，需在 `next.config.mjs` 配置 `images.domains` 或 `remotePatterns`。
- 对性能敏感区域，建议开启优化并提供合适的 `sizes` 与 `priority`。

## 6. 可复用的实践要点

- Hooks 顺序固定：声明全部 Hooks -> 逻辑 -> 条件/早退 -> 返回 JSX。
- 将异步登录、主题切换、用户信息拉取等逻辑拆分到自定义 Hook 并通过 `useEffect` 驱动。
- 保持 UI 不变：迁移 `<img>` 到 `<Image />` 时保留原有类名（如 `object-cover`、`rounded-full`、`aspect-16/9`）。

## 7. 检查清单（PR 自查）

- 是否存在任何 `<img>`？若有，是否全部替换为 `<Image />` 并补齐尺寸/alt？
- 是否存在条件 Hooks 或 Hooks 前的早退？
- `useEffect` 是否补全了依赖？其中函数是否 `useCallback` 包裹？
- 远程图片域名是否配置？是否误传了 `undefined` 的 `src`？
- Lint 是否 0 警告 0 错误？
