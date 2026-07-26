import { Keyboard, Search as SearchIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SearchPageProps } from "@/features/theme/contract/pages";
import { m } from "@/paraglide/messages";

/**
 * 搜索页：使用 7.css 原生 `.searchbox` 结构
 *   <div class="searchbox">
 *     <input type="search" placeholder="Search" />
 *     <button aria-label="search"></button>
 *   </div>
 * 输入与按钮的相对定位、放大镜图标、聚焦态都由 7.css 自带样式渲染。
 * 返回按钮用窗口的 Close 控件（onClick = onBack），不再自造一个单独按钮。
 */
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
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-12">
      {/* Header Area — 7.css 原生 .window.glass + 原生 .searchbox */}
      <div
        className="window glass active fuwari-onload-animation"
        style={{ animationDelay: "100ms" }}
      >
        <div className="title-bar">
          <div className="title-bar-text">{m.search_placeholder()}</div>
          <div className="title-bar-controls">
            <button type="button" aria-label="Close" onClick={onBack} />
          </div>
        </div>
        <div className="window-body has-space">
          {/* 7.css 原生 searchbox 容器：相对定位，input 占满宽度，
              搜索 button 绝对定位在右侧，蓝色放大镜图标。 */}
          <div className="searchbox">
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={m.search_placeholder()}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              aria-label="search"
              onClick={() => inputRef.current?.focus()}
            />
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
              <SearchIcon size={24} strokeWidth={1.5} />
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
            <h2
              className="text-xl font-bold fuwari-text-90 group-hover:text-(--fuwari-primary) transition-colors"
              style={{
                viewTransitionName: `post-title-${result.post.slug}`,
              }}
              dangerouslySetInnerHTML={{
                __html: result.matches.title || result.post.title,
              }}
            />
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
