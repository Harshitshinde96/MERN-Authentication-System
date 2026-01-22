import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IconArrowRight } from "@tabler/icons-react"; // Install this: npm install @tabler/icons-react
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAppContext } from "@/context/AppContext";
import api from "@/api/axios";
import toast from "react-hot-toast";

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex w-full flex-col space-y-2 ${className || ""}`}>
    {children}
  </div>
);

const Login = () => {
  const { setIsLoggedIn, getUserData } = useAppContext();

  const navigate = useNavigate();
  const [state, setState] = useState<"Sign Up" | "Login">("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (state === "Sign Up") {
        // --- REGISTER FLOW ---
        const { data } = await api.post("/auth/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          await getUserData(); // Fetch user profile immediately
          navigate("/"); // Go to Home Page
          toast.success("Account created successfully!");
        } else {
          toast.error(data.message);
        }
      } else {
        // --- LOGIN FLOW ---
        const { data } = await api.post("/auth/login", { email, password });

        if (data.success) {
          setIsLoggedIn(true);
          await getUserData(); // Fetch user profile immediately
          navigate("/"); // Go to Home Page
          toast.success("Welcome back!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error: any) {
      // Handle generic errors (like server down)
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <AuthLayout>
      <div className="w-full mx-auto rounded-xl md:rounded-2xl p-6 md:p-8 shadow-[0_0_40px_-10px_rgba(255,255,255,0.03)] bg-neutral-900/40 backdrop-blur-md border border-white/10 relative overflow-hidden">
        {/* Subtle inner shine */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />

        <div className="text-center md:text-left mb-6">
          <h2 className="font-bold text-2xl text-white tracking-tight">
            {state === "Sign Up" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            {state === "Sign Up"
              ? "Join us to secure your digital galaxy."
              : "Enter your credentials to access your account."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <LabelInputContainer>
              <Label htmlFor="fullname" className="text-neutral-300">
                Full Name
              </Label>
              <Input
                id="fullname"
                placeholder="Star Lord"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
              />
            </LabelInputContainer>
          )}

          <LabelInputContainer>
            <Label htmlFor="email" className="text-neutral-300">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="user@galaxy.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="password" className="text-neutral-300">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            />
          </LabelInputContainer>

          {state === "Login" && (
            <div className="flex justify-end">
              <p
                onClick={() => navigate("/reset-password")}
                className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors font-medium"
              >
                Forgot Password?
              </p>
            </div>
          )}

          {/* BUTTON COLOR OPTIONS:
            Option 1 (Current): High Contrast White (Best for Dark Mode)
            Option 2 (Vibrant): bg-gradient-to-br from-cyan-500 to-blue-600 text-white
          */}
          <button
            className="mt-6 relative group/btn flex items-center justify-center gap-2 w-full bg-white text-black rounded-xl h-11 font-bold text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:bg-neutral-200 transition-all duration-300 cursor-pointer"
            type="submit"
          >
            {state === "Sign Up" ? "Sign Up" : "Login"}
            <IconArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform duration-300" />
            <BottomGradient />
          </button>

          <div className="bg-linear-to-r from-transparent via-neutral-700 to-transparent my-6 h-px w-full" />

          <div className="text-center text-sm text-neutral-400">
            {state === "Sign Up" ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setState("Login")}
                  className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-bold transition-colors ml-1"
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => setState("Sign Up")}
                  className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-bold transition-colors ml-1"
                >
                  Sign up
                </span>
              </>
            )}
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
