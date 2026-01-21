import { assets } from "@/assets/assets";
import { motion } from "framer-motion";
import {
  IconArrowRight,
  IconShieldCheck,
  IconUserCheck,
  IconLogout,
} from "@tabler/icons-react"; // Added new icons
import Ballpit from "../components/reactbits/Ballpit";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast"; // Assuming you have toast installed from previous steps
import api from "@/api/axios"; // Use your configured api instance if you want to call a backend logout endpoint

const Header = () => {
  const { userData, setIsLoggedIn, setUserData } = useAppContext();
  const navigate = useNavigate();
  console.log(userData)

  // Simple Logout Handler
  const handleLogout = async () => {
    try {
      // Optional: Call backend logout if needed
      await api.post("/auth/logout");

      // Clear Local State
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* --- BACKGROUND LAYER --- */}
      <div
        className="absolute inset-0 z-0 w-full h-full"
        style={{ pointerEvents: "none" }}
      >
        <Ballpit
          count={100}
          gravity={0.01}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={false}
          colors={["#dbd9d9", "#8b5cf6", "#1f2937"]}
        />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20">
        {/* Profile/Logo Image with Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Change Glow Color based on Login State: Purple for Guest, Cyan/Green for User */}
          <div
            className={`absolute inset-0 blur-[60px] opacity-40 rounded-full ${userData ? "bg-cyan-500" : "bg-purple-600"}`}
          />

          <img
            src={assets.header_img}
            alt="Header Icon"
            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full mb-8 border border-white/20 shadow-2xl object-cover"
          />
        </motion.div>

        {/* --- CONDITIONAL HEADLINE --- */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex items-center gap-3 text-4xl sm:text-6xl font-bold mb-4 tracking-tight text-white"
        >
          {userData ? `Welcome back, ${userData.name}!` : "MERN Authentication"}

          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
            className={userData ? "text-cyan-400" : "text-purple-400"}
          >
            {/* Show User Check icon if logged in, otherwise Shield */}
            {userData ? (
              <IconUserCheck size={48} stroke={2} />
            ) : (
              <IconShieldCheck size={48} stroke={2} />
            )}
          </motion.span>
        </motion.h1>

        {/* --- CONDITIONAL SUB-HEADLINE --- */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl sm:text-2xl font-light mb-8 text-neutral-300"
        >
          {userData
            ? "Your session is active and secure."
            : "Secure. Scalable. Production-Ready."}
        </motion.h2>

        {/* --- CONDITIONAL DESCRIPTION --- */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-base sm:text-lg max-w-xl mx-auto text-neutral-500 mb-10 leading-relaxed"
        >
          {userData ? (
            // Logged In Text
            <>
              You are currently authenticated with{" "}
              <span className="text-neutral-300">HttpOnly Cookies</span>. You
              can now access protected routes or verify your email status.
            </>
          ) : (
            // Guest Text
            <>
              Experience a robust identity system featuring{" "}
              <span className="text-neutral-200">JWT Security</span>,
              <span className="text-neutral-200"> HttpOnly Cookies</span>, and
              automated{" "}
              <span className="text-neutral-200">Email Verification</span>.
            </>
          )}
        </motion.p>

        {/* --- CONDITIONAL ACTION BUTTON --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ pointerEvents: "auto" }}
        >
          {userData ? (
            // LOGGED IN BUTTON -> LOGOUT
            <button
              onClick={handleLogout}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              <span className="mr-2">Logout</span>
              <IconLogout className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          ) : (
            // GUEST BUTTON -> LOGIN
            <button
              onClick={() => navigate("/login")}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              <span className="mr-2">Test Login Flow</span>
              <IconArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
