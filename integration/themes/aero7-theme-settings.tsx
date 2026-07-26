import { useController, useFormContext } from "react-hook-form";
import { Field } from "@/features/config/components/site-settings-fields";
import { DefaultThemeSettings } from "@/features/config/components/themes/default-theme-settings";
import type { SystemConfig } from "@/features/config/config.schema";
import { getLocale } from "@/paraglide/runtime";

const DEFAULT_ACCENT = "#3c7fb1";

// aero7 专属文案，自包含在主题组件内，不写回共享 messages 文件，避免改动博客原文件。
const ACCENT_LABEL =
  getLocale() === "zh" ? "强调色" : "Accent Color";
const ACCENT_HINT =
  getLocale() === "zh"
    ? "控制 Windows 7 Aero 窗口颜色、链接、按钮与高光。使用十六进制颜色如 #2a7fd0。"
    : "Controls the Windows 7 Aero window color, links, buttons and highlights. Use a hex color like #2a7fd0.";

function Aero7AccentColorField() {
  const { control } = useFormContext<SystemConfig>();
  const { field } = useController({
    control,
    name: "site.theme.aero7.accentColor",
  });

  const value =
    typeof field.value === "string" && field.value ? field.value : DEFAULT_ACCENT;

  return (
    <Field label={ACCENT_LABEL} hint={ACCENT_HINT}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          aria-label="accent color picker"
          value={value}
          onChange={(event) => field.onChange(event.target.value)}
          className="h-10 w-14 cursor-pointer rounded-md border border-border/40 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => field.onChange(event.target.value)}
          placeholder={DEFAULT_ACCENT}
          className="h-10 flex-1 rounded-md border border-border/40 bg-background px-3 font-mono text-sm text-foreground"
        />
      </div>
    </Field>
  );
}

export function Aero7ThemeSettings() {
  return (
    <>
      {/* 复用"默认主题"的后台背景图设置（homeImage / globalImage / 模糊 / 透明度），
       * aero7 的页面背景与磨砂效果即由它驱动，可在后台随时更换。 */}
      <DefaultThemeSettings />
      <Aero7AccentColorField />
    </>
  );
}
