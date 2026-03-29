import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { WeatherTheme } from '@/types/weather';

interface WeatherBackgroundProps {
  theme: WeatherTheme;
  children: React.ReactNode;
}

export default function WeatherBackground({ theme, children }: WeatherBackgroundProps) {
  const gradient = useMemo(() => {
    const gradients: Record<WeatherTheme, string> = {
      sunny: 'linear-gradient(135deg, #f59e0b, #ea580c, #dc2626)',
      cloudy: 'linear-gradient(135deg, #64748b, #94a3b8, #cbd5e1)',
      rainy: 'linear-gradient(135deg, #1e3a5f, #2563eb, #3b82f6)',
      snowy: 'linear-gradient(135deg, #94a3b8, #cbd5e1, #e2e8f0)',
      night: 'linear-gradient(135deg, #0f172a, #1e1b4b, #312e81)',
      stormy: 'linear-gradient(135deg, #1f2937, #374151, #1e293b)',
      default: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
    };
    return gradients[theme];
  }, [theme]);

  const isRainy = theme === 'rainy' || theme === 'stormy';
  const isSnowy = theme === 'snowy';

  return (
    <div
      className="min-h-screen weather-gradient relative overflow-hidden"
      style={{ background: gradient }}
    >
      {/* Animated particles */}
      {isRainy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-white/20"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${15 + Math.random() * 25}px`,
              }}
              animate={{
                y: ['-10vh', '110vh'],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {isSnowy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/40"
              style={{ left: `${Math.random() * 100}%` }}
              animate={{
                y: ['-5vh', '105vh'],
                x: [0, Math.random() * 40 - 20],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* Stars for night */}
      {theme === 'night' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white animate-pulse-soft"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
