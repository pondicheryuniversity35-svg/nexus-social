import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function ExplorePage() {
  const { posts } = useApp();
  const [query, setQuery] = useState("");

  const filteredPosts = posts.filter(
    (p) =>
      query === "" ||
      p.caption.toLowerCase().includes(query.toLowerCase()) ||
      p.displayName.toLowerCase().includes(query.toLowerCase()) ||
      p.username.toLowerCase().includes(query.toLowerCase()),
  );

  const trendingTags = [
    { tag: "#nexus", count: "Trending" },
    { tag: "#gaming", count: "Hot" },
    { tag: "#music", count: "Trending" },
    { tag: "#tech", count: "Hot" },
    { tag: "#sports", count: "Trending" },
    { tag: "#photography", count: "Hot" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search posts, people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-card border-border"
          data-ocid="explore.search.input"
        />
      </div>

      {!query && (
        <section>
          <h2 className="text-base font-semibold mb-3">Trending Topics</h2>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map(({ tag, count }) => (
              <button
                type="button"
                key={tag}
                onClick={() => setQuery(tag)}
                className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 hover:bg-accent transition-colors"
                data-ocid="explore.trending.button"
              >
                <span className="nexus-accent text-sm font-medium">{tag}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-base font-semibold mb-3">
          {query ? `Results for "${query}"` : "All Posts"}
        </h2>
        {filteredPosts.length === 0 ? (
          <div
            className="text-center text-muted-foreground py-16"
            data-ocid="explore.empty_state"
          >
            <p className="text-4xl mb-3">🔍</p>
            {query ? (
              <>
                <p className="font-medium">No results found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </>
            ) : (
              <>
                <p className="font-medium">No posts yet</p>
                <p className="text-sm mt-1">
                  Be the first to share something on Nexus!
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-card border border-border rounded-2xl overflow-hidden"
                data-ocid="explore.post.item"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback className="bg-muted">
                      {post.displayName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{post.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      @{post.username}
                    </p>
                  </div>
                </div>
                {post.image && (
                  <img
                    src={post.image}
                    alt=""
                    className="w-full max-h-64 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="px-4 py-3">
                  <p className="text-sm">{post.caption}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {post.likes.length} likes · {post.comments.length} comments
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
