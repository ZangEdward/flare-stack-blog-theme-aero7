import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useViewCounts } from "@/features/pageview/queries";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import type { HomePageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";
import { DraggableWindow } from "../../components/draggable-window";
import { PostCard } from "../../components/post-card";

interface MergedPost {
  post: PostItem;
  pinned: boolean;
  popular: boolean;
}

function postWindowPosition(i: number) {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return {
    x: 352 + col * 320,
    y: 16 + row * 256,
    w: 480,
    h: 260,
  };
}

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

    // 2. Popular next (excluding already added)
    for (const post of popularPosts ?? []) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      result.push({ post, pinned: false, popular: true });
    }

    // 3. Recent fills the rest
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
    <div className="contents">
      {mergedPosts.map(({ post, pinned, popular }, i) => (
        <DraggableWindow
          key={post.slug}
          initial={postWindowPosition(i)}
          title={post.title}
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
      <Link
        to="/posts"
        className="fuwari-btn-regular mx-6 md:mx-auto rounded-lg h-10 px-6 flex items-center justify-center"
      >
        {m.home_view_all_posts()}
      </Link>
    </div>
  );
}
