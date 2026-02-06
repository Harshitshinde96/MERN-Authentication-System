import { assets } from "@/assets/assets";
import {
  IconHome,
  IconMessage,
  IconUser,
  IconArrowRight,
  IconLogout,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import api from "@/api/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, setIsLoggedIn, setUserData } = useAppContext();

  const navItems = [
    { name: "Home", link: "/", icon: <IconHome size={20} /> },
    { name: "About", link: "/about", icon: <IconUser size={20} /> },
    { name: "Contact", link: "/about", icon: <IconMessage size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Error logging out");
    }
  };

  const sendVerificationOtp = async () => {
    try {
      navigate("/email-verify");
      const { data } = await api.post("/auth/send-verify-otp");
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <>
      {/* DEBUGGING: I added 'outline-red-500' to the header. 
        If you see the red line BEHIND other elements on mobile, we know it's a z-index issue.
      */}
      <header className="fixed top-0 w-full z-1 transition-all duration-300 border-b border-transparent hover:border-white/10 hover:bg-white/5 backdrop-blur-sm pointer-events-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-5 px-6 lg:px-10">
          {/* Brand Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center group cursor-pointer"
          >
            <img
              src={assets.logo1}
              alt="Logo"
              className="w-28 sm:w-32 transition-transform duration-300 group-hover:scale-105 opacity-90 hover:opacity-100"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            {userData ? (
              // --- LOGGED IN STATE ---
              <div className="flex items-center gap-4">
                {!userData.isAccountVerified && (
                  <button
                    onClick={sendVerificationOtp}
                    className="hidden sm:flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-full hover:bg-amber-400/20 transition cursor-pointer relative z-50"
                  >
                    <IconAlertCircle size={14} />
                    Verify Email
                  </button>
                )}

                <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 flex items-center justify-center font-bold text-sm select-none">
                  {userData.name[0].toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  className="group flex items-center justify-center p-2 sm:px-4 sm:py-2 overflow-hidden font-medium text-white transition duration-300 ease-out border border-white/10 rounded-full hover:bg-white/10 cursor-pointer relative z-50"
                  title="Logout"
                >
                  <IconLogout
                    size={18}
                    className="text-neutral-300 group-hover:text-white"
                  />
                </button>
              </div>
            ) : (
              // --- GUEST STATE ---
              <>
                {/* 1. MOBILE BUTTON: 
                    Switched to standard HTML <a> tag. 
                    This forces the browser to handle the click natively.
                */}
                <a
                  href="/login"
                  className="flex md:hidden items-center justify-center gap-2 px-6 py-2 rounded-full bg-white text-black font-medium text-sm transition-transform active:scale-95 relative z-1 cursor-pointer"
                  onClick={(e) => {
                    // This prevents full page reload but uses native click behavior
                    e.preventDefault();
                    navigate("/login");
                  }}
                >
                  Login <IconArrowRight size={16} />
                </a>

                {/* 2. DESKTOP BUTTON */}
                <button
                  onClick={() => navigate("/login")}
                  className="hidden md:inline-flex group items-center justify-center px-8 py-2.5 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-white/20 rounded-full shadow-md bg-neutral-950 cursor-pointer active:scale-95 relative z-1"
                >
                  <span className="absolute inset-0 flex items-center justify-center w-full h-full text-black duration-300 -translate-x-full bg-white group-hover:translate-x-0 ease pointer-events-none">
                    <IconArrowRight size={18} />
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease pointer-events-none">
                    Login
                  </span>
                  <span className="relative invisible">Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
