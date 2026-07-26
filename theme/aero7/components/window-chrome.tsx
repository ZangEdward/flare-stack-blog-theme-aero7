import type { ReactNode } from "react";

interface WindowChromeProps {
  title: ReactNode;
  children?: ReactNode;
  rightSlot?: ReactNode;
  /** 是否在右上角显示 7.css 三按钮（默认 true）。 */
  showControls?: boolean;
  /** 自定义最外层 className */
  className?: string;
  /** 自定义 .title-bar className */
  titleBarClassName?: string;
}

/**
 * Win7 玻璃窗口壳：完全交由 7.css 原生 `.window.glass` 渲染外观，
 * 提供 7.css 原生三按钮 (Minimize / Maximize / Close) 装饰。
 * 本组件不实现按钮逻辑，仅作为视觉壳；按钮事件由 7.css aria-label 决定图标。
 *
 * 用法：
 *   <WindowChrome title="xxx">
 *     <div className="window-body has-space">...</div>
 *   </WindowChrome>
 */
export function WindowChrome({
  title,
  children,
  rightSlot,
  showControls = true,
  className,
  titleBarClassName,
}: WindowChromeProps) {
  return (
    <div className={`window glass active flex flex-col h-full ${className ?? ""}`}>
      <div className={`title-bar ${titleBarClassName ?? ""}`}>
        <div className="title-bar-text">{title}</div>
        {rightSlot}
        {showControls && (
          <div className="title-bar-controls">
            <button type="button" aria-label="Close" tabIndex={-1} />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
