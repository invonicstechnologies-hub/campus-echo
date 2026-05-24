import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search as SearchIcon, X, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PostCard } from "@/components/feed/PostCard";
import { posts, communities } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Unsaid" },
      { name: "description", content: "Search anonymous posts, communities and topics on Unsaid." },
    ],
  }),
  component: SearchPage,
});

const trendingQueries = ["finals week", "roommate", "library 3am", "dining hall", "crush", "professor"];

function SearchPage() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return [];
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.body.toLowerCase().includes(query) ||
        p.community.toLowerCase().includes(query),
    );
  }, [query]);

  const matchedCommunities = useMemo(() => {
    if (!query) return [];
    return communities.filter(
      (c) => c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query),
    );
  }, [query]);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 pt-3 pb-24">
        <div className="flex items-center gap-2">
          <Link
            to="/feed"
            aria-label="Back"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground tap"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Link>
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search posts, communities…"
              className="h-10 w-full rounded-full border border-border bg-secondary pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40"
            />
            {q ? (
              <button
                onClick={() => setQ("")}
                aria-label="Clear"
                className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </div>

        {!query ? (
          <section className="mt-8">
            <h2 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" /> Trending searches
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {trendingQueries.map((t) => (
                <button
                  key={t}
                  onClick={() => setQ(t)}
                  className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm text-foreground hover:border-primary/40 tap"
                >
                  {t}
                </button>
              ))}
            </div>

            <h2 className="mt-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Communities
            </h2>
            <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
              {communities.slice(0, 5).map((c) => (
                <li key={c.slug} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.members.toLocaleString()} members
                    </p>
                  </div>
                  <button
                    onClick={() => setQ(c.name)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Explore
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section className="mt-6 space-y-6">
            {matchedCommunities.length > 0 ? (
              <div>
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Communities
                </h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {matchedCommunities.map((c) => (
                    <span
                      key={c.slug}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm text-foreground"
                    >
                      {c.name}
                    </span>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {results.length} {results.length === 1 ? "post" : "posts"}
              </h2>
              {results.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center">
                  <p className="font-serif text-2xl text-foreground">Nothing matches.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different word — or be the first to post about it.
                  </p>
                </div>
              ) : (
                <div className="mt-3 divide-y divide-border">
                  {results.map((p, i) => (
                    <PostCard key={p.id} post={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
