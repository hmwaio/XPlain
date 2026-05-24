import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/auth";

import RootPage from "../pages/RootPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AppLayout from "../components/layout/Applayout";
import SearchPage from "../components/layout/SearchPage";
import CreatePost from "../components/posts/CreatePost";
import Spinner from "../components/ui/Spinner";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import EditPost from "../pages/posts/EditPost";
import AccountSettings from "../pages/profile/Account";
import MyProfile from "../pages/profile/MyProfile";
import UserProfile from "../pages/profile/UserProfile";
import SavedPage from "../pages/profile/SavedPosts";
import ProfileSettings from "../pages/profile/Setting";

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <>{children}</>;
}

function PrivateOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing - always accessible */}
        {/* <Route path="/" element={user ? <Home /> : <RootPage />} /> */}

        {/* Auth pages - only when NOT logged in */}
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnly>
              <Register />
            </PublicOnly>
          }
        />

        {/* Protected with AppLayout */}
        {user ? (
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/me" element={<MyProfile />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/new-post" element={<CreatePost />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/saved-posts" element={<SavedPage />} />
            <Route path="/settings" element={<ProfileSettings />} />
            <Route path="/account" element={<AccountSettings />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
          </Route>
        ) : (
          <Route path="/" element={<RootPage />} />
        )}

        {/* Dynamic */}
        {/* <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/users/:id" element={<Profile />} /> */}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
