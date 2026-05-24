import {
  CircleUserRound,
  LogOut,
  Moon,
  PenSquare,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../../api/user.api";
import { useAuth } from "../../context/auth";
import { useDarkMode } from "../../hooks/useDarkMode";
import Spinner from "../ui/Spinner";
import Searching from "./Searching";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { dark, setDark } = useDarkMode();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userAPI.getMyProfile();
      setProfile(res.data.profile);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) return <Spinner />;

  return (
    <nav className="bg-bg border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-extrabold">
          <span className="text-accent text-2xl">X</span>Plain
        </h1>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <Searching />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            to="/new-post"
            className="hidden lg:flex items-center gap-2 text-muted hover:text-primary"
          >
            <PenSquare size={18} />
            Write
          </Link>

          {/* Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden"
            >
              {profile?.profile_picture ? (
                <img src={profile.profile_picture} className="w-full h-full" />
              ) : (
                <span className="text-accent font-bold">
                  {profile?.name?.[0]}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
                <div className="p-3 border-b border-border">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-muted">{user?.email}</p>
                </div>

                <DropdownItem
                  icon={<CircleUserRound size={16} />}
                  label="Profile"
                />
                <DropdownItem icon={<Settings size={16} />} label="Settings" />
                <DropdownItem icon={<User size={16} />} label="Account" />

                <button
                  onClick={() => setDark(!dark)}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-hover"
                >
                  {dark ? <Sun size={16} /> : <Moon size={16} />}
                  Theme
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-surface-hover"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function DropdownItem({ icon, label }: any) {
  return (
    <div className="px-4 py-2 flex items-center gap-3 hover:bg-surface-hover cursor-pointer">
      {icon}
      <span>{label}</span>
    </div>
  );
}
