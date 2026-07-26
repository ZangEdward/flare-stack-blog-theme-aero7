import { Suspense } from "react";
import { DraggableWindow } from "./draggable-window";
import { Tags, TagsSkeleton } from "./tags";

/**
 * 侧栏组件：桌面左侧显示标签云窗口。
 * Profile（头像/简介/签名）已迁移到 Navbar 顶部作为 Win7 Orb 风格。
 *
 * DraggableWindow 仅作为定位/拖拽壳；7.css `.window.glass` 玻璃外观
 * 由 `<Tags />` / `<TagsSkeleton />` 内部自己渲染。
 */
export function Sidebar() {
  return (
    <DraggableWindow
      title="Tags"
      defaultSize={{ w: 260, h: 360 }}
      className="window glass active"
    >
      <Suspense fallback={<TagsSkeleton />}>
        <Tags />
      </Suspense>
    </DraggableWindow>
  );
}
