// components/ui/AnimatedLogo.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function AnimatedLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 32;
    canvas.height = 32;

    // Matrix code animation
    const chars = "01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let frame = 0;
    let animationId: number;

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text color based on theme
      const isDark = document.documentElement.classList.contains("dark");
      ctx.fillStyle = isDark ? "#00ff41" : "#4f46e5";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frame++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, rotate: 5 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        width={32}
        height={32}
        className="rounded-lg shadow-lg"
        style={{ imageRendering: "crisp-edges" }}
      />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse" />
    </motion.div>
  );
}