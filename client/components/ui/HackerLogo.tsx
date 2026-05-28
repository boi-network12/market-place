// components/ui/HackerLogo.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HackerLogo() {
  const [glitch, setGlitch] = useState(false);
  const [binaryText, setBinaryText] = useState("010");
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 3000);

    // Binary animation
    const binaryInterval = setInterval(() => {
      const randomBinary = Math.random() > 0.5 ? "010" : "101";
      setBinaryText(randomBinary);
    }, 2000);

    // Scan line animation
    const scanInterval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(binaryInterval);
      clearInterval(scanInterval);
    };
  }, []);

  return (
    <motion.div
      className="relative flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative w-10 h-10">
        {/* Main logo circle */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 shadow-lg"
          animate={{
            boxShadow: glitch
              ? [
                  "0 0 0 0 rgba(79, 70, 229, 0.7)",
                  "0 0 0 10px rgba(79, 70, 229, 0)",
                  "0 0 0 0 rgba(79, 70, 229, 0.7)",
                ]
              : "0 0 0 0 rgba(79, 70, 229, 0)",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Glitch layers */}
        <AnimatePresence>
          {glitch && (
            <>
              <motion.div
                initial={{ x: -2, y: 0, opacity: 0.8 }}
                animate={{ x: 2, y: 0 }}
                exit={{ x: 0, opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 rounded-full bg-indigo-400 mix-blend-screen"
              />
              <motion.div
                initial={{ x: 2, y: 0, opacity: 0.8 }}
                animate={{ x: -2, y: 0 }}
                exit={{ x: 0, opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 rounded-full bg-purple-400 mix-blend-screen"
              />
            </>
          )}
        </AnimatePresence>

        {/* Inner content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-white font-mono text-xs font-bold"
            animate={{
              opacity: [1, 0.8, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            K
          </motion.span>
        </div>

        {/* Binary ring */}
        <motion.div
          className="absolute -inset-1 rounded-full border-2 border-indigo-400/50"
          style={{
            clipPath: `polygon(0 ${scanLine}%, 100% ${scanLine}%, 100% ${scanLine + 5}%, 0 ${scanLine + 5}%)`,
          }}
        />

        {/* Hacker text */}
        <motion.div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-[8px] font-mono text-indigo-600 dark:text-indigo-400">
            {binaryText}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}