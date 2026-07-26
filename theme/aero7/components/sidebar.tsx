import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { DraggableWindow } from "./draggable-window";
import { Tags, TagsSkeleton } from "./tags";

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("contents", className)}>
      <DraggableWindow
        initial={{ x: 32, y: 16, w: 288, h: 240 }}
        title={m.tags_title()}
      >
        <Suspense fallback={<TagsSkeleton />}>
          <Tags />
        </Suspense>
      </DraggableWindow>
    </div>
  );
}
