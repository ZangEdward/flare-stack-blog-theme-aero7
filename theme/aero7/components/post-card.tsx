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
      className={`flex flex-col h-full relative ${
        pinned ? "ring-2 ring-(--fuwari-primary)/30" : ""
      }`}
    >
      {/* 7.css 原生 Win7 标题栏：标题在左（可点击），右侧为置顶/热门徽标 + 窗口控制按钮 */}
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
        <Link
          to="/post/$slug"
          params={{ slug: post.slug }}
          className="title-bar-text flex-1 min-w-0"
          title={post.title}
        >
          {post.title}
        </Link>

        <div className="title-bar-controls">
          <button type="button" aria-label="Minimize" />
          <button type="button" aria-label="Maximize" />
          <button type="button" aria-label="Close" />
        </div>
      </div>

      {/* 正文区 */}
      <div className="window-body has-space flex-1 overflow-hidden">
        <div className="flex flex-col gap-4 h-full">
          {/* 摘要 */}
          <div className="fuwari-text-75 text-lg leading-relaxed line-clamp-4 md:line-clamp-3 wrap-break-word">
            {post.summary ?? ""}
          </div>

          {/* 底部：元信息左，阅读详情右 */}
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

              {tagNames.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Tag size={12} strokeWidth={1.5} />
                  {tagNames.join(" / ")}
                </span>
              )}

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
