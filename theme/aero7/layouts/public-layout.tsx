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
  // 注意：滚动条容器在不同浏览器可能是 <html> 也可能是 <body>，
  // 7.css 的 .has-scrollbar 选择器只作用于带该类的元素，因此两者都加上，
  // 否则会回退到 Tailwind 默认的细滚动条（看起来不是 Win7 风格）。
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

  // 背景图读取顺序（与默认主题 BackgroundLayer 一致，可由博客后台更换）：
  //   - 首页用 theme.default.background.homeImage
  //   - 其它页用 theme.default.background.globalImage（缺省回退 homeImage）
  //   - aero7 自己的 theme.aero7.homeBg 若有值优先；都没有则兜底主题默认壁纸
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
    <div className="aero7-theme relative min-h-screen">
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

      {/* Main content（z-30 浮在背景层之上） */}
      <div
        className="relative z-30 mx-auto px-0 md:px-4 pb-8 grid grid-cols-1 lg:grid-cols-[17.5rem_1fr] gap-4"
        style={{ maxWidth: "var(--fuwari-page-width)" }}
      >
        {/* Sidebar Column (left on md+, below main on mobile) */}
        <Sidebar className="order-2 lg:order-1" />

        {/* Main Content Column (right on md+, top on mobile) */}
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
