import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, PartyPopper, Sparkles } from 'lucide-react';
import { CountdownState, padTwo } from '../utils/istCountdown';
import { MemoryItem } from './MemoriesGallery';

interface CountdownSectionProps {
  countdown: CountdownState;
  comingSoonTitle: string;
  comingSoonSubtitle: string;
  birthdayTitle: string;
  birthdaySubtitle: string;
  featuredMemories: MemoryItem[];
  isPreviewMode: boolean;
  onTogglePreviewMode: () => void;
  onReplayCelebration: () => void;
}

export function CountdownSection({
  countdown,
  comingSoonTitle,
  comingSoonSubtitle,
  birthdayTitle,
  birthdaySubtitle,
  featuredMemories,
  isPreviewMode,
  onTogglePreviewMode,
  onReplayCelebration,
}: CountdownSectionProps) {
  const [photoOffset, setPhotoOffset] = useState(0);

  const units = [
    { label: 'Days', value: padTwo(countdown.days) },
    { label: 'Hours', value: padTwo(countdown.hours) },
    { label: 'Minutes', value: padTwo(countdown.minutes) },
    { label: 'Seconds', value: padTwo(countdown.seconds) },
  ];

  const imageMemories = featuredMemories.filter(
    (m) => m.mediaType !== 'video' && !/\.mp4$/i.test(m.mediaUrl)
  );

  const visibleThree =
    imageMemories.length >= 3
      ? [
          imageMemories[photoOffset % imageMemories.length],
          imageMemories[(photoOffset + 1) % imageMemories.length],
          imageMemories[(photoOffset + 2) % imageMemories.length],
        ]
      : imageMemories;

  const yearProgressPercent = countdown.isBirthdayMode
    ? 100
    : Math.max(4, Math.min(99, Math.round(((365 - countdown.days) / 365) * 100)));

  return (
    <section
      id="countdown"
      className="relative z-20 pt-8 pb-12 sm:pt-14 sm:pb-16 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left / Top: Title, Countdown & Interactive Controls */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-[#8c5a7a] mb-3">
                <Calendar className="w-3.5 h-3.5 text-[#c89b3c]" aria-hidden="true" />
                <span>3 December {countdown.targetYear}</span>
                <span aria-hidden="true">·</span>
                <span>00:00 IST</span>
              </p>

              {countdown.isBirthdayMode ? (
                <>
                  <h1
                    style={{ textWrap: 'balance' }}
                    className="font-script text-[56px] sm:text-7xl md:text-8xl font-bold leading-[1.08] bg-gradient-to-r from-[#b83b75] via-[#7c4dff] to-[#c8962e] bg-clip-text text-transparent pb-2"
                  >
                    {birthdayTitle}
                  </h1>
                  <p className="mt-4 text-base sm:text-lg text-[#563e5c] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    {birthdaySubtitle}
                  </p>
                </>
              ) : (
                <>
                  <h1
                    style={{ textWrap: 'balance' }}
                    className="font-script text-[54px] sm:text-7xl md:text-8xl font-bold leading-[1.08] bg-gradient-to-r from-[#b83b75] via-[#7c4dff] to-[#c8962e] bg-clip-text text-transparent pb-2"
                  >
                    {comingSoonTitle}
                  </h1>
                  <p className="mt-3 sm:mt-4 text-sm sm:text-base text-[#664b6d] max-w-lg mx-auto lg:mx-0 leading-relaxed">
                    {comingSoonSubtitle}
                  </p>

                  {/* Live Animated IST Countdown Grid */}
                  <div
                    aria-label="Live countdown to December 3 midnight IST"
                    className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5 max-w-xl mx-auto lg:mx-0"
                  >
                    {units.map((unit) => (
                      <div
                        key={unit.label}
                        className="glass-tile rounded-2xl sm:rounded-3xl py-4 sm:py-5 px-3 flex flex-col items-center justify-center relative overflow-hidden"
                      >
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={unit.value}
                            initial={{ y: 8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="tabular-nums text-4xl sm:text-[44px] font-bold tracking-tight bg-gradient-to-br from-[#b4487b] via-[#7f59b6] to-[#b8862d] bg-clip-text text-transparent"
                          >
                            {unit.value}
                          </motion.span>
                        </AnimatePresence>
                        <span className="mt-1 text-xs sm:text-sm font-medium text-[#75577c]">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Subtle progress toward Dec 3 */}
                  <div className="mt-4 max-w-xl mx-auto lg:mx-0">
                    <div className="flex items-center justify-between text-xs text-[#7d5d84] mb-1.5">
                      <span>Countdown Progress</span>
                      <span className="tabular-nums font-medium">{yearProgressPercent}% closer</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/70 overflow-hidden border border-white/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#df6498] via-[#9e76dc] to-[#d5a13f] transition-all duration-500"
                        style={{ width: `${yearProgressPercent}%` }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Hero Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={onReplayCelebration}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#e06d9c] via-[#9c7ce0] to-[#d9a74a] text-white font-semibold text-sm shadow-lg shadow-pink-300/35 hover:brightness-105 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>Pop Celebration Confetti</span>
                </button>

                {!countdown.isBirthdayToday && (
                  <button
                    type="button"
                    onClick={onTogglePreviewMode}
                    className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-2xl bg-white/80 hover:bg-white border border-pink-100 text-[#4f3356] font-semibold text-sm active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PartyPopper className="w-4 h-4 text-[#b4487b]" aria-hidden="true" />
                    <span>
                      {isPreviewMode ? 'Back to Countdown' : 'Preview Birthday Mode'}
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right / Bottom: Interactive Fanned Polaroid Spotlight */}
          {visibleThree.length > 0 && (
            <div className="lg:col-span-5 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setPhotoOffset((prev) => prev + 1)}
                aria-label="Tap to shuffle featured memories"
                className="group relative w-[260px] sm:w-[300px] h-[300px] sm:h-[330px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 rounded-3xl"
              >
                {visibleThree.map((item, idx) => {
                  const transforms = [
                    '-rotate-6 -translate-x-5 translate-y-2 scale-95 z-10',
                    'rotate-6 translate-x-5 translate-y-3 scale-95 z-20',
                    'rotate-0 translate-x-0 translate-y-0 scale-100 z-30 group-hover:scale-[1.03]',
                  ];
                  const activeTransform = transforms[idx] ?? transforms[2];

                  return (
                    <div
                      key={`${item.id}-${photoOffset}`}
                      className={`absolute inset-x-4 top-2 polaroid-frame rounded-2xl p-2.5 pb-7 transition-all duration-300 ${activeTransform}`}
                    >
                      <div className="aspect-[4/4] w-full overflow-hidden rounded-xl bg-pink-50">
                        <img
                          src={item.mediaUrl}
                          alt={item.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-[center_22%]"
                        />
                      </div>
                      <p className="mt-2 font-script text-lg text-[#4a2d50] truncate px-1 text-center">
                        {item.caption}
                      </p>
                    </div>
                  );
                })}
              </button>
              <p className="mt-1 text-xs font-medium text-[#805e86]">
                Tap stack to shuffle spotlight photos
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
