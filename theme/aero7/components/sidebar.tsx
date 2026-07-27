import { Suspense } from "react";
import { DraggableWindow } from "./draggable-window";
import { Tags, TagsSkeleton } from "./tags";

/**
 * 侧栏组件：桌面左侧显示标签云窗口。
 * Profile（头像/简介/签名）已迁移到 Navbar 顶部作为 Win7 Orb 风格。
 *
 * 此处让 DraggableWindow 外壳本身就成为 7.css 的 .window.glass.active
 * （outerClassName 覆盖默认 aero-desktop-window 定位壳），并加
 * fuwari-onload-animation 入场动画；因此子组件 Tags 不再重复一层 .window.glass，
 * 只渲染 title-bar + window-body（见 tags.tsx）。
 * 布局类 aero-sidebar-window 保留（提供 width:100% 填满侧栏列）。
 * 不传 defaultSize：流式布局下 width:100% 自然填满侧栏列；拖动后 DraggableWindow
 * 用捕获到的 size.w 作为浮动宽度（见 styles 里 .aero-sidebar-window 的 width 规则，
 * 不能用 !important 否则浮动时会被撑成整页宽）。
 */
export function Sidebar() {
  return (
    <DraggableWindow
      title="Tags"
      className="aero-sidebar-window"
      outerClassName="window glass active fuwari-onload-animation"
    >
      <Suspense fallback={<TagsSkeleton />}>
        <Tags />
      </Suspense>
    </DraggableWindow>
  );
}
