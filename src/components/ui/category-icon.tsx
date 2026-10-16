import type { ComponentType, SVGProps } from "react";
import type { FocusIcon } from "@/types/content";
import {
  CloudIcon,
  CodeIcon,
  DatabaseIcon,
  LayoutIcon,
  MonitorIcon,
  PhoneIcon,
  PlugIcon,
  ServerIcon,
  ShieldIcon,
  SparklesIcon,
  WandIcon,
} from "./icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const FOCUS_ICONS: Record<FocusIcon, Icon> = {
  web: MonitorIcon,
  mobile: PhoneIcon,
  server: ServerIcon,
  ai: SparklesIcon,
};

const SKILL_ICONS: ReadonlyArray<[RegExp, Icon]> = [
  [/language/i, CodeIcon],
  [/front/i, LayoutIcon],
  [/back/i, ServerIcon],
  [/data/i, DatabaseIcon],
  [/tool/i, WandIcon],
  [/ai|genai|ml/i, SparklesIcon],
  [/cloud|devops/i, CloudIcon],
  [/integration/i, PlugIcon],
  [/security|auth/i, ShieldIcon],
];

export function getFocusIcon(icon: FocusIcon): Icon {
  return FOCUS_ICONS[icon];
}

export function getSkillIcon(title: string): Icon {
  return SKILL_ICONS.find(([pattern]) => pattern.test(title))?.[1] ?? CodeIcon;
}
