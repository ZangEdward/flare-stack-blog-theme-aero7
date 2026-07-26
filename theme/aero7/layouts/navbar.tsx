import { Link, useRouteContext } from "@tanstack/react-router";
import {
  FileText,
  Home,
  Link2,
  Menu,
  Newspaper,
  Search,
  User,
  UserIcon,
} from "lucide-react";
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

function navIcon(option: NavOption) {
  const id = option.id.toLowerCase();
  const label = option.label.toLowerCase();
  if (id.includes("home") || label.includes("主页") || label.includes("首页"))
    return Home;
  if (
    id.includes("post") ||
    id.includes("blog") ||
    id.includes("article") ||
    label.includes("文章") ||
    label.includes("博文")
  )
    return Newspaper;
  if (
    id.includes("friend") ||
    id.includes("link") ||
    label.includes("友链") ||
    label.includes("链接")
  )
    return Link2;
  if (
    id.includes("about") ||
    id.includes("profile") ||
    label.includes("关于") ||
    label.includes("简介")
  )
    return User;
  if (
    id.includes("search") ||
    id.includes("tag") ||
    label.includes("搜索") ||
    label.includes("标签")
  )
    return Search;
  return FileText;
}

export function Navbar({
  onMenuClick,
  user,
  navOptions,
  isLoading,
}: NavbarProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });

  return (
    <div className="aero-taskbar">
      {/* 左侧：Win7 Orb 风格站点区 */}
      <Link
        to="/"
        className="aero-taskbar-orb active:scale-95"
        aria-label={siteConfig.title}
      >
        <img
          src="/images/avatar.png"
          alt={siteConfig.author}
          className="aero-taskbar-avatar"
        />
        <div className="aero-taskbar-brand">
          <span className="aero-taskbar-title">{siteConfig.title}</span>
          <span className="aero-taskbar-tagline">{siteConfig.description}</span>
        </div>
      </Link>

      {/* 中间：任务栏按钮（像 Win7 任务栏上的任务图标） */}
      <nav className="aero-taskbar-buttons">
        {navOptions.map((option) => {
          const Icon = navIcon(option);
          return (
            <Link
              key={option.id}
              to={option.to}
              className="aero-taskbar-btn"
              activeProps={{ className: "aero-taskbar-btn aero-taskbar-btn-active" }}
            >
              <Icon size={18} strokeWidth={1.5} className="aero-taskbar-btn-icon" />
              <span className="aero-taskbar-btn-label">{option.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 右侧：系统托盘 */}
      <div className="aero-taskbar-tray">
        <Link
          to="/search"
          className="aero-taskbar-btn aero-taskbar-btn-icon-only"
          aria-label={m.nav_search()}
        >
          <Search size={18} strokeWidth={1.5} />
        </Link>

        <ThemeToggle className="aero-taskbar-btn aero-taskbar-btn-icon-only p-0! [&_svg]:w-4.5! [&_svg]:h-4.5! [&_div]:w-auto! [&_div]:h-auto!" />
        <LanguageSwitcher className="aero-taskbar-btn aero-taskbar-btn-icon-only p-0!" />

        <div className="hidden md:flex items-center">
          {isLoading ? (
            <Skeleton className="w-8 h-8 rounded-full" />
          ) : user ? (
            <Link
              to="/profile"
              className="aero-taskbar-btn aero-taskbar-btn-icon-only"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <UserIcon size={18} strokeWidth={1.5} />
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="aero-taskbar-btn aero-taskbar-btn-icon-only"
              aria-label={m.nav_login()}
            >
              <UserIcon size={18} strokeWidth={1.5} />
            </Link>
          )}
        </div>

        <button
          className="aero-taskbar-btn aero-taskbar-btn-icon-only md:hidden"
          onClick={onMenuClick}
          aria-label={m.common_open_menu()}
          type="button"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
