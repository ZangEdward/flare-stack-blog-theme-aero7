import { useEffect } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { BackToTop } from "../components/control/back-to-top";
import { Sidebar } from "../components/sidebar";
import { MobileMenu } from "./mobile-menu";
import { Navbar } from "./navbar";

/**
 * 公共页布局：顶部 Win7 任务栏 + 桌面区（左标签列 + 右文章列）。
 * 壁纸来源：
 *   1. 后台 siteConfig.theme.aero7.homeBg（aero7 主题设置）
 *   2. 后台 siteConfig.theme.default.background.homeImage（首页）/
 *      globalImage（其它页） — DefaultThemeSettings 的字段
 *   3. CSS 兜底（var(--fuwari-page-bg) 渐变）
 * 没有 fallback 到包底 /images/aero-wallpaper.jpg —— 真实场景中后台
 * 一定会配置；若为空就只用渐变兜底。
 */
export function PublicLayout({
  children,
  navOptions,
  user,
  isSessionLoading,
  logout,
}: PublicLayoutProps) {
  const ctx = useRouteContext({ from: "__root__" });
  const siteConfig = ctx.siteConfig;
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const isHome = pathname === "/" || pathname === "";

  // 主题隔离：只在公共页激活 aero7 作用域，离开时移除，避免污染 admin/设置页。
  useEffect(() => {
    document.documentElement.classList.add("aero7-theme");
    return () => {
      document.documentElement.classList.remove("aero7-theme");
    };
  }, []);

  // 壁纸来源（按优先级）：
  //   1. 用户后台为 aero7 主题单独设置的 homeBg
  //   2. 用户后台 default 主题设置的 homeImage/globalImage
  //   3. blogConfig 中的 fallback
  // 关键：如果 aero7.homeBg 等于 blogConfig 默认值（旧说明它是没设置时的占位），
  // 就视为未设置，回落到 default.background。
  const DEFAULT_AERO_HOME_BG = "/images/aero-wallpaper.jpg";
  const aero7HomeBg =
    siteConfig.theme.aero7?.homeBg &&
    siteConfig.theme.aero7.homeBg !== DEFAULT_AERO_HOME_BG
      ? siteConfig.theme.aero7.homeBg
      : undefined;
  const defaultBg = siteConfig.theme.default?.background;
  const bgUrl = isHome
    ? aero7HomeBg ||
      defaultBg?.homeImage ||
      DEFAULT_AERO_HOME_BG
    : aero7HomeBg ||
      defaultBg?.globalImage ||
      defaultBg?.homeImage ||
      DEFAULT_AERO_HOME_BG;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <MobileMenu
        navOptions={navOptions}
        isOpen={false}
        onClose={() => {}}
        user={user}
        logout={logout}
      />

      {/* Win7 任务栏 */}
      <Navbar
        navOptions={navOptions}
        onMenuClick={() => {}}
        user={user}
        isLoading={isSessionLoading}
      />

      {/* 桌面区：壁纸放在桌面内部第一层，确保在内容下方 */}
      <div className={cn("aero-desktop", bgUrl && "has-wallpaper")}>
        {bgUrl && (
          <div
            aria-hidden="true"
            className="aero-desktop-wallpaper"
            style={{ backgroundImage: `url("${bgUrl}")` }}
          />
        )}
        <div className="aero-desktop-content">
          <aside className="aero-desktop-sidebar">
            <Sidebar />
          </aside>
          <main className="aero-desktop-main">{children}</main>
        </div>
      </div>

      <BackToTop />
    </div>
  );
}
