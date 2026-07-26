import { useController, useFormContext } from "react-hook-form";
import { Field } from "@/features/config/components/site-settings-fields";
import { DefaultThemeSettings } from "@/features/config/components/themes/default-theme-settings";
import type { SystemConfig } from "@/features/config/config.schema";
import { m } from "@/paraglide/messages";

const DEFAULT_ACCENT = "#3c7fb1";

function Aero7AccentColorField() {
  const { control } = useFormContext<SystemConfig>();
  const { field } = useController({
    control,
    name: "site.theme.aero7.accentColor",
  });

  const value =
    typeof field.value === "string" && field.value ? field.value : DEFAULT_ACCENT;

  return (
    <Field
      label={m.settings_site_field_accent_color()}
      hint={m.settings_site_field_accent_color_hint()}
    >
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
