"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current - (scrollYProgress.getPrevious() ?? 0);

      if (window.scrollY < 50) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true); // Scrolling UP -> Show
        } else {
          setVisible(false); // Scrolling DOWN -> Hide
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{
          y: visible ? 0 : -50,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "flex max-w-fit fixed top-8 inset-x-0 mx-auto border border-white/10 rounded-full bg-neutral-950/70 backdrop-blur-md z-[5000] px-3 py-2 items-center justify-center space-x-2 shadow-2xl shadow-black/50",
          className,
        )}
      >
        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            to={navItem.link}
            className="relative items-center flex space-x-1 text-neutral-400 hover:text-white px-3 py-2 transition-colors duration-200"
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-xs font-semibold uppercase tracking-widest">
              {navItem.name}
            </span>
          </Link>
        ))}

        <Link
          to="/login"
          className="relative group border border-white/20 text-white px-5 py-2 rounded-full overflow-hidden transition-all duration-300 hover:border-white/40"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 text-xs font-bold uppercase tracking-tighter">
            Login
          </span>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};
