import { useState } from "react";
import CreatePost from "../components/feed/CreatePost";
import PostCard from "../components/feed/PostCard";
import StoryBar from "../components/feed/StoryBar";
import StoryViewer from "../components/feed/StoryViewer";
import { useApp } from "../context/AppContext";
import type { Post, Story } from "../data/mockData";

export default function FeedPage() {
  const { posts, setPosts, currentUser } = useApp();
  const [stories, setStories] = useState<Story[]>([]);
  const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);

  const handleLike = (id: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id !== id) return p;
        const alreadyLiked = p.likes.includes(currentUser.id);
        return {
          ...p,
          likes: alreadyLiked
            ? p.likes.filter((uid) => uid !== currentUser.id)
            : [...p.likes, currentUser.id],
        };
      }),
    );
  };

  const handleComment = (postId: string, text: string) => {
    setPosts(
      posts.map((p) =>
        p.id !== postId
          ? p
          : {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c_${Date.now()}`,
                  userId: currentUser.id,
                  username: currentUser.username,
                  displayName: currentUser.displayName,
                  avatar: currentUser.avatar,
                  text,
                  timestamp: "Just now",
                },
              ],
            },
      ),
    );
  };

  const handleNewPost = (post: Post) => {
    const updated = [post, ...posts];
    setPosts(updated);
  };

  const handleAddStory = (story: Story) => {
    setStories((prev) => [story, ...prev]);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <StoryBar
        stories={stories}
        onStoryClick={(i) => setStoryViewerIndex(i)}
        onAddStory={handleAddStory}
      />

      <CreatePost onPost={handleNewPost} />

      <section className="space-y-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="text-5xl">✨</div>
            <div>
              <p className="text-lg font-semibold">Welcome to Nexus Social!</p>
              <p className="text-muted-foreground text-sm mt-1">
                Be the first to share something with the community.
              </p>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        )}
      </section>

      {storyViewerIndex !== null && (
        <StoryViewer
          stories={stories}
          currentIndex={storyViewerIndex}
          onClose={() => setStoryViewerIndex(null)}
          onPrev={() => setStoryViewerIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() =>
            setStoryViewerIndex((i) =>
              (i ?? 0) < stories.length - 1 ? (i ?? 0) + 1 : null,
            )
          }
        />
      )}
    </div>
  );
}
