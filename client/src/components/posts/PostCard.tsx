import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../../api/post.api";
import { useAuth } from "../../context/auth";
import type { FeedPostCardType } from "../../types/post.types";
import PostComments from "../comment/AddComment";

type Props = {
  post: FeedPostCardType;
  isProfileView?: boolean;
  onUnSave?: (postId: number) => void;
  isSavedPage?: boolean;
};

export default function PostCard({
  post,
  isProfileView = false,
  onUnSave,
  isSavedPage = false,
}: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwner = user?.user_id === post.author?.user_id;
  console.log(isOwner);

  console.log(post.author.profile.profile_picture);

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post._count.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fullPost, setFullPost] = useState<any>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  // const [loading, setLoading] = useState(true);

  // Truncate content
  const truncateContent = (text: string, wordLimit: number = 20) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ");
  };

  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "") || "";

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Like handler
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));

    try {
      if (newLiked) {
        await postAPI.likePost(post.post_id);
      } else {
        await postAPI.unlikePost(post.post_id);
      }
    } catch (error) {
      setIsLiked(!newLiked);
      setLikesCount((prev) => (newLiked ? prev - 1 : prev + 1));
    }
  };

  // Save handler
  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      // If this card is rendered inside Saved Page
      if (isSavedPage) {
        await postAPI.unsavePost(post.post_id);

        // Tell parent to remove it from list
        onUnSave?.(post.post_id);
        return;
      }

      // Normal feed toggle behavior
      if (isSaved) {
        await postAPI.unsavePost(post.post_id);
      } else {
        await postAPI.savePost(post.post_id);
      }

      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Failed to save");
    }
  };

  // Share handler
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const url = `${window.location.origin}/posts/${post.post_id}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch (error) {
        // User cancelled, ignore
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      } catch {
        // Manual copy
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        alert("Link copied!");
      }
    }
  };

  // Read more - fetch full post
  const handleReadMore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
    setLoadingPost(true);

    try {
      const response = await postAPI.getPost(post.post_id);
      setFullPost(response.data.post);
    } catch (error) {
      console.error("Failed to fetch post");
    } finally {
      setLoadingPost(false);
    }
  };

  // Delete handler
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this post?")) return;

    try {
      await postAPI.deletePost(post.post_id);
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete");
    }
  };

  // Navigate to author
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isOwner) {
      navigate("/me");
    } else {
      navigate(`/users/${post.author.user_id}`);
    }
  };

  const contentPreview = truncateContent(stripHtml(post.content));
  const hasMoreContent = stripHtml(post.content).split(" ").length > 20;

  // if (loading)
  //   return (
  //     <div>
  //       <Spinner />
  //     </div>
  //   );

  return (
    <>
      <article className="card p-5 sm:p-6 hover:scale-[1.01] transition">
        {/* Author Header */}
        <div className="flex items-center justify-between mb-4">
          <div
            onClick={handleAuthorClick}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-surface border border-border">
              {post.author.profile.profile_picture ? (
                <img
                  src={post.author.profile.profile_picture}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent text-black font-bold">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <p className="font-semibold text-primary">{post.author?.name}</p>
              <p className="text-xs text-muted">
                {formatDate(post.created_at)}
              </p>
            </div>
          </div>

          {/* Owner controls - ONLY in profile view */}
          {isOwner && isProfileView && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-2 rounded-full hover:bg-surface text-muted"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowMenu(false)}
                  />

                  <div className="absolute right-0 mt-2 w-48 card p-2 z-20">
                    {post.status === "draft" ? (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await postAPI.publishPost(post.post_id);
                            window.location.reload();
                          } catch {
                            alert("Failed to publish");
                          }
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-green-400 hover:bg-surface"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/post/${post.post_id}/edit`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-surface"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Category + Draft */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.category && (
            <span className="px-3 py-1 text-xs rounded-full bg-surface border border-border text-muted">
              {post.category}
            </span>
          )}

          {post.status === "draft" && isOwner && (
            <span className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/20">
              Draft
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold mb-3">{post.title}</h2>

        {/* Content Preview */}
        <div className="mb-4">
          <p className="text-secondary leading-relaxed">
            {contentPreview}
            {hasMoreContent && <span className="text-muted">...</span>}
          </p>

          {hasMoreContent && (
            <button
              onClick={handleReadMore}
              className="mt-2 text-accent text-sm hover:opacity-80"
            >
              Read more →
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/search?tag=${tag.name}`);
                }}
                className="text-xs px-2 py-1 rounded-full bg-surface border border-border text-muted hover:text-accent cursor-pointer transition"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        {(isOwner || !isProfileView) && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-5">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-muted hover:text-red-400 transition"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? "text-red-400 fill-red-400" : ""
                  }`}
                />
                <span className="text-sm">{likesCount}</span>
              </button>

              <button
                onClick={handleReadMore}
                className="flex items-center gap-2 text-muted hover:text-accent transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post._count.comments}</span>
              </button>

              <button
                onClick={handleShare}
                className="text-muted hover:text-green-400 transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={handleSave}
              className="text-muted hover:text-accent transition"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isSaved ? "text-accent fill-accent" : ""
                }`}
              />
            </button>
          </div>
        )}
      </article>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingPost ? (
              <div className="py-20 text-center text-muted">Loading...</div>
            ) : fullPost ? (
              <>
                {/* Author */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface">
                    {fullPost.author.profile.profile_picture ? (
                      <img
                        src={fullPost.author.profile.profile_picture}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent text-black font-bold">
                        {fullPost.author.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">{fullPost.author.name}</p>
                    <p className="text-xs text-muted">
                      {formatDate(fullPost.created_at)}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-4">{fullPost.title}</h1>

                {/* Image */}
                {fullPost.post_picture && (
                  <img
                    src={fullPost.post_picture}
                    className="w-full rounded-xl mb-6"
                  />
                )}

                {/* Content */}
                <div
                  className="text-secondary leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{
                    __html: fullPost.content,
                  }}
                />

                {/* Tags */}
                {fullPost.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                    {fullPost.tags.map((tag: any, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-surface border border-border"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
                  <div className="flex items-center gap-5">
                    <button
                      onClick={handleLike}
                      className="flex items-center gap-2"
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? "text-red-400 fill-red-400" : ""}`}
                      />
                      <span className="text-sm">{likesCount}</span>
                    </button>

                    <button className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">
                        {fullPost._count.comments}
                      </span>
                    </button>

                    <button onClick={handleShare}>
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  <button onClick={handleSave}>
                    <Bookmark
                      className={`w-5 h-5 ${
                        isSaved ? "text-accent fill-accent" : ""
                      }`}
                    />
                  </button>
                </div>

                <PostComments postId={fullPost.post_id} />
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
