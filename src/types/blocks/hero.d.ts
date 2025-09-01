import { Button, Image, Announcement } from "@/types/blocks/base";

export interface Announcement {
  title?: string;
  description?: string;
  label?: string;
  url?: string;
  target?: string;
}

export interface FloatingImage {
  src: string;
  className: string;
  duration?: number;
  yOffset?: number;
  delay?: number;
  alt?: string;
}

export interface HeroForm {
  placeholder?: string;
  trust_text?: string;
}

export interface HeroButton {
  title: string;
  type: "style" | "submit";
  icon: string;
}

export interface Hero {
  name?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
  floating_images?: FloatingImage[];
  form?: HeroForm;
  buttons?: HeroButton[];
  announcement?: Announcement;
  show_announcement?: boolean;
}
