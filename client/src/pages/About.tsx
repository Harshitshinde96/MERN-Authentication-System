import React from "react";
import { motion } from "framer-motion";
import {
  IconBrandLinkedin,
  IconBrandX,
  IconBrandInstagram,
  IconMail,
  IconBrandMongodb,
  IconBrandReact,
  IconBrandNodejs,
  IconServer,
  IconCode,
  IconUser,
} from "@tabler/icons-react";
import AuthLayout from "@/components/layouts/AuthLayout";

// --- Interfaces ---
interface TechBadgeProps {
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  styleClass: string; // Changed to allow specific background styles
}

const About: React.FC = () => {
  return (
    <AuthLayout>
      {/* THE FIX: "Breakout" Container
        We use 'fixed inset-0' to break out of the 'max-w-md' restriction of AuthLayout.
        This allows the About page to be wide while keeping the Star Background.
      */}
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl flex flex-col items-center"
        >
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* 1. PROJECT CARD */}
            <div className="w-full rounded-3xl p-8 border border-white/10 bg-neutral-900/80 backdrop-blur-xl shadow-2xl flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
              {/* Decoration Icon */}
              <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                <IconCode size={200} />
              </div>

              <h2 className="text-3xl font-bold mb-4 text-white">
                About The <span className="text-cyan-400">Project</span>
              </h2>

              <p className="text-neutral-400 text-base leading-relaxed mb-8">
                A production-grade <strong>Authentication System</strong>{" "}
                engineered for the modern web. It secures your digital galaxy
                with <span className="text-neutral-200">HttpOnly Cookies</span>,
                <span className="text-neutral-200"> JWT</span>, and automated{" "}
                <span className="text-neutral-200">OTP Verification</span>.
              </p>

              <div className="mt-auto">
                <h3 className="text-xs uppercase tracking-wider text-neutral-500 font-bold mb-4">
                  Tech Stack
                </h3>
                {/* Tech Stack Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <TechBadge
                    name="MongoDB"
                    icon={<IconBrandMongodb size={20} />}
                    color="text-green-500 bg-green-950/30 border-green-500/20"
                  />
                  <TechBadge
                    name="Express"
                    icon={<IconServer size={20} />}
                    color="text-gray-300 bg-gray-800/50 border-gray-500/30"
                  />
                  <TechBadge
                    name="React"
                    icon={<IconBrandReact size={20} />}
                    color="text-cyan-400 bg-cyan-950/30 border-cyan-500/20"
                  />
                  <TechBadge
                    name="Node.js"
                    icon={<IconBrandNodejs size={20} />}
                    color="text-emerald-500 bg-emerald-950/30 border-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            {/* 2. PROFILE CARD */}
            <div className="w-full rounded-3xl p-8 border border-white/10 bg-neutral-900/80 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-white/20 transition-colors">
              {/* Decoration Icon */}
              <div className="absolute -left-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                <IconUser size={200} />
              </div>

              {/* Avatar */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-24 h-24 rounded-full bg-neutral-950 border-2 border-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-xl z-10">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                    HS
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-1">
                Harshit Shinde
              </h3>
              <p className="text-sm text-cyan-400 font-medium mb-6 uppercase tracking-wide">
                Full Stack Developer
              </p>

              <p className="text-neutral-400 text-sm mb-8 leading-relaxed max-w-sm">
                Crafting scalable web architectures and seamless user
                experiences with modern technologies.
              </p>

              {/* Social Icons - ORIGINAL BRAND COLORS */}
              <div className="flex items-center justify-center gap-4 w-full mt-auto">
                {/* LinkedIn: Original Blue */}
                <SocialLink
                  href="https://www.linkedin.com/in/harshitshinde96/"
                  icon={<IconBrandLinkedin size={28} stroke={1.5} />}
                  styleClass="bg-[#0077b5] text-white hover:brightness-110 shadow-lg shadow-blue-900/20"
                />

                {/* X (Twitter): Black with White Icon */}
                <SocialLink
                  href="https://x.com/HarshitShinde96"
                  icon={<IconBrandX size={28} stroke={1.5} />}
                  styleClass="bg-black text-white border border-white/20 hover:bg-neutral-900 shadow-lg"
                />

                {/* Instagram: Official Gradient */}
                <SocialLink
                  href="https://www.instagram.com/harshit.shinde01"
                  icon={<IconBrandInstagram size={28} stroke={1.5} />}
                  styleClass="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:brightness-110 shadow-lg shadow-pink-900/20"
                />

                {/* Email: White with Red Icon (Gmail style) */}
                <SocialLink
                  href="mailto:harshitshinde65@gmail.com"
                  icon={<IconMail size={28} stroke={1.5} />}
                  styleClass="bg-white text-[#EA4335] hover:bg-gray-100 shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full text-center mt-12 mb-6">
            <p className="flex items-center justify-center gap-2 text-neutral-500 text-xs sm:text-sm">
              Built with{" "}
              <span className="text-red-500 animate-pulse text-base">❤️</span>{" "}
              By
              <a
                href="https://github.com/Harshitshinde96"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 font-medium hover:text-cyan-400 transition-colors"
              >
                Harshit Shinde
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

// --- Helper Components ---

const TechBadge: React.FC<TechBadgeProps> = ({ name, icon, color }) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-300 hover:scale-105 cursor-default ${color}`}
  >
    {icon}
    <span>{name}</span>
  </div>
);

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, styleClass }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    // p-3 makes the button square/round enough to look like an app icon
    className={`p-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${styleClass}`}
  >
    {icon}
  </a>
);

export default About;
