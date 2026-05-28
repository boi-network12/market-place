// components/ui/LoadingBar.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
      
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);
    };

    const endLoading = () => {
      clearInterval(interval);
      setProgress(100);
      
      timeout = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    startLoading();
    
    // Simulate loading completion
    const timer = setTimeout(() => {
      endLoading();
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <motion.div
              className="h-full bg-indigo-600"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}