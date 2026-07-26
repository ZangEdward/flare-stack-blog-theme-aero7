import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { tagsQueryOptions } from "@/features/tags/queries";
import { m } from "@/paraglide/messages";

export function TagsSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="title-bar">
        <div className="title-bar-text">{m.tags_title()}</div>
        <div className="title-bar-controls">
          <button type="button" aria-label="Minimize" />
          <button type="button" aria-label="Maximize" />
          <button type="button" aria-label="Close" />
        </div>
      </div>
      <div className="window-body has-space">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 标签云窗口：
 * - 高度由内容自然撑开（不固定 minHeight），避免侧栏网格拉伸造成底部留白；
 * - 不再有丑陋的"灰色展开/收起"按钮——标签少量时窗口自然紧凑，
 *   标签多时（>20）通过页面内滚动条自然处理。
 */
export function Tags() {
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-col">
      <div className="title-bar">
        <div className="title-bar-text">{m.tags_title()}</div>
        <div className="title-bar-controls">
          <button type="button" aria-label="Minimize" />
          <button type="button" aria-label="Maximize" />
          <button type="button" aria-label="Close" />
        </div>
      </div>
      <div className="window-body has-space">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to="/posts"
              search={{ tagName: tag.name }}
              className="fuwari-btn-regular h-8 text-sm px-3 rounded-lg flex items-center gap-2"
            >
              <span>{tag.name}</span>
              <span className="bg-black/5 dark:bg-white/10 rounded-md px-1.5 py-0.5 text-xs opacity-70">
                {tag.postCount}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
