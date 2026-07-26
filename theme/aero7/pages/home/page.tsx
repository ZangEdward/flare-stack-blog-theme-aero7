import { Link, useRouteContext } from "@tanstack/react-router";
import { Terminal } from "lucide-react";
import { useMemo } from "react";
import {
  resolveSocialHref,
  SOCIAL_PLATFORMS,
} from "@/features/config/utils/social-platforms";
import { useViewCounts } from "@/features/pageview/queries";
import type { PostItem } from "@/features/posts/schema/posts.schema";
import type { HomePageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";
import { PostCard } from "../../components/post-card";

interface MergedPost {
  post: PostItem;
  pinned: boolean;
  popular: boolean;
}

export function HomePage({ posts, pinnedPosts, popularPosts }: HomePageProps) {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const delayOffset = 50;

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
    <div className="flex flex-col gap-12 md:gap-16">
      {/* Intro Section — 与原版 flare-stack-blog 一致的居中首屏 */}
      <section className="fuwari-card-base p-6 md:p-8 fuwari-onload-animation">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold fuwari-text-90 flex items-center gap-3">
            {m.home_greeting()}
          </h1>
          <div className="fuwari-text-50 text-base md:text-lg leading-relaxed">
            {m.home_intro_prefix()}{" "}
            <span className="fuwari-text-90 font-semibold">
              {siteConfig.author}
            </span>
            {m.home_intro_separator()}
            {siteConfig.description}
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-3 mt-5">
          {siteConfig.social
            .filter((link) => link.url)
            .map((link, i) => {
              const preset =
                link.platform !== "custom"
                  ? SOCIAL_PLATFORMS[link.platform]
                  : null;
              const Icon = preset?.icon;
              const label = preset?.label ?? link.label ?? "";
              const href = resolveSocialHref(link.platform, link.url);

              return (
                <a
                  key={`${link.platform}-${i}`}
                  href={href}
                  target={link.platform === "email" ? undefined : "_blank"}
                  rel={
                    link.platform === "email" ? undefined : "me noreferrer"
                  }
                  aria-label={label}
                  className="fuwari-btn-regular rounded-lg h-10 w-10 active:scale-90 hover:text-(--fuwari-primary) transition-colors"
                >
                  {Icon ? (
                    <Icon size={20} strokeWidth={1.5} />
                  ) : (
                    <img src={link.icon} alt={label} className="w-5 h-5" />
                  )}
                </a>
              );
            })}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-bold fuwari-text-90 flex items-center gap-2 px-1">
          {m.home_latest_posts()}
        </h2>

        <div className="flex flex-col gap-6">
          {mergedPosts.map(({ post, pinned, popular }, i) => (
            <div
              key={post.slug}
              className="fuwari-onload-animation"
              style={{
                animationDelay: `calc(var(--fuwari-content-delay) + ${i * delayOffset}ms)`,
              }}
            >
              <PostCard
                post={post}
                pinned={pinned}
                popular={!pinned && popular}
                views={viewCounts?.[post.slug]}
                isLoadingViews={isPendingViewCounts}
              />
            </div>
          ))}
        </div>

        <div
          className="fuwari-onload-animation"
          style={{
            animationDelay: `calc(var(--fuwari-content-delay) + ${mergedPosts.length * delayOffset}ms)`,
          }}
        >
          <Link
            to="/posts"
            className="fuwari-btn-regular mx-auto rounded-lg h-10 px-6 flex items-center justify-center gap-2 w-fit"
          >
            <Terminal size={16} />
            cd /posts
          </Link>
        </div>
      </section>
    </div>
  );
}
