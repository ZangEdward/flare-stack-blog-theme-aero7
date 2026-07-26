import { useMemo } from "react";
import { useViewCounts } from "@/features/pageview/queries";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import type { HomePageProps } from "@/features/theme/contract/pages";
import { DraggableWindow } from "../../components/draggable-window";
import { PostCard } from "../../components/post-card";

interface MergedPost {
  post: PostItem;
  pinned: boolean;
  popular: boolean;
}

/**
 * 主页文章卡片：每个卡片由 DraggableWindow 包裹，window 内部是 PostCard。
 * - 默认状态：完全 participate grid 流式布局（auto-fill 网格列，自适应屏宽），
 *   不重叠、不绝对定位；
 * - 用户按住 7.css 原生 `.title-bar` 后变为 absolute 浮动；
 * - 拖动位置不持久化（刷新回到 grid 流）；resize 改变窗口大小。
 *
 * 重要：此组件 wrap 在 `.aero-desktop-main` 内（grid 流），不要放最外层 div，
 * 否则会破坏桌面网格布局（DraggableWindow 内部会自己用 absolute）。
 */
export function HomePage({ posts, pinnedPosts, popularPosts }: HomePageProps) {
  const mergedPosts = useMemo(() => {
    const seen = new Set<string>();
    const result: MergedPost[] = [];
    const popularSlugs = new Set((popularPosts ?? []).map((p) => p.slug));

    // 1. Pinned first
    for (const post of pinnedPosts ?? []) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      result.push({ post, pinned: true, popular: popularSlugs.has(post.slug) });
    }

    // 2. Popular
    for (const post of popularPosts ?? []) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      result.push({ post, pinned: false, popular: true });
    }

    // 3. Recent
    for (const post of posts) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      result.push({ post, pinned: false, popular: false });
    }

    return result;
  }, [posts, pinnedPosts, popularPosts]);

  const allSlugs = useMemo(
    () => mergedPosts.map((m) => m.post.slug),
    [mergedPosts],
  );
  const { data: viewCounts, isPending: isPendingViewCounts } =
    useViewCounts(allSlugs);

  return (
    <>
      {mergedPosts.map(({ post, pinned, popular }, i) => (
        <DraggableWindow
          key={post.slug}
          title={post.title}
          className="aero-grid-item fuwari-onload-animation window glass active flex flex-col"
          style={{
            animationDelay: `calc(var(--fuwari-content-delay) + ${i * 60}ms)`,
          }}
        >
          <PostCard
            post={post}
            pinned={pinned}
            popular={!pinned && popular}
            views={viewCounts?.[post.slug]}
            isLoadingViews={isPendingViewCounts}
          />
        </DraggableWindow>
      ))}
    </>
  );
}
