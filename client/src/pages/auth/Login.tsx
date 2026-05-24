import { Github } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroImage1Copy from "../../assets/HeroImage1.png";
import { LabeledInput } from "../../components/ui/Input.js";
import { useAuth } from "../../context/auth.js";
import type { LoginInputType } from "../../types/auth.types.js";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [postInputs, setPostInputs] = useState<LoginInputType>({
    email: "",
    password: "",
  });

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(postInputs);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-primary flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
        {/* LEFT */}
        <section className="hidden lg:flex items-center justify-center relative">
          <div className="absolute w-72 h-72 bg-accent/10 blur-[120px] rounded-full" />
          <img
            src={HeroImage1Copy}
            className="relative w-[80%] rounded-3xl border border-border"
          />
        </section>

        {/* RIGHT */}
        <section className="w-full">
          <div className="glass rounded-[32px] p-8 sm:p-10 border border-border">
            <div className="mb-8 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Welcome to <span className="text-accent">XPlain</span>
              </h2>
              <p className="mt-3 text-secondary">
                Sign in to continue writing & exploring ideas
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={loginHandler} className="space-y-5">
              <LabeledInput
                label="Email"
                value={postInputs.email}
                placeholder="Enter email"
                onchange={(e) =>
                  setPostInputs({ ...postInputs, email: e.target.value })
                }
              />

              <LabeledInput
                label="Password"
                type="password"
                value={postInputs.password}
                placeholder="Enter password"
                onchange={(e) =>
                  setPostInputs({ ...postInputs, password: e.target.value })
                }
              />

              <button
                type="submit"
                disabled={loading}
                className="primary-btn primary-btn-hover w-full h-12 rounded-2xl"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate("/forgot-password")}
                className="w-full h-11 rounded-2xl border border-border bg-surface text-secondary hover:bg-surface-hover transition"
              >
                Forgot password?
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="w-full h-11 rounded-2xl border border-border text-primary hover:bg-surface transition"
              >
                Create account
              </button>

              <button
                type="button"
                className="w-full h-12 rounded-2xl bg-surface border border-border flex items-center justify-center gap-3 hover:bg-surface-hover transition"
              >
                <Github size={18} />
                Continue with GitHub
              </button>

              <button
                type="button"
                className="w-full h-12 rounded-2xl bg-accent text-black font-semibold hover:bg-accent-hover transition"
              >
                Continue with Google
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-muted">
              © 2026 XPlain
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
