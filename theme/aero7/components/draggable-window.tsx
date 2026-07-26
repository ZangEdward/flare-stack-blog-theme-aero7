"use client";

import { useCallback, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DraggableWindowProps {
  initial: Position;
  children: ReactNode;
  className?: string;
  title?: string;
  minW?: number;
  minH?: number;
}

const TITLEBAR_HEIGHT = 36;

export function DraggableWindow({
  initial,
  children,
  className,
  title,
  minW = 180,
  minH = 100,
}: DraggableWindowProps) {
  const [pos, setPos] = useState<Position>(initial);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const startRef = useRef<{ x: number; y: number; pos: Position } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      const rect = nodeRef.current?.getBoundingClientRect();
      if (!rect) return;

      const relY = e.clientY - rect.top;
      // 仅在标题栏区域（顶部约 36px）开始拖拽
      if (relY > TITLEBAR_HEIGHT) return;

      // 避免在按钮、链接、resize 手柄上触发拖拽
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-resize-handle]")
      )
        return;

      setIsActive(true);
      setIsDragging(true);
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      startRef.current = { x: e.clientX, y: e.clientY, pos: { ...pos } };
    },
    [pos]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!startRef.current) return;
      if (isDragging) {
        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;
        setPos({
          ...startRef.current.pos,
          x: startRef.current.pos.x + dx,
          y: startRef.current.pos.y + dy,
        });
      } else if (isResizing) {
        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;
        setPos({
          ...startRef.current.pos,
          w: Math.max(minW, startRef.current.pos.w + dx),
          h: Math.max(minH, startRef.current.pos.h + dy),
        });
      }
    },
    [isDragging, isResizing, minW, minH]
  );

  const endInteraction = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      setIsResizing(false);
      startRef.current = null;
      try {
        (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    },
    []
  );

  const onResizeDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (e.button !== 0) return;
      setIsActive(true);
      setIsResizing(true);
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      startRef.current = { x: e.clientX, y: e.clientY, pos: { ...pos } };
    },
    [pos]
  );

  return (
    <div
      ref={nodeRef}
      className={cn(
        "window glass active aero-desktop-window",
        isActive && "aero-desktop-window-active",
        className
      )}
      style={{
        left: pos.x,
        top: pos.y,
        width: pos.w,
        height: pos.h,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endInteraction}
      onPointerCancel={endInteraction}
      data-title={title}
      aria-label={title}
      role="group"
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
      />
    </div>
  );
}
