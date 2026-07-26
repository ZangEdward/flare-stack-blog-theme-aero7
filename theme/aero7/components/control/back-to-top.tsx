import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = window.innerHeight * 0.35;
      setIsVisible(window.scrollY > bannerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label={m.post_back_to_top()}
      type="button"
      className={cn(
        "hidden lg:flex fixed bottom-8 right-8 z-50 items-center justify-center",
        "w-12 h-12 rounded-full fuwari-btn-regular",
        "text-(--fuwari-primary) shadow-lg transition-all duration-300",
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none",
      )}
    >
      <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
}
