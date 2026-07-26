import type { CSSProperties } from "react";
import type { SiteConfig } from "@/features/config/site-config.schema";

/**
 * 把站点配置映射成注入 <html> 的 CSS 变量。
 * - 默认使用 Aero 蓝（#3c7fb1，Frutiger Aero 主色）。
 * - 若后台在 aero7 主题配置中设置了“有效”强调色，则覆盖
 *   7.css 的窗口主色 --w7-w-bg 与主题主色 --fuwari-primary。
 * - 空白、#fff / #ffffff / white 等无色值一律回落到 Aero 蓝，
 *   避免后台误存白色导致整套主题“看起来没应用”（窗口框/链接全白）。
 */
function isValidAccent(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const v = value.trim().toLowerCase();
  if (!v) return false;
  // 无色 / 近白值视为无效，回落默认蓝
  if (/^#?(fff{1,2}|ffffff|white)$/.test(v)) return false;
  return true;
}

export function getAero7ThemeStyle(siteConfig: SiteConfig): CSSProperties {
  const style: Record<string, string> = {
    "--fuwari-hue": "215",
    "--fuwari-primary": "#3c7fb1",
    "--w7-w-bg": "#3c7fb1",
  };

  const accent = siteConfig.theme.aero7?.accentColor;
  if (isValidAccent(accent)) {
    style["--w7-w-bg"] = accent;
    style["--fuwari-primary"] = accent;
  }

  return style as CSSProperties;
}
