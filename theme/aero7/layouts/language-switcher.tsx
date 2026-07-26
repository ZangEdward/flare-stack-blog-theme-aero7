import { Languages } from "lucide-react";
import { m } from "@/paraglide/messages";
import { getLocale, setLocale } from "@/paraglide/runtime";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  // 7.css 原生结构（参考 https://khang-nd.github.io/7.css/#menu）：
  //   <ul role="menu" style="width: 200px">
  //     <li role="menuitem">
  //       <input type="radio" name="icon-size" id="example15"><label for="example15">中文</label>
  //     </li>
  //   </ul>
  // 由 setLocale 切换语言。
  const current = getLocale();
  const onPick = (next: "zh" | "en") => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocale(next);
  };

  return (
    <div
      className={`relative flex items-center justify-center h-full aero-language-wrap ${className}`}
    >
      <button
        type="button"
        className="aero-language-trigger flex items-center justify-center w-full h-full text-white/85 hover:text-white transition-colors"
        aria-label={m.common_switch_language()}
        aria-haspopup="menu"
      >
        <Languages size={16} strokeWidth={1.5} />
      </button>

      <ul role="menu" className="aero-language-menu" style={{ width: "200px" }}>
        <li role="menuitem">
          <input
            type="radio"
            name="icon-size"
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
            name="icon-size"
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
