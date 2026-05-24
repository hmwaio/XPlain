import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../../api/user.api";
import PostCard from "../../components/posts/PostCard";
import Spinner from "../../components/ui/Spinner";

export default function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getUserProfile(Number(id));
      setProfile(response.data.profile);
      setPosts(response.data.posts);
    } catch {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (profile.isFollowing) {
        await userAPI.unfollowUser(Number(id));
      } else {
        await userAPI.followUser(Number(id));
      }
      fetchProfile();
    } catch {
      console.error("Follow failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-100">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* COVER */}
        <div className="relative h-40 sm:h-56 lg:h-64 rounded-2xl overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600/60 to-purple-600/60" />

          {profile?.cover_picture && (
            <img
              src={profile.cover_picture}
              className="w-full h-full object-cover opacity-80"
            />
          )}
        </div>

        {/* PROFILE CARD */}
        <div className="relative -mt-14 sm:-mt-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            {/* avatar */}
            {profile?.profile_picture ? (
              <img
                src={profile.profile_picture}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl sm:text-6xl font-bold">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* info */}
            <div className="flex-1">
              <h1 className="text-xl sm:text-3xl font-bold">{profile?.name}</h1>
              <p className="text-sm text-gray-400">
                Joined {new Date(profile?.joined).toDateString()}
              </p>
            </div>

            <button
              onClick={handleFollow}
              className={`px-5 py-2 rounded-xl text-sm transition ${
                profile?.isFollowing
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {profile?.isFollowing ? "Following" : "Follow"}
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-center">
            <div>
              <p className="text-lg sm:text-2xl font-bold">
                {profile?.stats.posts}
              </p>
              <p className="text-xs sm:text-sm text-gray-400">Posts</p>
            </div>

            <div>
              <p className="text-lg sm:text-2xl font-bold">
                {profile?.stats.followers}
              </p>
              <p className="text-xs sm:text-sm text-gray-400">Followers</p>
            </div>

            <div>
              <p className="text-lg sm:text-2xl font-bold">
                {profile?.stats.following}
              </p>
              <p className="text-xs sm:text-sm text-gray-400">Following</p>
            </div>
          </div>
        </div>

        {/* POSTS */}
        <div className="mt-10">
          <h2 className="text-lg sm:text-2xl font-semibold mb-6">Posts</h2>

          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.post_id}
                className="bg-white/5 border border-white/10 rounded-2xl"
              >
                <PostCard post={post} isProfileView={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
