# 通用 Block 组件 SOP（标准作业流程）

本 SOP 旨在沉淀一套在本项目可直接复用、跨项目也易迁移的 Block 组件建设流程。遵循团队前端规范（见 `docs/golden-rules-of-front.txt`）。

---

## 1. 概览
- 目标：以“类型先行、数据驱动、事件解耦、可访问、可回归”为核心，快速从 0 到 1 搭建任意 Block。
- 输出物：类型定义、i18n 数据片段、组件骨架、事件联动、检查清单。

## 2. 适用场景
- 首页/落地页的可配置区块（列表、卡片、Banner、推荐位等）。
- 需要与其他模块解耦交互（如通过自定义事件联动）。

## 3. 目录与命名
- 组件：`src/components/blocks/<block-name>/index.tsx`
- 类型：`src/types/blocks/<block-name>.d.ts`
- 数据：`src/i18n/pages/<page>/<locale>.json` 对应 section 片段
- 页面：`src/app/[locale]/(default)/page.tsx` 中装配 block

命名建议：语义清晰、统一小驼峰 key，label 用于展示、key 用于逻辑。

## 4. 类型契约（先定合同）
在 `src/types/blocks/<block-name>.d.ts` 定义最小且稳定的类型契约：
```ts
export interface BlockBase {
  name?: string;
  label?: string;
  title?: string;
  description?: string;
  disabled?: boolean;
}

export interface ExampleItem {
  id: string;
  title: string;
  description?: string;
  categories?: string[]; // 使用稳定的 key
  image: {
    src: string;
    alt?: string;
    aspectRatio?: string; // 例如 "16:9"，可选
  };
  prompt?: string; // 示例：和其他模块交互所需的主要数据
}

export interface ExampleSection extends BlockBase {
  categories?: { key: string; label: string }[];
  items?: ExampleItem[];
}
```

要点：
- 保持字段最小化与可选化（向后兼容）。
- 组件不依赖非必要字段，避免数据变更牵连组件。

## 5. i18n 数据片段
在 `src/i18n/pages/landing/en.json` 等文件中维护：
```json
{
  "exampleBlock": {
    "label": "Label",
    "title": "Block Title",
    "description": "Optional description",
    "categories": [
      { "key": "all", "label": "All" },
      { "key": "social", "label": "Social" }
    ],
    "items": [
      {
        "id": "item-001",
        "title": "Sample Card",
        "description": "Optional",
        "categories": ["social"],
        "image": {
          "src": "https://...",
          "alt": "card",
          "aspectRatio": "16:9"
        },
        "prompt": "optional payload"
      }
    ]
  }
}
```
要点：
- key 稳定、label 可改。尽量不在组件里硬编码文案。

## 6. 组件骨架
在 `src/components/blocks/<block-name>/index.tsx`：
```tsx
"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { ExampleSection, ExampleItem } from "@/types/blocks/<block-name>";

export default function ExampleBlock({ section }: { section: ExampleSection }) {
  if (section?.disabled) return null;

  const [active, setActive] = useState<string>(section.categories?.[0]?.key || "all");

  const list = useMemo(() => {
    if (active === "all") return section.items || [];
    return (section.items || []).filter((t) => t.categories?.includes(active));
  }, [active, section.items]);

  return (
    <section id={section.name || "example-block"} className="py-16">
      <div className="container flex flex-col items-center gap-4">
        {section.label && <div className="text-sm font-semibold text-primary">{section.label}</div>}
        {section.title && <h2 className="text-center text-3xl font-semibold lg:text-4xl">{section.title}</h2>}
        {section.description && <p className="text-center text-muted-foreground lg:text-lg">{section.description}</p>}
      </div>

      {/* 分类 */}
      <div className="container mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setActive("all")} className={`px-3 py-1 rounded-full text-sm border transition-colors ${active === "all" ? "bg-primary text-primary-foreground" : "border-border text-secondary hover:text-foreground"}`}>All</button>
          {(section.categories || []).map((c) => (
            <button key={c.key} onClick={() => setActive(c.key)} className={`px-3 py-1 rounded-full text-sm border transition-colors ${active === c.key ? "bg-primary text-primary-foreground" : "border-border text-secondary hover:text-foreground"}`}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* 列表布局：二选一 */}
      {/* 方案A：瀑布流（多比例内容） */}
      <div className="container mt-8">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-x-4">
          {list.map((item: ExampleItem) => (
            <div key={item.id} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative w-full" style={{ aspectRatio: (item.image.aspectRatio && item.image.aspectRatio.includes(":")) ? (item.image.aspectRatio.replace(":", " / ")) as any : undefined }}>
                <Image src={item.image.src} alt={item.image.alt || item.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" unoptimized />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <button className="pointer-events-auto absolute inset-x-4 bottom-4 hidden items-center justify-center rounded-lg bg-primary/95 px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary group-hover:flex" onClick={() => window.dispatchEvent(new CustomEvent("example:use", { detail: { id: item.id, prompt: item.prompt } }))} aria-label="use-item">Use</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 方案B：网格（统一比例内容）
      <div className="container mt-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((item: ExampleItem) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative w-full" style={{ aspectRatio: (item.image.aspectRatio && item.image.aspectRatio.includes(":")) ? (item.image.aspectRatio.replace(":", " / ")) as any : undefined }}>
                <Image src={item.image.src} alt={item.image.alt || item.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" unoptimized />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <button className="pointer-events-auto absolute inset-x-4 bottom-4 hidden items-center justify-center rounded-lg bg-primary/95 px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary group-hover:flex" onClick={() => window.dispatchEvent(new CustomEvent("example:use", { detail: { id: item.id, prompt: item.prompt } }))} aria-label="use-item">Use</button>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
}
```

