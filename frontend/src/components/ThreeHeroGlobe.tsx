"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";
import { Article } from "@/types/news";
import { Sparkles, TrendingUp, Flame, ArrowRight, Eye, Clock, ShieldCheck, ChevronLeft, ChevronRight, Globe2, Radio } from "lucide-react";

interface ThreeHeroGlobeProps {
  breakingArticles: Article[];
  onSelectArticle: (article: Article) => void;
  language?: "en" | "hi";
}

// Global hot-spot coordinates on the sphere
const HOTSPOTS = [
  { name: "New Delhi (IN)", lat: 28.6139, lon: 77.2090, label: "National Hub" },
  { name: "Silicon Valley (US)", lat: 37.3875, lon: -122.0575, label: "AI Frontier" },
  { name: "London (UK)", lat: 51.5074, lon: -0.1278, label: "Global Wire" },
  { name: "Tokyo (JP)", lat: 35.6762, lon: 139.6503, label: "Asia Markets" },
  { name: "Singapore (SG)", lat: 1.3521, lon: 103.8198, label: "Fintech Hub" },
];

export default function ThreeHeroGlobe({
  breakingArticles,
  onSelectArticle,
  language = "en",
}: ThreeHeroGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(HOTSPOTS[0]);

  // Next / Prev handlers
  const handleNext = useCallback(() => {
    if (!breakingArticles || breakingArticles.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % breakingArticles.length);
    setActiveHotspot(HOTSPOTS[(currentIndex + 1) % HOTSPOTS.length]);
  }, [breakingArticles, currentIndex]);

  const handlePrev = useCallback(() => {
    if (!breakingArticles || breakingArticles.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + breakingArticles.length) % breakingArticles.length);
    setActiveHotspot(HOTSPOTS[(currentIndex - 1 + HOTSPOTS.length) % HOTSPOTS.length]);
  }, [breakingArticles, currentIndex]);

  // Auto-advance breaking news every 7 seconds when not hovered
  useEffect(() => {
    if (isHovered || !breakingArticles || breakingArticles.length <= 1) return;
    const interval = setInterval(handleNext, 7000);
    return () => clearInterval(interval);
  }, [isHovered, breakingArticles, handleNext]);

  const currentArticle =
    breakingArticles && breakingArticles.length > 0
      ? breakingArticles[currentIndex]
      : null;

  const displayTitle =
    currentArticle
      ? language === "hi" && currentArticle.title_hi
        ? currentArticle.title_hi
        : currentArticle.title_en || currentArticle.title
      : "";

  const displaySummary =
    currentArticle
      ? language === "hi" && currentArticle.summary_hi
        ? currentArticle.summary_hi
        : currentArticle.summary_en || currentArticle.summary
      : "";

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 21;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Globe Geometry
    const particleCount = 1600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const radius = 7.2;
    const colorCyan = new THREE.Color("#00f0ff");
    const colorRose = new THREE.Color("#ff007f");
    const colorGold = new THREE.Color("#fbbf24");
    const colorPurple = new THREE.Color("#a855f7");

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color gradation across globe latitudes
      const ratio = (y + radius) / (2 * radius);
      const colorA = ratio > 0.5 ? colorCyan : colorRose;
      const colorB = ratio > 0.5 ? colorGold : colorPurple;
      const mixedColor = colorA.clone().lerp(colorB, Math.random());

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.17,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const particleSphere = new THREE.Points(geometry, material);
    scene.add(particleSphere);

    // Inner Glowing Wireframe Geo
    const innerGeo = new THREE.IcosahedronGeometry(6.9, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // Orbital Cyber Rings
    const ringGeo1 = new THREE.RingGeometry(9.4, 9.7, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(11.0, 11.2, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    scene.add(ring2);

    // Add Beacon Nodes for Hotspots
    const beaconGroup = new THREE.Group();
    HOTSPOTS.forEach((spot) => {
      const phi = (90 - spot.lat) * (Math.PI / 180);
      const theta = (spot.lon + 180) * (Math.PI / 180);
      const bx = -radius * Math.sin(phi) * Math.cos(theta);
      const by = radius * Math.cos(phi);
      const bz = radius * Math.sin(phi) * Math.sin(theta);

      const beaconGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: 0xffe600,
        wireframe: false,
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(bx, by, bz);
      beaconGroup.add(beaconMesh);
    });
    particleSphere.add(beaconGroup);

    // Mouse & Touch Drag Rotation Support
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };
    let mouseX = 0;
    let mouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.5;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 1.5;

      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotationVelocity.x = deltaY * 0.005;
      rotationVelocity.y = deltaX * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      rotationVelocity.x = deltaY * 0.005;
      rotationVelocity.y = deltaX * 0.005;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Apply drag momentum with decay
      particleSphere.rotation.y += rotationVelocity.y;
      particleSphere.rotation.x += rotationVelocity.x;
      rotationVelocity.x *= 0.95;
      rotationVelocity.y *= 0.95;

      // Base idle continuous rotation + mouse parallax
      particleSphere.rotation.y += 0.003 + mouseX * 0.01;
      particleSphere.rotation.x += mouseY * 0.005;

      innerSphere.rotation.y = -elapsedTime * 0.08;
      ring1.rotation.z = elapsedTime * 0.15;
      ring2.rotation.z = -elapsedTime * 0.12;

      // Beacon pulsing
      const scalePulse = 1 + Math.sin(elapsedTime * 4) * 0.25;
      beaconGroup.scale.set(scalePulse, scalePulse, scalePulse);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);

      geometry.dispose();
      material.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      renderer.dispose();
    };
  }, []);

  const handleReadNow = () => {
    if (!currentArticle) return;
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSelectArticle(currentArticle);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full min-h-[500px] md:min-h-[560px] rounded-3xl overflow-hidden glass-cyber-glow border border-cyan-500/30 shadow-[0_0_60px_-15px_rgba(0,240,255,0.25)] my-4 flex items-center select-none"
    >
      {/* 3D Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        title="Click and drag to spin the 3D globe"
      />

      {/* Cyber Grid Background Matrix */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.12) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Radial Gradient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 3D Drag Tip Badge */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 text-[11px] text-cyan-300 shadow-md">
        <Globe2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
        <span>3D Interactive Sphere • Drag to Spin</span>
      </div>

      {/* Foreground Holographic News Card */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 md:px-12 py-8 flex flex-col justify-center">
        {/* Pulsating Live HUD Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-rose-950/40">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Live 24×7 Intelligence</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-semibold backdrop-blur-md">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Active Beacon: {activeHotspot.name}</span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Grok AI Fact-Checked</span>
          </div>
        </div>

        {/* Featured Article Card */}
        {currentArticle ? (
          <div className="backdrop-blur-2xl bg-slate-950/80 p-5 sm:p-7 md:p-8 rounded-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative group transition-all duration-300 hover:border-cyan-400/60">
            {/* FOMO Tag Pill */}
            <div className="flex items-center justify-between mb-3">
              <span className="inline-block px-3 py-1 rounded-md bg-gradient-to-r from-amber-500/25 to-rose-500/25 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider shadow">
                {currentArticle.fomo_badge || "⚡ Trending Milestone"}
              </span>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Previous Story"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Next Story"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sensational Headline */}
            <h2
              onClick={handleReadNow}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-black text-white tracking-tight leading-tight cursor-pointer hover:text-cyan-300 transition-colors duration-200 line-clamp-2 md:line-clamp-3 mb-3"
            >
              {displayTitle}
            </h2>

            {/* Quick Summary / Hook */}
            <p className="text-slate-300 text-xs sm:text-sm md:text-base line-clamp-2 mb-5 font-normal leading-relaxed">
              {displaySummary}
            </p>

            {/* Footer Metadata & CTA Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-cyan-400 font-bold uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {currentArticle.category}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  {currentArticle.views_count.toLocaleString()} reads
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {currentArticle.read_time}
                </span>
              </div>

              <button
                onClick={handleReadNow}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Read Full 3D Dispatch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="backdrop-blur-md bg-slate-900/60 p-8 rounded-2xl border border-white/10 text-center">
            <p className="text-gray-400">Loading 3D world wire dispatches...</p>
          </div>
        )}

        {/* Carousel Slide Indicators */}
        {breakingArticles && breakingArticles.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {breakingArticles.slice(0, 6).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setActiveHotspot(HOTSPOTS[idx % HOTSPOTS.length]);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-cyan-400 shadow-[0_0_12px_#00f0ff]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Story ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
