import { assets } from "@/assets/assets";
import { motion } from "framer-motion";
import {
  IconArrowRight,
  IconShieldCheck,
  IconUserCheck,
  IconLogout,
} from "@tabler/icons-react";
import Ballpit from "../components/reactbits/Ballpit";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import api from "@/api/axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// 1. Imports for Grid Pattern
import { cn } from "@/lib/utils";
import { GridPattern } from "./ui/grid-pattern";

const Header = () => {
  const { userData, setIsLoggedIn, setUserData } = useAppContext();
  const navigate = useNavigate();

  // Initialize state
  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Threshold set to 1250px
      setIsLaptop(window.innerWidth >= 1250);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden isolate">
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        {isLaptop ? (
          // 🖥️ DESKTOP: Show Ballpit
          <div className="ballpit-container w-full h-full">
            <style>
              {`
                .ballpit-container, .ballpit-container canvas {
                  pointer-events: none !important;
                }
              `}
            </style>
            <Ballpit
              count={100}
              gravity={0.01}
              friction={0.9975}
              wallBounce={0.95}
              followCursor={false}
              colors={["#dbd9d9", "#8b5cf6", "#1f2937"]}
            />
          </div>
        ) : (
        
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <GridPattern
              squares={[
                [4, 4],
                [5, 1],
                [8, 2],
                [5, 3],
                [5, 5],
                [10, 10],
                [12, 15],
                [15, 10],
                [10, 15],
              ]}
              className={cn(
                // Mask: Increased size to 500px to ensure it covers enough screen on mobile
                "mask-[radial-gradient(500px_circle_at_center,white,transparent)]",

                // Layout: Position absolute to cover the container
                "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",

                // COLOR FIX:
                // Changed from 'white/10' to 'gray-400/30' and 'gray-500/30'.
                // This gives it enough contrast to be seen on the black background.
                "fill-gray-400/30 stroke-gray-500/30",
              )}
            />
          </div>
        )}
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20 pointer-events-none">
        {/* Profile/Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative pointer-events-auto"
        >
          <div
            className={`absolute inset-0 blur-[60px] opacity-40 rounded-full ${userData ? "bg-cyan-500" : "bg-purple-600"}`}
          />
          <img
            src={assets.header_img}
            alt="Header Icon"
            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full mb-8 border border-white/20 shadow-2xl object-cover"
          />
        </motion.div>

        {/* Headlines */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex items-center gap-3 text-4xl sm:text-6xl font-bold mb-4 tracking-tight text-white pointer-events-auto"
        >
          {userData ? `Welcome back, ${userData.name}!` : "MERN Authentication"}
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
            className={userData ? "text-cyan-400" : "text-purple-400"}
          >
            {userData ? (
              <IconUserCheck size={48} />
            ) : (
              <IconShieldCheck size={48} />
            )}
          </motion.span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl sm:text-2xl font-light mb-8 text-neutral-300 pointer-events-auto"
        >
          {userData
            ? "Your session is active and secure."
            : "Secure. Scalable. Production-Ready."}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-base sm:text-lg max-w-xl mx-auto text-neutral-500 mb-10 leading-relaxed pointer-events-auto"
        >
          {userData ? (
            <>
              Authenticated with{" "}
              <span className="text-neutral-300">HttpOnly Cookies</span>.
            </>
          ) : (
            <>
              Experience robust{" "}
              <span className="text-neutral-200">JWT Security</span>.
            </>
          )}
        </motion.p>

        {/* --- ACTION BUTTON --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative z-2 pointer-events-auto mt-6"
        >
          {userData ? (
            <Button
              onClick={handleLogout}
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer border-none"
            >
              <span className="mr-2">Logout</span>
              <IconLogout className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          ) : (
            <Link
              to="/login"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black transition-all duration-300 hover:bg-neutral-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer border-none"
            >
              <span className="mr-2">Test Login Flow</span>
              <IconArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
