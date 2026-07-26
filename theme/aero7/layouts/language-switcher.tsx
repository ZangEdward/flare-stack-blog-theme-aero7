import { ChevronLeft, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { m } from "@/paraglide/messages";
import { getLocale, setLocale } from "@/paraglide/runtime";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = getLocale();

  const handleLanguageChange = (locale: "zh" | "en") => {
    setLocale(locale);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative flex items-center justify-center h-full ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full h-full text-white/85 hover:text-white transition-colors group"
        aria-label={m.common_switch_language()}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Languages size={18} strokeWidth={1.5} />
      </button>

      {isOpen && (
        // 7.css 原生 menu 风格：直角、Aero 玻璃、蓝色高亮，无圆角裁切
        <ul
          role="menu"
          className="aero-menu aero-language-dropdown absolute top-full right-0 mt-1 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <li role="none">
            <button
              role="menuitem"
              type="button"
              onClick={() => handleLanguageChange("zh")}
              className={`aero-menu-item ${
                currentLocale === "zh" ? "aero-menu-item-active" : ""
              }`}
            >
              <ChevronLeft
                size={12}
                className={`inline-block mr-1 ${
                  currentLocale === "zh" ? "" : "opacity-0"
                }`}
              />
              中文
            </button>
          </li>
          <li role="none">
            <button
              role="menuitem"
              type="button"
              onClick={() => handleLanguageChange("en")}
              className={`aero-menu-item ${
                currentLocale === "en" ? "aero-menu-item-active" : ""
              }`}
            >
              <ChevronLeft
                size={12}
                className={`inline-block mr-1 ${
                  currentLocale === "en" ? "" : "opacity-0"
                }`}
              />
              English
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
