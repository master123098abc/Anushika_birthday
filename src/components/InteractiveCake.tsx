import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, RotateCcw, Sparkles } from 'lucide-react';

interface InteractiveCakeProps {
  friendName: string;
  onAllCandlesBlown: () => void;
}

const CANDLE_POSITIONS = [68, 104, 140, 176, 212];

export function InteractiveCake({
  friendName,
  onAllCandlesBlown,
}: InteractiveCakeProps) {
  const [litCandles, setLitCandles] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
  ]);
  const [wishGranted, setWishGranted] = useState(false);

  const litCount = litCandles.filter(Boolean).length;

  const blowCandle = (idx: number) => {
    if (!litCandles[idx]) return;
    const next = [...litCandles];
    next[idx] = false;
    setLitCandles(next);

    if (next.every((c) => !c)) {
      setWishGranted(true);
      onAllCandlesBlown();
    }
  };

  const blowAllCandles = () => {
    setLitCandles([false, false, false, false, false]);
    setWishGranted(true);
    onAllCandlesBlown();
  };

  const relightAll = () => {
    setLitCandles([true, true, true, true, true]);
    setWishGranted(false);
  };

  return (
    <section className="relative z-20 py-10 sm:py-14 px-4">
      <div className="max-w-xl mx-auto glass-card rounded-3xl p-6 sm:p-9 text-center">
        <h2 className="font-script text-4xl sm:text-5xl font-bold text-[#3a2240]">
          Make a Birthday Wish
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#6e5276]">
          {wishGranted
            ? `Wish sent to the universe for ${friendName}!`
            : 'Tap each glowing candle to blow it out'}
        </p>

        {/* Interactive SVG Cake with 5 Tappable Candles */}
        <div className="mt-6 flex justify-center">
          <svg
            viewBox="0 0 280 210"
            className="w-full max-w-[270px] h-auto select-none"
            role="img"
            aria-label="Interactive birthday cake with five candles"
          >
            {/* Cake Plate */}
            <ellipse cx="140" cy="190" rx="112" ry="12" fill="#F3E8FF" />
            <ellipse cx="140" cy="187" rx="104" ry="9" fill="#FFFFFF" />

            {/* Bottom Cake Layer */}
            <rect x="48" y="132" width="184" height="54" rx="16" fill="#F9A8D4" />
            <path
              d="M48 144 Q71 156 94 144 T140 144 T186 144 T232 144 L232 132 Q232 126 220 126 L60 126 Q48 126 48 132 Z"
              fill="#FCE7F3"
            />

            {/* Top Cake Layer */}
            <rect x="74" y="84" width="132" height="48" rx="14" fill="#DDD6FE" />
            <path
              d="M74 96 Q90 107 107 96 T140 96 T173 96 T206 96 L206 84 Q206 78 194 78 L86 78 Q74 78 74 84 Z"
              fill="#FFFDF9"
            />

            {/* Gold decorative pearls */}
            {[86, 113, 140, 167, 194].map((x) => (
              <circle key={x} cx={x} cy="126" r="3" fill="#E5B95C" />
            ))}

            {/* 5 Interactive Candles */}
            {CANDLE_POSITIONS.map((cx, idx) => {
              const isLit = litCandles[idx];
              return (
                <g
                  key={cx}
                  onClick={() => blowCandle(idx)}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={
                    isLit
                      ? `Blow out candle ${idx + 1}`
                      : `Candle ${idx + 1} blown out`
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      blowCandle(idx);
                    }
                  }}
                >
                  {/* Generous invisible tap target */}
                  <rect
                    x={cx - 16}
                    y="12"
                    width="32"
                    height="70"
                    fill="transparent"
                  />
                  {/* Candle body */}
                  <rect
                    x={cx - 4.5}
                    y="44"
                    width="9"
                    height="36"
                    rx="3"
                    fill={idx % 2 === 0 ? '#FBCFE8' : '#FDE68A'}
                  />
                  {/* Wick */}
                  <line
                    x1={cx}
                    y1="44"
                    x2={cx}
                    y2="37"
                    stroke="#6B4F6D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Flickering Flame */}
                  {isLit ? (
                    <g className="animate-flame">
                      <ellipse
                        cx={cx}
                        cy="28"
                        rx="8"
                        ry="11"
                        fill="#FDE68A"
                        fillOpacity="0.45"
                      />
                      <path
                        d={`M${cx} 16 C${cx + 5} 24, ${cx + 5} 34, ${cx} 36 C${cx - 5} 34, ${cx - 5} 24, ${cx} 16 Z`}
                        fill="#F59E0B"
                      />
                      <path
                        d={`M${cx} 22 C${cx + 2.5} 27, ${cx + 2.5} 33, ${cx} 35 C${cx - 2.5} 33, ${cx - 2.5} 27, ${cx} 22 Z`}
                        fill="#FEF3C7"
                      />
                    </g>
                  ) : (
                    <path
                      d={`M${cx} 34 Q${cx + 3} 28 ${cx - 1} 22`}
                      stroke="#C4B5FD"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.6"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <AnimatePresence mode="wait">
          {wishGranted ? (
            <motion.div
              key="wish-granted"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-4"
            >
              <div className="rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50 border border-white p-4">
                <p className="text-sm sm:text-base font-medium text-[#4d2f52]">
                  All candles blown out! May every single wish you made today come true, {friendName}.
                </p>
              </div>
              <button
                type="button"
                onClick={relightAll}
                className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-white border border-pink-100 text-[#5e3d63] text-sm font-medium inline-flex items-center gap-2 hover:bg-pink-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Relight Candles</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="blow-controls"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <span className="text-xs font-medium text-[#7b5b82] tabular-nums">
                {litCount} of 5 candles lit
              </span>
              <button
                type="button"
                onClick={blowAllCandles}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#df6498] via-[#9e76dc] to-[#d5a13f] text-white text-sm font-semibold shadow-md shadow-pink-200/50 hover:brightness-105 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4" aria-hidden="true" />
                <span>Blow All Candles &amp; Make a Wish</span>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
