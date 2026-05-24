import {
  BookMarked,
  CircleUserRound,
  Home,
  Settings,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LeftSidebar() {
  return (
    <nav className="space-y-1 p-2">
      <SidebarItem icon={<Home size={18} />} label="Home" to="/" />
      <SidebarItem
        icon={<BookMarked size={18} />}
        label="Library"
        to="/saved-posts"
      />
      <SidebarItem
        icon={<CircleUserRound size={18} />}
        label="Profile"
        to="/me"
      />
      <SidebarItem
        icon={<Settings size={18} />}
        label="Settings"
        to="/settings"
      />
      <SidebarItem icon={<User size={18} />} label="Account" to="/account" />
    </nav>
  );
}

function SidebarItem({ icon, label, to }: any) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted hover:text-primary hover:bg-surface transition"
    >
      {icon}
      {label}
    </Link>
  );
}
