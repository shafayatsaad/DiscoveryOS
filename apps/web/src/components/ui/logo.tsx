"use client";

// Purpose: Render the DiscoveryOS brand mark — a stylized atom/orbital SVG with glow.

import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

const sizeConfig: Record<LogoSize, { icon: number; text: string; gap: string }> = {
  sm: { icon: 28, text: "text-lg", gap: "gap-2" },
  md: { icon: 36, text: "text-xl", gap: "gap-2.5" },
  lg: { icon: 48, text: "text-2xl", gap: "gap-3" },
};

export function Logo({
  size = "md",
  showText = true,
  className,
}: {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
}) {
  const config = sizeConfig[size];

  return (
    <span className={cn("inline-flex items-center", config.gap, className)}>
      <LogoMark size={config.icon} />
      {showText && (
        <span className={cn("font-display font-extrabold tracking-tight text-on-surface", config.text)}>
          Discovery
          <span className="bg-gradient-to-r from-primary via-[#7dd3fc] to-primary bg-clip-text text-transparent">
            OS
          </span>
        </span>
      )}
    </span>
  );
}

function LogoMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-mark shrink-0"
      aria-hidden="true"
    >
      {/* Outer glow */}
      <defs>
        <radialGradient id="logo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#adc6ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ring-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#adc6ff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#adc6ff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="ring-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#adc6ff" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Ambient glow circle */}
      <circle cx="24" cy="24" r="20" fill="url(#logo-glow)" />

      {/* Orbital ring 1 — horizontal ellipse */}
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="7"
        stroke="url(#ring-gradient-1)"
        strokeWidth="1.5"
        className="logo-orbit-1"
      />

      {/* Orbital ring 2 — tilted 60° */}
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="7"
        stroke="url(#ring-gradient-2)"
        strokeWidth="1.5"
        transform="rotate(60 24 24)"
        className="logo-orbit-2"
      />

      {/* Orbital ring 3 — tilted -60° */}
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="7"
        stroke="url(#ring-gradient-1)"
        strokeWidth="1.2"
        strokeOpacity="0.5"
        transform="rotate(-60 24 24)"
        className="logo-orbit-3"
      />

      {/* Center nucleus */}
      <circle cx="24" cy="24" r="4" fill="#adc6ff" className="logo-nucleus" />
      <circle cx="24" cy="24" r="6" fill="#adc6ff" fillOpacity="0.15" />

      {/* Electron dots on orbits */}
      <circle cx="42" cy="24" r="2" fill="#7dd3fc" className="logo-electron-1" />
      <circle cx="15" cy="14" r="1.5" fill="#c4b5fd" className="logo-electron-2" />
      <circle cx="33" cy="34" r="1.5" fill="#adc6ff" fillOpacity="0.7" className="logo-electron-3" />
    </svg>
  );
}
