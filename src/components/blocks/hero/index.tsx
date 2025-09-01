import Image from "next/image";
import { PromptForm } from "./PromptForm";
import type { Hero as SectionType } from "@/types/blocks/hero";

// 默认导出：Hero（Freepik 风格）
// 说明：单张沉浸式背景 + 底部对齐内容，左对齐文本，聚焦输入。
export default function Hero({ section }: { section: SectionType }) {
  if (!section || section.disabled) return null;

  // 临时背景图（可替换为从 section 读取）
  const bgImage =
    "https://cdn-front.freepik.com/images/ai/image-generator/cover/image-generator-header.webp";

  return (
    <section className="relative w-full overflow-hidden bg-[--background]">
      <div className="relative mx-auto my-0 min-h-[780px] w-full max-w-[1576px] lg:rounded-xl">
        {/* 背景图片 */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt={section.title || "Abstract AI creative background"}
            fill
            priority
            className="object-cover object-top"
          />
          {/* 深色渐变蒙版：增强对比 from-black/80 via-black/60 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[--background]" />
        </div>

        {/* 内容容器：底部对齐 */}
        <div className="relative z-10 flex h-[780px] flex-col justify-end gap-8 p-6 pb-16 sm:p-8 md:p-10 lg:p-11 xl:p-16">
          <div className="flex flex-col items-start gap-8">
            {/* 标题和描述：左对齐 */}
            <div className="max-w-[676px] text-left text-white">
              <h1 className="text-balance text-4xl font-bold leading-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] lg:text-5xl xl:text-6xl">
                {section.title || "AI Image Generator"}
              </h1>
              <p className="mt-4 max-w-2xl text-balance text-base font-normal leading-relaxed text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                {section.description ||
                  "Try the ultimate Image Generator. Access the most advanced AI models and create AI images with just a prompt or an image reference."}
              </p>
            </div>

            {/* 输入表单 */}
            <PromptForm
              placeholder={section.form?.placeholder}
              trustText={section.form?.trust_text}
              buttons={section.buttons}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
