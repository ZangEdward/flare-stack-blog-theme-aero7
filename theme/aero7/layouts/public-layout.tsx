import { useRouteContext, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { BackToTop } from "../components/control/back-to-top";
import { Sidebar } from "../components/sidebar";
import { Footer } from "./footer";
import { MobileMenu } from "./mobile-menu";
import { Navbar } from "./navbar";

export function PublicLayout({
  children,
  navOptions,
  user,
  isSessionLoading,
  logout,
}: PublicLayoutProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 让 7.css 的 Win7 滚动条样式作用于整个文档。
  // 同时给 <html> 打上 aero7-theme 标记，使 aero7 的全局样式（滚动条/选区）
  // 仅作用于公共博客页，不污染后台/设置界面（后台用 default 主题）。
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.add("has-scrollbar");
    root.classList.add("aero7-theme");
    body.classList.add("has-scrollbar");
    return () => {
      root.classList.remove("has-scrollbar");
      root.classList.remove("aero7-theme");
      body.classList.remove("has-scrollbar");
    };
  }, []);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isHome = pathname === "/" || pathname === "";
  const aero7HomeBg = siteConfig.theme.aero7?.homeBg;
  const defaultBg = siteConfig.theme.default?.background;
  const aero7Bg = isHome
    ? aero7HomeBg ||
      defaultBg?.homeImage ||
      "/images/aero-wallpaper.jpg"
    : aero7HomeBg ||
      defaultBg?.globalImage ||
      defaultBg?.homeImage ||
      "/images/aero-wallpaper.jpg";

  return (
    <div className="aero7-theme relative min-h-screen flex flex-col overflow-hidden">
      {/* 壁纸背景层 */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url("${aero7Bg}")` }}
      />
      {/* 极淡的全局压暗层 */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-gradient-to-b from-white/10 via-transparent to-white/25 dark:from-black/20 dark:via-transparent dark:to-black/40 pointer-events-none"
      />

      <MobileMenu
        navOptions={navOptions}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        logout={logout}
      />

      {/* Win7 任务栏 */}
      <div className="aero-taskbar-shell sticky top-0 z-50 shrink-0">
        <Navbar
          navOptions={navOptions}
          onMenuClick={() => setIsMenuOpen(true)}
          user={user}
          isLoading={isSessionLoading}
        />
      </div>

      {/* 桌面区域：浮动窗口容器 */}
      <div className="aero-desktop flex-1 relative overflow-auto">
        <div className="aero-desktop-surface">
          <Sidebar />
          {children}
        </div>
        <div className="aero-desktop-footer">
          <Footer navOptions={navOptions} />
        </div>
      </div>

      <BackToTop />
    </div>
  );
}
