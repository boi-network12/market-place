// components/ui/ParticleBackground.tsx
"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particleCount = 50;

    particlesRef.current = Array.from(
      { length: particleCount },
      () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      })
    );

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(79, 70, 229, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (
          let j = i + 1;
          j < particlesRef.current.length;
          j++
        ) {
          const dx =
            particlesRef.current[i].x -
            particlesRef.current[j].x;

          const dy =
            particlesRef.current[i].y -
            particlesRef.current[j].y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();

            ctx.moveTo(
              particlesRef.current[i].x,
              particlesRef.current[i].y
            );

            ctx.lineTo(
              particlesRef.current[j].x,
              particlesRef.current[j].y
            );

            ctx.strokeStyle = `rgba(
              79,
              70,
              229,
              ${0.1 * (1 - distance / 100)}
            )`;

            ctx.stroke();
          }
        }
      }

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener(
        "resize",
        resizeCanvas
      );

      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}