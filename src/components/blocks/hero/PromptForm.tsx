"use client";

import { Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HeroButton } from '@/types/blocks/hero';

export interface PromptFormProps {
  placeholder?: string;
  trustText?: string;
  buttons?: HeroButton[];
}

export const PromptForm = ({
  placeholder = "Describe what you want to see",
  buttons,
}: PromptFormProps) => {
  const defaultButtons: HeroButton[] = [
    { title: "No style", type: "style", icon: "Sparkles" },
    { title: "Generate", type: "submit", icon: "Send" },
  ];
  const formButtons = buttons && buttons.length >= 2 ? buttons : defaultButtons;

  return (
    <form className="relative z-10 flex w-full max-w-xl flex-col gap-7 rounded-3xl border border-white/10 bg-[var(--card,#1f1f1f)] p-5 backdrop-blur-xl">
      <textarea
        name="prompt"
        rows={2}
        className="block w-full resize-none border-none bg-transparent text-lg text-[--foreground] outline-none placeholder:text-[--muted-foreground] focus-visible:outline-none"
        placeholder={placeholder}
      />
      <div className="flex items-center justify-between">
        <motion.button
          type="button"
          className="flex items-center gap-2 rounded-full bg-zinc-800/80 px-5 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-zinc-700/80"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={16} />
          <span className="truncate">{formButtons[0]?.title ?? "No style"}</span>
        </motion.button>
        <motion.button
          type="submit"
          className="group flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-zinc-800/80 p-3 text-white transition-colors hover:bg-zinc-700/80"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Send size={16} />
        </motion.button>
      </div>
    </form>
  );
};
