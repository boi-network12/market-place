// components/ui/TerminalLogo.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TerminalLogo() {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = ">_ kamdi.sh";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setText("");
          index = 0;
          setIsTyping(true);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
    >
      {/* Terminal icon */}
      <div className="relative">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-lg border border-indigo-500/30">
          <svg
            className="w-5 h-5 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Blinking cursor effect */}
        <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
      </div>

      {/* Animated terminal text */}
      <div className="hidden sm:block">
        <motion.div
          className="font-mono text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
          {isTyping && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5"
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}