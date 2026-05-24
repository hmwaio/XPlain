import { Camera, X } from "lucide-react";
import { useEffect, useState } from "react";
import { uploadAPI } from "../../api/upload.api";
import { userAPI } from "../../api/user.api";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../context/auth";

export default function ProfileSettings() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getMyProfile();
      const data = response.data.profile;
      setProfile(data);
      setName(data.name);
      setBio(data.bio || "");
    } catch (error) {
      console.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  // Upload Profile Picture
  const handleProfilePicUpload = async (file: File) => {
    setUploadingProfile(true);
    try {
      const response = await uploadAPI.uploadProfilePicture(file);
      const imageUrl = response.data.url;
      const imageId = response.data.public_id;

      await userAPI.updateProfile({
        profile_picture: imageUrl,
        profile_picture_id: imageId,
      });

      setProfile((prev: any) => ({
        ...prev,
        profile_picture: imageUrl,
      }));

      fetchProfile();
      alert("Profile picture updated!");
    } catch (error) {
      console.log(error);
      // console.error("Upload failed");
      alert("Failed to upload");
    } finally {
      setUploadingProfile(false);
    }
  };

  // Upload Cover Picture
  const handleCoverPicUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const response = await uploadAPI.uploadCoverPicture(file);
      const imageUrl = response.data.url;
      const imageId = response.data.public_id;

      await userAPI.updateProfile({
        cover_picture: imageUrl,
        cover_picture_id: imageId,
      });

      setProfile((prev: any) => ({
        ...prev,
        cover_picture: imageUrl,
      }));

      fetchProfile();
      alert("Cover picture updated!");
    } catch (error) {
      console.log(error);
      // console.error("Upload failed");
      alert("Failed to upload");
    } finally {
      setUploadingCover(false);
    }
  };

  // Delete Profile Picture
  const handleDeleteProfilePic = async () => {
    if (!window.confirm("Delete profile picture?")) return;

    try {
      await userAPI.deleteProfilePicture("profile");
      fetchProfile();
      alert("Profile picture deleted");
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // Delete Cover Picture
  const handleDeleteCoverPic = async () => {
    if (!window.confirm("Delete cover picture?")) return;

    try {
      await userAPI.deleteProfilePicture("cover");
      fetchProfile();
      alert("Cover picture deleted");
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // Update Name & Bio
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await userAPI.updateProfile({ name, bio });
      alert("Profile updated!");
      fetchProfile();
    } catch (error) {
      alert("Failed to update");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your profile, avatar and personal information
          </p>
        </div>

        {/* COVER */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
          <div className="relative h-52 bg-linear-to-r from-blue-500 to-purple-600">
            {profile?.cover_picture && (
              <img
                src={profile.cover_picture}
                className="w-full h-full object-cover"
                alt="Cover"
              />
            )}

            {/* Overlay actions */}
            <div className="absolute bottom-4 right-4 flex gap-3">
              {profile?.cover_picture && (
                <button
                  onClick={handleDeleteCoverPic}
                  className="p-2 rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <label className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-md cursor-pointer hover:scale-105 transition">
                <Camera className="w-5 h-5 text-gray-700 dark:text-white" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files && handleCoverPicUpload(e.target.files[0])
                  }
                />
              </label>
            </div>

            {/* Upload loading */}
            {uploadingCover && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* PROFILE PIC CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Profile Picture
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  alt="Profile"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <label className="absolute bottom-1 right-1 p-2 bg-white dark:bg-gray-900 rounded-full shadow cursor-pointer hover:scale-105 transition">
                <Camera className="w-4 h-4 text-gray-700 dark:text-white" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files && handleProfilePicUpload(e.target.files[0])
                  }
                />
              </label>

              {uploadingProfile && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left">
              <p className="text-gray-600 dark:text-gray-400">
                Recommended: square image (400×400 or more)
              </p>

              {profile?.profile_picture && (
                <button
                  onClick={handleDeleteProfilePic}
                  className="mt-2 text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  Remove picture
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Basic Information
          </h2>

          <form onSubmit={handleUpdateInfo} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your name"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                maxLength={160}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Tell us about yourself..."
              />

              <p className="text-sm text-gray-500 mt-1">{bio.length}/160</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
