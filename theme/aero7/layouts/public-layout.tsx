import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PublicLayoutProps } from "@/features/theme/contract/layouts";
import { BackToTop } from "../components/control/back-to-top";
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

  // aero7 使用自己的 homeBg；未设置则兜底到主题默认壁纸
  const aero7Bg =
    siteConfig.theme.aero7?.homeBg || "/images/aero-wallpaper.jpg";

  // 给 <html> 打上 aero7-theme 标记，使 aero7 的全局样式（滚动条/选区/字体/背景）
  // 仅作用于公共博客页，不污染后台/设置界面（后台用 default 主题）。
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-scrollbar");
    root.classList.add("aero7-theme");
    return () => {
      root.classList.remove("has-scrollbar");
      root.classList.remove("aero7-theme");
    };
  }, []);

  return (
    <div className="aero7-theme relative min-h-screen flex flex-col">
      {/* 壁纸背景层：固定覆盖、居中、无过度遮罩，让壁纸正常显示 */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url("${aero7Bg}")` }}
      />
      {/* 极淡的全局压暗层，仅提升文字可读性，不遮住壁纸 */}
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

      {/* Main content：与原版 flare-stack-blog 一致的居中窄布局 */}
      <main className="relative z-30 flex-1 w-full max-w-(--fuwari-page-width) mx-auto px-6 md:px-0 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <div className="relative z-30 w-full max-w-(--fuwari-page-width) mx-auto px-6 md:px-0 pb-8">
        <Footer navOptions={navOptions} />
      </div>

      <BackToTop />
    </div>
  );
}
