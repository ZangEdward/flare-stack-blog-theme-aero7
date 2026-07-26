import { ClientOnly, Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Flame,
  Pin,
  Tag,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import { formatDate } from "@/lib/utils";
import { m } from "@/paraglide/messages";

interface PostCardProps {
  post: PostItem;
  pinned?: boolean;
  popular?: boolean;
  views?: number;
  isLoadingViews?: boolean;
}

/**
 * 文章卡片：自身渲染完整的 7.css `.window.glass` 玻璃窗
 * （标题栏 + window-body + resize 手柄由 DraggableWindow 注入）。
 * 这里只关心 7.css 标题栏与正文区内容。
 */
export function PostCard({
  post,
  pinned,
  popular,
  views,
  isLoadingViews,
}: PostCardProps) {
  const tagNames = (post.tags ?? []).map((t) => t.name);

  return (
    <div
      className={`window glass active flex flex-col h-full w-full relative ${
        pinned ? "ring-2 ring-(--fuwari-primary)/30" : ""
      }`}
  >
      {/* 7.css 原生 Win7 标题栏：标题可点击进入文章，徽标 + 控制按钮 */}
      <div className="title-bar">
        {pinned && (
          <Pin
            size={13}
            className="aero-tb-badge shrink-0"
            aria-label={m.home_pinned_posts()}
          />
        )}
        {!pinned && popular && (
          <Flame
            size={13}
            className="aero-tb-badge aero-tb-badge-hot shrink-0"
            aria-label={m.home_popular_posts()}
          />
        )}
        <span
          className="title-bar-text flex-1 min-w-0"
          title={post.title}
        >
          {post.title}
        </span>
          <div className="title-bar-controls">
            <button type="button" aria-label="Close" tabIndex={-1} />
          </div>
      </div>

      {/* 正文区 */}
      <div className="window-body has-space flex-1 overflow-hidden">
        <div className="flex flex-col gap-3 h-full">
          {/* 简介：复用 7.css 搜索框（[type=search]）内嵌字段外观 */}
          <div className="aero-field aero-field-summary fuwari-text-75 line-clamp-4 md:line-clamp-3 wrap-break-word">
            {post.summary ?? ""}
          </div>

          {/* 标签框：同样使用搜索框风格容器，标签以 Win7 小按钮式 chip 呈现 */}
          {tagNames.length > 0 && (
            <div className="aero-field aero-field-tags">
              {tagNames.map((name) => (
                <Link
                  key={name}
                  to="/posts"
                  search={{ tagName: name }}
                  className="aero-tag-chip"
                >
                  <Tag size={11} strokeWidth={1.5} />
                  {name}
                </Link>
              ))}
            </div>
          )}

          {/* 底部：元信息 + 阅读详情 */}
          <div className="flex items-end justify-between gap-4 mt-auto">
            <div className="text-xs fuwari-text-50 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} strokeWidth={1.5} />
                <time dateTime={post.publishedAt?.toISOString()}>
                  <ClientOnly fallback="-">
                    {formatDate(post.publishedAt)}
                  </ClientOnly>
                </time>
              </span>

              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {m.read_time({ count: post.readTimeInMinutes })}
              </span>

              {isLoadingViews ? (
                <span className="inline-flex items-center gap-1">
                  <Eye size={12} />
                  <Skeleton className="h-3 w-6 rounded bg-black/10 dark:bg-white/10" />
                </span>
              ) : (
                views !== undefined && (
                  <span className="inline-flex items-center gap-1">
                    <Eye size={12} />
                    {views.toLocaleString()}
                  </span>
                )
              )}
            </div>

            <Link
              to="/post/$slug"
              params={{ slug: post.slug }}
              className="fuwari-btn-primary px-4 py-2 text-sm rounded-lg active:scale-95 shrink-0 inline-flex items-center"
            >
              {m.post_read_more()}
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
