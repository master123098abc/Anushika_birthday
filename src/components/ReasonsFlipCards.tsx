import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, RotateCcw, RotateCw, Sparkles } from 'lucide-react';

export interface SpecialReason {
  id: string;
  frontTitle: string;
  backMessage: string;
}

interface ReasonsFlipCardsProps {
  reasons: SpecialReason[];
  onAllRevealed?: () => void;
}

export function ReasonsFlipCards({ reasons, onAllRevealed }: ReasonsFlipCardsProps) {
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [celebratedAll, setCelebratedAll] = useState(false);

  const revealedCount = reasons.filter((r) => flippedIds[r.id]).length;

  const toggleCard = (id: string) => {
    setFlippedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const nextCount = reasons.filter((r) => next[r.id]).length;
      if (nextCount === reasons.length && !celebratedAll) {
        setCelebratedAll(true);
        onAllRevealed?.();
      }
      return next;
    });
  };

  const revealAll = () => {
    const all: Record<string, boolean> = {};
    for (const r of reasons) all[r.id] = true;
    setFlippedIds(all);
    if (!celebratedAll) {
      setCelebratedAll(true);
      onAllRevealed?.();
    }
  };

  const resetAll = () => {
    setFlippedIds({});
    setCelebratedAll(false);
  };

  return (
    <section id="special" className="relative z-20 py-10 sm:py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-script text-4xl sm:text-5xl font-bold text-[#3a2240]">
            Reasons Why You&apos;re Special
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6e5276]">
            Tap each card to flip and unlock —{' '}
            <span className="tabular-nums font-semibold text-[#9e4776]">
              {revealedCount} / {reasons.length} revealed
            </span>
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            {revealedCount < reasons.length ? (
              <button
                type="button"
                onClick={revealAll}
                className="min-h-[44px] px-4 py-2 rounded-2xl bg-white/80 hover:bg-white border border-pink-100 text-xs sm:text-sm font-medium text-[#5c3d64] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#c89b3c]" aria-hidden="true" />
                <span>Reveal All Cards</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={resetAll}
                className="min-h-[44px] px-4 py-2 rounded-2xl bg-white/80 hover:bg-white border border-pink-100 text-xs sm:text-sm font-medium text-[#5c3d64] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#9e76dc]" aria-hidden="true" />
                <span>Flip All Back</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reasons.map((reason, idx) => {
            const isFlipped = Boolean(flippedIds[reason.id]);

            return (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className="perspective-1000"
              >
                <button
                  type="button"
                  aria-pressed={isFlipped}
                  onClick={() => toggleCard(reason.id)}
                  className="relative w-full min-h-[192px] text-left rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 cursor-pointer"
                >
                  <div
                    className={`relative w-full min-h-[192px] transition-transform duration-500 preserve-3d ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front Face */}
                    <div className="absolute inset-0 backface-hidden glass-card rounded-3xl p-6 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs font-medium text-[#98729e]">
                        <span className="tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                        <Sparkles className="w-4 h-4 text-[#c89b3c]" aria-hidden="true" />
                      </div>

                      <h3 className="font-script text-3xl sm:text-[32px] font-bold text-[#3f2547] leading-snug">
                        {reason.frontTitle}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#9e537d]">
                        <span>Tap to reveal</span>
                        <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 flex flex-col justify-between bg-gradient-to-br from-[#fce7f3]/95 via-[#f3e8ff]/95 to-[#fef3c7]/92 border-2 border-[#f5d08a]/70 shadow-lg shadow-pink-200/40">
                      <div className="flex items-center justify-between text-xs font-medium text-[#8a5d8b]">
                        <span>{reason.frontTitle}</span>
                        <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                      </div>

                      <p className="text-sm sm:text-base text-[#3b2242] leading-relaxed font-medium">
                        {reason.backMessage}
                      </p>

                      <span className="text-xs text-[#916995]">
                        Tap to flip back
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
