import { useEffect, useState } from "react";
import { postAPI } from "../api/post.api";
import PostCard from "../components/posts/PostCard";
import type { FeedPostCardType } from "../types/post.types";

export default function Home() {
  const [posts, setPosts] = useState<FeedPostCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<{
    id: number;
    created_at: string;
  } | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const params = cursor
        ? { cursorId: cursor.id, cursorDate: cursor.created_at, limit: 20 }
        : { limit: 20 };

      const response = await postAPI.getHomeFeed(params);
      const { items, nextCursor, hasMore: more } = response.data;

      setPosts((prev) => (cursor ? [...prev, ...items] : items));
      setCursor(nextCursor);
      setHasMore(more);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) fetchPosts();
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-100">
      {/* subtle vignette / vintage depth layer */}
      <div className="fixed inset-0 pointer-events-none bg-linear-to-b from-black/40 via-transparent to-black/60" />

      {/* feed wrapper */}
      <div className="relative max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* small identity header (modern feed feel) */}
        <div className="mb-8 px-2">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Home Feed
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Discover ideas, posts, and thoughts
          </p>
        </div>

        {/* posts */}
        <div className="space-y-6 sm:space-y-8">
          {posts.map((post) => (
            <div
              key={post.post_id}
              className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg"
            >
              <PostCard post={post} isProfileView={false} />
            </div>
          ))}
        </div>

        {/* loading */}
        {loading && posts.length === 0 && (
          <div className="flex justify-center py-10 text-gray-400">
            Loading feed...
          </div>
        )}

        {/* load more */}
        {hasMore && posts.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-6 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm hover:bg-white/20 transition disabled:opacity-40"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}

        {/* end */}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-gray-500 mt-10 text-sm">
            You’ve reached the end
          </p>
        )}

        {/* empty */}
        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-500 mt-10">No posts yet</div>
        )}
      </div>
    </div>
  );
}
