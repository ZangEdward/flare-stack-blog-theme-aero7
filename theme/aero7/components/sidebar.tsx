import { Suspense } from "react";
import { DraggableWindow } from "./draggable-window";
import { Tags, TagsSkeleton } from "./tags";

/**
 * 侧栏组件：桌面左侧显示标签云窗口。
 * Profile（头像/简介/签名）已迁移到 Navbar 顶部作为 Win7 Orb 风格。
 *
 * 不再传 defaultSize.h，让 Tags 内容自然撑开；sidebar 列使用 align-items:
 * start（在 styles/index.css 中已设），避免网格拉伸造成底部留白。
 */
export function Sidebar() {
  return (
    <DraggableWindow
      title="Tags"
      defaultSize={{ w: 260 }}
      className="window glass active aero-sidebar-window"
    >
      <Suspense fallback={<TagsSkeleton />}>
        <Tags />
      </Suspense>
    </DraggableWindow>
  );
}
