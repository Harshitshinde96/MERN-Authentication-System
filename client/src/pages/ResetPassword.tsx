import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "react-hot-toast";
import AuthLayout from "@/components/layouts/AuthLayout";
import {
  IconArrowRight,
  IconMail,
  IconLock,
  IconLoader2,
} from "@tabler/icons-react"; // Added Loader Icon

// --- Shared UI Components ---
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

// ----------------------------------------------------------------------
// STEP 1: Email Input Form (Now accepts 'isLoading')
// ----------------------------------------------------------------------
const EmailStep = ({ email, setEmail, onSubmit, isLoading }: any) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="text-center">
      <h2 className="font-bold text-2xl text-white tracking-tight">
        Reset Password
      </h2>
      <p className="text-neutral-400 text-sm mt-2">
        Enter your registered email address
      </p>
    </div>
    <div className="relative">
      <IconMail className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
      <input
        type="email"
        placeholder="Email id"
        required
        className="w-full bg-neutral-800/50 border border-neutral-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder:text-neutral-600"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading} // Disable input while loading
      />
    </div>
    <button
      disabled={isLoading} // DISABLE BUTTON TO PREVENT DOUBLE CLICK
      className="relative group/btn flex items-center justify-center gap-2 w-full bg-white text-black rounded-xl h-11 font-bold text-sm hover:bg-neutral-200 transition-all duration-300 disabled:opacity-70 cursor-pointer"
    >
      {isLoading ? (
        <IconLoader2 className="animate-spin w-5 h-5" />
      ) : (
        <>
          Submit <IconArrowRight className="w-4 h-4" />
        </>
      )}
      <BottomGradient />
    </button>
  </form>
);

// ----------------------------------------------------------------------
// STEP 2: OTP Input Form (Now accepts 'isLoading')
// ----------------------------------------------------------------------
const OtpStep = ({ otp, setOtp, onSubmit, isLoading }: any) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasteData)) return;
    const pasteArray = pasteData.split("").slice(0, 6);
    const newOtp = [...otp];
    pasteArray.forEach((char, i) => (newOtp[i] = char));
    setOtp(newOtp);
    const lastIndex = pasteArray.length - 1;
    if (lastIndex < 5) inputRefs.current[lastIndex]?.focus();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="font-bold text-2xl text-white tracking-tight">
          Reset Password OTP
        </h2>
        <p className="text-neutral-400 text-sm mt-2">
          Enter the 6-digit code sent to your email.
        </p>
      </div>
      <div
        className="flex justify-between gap-1 sm:gap-2"
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
              disabled={isLoading}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-800/50 border border-neutral-700 text-white text-center text-xl sm:text-2xl rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all disabled:opacity-50"
              ref={(e) => {
                inputRefs.current[index] = e;
              }}
              value={otp[index]}
              onInput={(e) =>
                handleInput(e as React.ChangeEvent<HTMLInputElement>, index)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
      </div>
      <button
        disabled={isLoading}
        className="relative group/btn flex items-center justify-center gap-2 w-full bg-white text-black rounded-xl h-11 font-bold text-sm hover:bg-neutral-200 transition-all duration-300 disabled:opacity-70 cursor-pointer"
      >
        {isLoading ? (
          <IconLoader2 className="animate-spin w-5 h-5" />
        ) : (
          <>
            Submit <IconArrowRight className="w-4 h-4" />
          </>
        )}
        <BottomGradient />
      </button>
    </form>
  );
};

// ----------------------------------------------------------------------
// STEP 3: New Password Form (Now accepts 'isLoading')
// ----------------------------------------------------------------------
const NewPasswordStep = ({
  newPassword,
  setNewPassword,
  onSubmit,
  isLoading,
}: any) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 mb-4 border border-cyan-500/20">
        <IconLock size={24} />
      </div>
      <h2 className="font-bold text-2xl text-white tracking-tight">
        New Password
      </h2>
      <p className="text-neutral-400 text-sm mt-2">
        Enter your new secure password below.
      </p>
    </div>
    <div className="relative">
      <IconLock className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
      <input
        type="password"
        placeholder="New Password"
        required
        disabled={isLoading}
        className="w-full bg-neutral-800/50 border border-neutral-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder:text-neutral-600 disabled:opacity-50"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>
    <button
      disabled={isLoading}
      className="relative group/btn flex items-center justify-center gap-2 w-full bg-white text-black rounded-xl h-11 font-bold text-sm hover:bg-neutral-200 transition-all duration-300 disabled:opacity-70 cursor-pointer"
    >
      {isLoading ? (
        <IconLoader2 className="animate-spin w-5 h-5" />
      ) : (
        <>
          Reset Password <IconArrowRight className="w-4 h-4" />
        </>
      )}
      <BottomGradient />
    </button>
  </form>
);

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  // NEW: Loading State
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // START LOADING
    try {
      const { data } = await api.post("/auth/send-reset-otp", { email });
      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    } finally {
      setIsLoading(false); // STOP LOADING
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6)
      return toast.error("Please enter the 6-digit code");
    setStep(3);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    setIsLoading(true); // START LOADING
    try {
      const { data } = await api.post("/auth/reset-password", {
        email,
        otp: otpCode,
        newPassword,
      });
      if (data.success) {
        toast.success("Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setIsLoading(false); // STOP LOADING
    }
  };

  return (
    <AuthLayout>
      <div className="w-full mx-auto rounded-xl md:rounded-2xl p-6 md:p-8 shadow-[0_0_40px_-10px_rgba(255,255,255,0.03)] bg-neutral-900/40 backdrop-blur-md border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />

        {step === 1 && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            onSubmit={handleEmailSubmit}
            isLoading={isLoading}
          />
        )}
        {step === 2 && (
          <OtpStep
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleOtpSubmit}
            isLoading={isLoading}
          />
        )}
        {step === 3 && (
          <NewPasswordStep
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            onSubmit={handlePasswordSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
