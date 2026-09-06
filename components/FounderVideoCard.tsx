"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, Volume2, VolumeX, Maximize2, X, MessageSquare } from "lucide-react";

interface FounderVideoCardProps {
  className?: string;
  videoSrc?: string;
  posterSrc?: string;
  founderName?: string;
  founderRole?: string;
}

export default function FounderVideoCard({
  className = "",
  videoSrc = "/videos/founder-intro.mp4",
  posterSrc = "/videos/founder-video-poster.webp",
  founderName = "Mubeen Ahmad",
  founderRole = "Founder & Lead Developer",
}: FounderVideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBigPlaying, setIsBigPlaying] = useState(true);
  const [isBigMuted, setIsBigMuted] = useState(false);
  const [bigProgress, setBigProgress] = useState(0);
  const [bigDuration, setBigDuration] = useState(64);
  const [currentTime, setCurrentTime] = useState(0);
  const [mounted, setMounted] = useState(false);

  const smallVideoRef = useRef<HTMLVideoElement>(null);
  const bigVideoRef = useRef<HTMLVideoElement>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Control small video playback via IntersectionObserver to preserve battery/CPU
  useEffect(() => {
    const video = smallVideoRef.current;
    const container = cardContainerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!isModalOpen) {
            video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [isModalOpen]);

  // Handle modal open / close & scroll locking
  useEffect(() => {
    if (!mounted) return;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      smallVideoRef.current?.pause();

      setTimeout(() => {
        if (bigVideoRef.current) {
          bigVideoRef.current.currentTime = smallVideoRef.current?.currentTime || 0;
          bigVideoRef.current.muted = false;
          setIsBigMuted(false);
          bigVideoRef.current.play().then(() => {
            setIsBigPlaying(true);
          }).catch(() => {
            if (bigVideoRef.current) {
              bigVideoRef.current.muted = true;
              setIsBigMuted(true);
              bigVideoRef.current.play();
              setIsBigPlaying(true);
            }
          });
        }
      }, 50);
    } else {
      document.body.style.overflow = "";
      if (bigVideoRef.current) {
        bigVideoRef.current.pause();
      }
      smallVideoRef.current?.play().catch(() => {});
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, mounted]);

  const toggleBigPlay = () => {
    if (!bigVideoRef.current) return;
    if (bigVideoRef.current.paused) {
      bigVideoRef.current.play();
      setIsBigPlaying(true);
    } else {
      bigVideoRef.current.pause();
      setIsBigPlaying(false);
    }
  };

  const toggleBigMute = () => {
    if (!bigVideoRef.current) return;
    bigVideoRef.current.muted = !bigVideoRef.current.muted;
    setIsBigMuted(bigVideoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!bigVideoRef.current) return;
    const cur = bigVideoRef.current.currentTime;
    const dur = bigVideoRef.current.duration || 64;
    setCurrentTime(cur);
    setBigDuration(dur);
    setBigProgress((cur / dur) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bigVideoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newFraction = Math.max(0, Math.min(1, clickX / width));
    const newTime = newFraction * bigDuration;
    bigVideoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setBigProgress(newFraction * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* 1. Small View inside the section card */}
      <div
        ref={cardContainerRef}
        onClick={() => setIsModalOpen(true)}
        className={`group/videocard relative cursor-pointer select-none rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-accent-cyan/50 hover:shadow-[0_0_40px_rgba(0,212,255,0.25)] hover:scale-[1.015] active:scale-[0.99] ${className}`}
      >
        {/* Subtle glowing ambient aura */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-accent-primary/20 to-accent-cyan/20 blur-xl opacity-40 group-hover/videocard:opacity-90 transition-opacity duration-500 pointer-events-none" />

        {/* Outer Phone / Device Bezel */}
        <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
          
          {/* Top Info Bar Overlay */}
          <div className="relative z-20 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-[0_0_8px_rgba(0,212,255,1)]" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-text-heading font-medium">
                Founder Message
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/70 text-[10px]">
              <VolumeX size={12} className="text-accent-cyan" />
              <span className="hidden sm:inline font-mono">Muted</span>
            </div>
          </div>

          {/* Video Preview */}
          <div className="absolute inset-0 z-0">
            <video
              ref={smallVideoRef}
              src={videoSrc}
              poster={posterSrc}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover object-center transform group-hover/videocard:scale-105 transition-transform duration-700"
            />
            {/* Dark glass tint so text/badges remain ultra sharp */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Center Hover Action Button */}
          <div className="relative z-20 my-auto flex flex-col items-center justify-center pointer-events-none">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent-primary/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-[0_0_25px_rgba(47,168,255,0.6)] transform group-hover/videocard:scale-115 group-hover/videocard:bg-accent-cyan transition-all duration-300">
              <Play size={20} className="ml-1 text-black fill-current" />
            </div>
            <span className="mt-2.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs text-text-heading font-medium tracking-wide shadow-lg group-hover/videocard:border-accent-cyan/50 group-hover/videocard:text-accent-cyan transition-colors">
              Click to Open & Unmute
            </span>
          </div>

          {/* Bottom Caption Bar */}
          <div className="relative z-20 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">{founderName}</span>
              <span className="text-[10px] sm:text-[11px] text-accent-cyan font-mono">{founderRole}</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover/videocard:bg-accent-primary group-hover/videocard:text-black transition-colors">
              <Maximize2 size={14} />
            </div>
          </div>

        </div>
      </div>

      {/* 2. Big View Cinema Modal (Rendered in React Portal) */}
      {mounted && isModalOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Founder Video Player"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl transition-all duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          {/* Ambient background glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-accent-primary/15 blur-[120px] pointer-events-none" />

          {/* Cinema Card Container */}
          <div className="relative w-full max-w-[420px] sm:max-w-[440px] max-h-[92dvh] flex flex-col rounded-3xl overflow-hidden bg-[#0a0f1a] border border-white/15 shadow-[0_0_80px_rgba(0,212,255,0.25)] z-10">
            
            {/* Modal Header */}
            <div className="relative z-20 flex items-center justify-between px-4 py-3 bg-[#080c16]/90 backdrop-blur-md border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-ping" />
                <div className="flex flex-col">
                  <h4 className="text-xs sm:text-sm font-semibold text-white">{founderName}</h4>
                  <span className="text-[10px] sm:text-[11px] text-accent-cyan font-mono leading-tight">{founderRole}</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all duration-200 border border-white/10 hover:border-white/30"
                aria-label="Close video"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Player Core */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden aspect-[9/16] max-h-[68dvh]">
              <video
                ref={bigVideoRef}
                src={videoSrc}
                poster={posterSrc}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onClick={toggleBigPlay}
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Center Play Overlay Indicator (When Paused) */}
              {!isBigPlaying && (
                <button
                  type="button"
                  onClick={toggleBigPlay}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all"
                  aria-label="Play video"
                >
                  <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center text-black shadow-glow-cyan transform scale-100 hover:scale-110 active:scale-95 transition-transform">
                    <Play size={26} className="ml-1 fill-current" />
                  </div>
                </button>
              )}

              {/* Sound status prompt if browser muted initial playback */}
              {isBigMuted && (
                <button
                  type="button"
                  onClick={toggleBigMute}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-accent-primary text-black font-semibold text-xs tracking-wide shadow-glow-cyan flex items-center gap-2"
                >
                  <VolumeX size={16} />
                  <span>Click to Unmute Audio 🔊</span>
                </button>
              )}
            </div>

            {/* Modal Controls & Progress Bar */}
            <div className="relative z-20 p-4 bg-[#080c16]/95 backdrop-blur-md border-t border-white/10 flex flex-col gap-3">
              
              {/* Interactive Scrub Bar */}
              <div
                onClick={handleSeek}
                className="relative w-full h-2 rounded-full bg-white/10 hover:h-2.5 cursor-pointer transition-all duration-200 group/scrub"
              >
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-accent-primary to-accent-cyan shadow-[0_0_8px_rgba(0,212,255,0.8)]"
                  style={{ width: `${bigProgress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transform -translate-x-1/2 opacity-0 group-hover/scrub:opacity-100 transition-opacity"
                  style={{ left: `${bigProgress}%` }}
                />
              </div>

              {/* Controls Toolbar */}
              <div className="flex items-center justify-between">
                
                {/* Left: Play/Pause & Mute/Unmute */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={toggleBigPlay}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all"
                    aria-label={isBigPlaying ? "Pause" : "Play"}
                  >
                    {isBigPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleBigMute}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-all"
                    aria-label={isBigMuted ? "Unmute" : "Mute"}
                  >
                    {isBigMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-accent-cyan" />}
                  </button>

                  <span className="text-[11px] font-mono text-text-body select-none">
                    {formatTime(currentTime)} / {formatTime(bigDuration)}
                  </span>
                </div>

                {/* Right: Connect Action */}
                <a
                  href="#contact"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-cyan border border-accent-primary/30 text-xs font-medium transition-all"
                >
                  <MessageSquare size={12} />
                  <span>Start Project</span>
                </a>

              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}
