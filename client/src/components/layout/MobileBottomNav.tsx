import {
  BookMarked,
  CircleUserRound,
  Home,
  Menu,
  PlusSquare,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileBottomNav({ onMenuClick }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-border flex justify-around items-center py-3 lg:hidden z-50">

      <button onClick={onMenuClick}>
        <Menu className="w-6 h-6 text-muted" />
      </button>

      <Link to="/"><Home className="w-6 h-6 text-muted" /></Link>
      <Link to="/saved-posts"><BookMarked className="w-6 h-6 text-muted" /></Link>
      <Link to="/search"><Search className="w-6 h-6 text-muted" /></Link>
      <Link to="/new-post"><PlusSquare className="w-6 h-6 text-muted" /></Link>
      <Link to="/me"><CircleUserRound className="w-6 h-6 text-muted" /></Link>

    </div>
  );
}