"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DraggableWindowProps {
  children: ReactNode;
  /** 在 grid 流式布局中的初始尺寸（仅在未拖动前生效） */
  defaultSize?: { w: number; h: number };
  className?: string;
  title?: string;
  minW?: number;
  minH?: number;
  /** 作为拖动手柄的子元素选择器（默认 `.title-bar`，即 7.css 原生标题栏） */
  dragHandleSelector?: string;
  /** 可选：覆盖初始 absolute 位置（用户拖动后保持该位置） */
  initial?: Position;
  /** 额外的内联样式（如动画 delay） */
  style?: CSSProperties;
}

/**
 * Win7 风格可拖动 / 可缩放窗口壳：
 *
 * - 默认状态：完全 participate grid/flow 布局（CSS `position: static`），
 *   不会重叠、不绝对定位、不脱离文档流；
 * - 按住 7.css 原生 `.title-bar`（在标题栏内、且不在按钮/链接/resize 区域）
 *   开始拖动：立刻切到 `position: absolute`，从 grid 中剥离并跟随手指/鼠标；
 * - 释放后保持 absolute 位置（下次刷新回到默认 grid 流，但用户拖动的体验被保留）；
 * - 右下角 resize 手柄拉伸；点击窗口抬高 z-index。
 *
 * 设计要点（与 7.css 兼容）：
 * 1) **不**渲染外层 chrome（不重复一层 .window.glass），由子组件自己提供，
 *    这样 PostCard 可以自己渲染真实 7.css 标题栏作为可读窗口标题和拖动手柄。
 * 2) 默认 `touch-action: none` 是为了阻断手机浏览器对拖动手势的解释；
 *    非拖动状态用 `touch-action: pan-y` 允许桌面区竖向滚动。
 */
export function DraggableWindow({
  children,
  defaultSize,
  className,
  title,
  minW = 240,
  minH = 160,
  dragHandleSelector = ".title-bar",
  initial,
  style: extraStyle,
}: DraggableWindowProps) {
  const [pos, setPos] = useState<Position | null>(initial ?? null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(
    initial ? { w: initial.w, h: initial.h } : null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const startRef = useRef<{
    x: number;
    y: number;
    pos: Position;
    size: { w: number; h: number };
  } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;

      // 仅在指定 drag-handle 区域内才允许开始拖拽
      const handle = target.closest(dragHandleSelector);
      if (!handle || !nodeRef.current?.contains(handle as Node)) return;

      // 链接 / 按钮 / resize 手柄上不开始拖拽
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-resize-handle]")
      )
        return;
      // 整个 .title-bar-controls 区域也不开始拖拽
      if (target.closest(".title-bar-controls")) return;

      const el = nodeRef.current;
      const parent = el?.offsetParent as HTMLElement | null;
      if (!el || !parent) return;

      const elRect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const curPos: Position = pos ?? {
        x: elRect.left - parentRect.left + parent.scrollLeft,
        y: elRect.top - parentRect.top + parent.scrollTop,
        w: elRect.width,
        h: elRect.height,
      };
      const curSize = { w: elRect.width, h: elRect.height };

      setPos(curPos);
      setSize(curSize);
      setIsActive(true);
      setIsDragging(true);
      try {
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      startRef.current = {
        x: e.clientX,
        y: e.clientY,
        pos: curPos,
        size: curSize,
      };
    },
    [dragHandleSelector, pos],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!startRef.current) return;
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      if (isDragging && pos) {
        setPos({
          ...startRef.current.pos,
          x: startRef.current.pos.x + dx,
          y: startRef.current.pos.y + dy,
        });
      } else if (isResizing && size) {
        setSize({
          w: Math.max(minW, startRef.current.size.w + dx),
          h: Math.max(minH, startRef.current.size.h + dy),
        });
      }
    },
    [isDragging, isResizing, pos, size, minW, minH],
  );

  const endInteraction = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (isDragging || isResizing) {
        setIsDragging(false);
        setIsResizing(false);
        startRef.current = null;
        try {
          (e.currentTarget as HTMLDivElement).releasePointerCapture(
            e.pointerId,
          );
        } catch {
          // ignore
        }
      }
    },
    [isDragging, isResizing],
  );

  const onResizeDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (e.button !== 0) return;
      const el = nodeRef.current;
      const parent = el?.offsetParent as HTMLElement | null;
      if (!el || !parent) return;

      const elRect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const curPos: Position = pos ?? {
        x: elRect.left - parentRect.left + parent.scrollLeft,
        y: elRect.top - parentRect.top + parent.scrollTop,
        w: elRect.width,
        h: elRect.height,
      };
      const curSize = { w: elRect.width, h: elRect.height };

      setPos(curPos);
      setSize(curSize);
      setIsActive(true);
      setIsResizing(true);
      try {
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      startRef.current = {
        x: e.clientX,
        y: e.clientY,
        pos: curPos,
        size: curSize,
      };
    },
    [pos],
  );

  const inlineStyle: CSSProperties = pos
    ? {
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size?.w ?? pos.w,
        height: size?.h ?? pos.h,
        touchAction: "none",
        zIndex: isActive ? 60 : 20,
        userSelect: "none",
      }
    : {
        width: defaultSize?.w ? `${defaultSize.w}px` : undefined,
        minHeight: defaultSize?.h ? `${defaultSize.h}px` : undefined,
        // grid 流式布局下允许触屏竖向滚动不被吞
        touchAction: "pan-y",
      };

  return (
    <div
      ref={nodeRef}
      className={cn(
        "aero-desktop-window",
        pos && "aero-desktop-window-floating",
        isActive && "aero-desktop-window-active",
        className,
      )}
      style={{ ...inlineStyle, ...extraStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
      aria-label={title}
      data-title={title}
    >
      {children}
      <div
        data-resize-handle
        className="aero-resize-handle"
        onPointerDown={onResizeDown}
        onPointerMove={onPointerMove}
        onPointerUp={endInteraction}
        onPointerCancel={endInteraction}
        aria-label="Resize window"
        role="button"
        tabIndex={-1}
      />
    </div>
  );
}
