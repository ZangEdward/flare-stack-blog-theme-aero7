import { useEffect, useRef, useState } from "react";
import { Languages } from "lucide-react";
import { m } from "@/paraglide/messages";
import { getLocale, setLocale } from "@/paraglide/runtime";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  // 7.css 原生结构（参考 https://khang-nd.github.io/7.css/#menu）：
  //   <ul role="menu" style="width: 200px">
  //     <li role="menuitem">
  //       <input type="radio" name="aero-lang" id="aero-lang-zh"><label for="aero-lang-zh">中文</label>
  //     </li>
  //   </ul>
  // 由 setLocale 切换语言。
  const current = getLocale();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 点击外部 / Esc 关闭（Win7 系统托盘标准行为）
  useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onPick = (next: "zh" | "en") => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocale(next);
    setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className={`relative flex items-center justify-center h-full aero-language-wrap ${className} ${open ? "is-open" : ""}`}
    >
      <button
        type="button"
        className="aero-language-trigger flex items-center justify-center w-full h-full text-white/85 hover:text-white transition-colors"
        aria-label={m.common_switch_language()}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Languages size={16} strokeWidth={1.5} />
      </button>

      <ul role="menu" className="aero-language-menu" style={{ width: "200px" }}>
        <li role="menuitem">
          <input
            type="radio"
            name="aero-lang"
            id="aero-lang-zh"
            checked={current === "zh"}
            onChange={() => {}}
            onClick={onPick("zh")}
          />
          <label htmlFor="aero-lang-zh">中文</label>
        </li>
        <li role="menuitem">
          <input
            type="radio"
            name="aero-lang"
            id="aero-lang-en"
            checked={current === "en"}
            onChange={() => {}}
            onClick={onPick("en")}
          />
          <label htmlFor="aero-lang-en">English</label>
        </li>
      </ul>
    </div>
  );
}