要点：
- 先实现“无副作用”的纯渲染；交互通过自定义事件对外派发，监听放到使用方。
- 瀑布流（columns）与网格（grid）按内容比例选择其一。

## 7. 交互与事件（解耦）
- 派发：`window.dispatchEvent(new CustomEvent("example:use", { detail: { id, prompt } }))`
- 监听（示例）：
```ts
useEffect(() => {
  const onUse = (e: CustomEvent<{ id: string; prompt?: string }>) => {
    // 承接逻辑：如切换 Tab、填充输入框、滚动聚焦等
  };
  window.addEventListener("example:use", onUse as EventListener);
  return () => window.removeEventListener("example:use", onUse as EventListener);
}, []);
```

## 8. 可访问性（a11y）
- 图片提供 `alt`；按钮提供 `aria-label`；键盘可达；焦点可见。
- 悬浮操作在移动端不可用时，提供点击/长按兜底（可后续增强）。

## 9. 性能与图片策略
- `next/image` 使用 `sizes` 合理分配视口加载尺寸。
- 外链图片开发可 `unoptimized`；生产建议在 `next.config.mjs` 中配置 `images.domains` 以启用优化。

## 10. 页面接入
- 在页面文件中注入：
```tsx
// src/app/[locale]/(default)/page.tsx
// <ExampleBlock section={t("exampleBlock")} />
```
- 与其它区块的间距协调（如 `py-16`），避免视觉拥挤。
- 同步更新页面类型定义：在 `src/types/pages/<page>.d.ts`（如 `landing.d.ts`）中新增对应字段（如 `promptGuide?: PromptGuideSection`），并补充 `import`，避免 TS 报错。

## 11. 回归检查清单
- 布局：不同断点（sm/lg）列数正确；瀑布流无断裂（`break-inside-avoid`）。
- 交互：分类筛选、按钮派发、监听响应正确。
- i18n：key 与 items.categories 匹配；文案不硬编码。
- a11y：alt/aria/focus 正常。
- 性能：图片加载与尺寸合适；控制 CLS 与过度动画。
- 移动端：无 hover 退化方案不影响主流程。
- 类型：新增 Block 后，`src/types/pages/<page>.d.ts` 同步包含对应字段，页面装配处的 `page.xxx` 访问类型安全。

## 12. 常见问题与处理
- 不同比例图导致空白：优先用 columns 瀑布流；若必须整齐棋盘，统一 `aspectRatio`。
- 外链图片报错：在 `next.config.mjs` 的 `images.domains` 加白名单或退回 `unoptimized`。
- i18n key/label 不一致：只改 label，key 稳定。

## 13. 复用步骤（超简清单）
1) 定义类型 `<block-name>.d.ts`
2) 在 i18n 增加 `section` 数据（categories/items）
3) 创建组件骨架：分类筛选 + 列表布局（columns 或 grid）
4) 自定义事件派发/监听（按需）
5) a11y 与性能检查
6) 页面接入与回归

---

以上流程可直接复制为任意 Block 的模板实现：换类型名、换 i18n 片段、替换布局策略，即可落地新组件。
