import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import api from "@/api/axios";
import { toast } from "react-hot-toast";
import AuthLayout from "@/components/layouts/AuthLayout";
import { IconArrowRight, IconMailCheck } from "@tabler/icons-react";

// --- Helper Component (Same as Login) ---
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const EmailVerify = () => {
  const navigate = useNavigate();
  const { getUserData, userData, isLoggedIn } = useAppContext();

  // Array to store the 6 digits
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  // Refs to manage focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Handle Typing
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; // Only allow numbers

    const newOtp = [...otp];
    // Take only the last character entered (prevents double digits in one box)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto Focus Next
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 2. Handle Backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move back if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 3. Handle Paste (Ctrl + V)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");

    // Check if pasted content is number
    if (!/^\d+$/.test(pasteData)) return;

    const pasteArray = pasteData.split("").slice(0, 6);
    const newOtp = [...otp];

    pasteArray.forEach((char, i) => {
      newOtp[i] = char;
    });

    setOtp(newOtp);

    // Focus the last filled input or the first empty one
    const lastFilledIndex = pasteArray.length - 1;
    if (lastFilledIndex < 5 && inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  // 4. Submit Handler
  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    try {
      const { data } = await api.post("/auth/verify-account", { otp: otpCode });

      if (data.success) {
        toast.success("Email verified successfully!");
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  // Ensure user is logged in before verifying
  useEffect(() => {
    if (isLoggedIn && userData && userData.isAccountVerified) {
      navigate("/"); // If already verified, kick them out
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <AuthLayout>
      <div className="w-full mx-auto rounded-xl md:rounded-2xl p-6 md:p-8 shadow-[0_0_40px_-10px_rgba(255,255,255,0.03)] bg-neutral-900/40 backdrop-blur-md border border-white/10 relative overflow-hidden">
        {/* Subtle inner shine */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {/* Icon & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 mb-4 border border-cyan-500/20">
            <IconMailCheck size={24} />
          </div>
          <h2 className="font-bold text-2xl text-white tracking-tight">
            Verify your email
          </h2>
          <p className="text-neutral-400 text-sm mt-2 max-w-sm mx-auto">
            We've sent a 6-digit code to your email address.
            <br />
            Enter it below to confirm your identity.
          </p>
        </div>

        <form onSubmit={onSubmitHandler}>
          {/* OTP Input Grid */}
          <div
            className="flex justify-between gap-2 mb-8"
            onPaste={handlePaste}
          >
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  required
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800/50 border border-neutral-700 text-white text-center text-xl sm:text-2xl rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder:text-neutral-600"
                  ref={(e) => {
                    inputRefs.current[index] = e;
                  }}
                  value={otp[index]} // Controlled Input
                  onInput={(e) =>
                    handleInput(e as React.ChangeEvent<HTMLInputElement>, index)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>

          {/* Verify Button */}
          <button
            className="relative group/btn flex items-center justify-center gap-2 w-full bg-white text-black rounded-xl h-11 font-bold text-sm shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:bg-neutral-200 transition-all duration-300"
            type="submit"
          >
            Verify Email
            <IconArrowRight className="w-4 h-4 text-black group-hover/btn:translate-x-1 transition-transform duration-300" />
            <BottomGradient />
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <p
            onClick={() => navigate("/")}
            className="text-sm text-neutral-500 hover:text-white cursor-pointer transition-colors"
          >
            Skip for now
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerify;
