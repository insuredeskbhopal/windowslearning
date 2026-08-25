"use client";

import React, { useEffect, useRef } from "react";
import styles from "./ParticleText.module.css";

interface DustParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  friction: number;
  ease: number;
  driftAngle: number;
  driftSpeed: number;
  spawnDelay: number;
  alpha: number;
  baseAlpha: number;
}

interface ParticleTextProps {
  text?: string;
  tagline?: string;
}

export default function ParticleText({
  text = "WINDOWS LEARNING",
  tagline = "LEARN   •   CONNECT   •   GROW",
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let whiteParticles: DustParticle[] = [];
    let mintParticles: DustParticle[] = [];
    let goldParticles: DustParticle[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 110,
      radiusSq: 110 * 110,
      isHovered: false,
    };

    let dpr = 1;
    let width = 0;
    let height = 0;
    let startTime = 0;

    const initCanvasAndDust = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const containerWidth = container.clientWidth || window.innerWidth * 0.9;
      width = Math.min(Math.max(containerWidth, 320), 1280);

      // Large bold typography calculation
      let calculatedFontSize = Math.floor(width / (text.length * 0.58));
      calculatedFontSize = Math.min(Math.max(calculatedFontSize, 44), 108);

      // Tagline font size
      const taglineFontSize = Math.max(Math.round(calculatedFontSize * 0.17), 13);

      // Compact canvas height covering both lines
      height = Math.round(calculatedFontSize * 1.35 + taglineFontSize * 2.2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Clear
      ctx.clearRect(0, 0, width, height);

      const titleY = Math.round(calculatedFontSize * 0.62);
      const taglineY = Math.round(calculatedFontSize * 1.26 + taglineFontSize * 0.6);

      // 1. Draw Title in Insaniburger custom font
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 ${calculatedFontSize}px Insaniburger, "Insaniburger", sans-serif`;
      ctx.fillText(text, width / 2, titleY);

      // 2. Draw Tagline in clean bold font
      ctx.font = `700 ${taglineFontSize}px "Plus Jakarta Sans", "JetBrains Mono", -apple-system, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(tagline, width / 2, taglineY);

      // Extract pixel data for both lines
      const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr);
      const data = imageData.data;
      ctx.clearRect(0, 0, width, height);

      whiteParticles = [];
      mintParticles = [];
      goldParticles = [];
      startTime = performance.now();

      const taglineThresholdY = (titleY + calculatedFontSize * 0.5) * dpr;

      // Perfectly balanced density: 2.15px title, 1.4px tagline
      const titleStep = Math.max(1, Math.round(2.15 * dpr));
      const taglineStep = Math.max(1, Math.round(1.4 * dpr));

      for (let y = 0; y < height * dpr; y++) {
        const isTaglineRow = y > taglineThresholdY;
        const currentStep = isTaglineRow ? taglineStep : titleStep;

        if (y % currentStep !== 0) continue;

        for (let x = 0; x < width * dpr; x += currentStep) {
          const sampleX = Math.floor(x);
          const sampleY = Math.floor(y);
          const index = (sampleY * (width * dpr) + sampleX) * 4;
          const alpha = data[index + 3];

          if (alpha > 65) {
            const posX = sampleX / dpr;
            const posY = sampleY / dpr;
            const isTagline = posY > (titleY + calculatedFontSize * 0.5);

            const ratio = posX / width;
            let colorCategory: 0 | 1 | 2 = 0; // 0 = white, 1 = mint, 2 = gold

            if (!isTagline) {
              if (ratio < 0.38) {
                colorCategory = 0;
              } else if (ratio < 0.72) {
                colorCategory = 1;
              } else {
                colorCategory = 2;
              }
            }

            const baseAlpha = Math.min(1.0, (alpha / 255) * 1.15);
            // Particle sizes tailored for full visual coverage
            const size = isTagline ? 0.8 : (Math.random() * 0.35 + 1.1);

            // Initial scatter
            const scatterAngle = Math.random() * Math.PI * 2;
            const scatterDist = Math.random() * 75 + 20;
            const startX = posX + Math.cos(scatterAngle) * scatterDist;
            const startY = posY + Math.sin(scatterAngle) * scatterDist;

            // Sequential wave spawn delay from left to right
            const horizontalDelay = (posX / width) * 1.1;
            const randomJitter = Math.random() * 0.2;
            const spawnDelay = horizontalDelay + randomJitter + (isTagline ? 0.15 : 0);

            const particle: DustParticle = {
              x: startX,
              y: startY,
              originX: posX,
              originY: posY,
              vx: (Math.random() - 0.5) * 0.8,
              vy: (Math.random() - 0.5) * 0.8,
              size,
              baseAlpha,
              alpha: 0,
              friction: 0.90,
              ease: 0.085 + Math.random() * 0.03,
              driftAngle: Math.random() * Math.PI * 2,
              driftSpeed: 0.015 + Math.random() * 0.015,
              spawnDelay,
            };

            if (colorCategory === 0) {
              whiteParticles.push(particle);
            } else if (colorCategory === 1) {
              mintParticles.push(particle);
            } else {
              goldParticles.push(particle);
            }
          }
        }
      }
    };

    // Ensure custom font is ready
    if (document.fonts) {
      document.fonts.load('700 60px Insaniburger').then(() => {
        initCanvasAndDust();
      }).catch(() => {
        initCanvasAndDust();
      });
    } else {
      initCanvasAndDust();
    }

    // Ultra-Fast Zero-Allocation Update & Render Function
    const updateAndDrawGroup = (
      group: DustParticle[],
      elapsed: number,
      fillColor: string
    ) => {
      ctx.fillStyle = fillColor;
      const mouseRadius = mouse.radius;
      const mouseRadiusSq = mouse.radiusSq;
      const isHovered = mouse.isHovered;
      const mouseX = mouse.x;
      const mouseY = mouse.y;

      for (let i = 0; i < group.length; i++) {
        const p = group[i];

        if (elapsed < p.spawnDelay) {
          p.driftAngle += p.driftSpeed;
          p.x += Math.sin(p.driftAngle) * 0.2;
          p.y += Math.cos(p.driftAngle) * 0.2;
          continue;
        }

        const activeTime = elapsed - p.spawnDelay;
        if (activeTime < 0.45) {
          p.alpha = (activeTime / 0.45) * p.baseAlpha;
        } else {
          p.alpha = p.baseAlpha;
        }

        // Settled drift stabilization
        let driftX = 0;
        let driftY = 0;
        if (activeTime < 0.8 || isHovered) {
          p.driftAngle += p.driftSpeed;
          driftX = Math.sin(p.driftAngle) * 0.25;
          driftY = Math.cos(p.driftAngle * 0.8) * 0.25;
        }

        // Fast bounding box distance check for mouse repulsion
        if (isHovered) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          if (absDx < mouseRadius && absDy < mouseRadius) {
            const distSq = dx * dx + dy * dy;
            if (distSq < mouseRadiusSq && distSq > 0) {
              const distance = Math.sqrt(distSq);
              const force = (1 - distance / mouseRadius) * 14;
              const angle = Math.atan2(dy, dx);
              const turbulence = (Math.random() - 0.5) * 1.2;
              p.vx -= (Math.cos(angle) + turbulence * 0.15) * force;
              p.vy -= (Math.sin(angle) + turbulence * 0.15) * force;
            }
          }
        }

        // Magnetic spring return
        const homeDx = p.originX + driftX - p.x;
        const homeDy = p.originY + driftY - p.y;

        p.vx = (p.vx + homeDx * p.ease) * p.friction;
        p.vy = (p.vy + homeDy * p.ease) * p.friction;

        p.x += p.vx;
        p.y += p.vy;

        if (p.alpha > 0.05) {
          const s = p.size;
          ctx.fillRect(p.x - s * 0.5, p.y - s * 0.5, s, s);
        }
      }
    };

    const animate = (currentTime: number) => {
      ctx.clearRect(0, 0, width, height);
      const elapsed = (currentTime - startTime) / 1000;

      updateAndDrawGroup(whiteParticles, elapsed, "rgba(255, 255, 255, 0.96)");
      updateAndDrawGroup(mintParticles, elapsed, "rgba(225, 246, 236, 0.96)");
      updateAndDrawGroup(goldParticles, elapsed, "rgba(254, 243, 199, 0.96)");

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.isHovered = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.isHovered = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      initCanvasAndDust();
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [text, tagline]);

  return (
    <div className={styles.particleContainer} ref={containerRef}>
      <h1 className={styles.accessibleText}>{text} - {tagline}</h1>
      <canvas ref={canvasRef} className={styles.particleCanvas} />
    </div>
  );
}
