import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { BackgroundLayer } from "@/features/theme/themes/default/components/background-layer";
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

  return (
    <div className="aero7-theme relative min-h-screen">
      {/* 后台"背景图"设置驱动的背景层（含 backdropBlur 磨砂模糊），可在后台随时更换 */}
      <BackgroundLayer background={siteConfig.theme.default.background} />

      <MobileMenu
        navOptions={navOptions}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        logout={logout}
      />

      {/* Top row: Navbar - sticky（始终可见，仿窗口标题栏） */}
      <div className="sticky top-0 z-50 pointer-events-none">
        <div className="pointer-events-auto max-w-(--fuwari-page-width) mx-auto px-0 md:px-4">
          <Navbar
            navOptions={navOptions}
            onMenuClick={() => setIsMenuOpen(true)}
            user={user}
            isLoading={isSessionLoading}
          />
        </div>
      </div>

      {/* Main content（z-30 浮在背景层之上） */}
      <div
        className="relative z-30 mx-auto px-0 md:px-4 pb-8 grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-6"
        style={{ maxWidth: "var(--fuwari-page-width)" }}
      >
        {/* Sidebar Column */}
        <Sidebar className="order-2 lg:order-1" />

        {/* Main Content Column */}
        <main className="order-1 lg:order-2 flex flex-col gap-4 min-w-0">
          {children}
        </main>

        {/* Footer Column (Desktop: below main, Mobile: below sidebar) */}
        <div
          className="order-3 lg:col-start-2 fuwari-onload-animation mt-auto"
          style={{ animationDelay: "250ms" }}
        >
          <Footer navOptions={navOptions} />
        </div>

        <BackToTop />
      </div>
    </div>
  );
}
