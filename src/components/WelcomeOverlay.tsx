import { motion } from 'motion/react';
import { Music, Sparkles } from 'lucide-react';

interface WelcomeOverlayProps {
  friendName: string;
  senderName: string;
  onStartWithMusic: () => void;
  onStartMuted: () => void;
}

export function WelcomeOverlay({
  friendName,
  senderName,
  onStartWithMusic,
  onStartMuted,
}: WelcomeOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-gradient-to-br from-[#fff5fa] via-[#f5ecfe] to-[#fdf3e2]"
    >
      {/* Soft glowing backdrop */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-pink-200/50 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-purple-200/50 blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md glass-card rounded-3xl p-7 sm:p-10 text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#df6498] via-[#9e76dc] to-[#d5a13f] text-white flex items-center justify-center shadow-lg shadow-pink-200/60">
          <Music className="w-7 h-7" aria-hidden="true" />
        </div>

        <p className="mt-5 text-xs sm:text-sm font-medium text-[#8a5d8b]">
          A Birthday Surprise From {senderName}
        </p>

        <h1
          style={{ textWrap: 'balance' }}
          className="mt-2 font-script text-5xl sm:text-6xl font-bold leading-[1.1] bg-gradient-to-r from-[#b83b75] via-[#7c4dff] to-[#c8962e] bg-clip-text text-transparent pb-1"
        >
          Happy Birthday {friendName} 🎂
        </h1>

        <p className="mt-3 text-sm sm:text-base text-[#5e4266] leading-relaxed">
          Turn your sound up and tap below to open your keepsake with music.
        </p>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={onStartWithMusic}
            className="w-full min-h-[56px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#df6498] via-[#9e76dc] to-[#d5a13f] text-white font-semibold text-base shadow-xl shadow-pink-300/45 hover:brightness-105 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            <span>Tap to Start &amp; Play Music</span>
          </button>

          <button
            type="button"
            onClick={onStartMuted}
            className="w-full min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#7b5b82] hover:text-[#3a2240] transition-colors cursor-pointer"
          >
            Open without music
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
