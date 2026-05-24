import { Facebook, Github } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth.api";
import { LabeledInput } from "../../components/ui/Input";
import { useAuth } from "../../context/auth";

type Step = "email" | "otp" | "registration";

function Register() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.sendOtp({ email });
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.verifyOtp({ email, otp });
      setTempToken(res.data.data.tempToken);
      setStep("registration");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.completeRegistration({ name, password }, tempToken);

      const me = await authAPI.getMe();
      setUser(me.data);

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-primary flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10">
        {/* LEFT */}
        <section className="hidden lg:flex flex-col justify-center relative">
          <div className="absolute w-80 h-80 bg-accent/10 blur-[120px] rounded-full" />

          <h1 className="text-6xl font-extrabold tracking-tight">
            Join <span className="text-accent">XPlain</span>
          </h1>

          <p className="mt-6 text-secondary text-lg leading-7 max-w-md">
            Create an account to share ideas, write posts, and explore
            meaningful conversations.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="card card-hover p-4">
              <p className="text-secondary text-sm">Write & publish posts</p>
            </div>
            <div className="card card-hover p-4">
              <p className="text-secondary text-sm">Connect with thinkers</p>
            </div>
            <div className="card card-hover p-4">
              <p className="text-secondary text-sm">Build your profile</p>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="w-full">
          <div className="glass border border-border rounded-[32px] p-8 sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold">Create Account</h2>
              <p className="mt-2 text-secondary">
                Step {step === "email" ? 1 : step === "otp" ? 2 : 3} of 3
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* STEP 1 */}
            {step === "email" && (
              <form onSubmit={handleSendOTP} className="space-y-5">
                <LabeledInput
                  type="email"
                  label="Email"
                  value={email}
                  placeholder="Enter email"
                  onchange={(e) => setEmail(e.target.value)}
                />

                <button
                  disabled={loading}
                  className="primary-btn primary-btn-hover w-full h-12 rounded-2xl"
                >
                  {loading ? "Sending..." : "Continue"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full h-11 rounded-2xl border border-border bg-surface text-secondary hover:bg-surface-hover transition"
                >
                  Already have an account
                </button>

                <div className="grid gap-3 pt-2">
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

                  <button
                    type="button"
                    className="w-full h-12 rounded-2xl bg-surface border border-border flex items-center justify-center gap-3 hover:bg-surface-hover transition"
                  >
                    <Facebook size={18} />
                    Continue with Facebook
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2 */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <LabeledInput
                  label={`OTP sent to ${email}`}
                  value={otp}
                  placeholder="Enter OTP"
                  onchange={(e) => setOtp(e.target.value)}
                  maxlength={6}
                />

                <button
                  disabled={loading}
                  className="primary-btn primary-btn-hover w-full h-12 rounded-2xl"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-sm text-muted hover:text-secondary"
                >
                  Change email
                </button>
              </form>
            )}

            {/* STEP 3 */}
            {step === "registration" && (
              <form onSubmit={handleCompleteSignup} className="space-y-5">
                <LabeledInput
                  label="Name"
                  value={name}
                  placeholder="Enter name"
                  onchange={(e) => setName(e.target.value)}
                />

                <LabeledInput
                  type="password"
                  label="Password"
                  value={password}
                  placeholder="Enter password"
                  onchange={(e) => setPassword(e.target.value)}
                />

                <button
                  disabled={loading}
                  className="primary-btn primary-btn-hover w-full h-12 rounded-2xl"
                >
                  {loading ? "Creating..." : "Create account"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full h-11 rounded-2xl border border-border bg-surface text-secondary hover:bg-surface-hover transition"
                >
                  I already have an account
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;
