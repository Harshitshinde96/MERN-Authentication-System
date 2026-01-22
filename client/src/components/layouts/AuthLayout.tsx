import React from "react";
import { StarsBackground } from "@/components/animate-ui/components/backgrounds/stars";
import { cn } from "@/lib/utils";
import { assets } from "@/assets/assets";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full">
        <StarsBackground
          // Pure white stars for maximum visibility
          starColor="#FFFFFF"
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            // Adjusted Gradient: A bit more light in the center so stars pop against it
            "bg-[radial-gradient(ellipse_at_center,#111111_0%,#050505_60%,#000000_100%)]",
          )}
        />
      </div>

      <div className="absolute top-8 left-8 z-50">
        <img
          onClick={() => navigate("/")}
          src={assets.logo1}
          alt="Logo"
          className="w-26 sm:w-32 cursor-pointer transition-transform duration-300 hover:scale-105 opacity-90 hover:opacity-100"
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
