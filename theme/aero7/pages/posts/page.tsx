import { useRouteContext } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { PostsPageProps } from "@/features/theme/contract/pages";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { PostCard } from "../../components/post-card";

export const INITIAL_TAG_COUNT = 8;

export function PostsPage({
  posts,
  tags,
  selectedTag,
  onTagClick,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: PostsPageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreTags = tags.length > INITIAL_TAG_COUNT;
  const visibleTags = isExpanded ? tags : tags.slice(0, INITIAL_TAG_COUNT);

  // Infinite scroll observer
  const observerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "0px" },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="w-full max-w-(--fuwari-page-width) mx-auto pb-20 px-6 md:px-0">
      {/* Header Section — 与原版 flare-stack-blog 一致的居中首屏 */}
      <header className="fuwari-card-base p-6 md:p-8 fuwari-onload-animation mb-8 md:mb-12 space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold fuwari-text-90">
          {m.nav_posts()}
        </h1>
        <p className="fuwari-text-50 text-base md:text-lg leading-relaxed">
          {siteConfig.description}
        </p>
      </header>

      {/* Tag Filters — 极简文字 chips（aero7 配色）*/}
      {tags.length > 0 && (
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase fuwari-text-50/70">
            <span>{m.posts_tags_filter()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              onClick={() => onTagClick(undefined)}
              className={cn(
                "text-sm font-mono transition-all duration-300 relative group",
                !selectedTag
                  ? "fuwari-text-90 font-semibold"
                  : "fuwari-text-50 hover:fuwari-text-90",
              )}
            >
              {m.posts_all()}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-px bg-(--fuwari-primary) transition-all duration-300",
                  !selectedTag ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </button>

            {visibleTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagClick(tag.name)}
                className={cn(
                  "text-sm font-mono transition-all duration-300 relative group flex items-baseline gap-1.5",
                  selectedTag === tag.name
                    ? "fuwari-text-90 font-semibold"
                    : "fuwari-text-50 hover:fuwari-text-90",
                )}
              >
                <span>{tag.name}</span>
                <span className="text-[10px] opacity-40 group-hover:opacity-70 transition-opacity">
                  {tag.postCount}
                </span>
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-(--fuwari-primary) transition-all duration-300",
                    selectedTag === tag.name
                      ? "w-full"
                      : "w-0 group-hover:w-full",
                  )}
                />
              </button>
            ))}

            {hasMoreTags && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-mono fuwari-text-50/60 hover:fuwari-text-90 transition-colors ml-2"
              >
                {isExpanded
                  ? `[- ${m.tags_collapse()}]`
                  : `[+ ${m.tags_expand()} ${tags.length - INITIAL_TAG_COUNT}]`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Posts List — 与原版一致的居中单列，套用 aero7 玻璃卡片 */}
      <div className="flex flex-col gap-6">
        {posts.length === 0 ? (
          <div className="fuwari-card-base w-full px-8 py-12 text-center text-sm fuwari-text-50">
            {m.posts_no_posts()}
          </div>
        ) : (
          posts.map((post, i) => (
            <div
              key={post.id}
              className="fuwari-onload-animation"
              style={{
                animationDelay: `calc(var(--fuwari-content-delay) + ${i * 50}ms)`,
              }}
            >
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>

      {/* Load More Area */}
      <div
        ref={observerRef}
        className="py-16 flex flex-col items-center justify-center gap-6"
      >
        {isFetchingNextPage ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500 fill-mode-both">
            <div className="w-1.5 h-1.5 rounded-full bg-(--fuwari-primary) animate-ping" />
            <span className="text-[10px] font-mono tracking-[0.3em] fuwari-text-50 uppercase">
              {m.posts_loading()}
            </span>
          </div>
        ) : hasNextPage ? (
          <div className="h-px w-24 bg-(--fuwari-meta-divider)" />
        ) : posts.length > 0 ? (
          <div className="flex items-center gap-4 fuwari-text-50/30">
            <span className="h-px w-12 bg-current" />
            <span className="text-lg font-serif italic">{m.posts_end()}</span>
            <span className="h-px w-12 bg-current" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
