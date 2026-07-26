import { Link, useRouteContext } from "@tanstack/react-router";
import { Home, Menu, Search, UserIcon } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import type { NavOption, UserInfo } from "@/features/theme/contract/layouts";
import { m } from "@/paraglide/messages";
import { LanguageSwitcher } from "./language-switcher";

interface NavbarProps {
  navOptions: Array<NavOption>;
  onMenuClick: () => void;
  isLoading?: boolean;
  user?: UserInfo;
}

export function Navbar({
  onMenuClick,
  user,
  navOptions,
  isLoading,
}: NavbarProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [collapsed, setCollapsed] = useState(false);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      id="fuwari-navbar"
      className="fuwari-onload-animation aero-titlebar"
      style={{ animationDelay: "0ms" }}
    >
      {/* 左侧：站点标题（窗口标题文字 + 白光） */}
      {!collapsed && (
        <Link
          to="/"
          className="title-bar-text aero-brand active:scale-95"
          aria-label={siteConfig.title}
        >
          <Home
            size={24}
            strokeWidth={1.5}
            className="aero-brand-icon mr-2 shrink-0"
          />
          <span className="aero-brand-text">{siteConfig.title}</span>
        </Link>
      )}

      {/* 中间：导航标签（Aero 标签页风格） */}
      {!collapsed && (
        <nav className="aero-tabs">
          {navOptions.map((option) => (
            <Link
              key={option.id}
              to={option.to}
              className="aero-tab"
              activeProps={{ className: "aero-tab-active" }}
            >
              {option.label}
            </Link>
          ))}
        </nav>
      )}

      {/* 右侧：UI 按钮（Win7 玻璃按钮）+ 窗口控制按钮 */}
      <div className="aero-nav-actions">
        {!collapsed && (
          <>
            <Link
              to="/search"
              className="aero-navbtn fuwari-btn-regular hidden lg:flex items-center h-11 mr-1 rounded-lg w-52"
              aria-label={m.nav_search()}
            >
              <Search
                size={18}
                className="ml-3 transition-colors"
                strokeWidth={1.25}
              />
              <span className="ml-2 text-sm bg-transparent outline-none truncate">
                {m.nav_search()}
              </span>
            </Link>
            <Link
              to="/search"
              className="aero-navbtn fuwari-btn-regular lg:hidden flex items-center justify-center h-11 w-11 rounded-lg"
              aria-label={m.nav_search()}
            >
              <Search size={18} strokeWidth={1.25} />
            </Link>
            <ThemeToggle className="aero-navbtn fuwari-btn-regular flex items-center justify-center h-11 w-11 rounded-lg p-0! [&_svg]:w-4.5! [&_svg]:h-4.5! [&_div]:w-auto! [&_div]:h-auto!" />
            <LanguageSwitcher className="aero-navbtn fuwari-btn-regular flex items-center justify-center h-11 w-11 rounded-lg p-0!" />
            <div className="hidden md:flex items-center">
              {isLoading ? (
                <Skeleton className="w-9 h-9 rounded-lg" />
              ) : user ? (
                <Link
                  to="/profile"
                  className="aero-navbtn fuwari-btn-regular flex items-center justify-center h-11 w-11 rounded-lg"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon
                        size={18}
                        strokeWidth={1.25}
                        className="aero-icon-faint"
                      />
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="aero-navbtn fuwari-btn-regular flex items-center justify-center h-11 w-11 rounded-lg"
                  aria-label={m.nav_login()}
                >
                  <UserIcon size={18} strokeWidth={1.25} />
                </Link>
              )}
            </div>
            <button
              className="aero-navbtn fuwari-btn-regular flex items-center justify-center h-11 w-11 rounded-lg md:hidden"
              onClick={onMenuClick}
              aria-label={m.common_open_menu()}
              type="button"
            >
              <Menu size={18} strokeWidth={1.25} />
            </button>
          </>
        )}

        {/* 窗口控制按钮（最小化 / 最大化 / 关闭）—— 仿 Windows 7 标题栏 */}
        <div className="title-bar-controls">
          <button
            aria-label="Minimize"
            type="button"
            onClick={() => setCollapsed(true)}
          />
          <button
            aria-label="Maximize"
            title="回到顶部"
            type="button"
            onClick={scrollTop}
          />
          <button
            aria-label="Close"
            title="回到顶部"
            type="button"
            onClick={scrollTop}
          />
        </div>
      </div>
    </div>
  );
}
