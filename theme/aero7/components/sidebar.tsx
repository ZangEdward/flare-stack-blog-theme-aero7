import { Suspense } from "react";
import { DraggableWindow } from "./draggable-window";
import { Tags, TagsSkeleton } from "./tags";

/**
 * 侧栏组件：桌面左侧显示标签云窗口。
 * Profile（头像/简介/签名）已迁移到 Navbar 顶部作为 Win7 Orb 风格。
 *
 * 窗口 chrome（.window.glass.active）由子组件 Tags 自己提供（draggable-window
 * 的设计约定：外壳只负责拖动/定位，不重复一层 .window.glass），所以这里只挂
 * 布局类 aero-sidebar-window。
 * 不传 defaultSize：流式布局下 width:100% 自然填满侧栏列；拖动后 DraggableWindow
 * 用捕获到的 size.w 作为浮动宽度（见 styles 里 .aero-sidebar-window 的 width 规则，
 * 不能用 !important 否则浮动时会被撑成整页宽）。
 */
export function Sidebar() {
  return (
    <DraggableWindow title="Tags" className="aero-sidebar-window">
      <Suspense fallback={<TagsSkeleton />}>
        <Tags />
      </Suspense>
    </DraggableWindow>
  );
}
