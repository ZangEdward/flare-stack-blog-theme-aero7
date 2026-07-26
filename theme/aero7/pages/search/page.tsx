import { ArrowLeft, Keyboard, Loader2, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SearchPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

export function SearchPage({
  query,
  results,
  isSearching,
  onQueryChange,
  onSelectPost,
  onBack,
}: SearchPageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Small delay to ensure the page has transitioned before focusing
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-12">
      {/* Header Area — Win7 地址栏风格搜索框 */}
      <div
        className="fuwari-card-base p-3 md:p-4 fuwari-onload-animation"
        style={{ animationDelay: "100ms" }}
      >
        <div className="aero-search-bar">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={m.search_placeholder()}
              className="aero-search-input"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Loader2 className="w-4 h-4 animate-spin text-white/90" />
              </div>
            )}
          </div>

          <div className="aero-search-controls">
            <button
              type="button"
              onClick={onBack}
              className="aero-search-control"
              title={m.search_back()}
            >
              <ArrowLeft size={18} />
            </button>
            <div className="w-px h-5 bg-white/40 dark:bg-white/20" />
            <button
              type="button"
              className="aero-search-control"
              aria-label={m.search_placeholder()}
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex flex-col gap-4">
        {query.trim() === "" && (
          <div
            className="fuwari-card-base p-16 flex flex-col items-center justify-center text-center fuwari-onload-animation"
            style={{ animationDelay: "200ms" }}
          >
            <div className="w-20 h-20 rounded-full bg-(--fuwari-btn-regular-bg) flex items-center justify-center mb-6 text-(--fuwari-btn-content)">
              <Keyboard size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold fuwari-text-75 mb-3">
              {m.search_fuwari_intro_title()}
            </h3>
            <p className="text-sm fuwari-text-50 max-w-sm">
              {m.search_fuwari_intro_desc()}
            </p>
          </div>
        )}

        {query.trim() !== "" && !isSearching && results.length === 0 && (
          <div
            className="fuwari-card-base p-12 flex flex-col items-center justify-center text-center fuwari-onload-animation"
            style={{ animationDelay: "200ms" }}
          >
            <div className="w-16 h-16 rounded-full bg-(--fuwari-btn-regular-bg) flex items-center justify-center mb-4 text-(--fuwari-btn-content)">
              <Search size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold fuwari-text-75 mb-2">
              {m.search_no_results()}
            </h3>
            <p className="text-sm fuwari-text-50">
              {m.search_no_results_with_query({ query })}
            </p>
          </div>
        )}

        {results.map((result, index) => (
          <button
            key={result.post.id}
            onClick={() => onSelectPost(result.post.slug)}
            className="fuwari-card-base p-6 text-left w-full group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col gap-3 fuwari-onload-animation outline-none focus-visible:ring-2 focus-visible:ring-(--fuwari-primary)/50"
            style={{ animationDelay: `${200 + index * 50}ms` }}
          >
            {/* Title with highlighting */}
            <h2
              className="text-xl font-bold fuwari-text-90 group-hover:text-(--fuwari-primary) transition-colors"
              style={{
                viewTransitionName: `post-title-${result.post.slug}`,
              }}
              dangerouslySetInnerHTML={{
                __html: result.matches.title || result.post.title,
              }}
            />

            {/* Summary with highlighting */}
            <p
              className="text-sm fuwari-text-75 line-clamp-3 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  result.matches.summary ||
                  result.post.summary ||
                  result.matches.contentSnippet ||
                  "",
              }}
            />

            {/* Tags */}
            {result.post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 mt-auto">
                {result.post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-(--fuwari-btn-content) bg-(--fuwari-btn-regular-bg) px-2 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Embedded highlighting styles for the dynamically injected HTML */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
              #search-card-${result.post.id} mark {
                background-color: transparent;
                color: var(--fuwari-primary);
                font-weight: 600;
              }
            `,
              }}
            />
            <div id={`search-card-${result.post.id}`} className="hidden" />
          </button>
        ))}

        {/* Global highlighting style for all result cards */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .fuwari-card-base mark {
            background-color: transparent;
            color: var(--fuwari-primary);
            font-weight: 600;
            padding: 0 0.1em;
          }
        `,
          }}
        />
      </div>
    </div>
  );
}
