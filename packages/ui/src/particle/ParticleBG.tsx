"use client";

import React, { useEffect, useRef } from "react";

interface Star {
    angle: number;
    distance: number;
    speed: number;
    size: number;
    color: string;
}

export default function ParticleBG({ isVisible }: { isVisible: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let stars: Star[] = [];
        let animationFrameId: number;

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];
            const count = 1500;

            for (let i = 0; i < count; i++) {
                stars.push({
                    angle: Math.random() * Math.PI * 2,
                    distance: Math.random() * Math.max(canvas.width, canvas.height) * 0.8,
                    speed: 0.002 + Math.random() * 0.008,
                    size: 0.5 + Math.random() * 1.5,
                    color: Math.random() > 0.5 ? "#ffffff" : "#3b82f6", // White and Blue stars
                });
            }
        };

        const animate = () => {
            if (!ctx) return;

            // Clear with slight alpha for trails
            ctx.fillStyle = "rgba(5, 5, 5, 0.15)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            stars.forEach((s) => {
                // Update physics
                s.angle += s.speed;

                // Gravitational pull: particles move faster as they get closer
                const pullFactor = 1.2 + (1 - s.distance / (canvas.width / 2)) * 1.5;
                s.distance -= pullFactor;

                // Swirl speed increases as they get closer (Conservation of angular momentum feel)
                s.speed += (1 / (s.distance + 10)) * 0.01;

                // Event Horizon Recycling
                if (s.distance <= 10) {
                    s.distance = Math.max(canvas.width, canvas.height) * 0.7;
                    s.angle = Math.random() * Math.PI * 2;
                    s.speed = 0.002 + Math.random() * 0.008;
                }

                const x = centerX + Math.cos(s.angle) * s.distance;
                const y = centerY + Math.sin(s.angle) * s.distance;

                // Subtle glow based on distance to center
                const alpha = Math.min(1, s.distance / 100);
                ctx.globalAlpha = alpha;

                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(x, y, s.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 1;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => init();
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 w-full h-full -z-20 transition-opacity duration-[3000ms] pointer-events-none ${isVisible ? "opacity-100" : "opacity-0"
                }`}
            style={{ background: "transparent" }}
        />
    );
}
