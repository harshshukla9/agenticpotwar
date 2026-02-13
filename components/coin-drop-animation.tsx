"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Coin {
  id: number;
  left: number;   // % from left
  delay: number;   // animation delay in ms
  size: number;    // px
  rotate: number;  // initial rotation
  duration: number; // ms
}

function generateCoins(count: number): Coin[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,          // 20-80% from left so they land on the bag
    delay: Math.random() * 1200,            // stagger up to 1.2s (slower spread)
    size: 20 + Math.random() * 18,          // 20-38px
    rotate: Math.random() * 360,
    duration: 1800 + Math.random() * 1200, // 1.8–3s fall time (slower)
  }));
}

/** Play a short synthesized coin clink sound */
function playCoinSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    // Two short pings for a "clink" feel
    const playPing = (freq: number, startTime: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + 0.02);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    };

    const now = ctx.currentTime;
    playPing(2200, now);
    playPing(3300, now + 0.08);
    playPing(2800, now + 0.18);
    playPing(4000, now + 0.3);
    playPing(2500, now + 0.45);

    // Close context after sounds finish
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Silently fail if AudioContext not available
  }
}

interface CoinDropAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function CoinDropAnimation({ trigger, onComplete }: CoinDropAnimationProps) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [visible, setVisible] = useState(false);
  const prevTrigger = useRef(false);

  const startAnimation = useCallback(() => {
    const newCoins = generateCoins(12);
    setCoins(newCoins);
    setVisible(true);
    playCoinSound();

    // Clean up after longest animation finishes
    const maxDuration = Math.max(...newCoins.map((c) => c.delay + c.duration)) + 200;
    setTimeout(() => {
      setVisible(false);
      setCoins([]);
      onComplete?.();
    }, maxDuration);
  }, [onComplete]);

  useEffect(() => {
    if (trigger && !prevTrigger.current) {
      startAnimation();
    }
    prevTrigger.current = trigger;
  }, [trigger, startAnimation]);

  if (!visible || coins.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden
    >
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute"
          style={{
            left: `${coin.left}%`,
            top: "-10%",
            width: coin.size,
            height: coin.size,
            animationName: "coinFall",
            animationDuration: `${coin.duration}ms`,
            animationDelay: `${coin.delay}ms`,
            animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            animationFillMode: "forwards",
            transform: `rotate(${coin.rotate}deg)`,
          }}
        >
          {/* Gold coin SVG */}
          <svg viewBox="0 0 40 40" className="h-full w-full drop-shadow-md">
            <defs>
              <radialGradient id={`cg${coin.id}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="50%" stopColor="#FFD93D" />
                <stop offset="100%" stopColor="#E6A817" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill={`url(#cg${coin.id})`} stroke="#B8860B" strokeWidth="2" />
            <circle cx="20" cy="20" r="13" fill="none" stroke="#B8860B" strokeWidth="1" opacity="0.4" />
            <text
              x="20"
              y="26"
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#B8860B"
              fontFamily="serif"
            >
              $
            </text>
          </svg>
        </div>
      ))}

      <style jsx>{`
        @keyframes coinFall {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.5);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          85% {
            transform: translateY(70vh) rotate(720deg) scale(1);
            opacity: 0.9;
          }
          100% {
            transform: translateY(75vh) rotate(720deg) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
