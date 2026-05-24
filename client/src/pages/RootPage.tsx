import { Feather, Globe, PenSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

function RootPage() {
  const navigate = useNavigate();

  function handleSignup() {
    navigate("/signup");
  }

  function handleLogin() {
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-bg text-primary flex flex-col">
      {/* Main */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* LEFT SIDE */}
        <section className="relative flex w-full items-center justify-center overflow-hidden border-b border-border px-6 py-16 lg:w-1/2 lg:border-b-0 lg:border-r">
          {/* subtle glow */}
          <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

          <div className="relative z-10 max-w-xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-secondary">
              <Feather size={16} className="text-accent" />
              Share ideas beautifully
            </div>

            <h1 className="text-6xl font-extrabold tracking-tight text-primary sm:text-7xl lg:text-8xl">
              X<span className="text-accent">Plain</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-secondary sm:text-xl">
              A calm space for thoughtful conversations, meaningful discussions,
              and timeless ideas.
            </p>

            {/* Features */}
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="card card-hover p-4">
                <PenSquare className="mb-3 text-accent" size={22} />
                <h3 className="font-semibold text-primary">Write</h3>
                <p className="mt-1 text-sm text-secondary">
                  Share stories & thoughts
                </p>
              </div>

              <div className="card card-hover p-4">
                <Globe className="mb-3 text-accent" size={22} />
                <h3 className="font-semibold text-primary">Connect</h3>
                <p className="mt-1 text-sm text-secondary">
                  Meet curious minds
                </p>
              </div>

              <div className="card card-hover p-4">
                <Feather className="mb-3 text-accent" size={22} />
                <h3 className="font-semibold text-primary">Discover</h3>
                <p className="mt-1 text-sm text-secondary">Learn deeply</p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <main className="flex w-full items-center justify-center px-6 py-14 lg:w-1/2">
          <div className="glass w-full max-w-md rounded-[32px] p-8 shadow-2xl">
            <h2 className="text-4xl font-bold text-primary sm:text-5xl">
              Connect to the world
            </h2>

            <p className="mt-4 text-lg text-secondary">
              Join a community where ideas matter more than noise.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <button
                onClick={handleLogin}
                className="primary-btn primary-btn-hover h-14 cursor-pointer rounded-2xl text-lg"
              >
                Log in
              </button>

              <button
                onClick={handleSignup}
                className="h-14 cursor-pointer rounded-2xl border border-border bg-surface text-lg font-semibold text-primary transition hover:bg-surface-hover"
              >
                Create account
              </button>
            </div>

            <p className="mt-8 text-center text-sm leading-6 text-muted">
              By signing up, you agree to our{" "}
              <span className="cursor-pointer text-accent hover:underline">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="cursor-pointer text-accent hover:underline">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted">
          <span className="cursor-pointer hover:text-secondary">
            Help Center
          </span>
          <span className="cursor-pointer hover:text-secondary">About</span>
          <span className="cursor-pointer hover:text-secondary">Terms</span>
          <span className="cursor-pointer hover:text-secondary">Privacy</span>
          <span className="cursor-pointer hover:text-secondary">Cookies</span>
          <span className="cursor-pointer hover:text-secondary">
            Developers
          </span>

          <span className="text-secondary">© 2026 XPlain</span>
        </div>
      </footer>
    </div>
  );
}

export default RootPage;
