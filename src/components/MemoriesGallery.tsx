import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, PanInfo } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Film,
  Heart,
  Layers,
  LayoutGrid,
  Pause,
  Play,
  Sparkles,
  X,
} from 'lucide-react';

export interface MemoryItem {
  id: string;
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  caption: string;
  dateLabel?: string;
}

interface MemoriesGalleryProps {
  memories: MemoryItem[];
}

type MediaFilter = 'all' | 'image' | 'video';
type GalleryView = 'collage' | 'deck';

function resolveMediaType(item: MemoryItem): 'image' | 'video' {
  if (item.mediaType) return item.mediaType;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(item.mediaUrl) ? 'video' : 'image';
}

const WASHI_COLORS = [
  'bg-pink-200/75',
  'bg-purple-200/75',
  'bg-amber-200/75',
  'bg-rose-200/75',
];

function MemoryMediaContent({
  item,
  naturalAspect = false,
}: {
  item: MemoryItem;
  naturalAspect?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const type = resolveMediaType(item);

  if (failed || !item.mediaUrl) {
    return (
      <div className="w-full aspect-[4/3] flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-amber-50 text-[#7d5a7f] p-4 text-center">
        <Heart className="w-8 h-8 text-pink-400 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium">{item.caption}</span>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] bg-[#241629]">
        <video
          src={`${item.mediaUrl}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent flex items-center justify-center">
          <span className="w-13 h-13 rounded-full bg-white/92 backdrop-blur-md text-[#a64d79] shadow-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
            <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
          </span>
        </div>
        <span className="sr-only">Video memory</span>
      </div>
    );
  }

  return (
    <img
      src={item.mediaUrl}
      alt={item.caption}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={
        naturalAspect
          ? 'w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]'
          : 'w-full h-full object-cover object-[center_22%] transition-transform duration-500 group-hover:scale-[1.03]'
      }
    />
  );
}

export function MemoriesGallery({ memories }: MemoriesGalleryProps) {
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [viewMode, setViewMode] = useState<GalleryView>('collage');
  const [deckIndex, setDeckIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isStoryPlaying, setIsStoryPlaying] = useState(false);

  const counts = useMemo(() => {
    let photos = 0;
    let videos = 0;
    for (const m of memories) {
      if (resolveMediaType(m) === 'video') videos++;
      else photos++;
    }
    return { all: memories.length, photos, videos };
  }, [memories]);

  const filteredMemories = useMemo(() => {
    if (filter === 'all') return memories;
    return memories.filter((m) => resolveMediaType(m) === filter);
  }, [memories, filter]);

  useEffect(() => {
    setDeckIndex(0);
  }, [filter]);

  // Auto-advance Story Reel on photos when isStoryPlaying is active
  useEffect(() => {
    if (lightboxIndex === null || !isStoryPlaying) return;
    const current = filteredMemories[lightboxIndex];
    if (!current) return;
    if (resolveMediaType(current) === 'video') return;

    const timer = window.setTimeout(() => {
      setLightboxIndex((prev) =>
        prev === null ? null : (prev + 1) % filteredMemories.length
      );
    }, 3800);

    return () => window.clearTimeout(timer);
  }, [lightboxIndex, isStoryPlaying, filteredMemories]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStoryPlaying(false);
        setLightboxIndex(null);
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredMemories.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredMemories.length) % filteredMemories.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, filteredMemories.length]);

  const nextDeckCard = () => {
    if (filteredMemories.length === 0) return;
    setDeckIndex((prev) => (prev + 1) % filteredMemories.length);
  };

  const prevDeckCard = () => {
    if (filteredMemories.length === 0) return;
    setDeckIndex((prev) => (prev - 1 + filteredMemories.length) % filteredMemories.length);
  };

  const handleDeckDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -55 || info.velocity.x < -300) {
      nextDeckCard();
    } else if (info.offset.x > 55 || info.velocity.x > 300) {
      prevDeckCard();
    }
  };

  const startStoryReel = () => {
    setLightboxIndex(0);
    setIsStoryPlaying(true);
  };

  const activeLightbox =
    lightboxIndex !== null ? filteredMemories[lightboxIndex] : null;
  const activeLightboxType = activeLightbox ? resolveMediaType(activeLightbox) : 'image';

  // Top 3 visible cards for Interactive Deck view
  const deckCards = useMemo(() => {
    if (filteredMemories.length === 0) return [];
    const total = Math.min(3, filteredMemories.length);
    const result: { item: MemoryItem; originalIndex: number; depth: number }[] = [];
    for (let offset = total - 1; offset >= 0; offset--) {
      const idx = (deckIndex + offset) % filteredMemories.length;
      result.push({
        item: filteredMemories[idx],
        originalIndex: idx,
        depth: offset,
      });
    }
    return result;
  }, [filteredMemories, deckIndex]);

  return (
    <section id="memories" className="relative z-20 py-10 sm:py-16 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-7 sm:mb-9">
          <h2 className="font-script text-4xl sm:text-5xl font-bold text-[#3a2240]">
            Our Memory Scrapbook
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6e5276] max-w-lg mx-auto">
            Browse the masonry collage, swipe through the Polaroid deck, or play the full story reel
          </p>

          {/* Controls Toolbar: Story Reel + View Switcher + Filter Tabs */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={startStoryReel}
              className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#df6498] via-[#9e76dc] to-[#d5a13f] text-white text-xs sm:text-sm font-semibold shadow-md shadow-pink-200/50 hover:brightness-105 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Play Memory Reel</span>
            </button>

            {/* Collage vs Swipe Deck Toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('collage')}
                aria-pressed={viewMode === 'collage'}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'collage'
                    ? 'bg-[#3a2240] text-white shadow-sm'
                    : 'text-[#64486c] hover:text-[#3a2240]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Collage</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('deck')}
                aria-pressed={viewMode === 'deck'}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap inline-flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'deck'
                    ? 'bg-[#3a2240] text-white shadow-sm'
                    : 'text-[#64486c] hover:text-[#3a2240]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Swipe Deck</span>
              </button>
            </div>

            {/* Filter Tabs */}
            {counts.videos > 0 && (
              <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 shadow-sm">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    filter === 'all'
                      ? 'bg-[#b4487b] text-white shadow-sm'
                      : 'text-[#64486c] hover:text-[#3a2240]'
                  }`}
                >
                  All ({counts.all})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('image')}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    filter === 'image'
                      ? 'bg-[#b4487b] text-white shadow-sm'
                      : 'text-[#64486c] hover:text-[#3a2240]'
                  }`}
                >
                  Photos ({counts.photos})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('video')}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap inline-flex items-center gap-1 cursor-pointer ${
                    filter === 'video'
                      ? 'bg-[#b4487b] text-white shadow-sm'
                      : 'text-[#64486c] hover:text-[#3a2240]'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Videos ({counts.videos})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* VIEW 1: Masonry Washi-Tape Collage (natural proportions, 2 cols mobile -> 3 cols desktop) */}
        {viewMode === 'collage' ? (
          <div className="columns-2 md:columns-3 gap-3.5 sm:gap-6 space-y-5 sm:space-y-7 pt-2">
            {filteredMemories.map((item, idx) => {
              const washiColor = WASHI_COLORS[idx % WASHI_COLORS.length];
              const tilt =
                idx % 3 === 0
                  ? 'hover:-rotate-1'
                  : idx % 3 === 1
                  ? 'hover:rotate-1'
                  : 'hover:rotate-0';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.025, 0.2) }}
                  className="break-inside-avoid pt-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsStoryPlaying(false);
                      setLightboxIndex(idx);
                    }}
                    className={`group relative w-full text-left polaroid-frame rounded-2xl p-2 sm:p-3 pb-3.5 sm:pb-5 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 cursor-pointer ${tilt}`}
                  >
                    {/* Decorative translucent pastel washi tape */}
                    <span
                      aria-hidden="true"
                      className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-4 rounded-xs ${washiColor} backdrop-blur-xs shadow-xs -rotate-2 pointer-events-none`}
                    />

                    <div className="w-full overflow-hidden rounded-xl bg-pink-50">
                      <MemoryMediaContent item={item} naturalAspect />
                    </div>

                    <div className="pt-2.5 sm:pt-3.5 px-0.5 sm:px-1">
                      <p className="font-script text-lg sm:text-2xl text-[#3a2240] leading-snug">
                        {item.caption}
                      </p>
                      {item.dateLabel && (
                        <p className="mt-0.5 text-[11px] sm:text-xs text-[#88688e]">
                          {item.dateLabel}
                          {resolveMediaType(item) === 'video' ? ' · Tap to play' : ''}
                        </p>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: Interactive Swipeable Polaroid Card Deck */
          <div className="max-w-sm mx-auto pt-2 pb-4">
            <div className="relative h-[430px] sm:h-[470px] w-full flex items-center justify-center">
              <AnimatePresence initial={false}>
                {deckCards.map(({ item, originalIndex, depth }) => {
                  const isTop = depth === 0;
                  const scale = 1 - depth * 0.05;
                  const yOffset = depth * 12;
                  const rotate = depth === 1 ? -3 : depth === 2 ? 3 : 0;

                  return (
                    <motion.div
                      key={`${item.id}-${deckIndex}`}
                      style={{
                        zIndex: 30 - depth,
                      }}
                      initial={{ scale: 0.94, opacity: 0, y: 18 }}
                      animate={{
                        scale,
                        opacity: 1,
                        y: yOffset,
                        rotate,
                      }}
                      exit={{ x: 240, opacity: 0, rotate: 12 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                      drag={isTop ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.45}
                      onDragEnd={isTop ? handleDeckDragEnd : undefined}
                      className={`absolute inset-x-2 top-2 polaroid-frame rounded-3xl p-3 sm:p-4 pb-6 select-none ${
                        isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 rounded-xs ${
                          WASHI_COLORS[originalIndex % WASHI_COLORS.length]
                        } -rotate-1 pointer-events-none`}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          if (!isTop) return;
                          setIsStoryPlaying(false);
                          setLightboxIndex(originalIndex);
                        }}
                        className="group w-full text-left cursor-pointer focus-visible:outline-none"
                      >
                        <div className="aspect-[4/4] w-full overflow-hidden rounded-2xl bg-pink-50">
                          <MemoryMediaContent item={item} />
                        </div>
                        <div className="pt-3.5 px-1">
                          <p className="font-script text-2xl sm:text-[28px] text-[#3a2240] leading-snug line-clamp-2">
                            {item.caption}
                          </p>
                          <p className="mt-1 text-xs text-[#88688e]">
                            {item.dateLabel ?? 'Memory'} · Tap photo to enlarge
                          </p>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Deck Controls */}
            <div className="mt-5 flex items-center justify-between gap-4 px-2">
              <button
                type="button"
                aria-label="Previous memory card"
                onClick={prevDeckCard}
                className="min-h-[48px] min-w-[48px] rounded-2xl glass-tile flex items-center justify-center text-[#5c3d64] active:scale-95 transition-transform cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center">
                <p className="tabular-nums text-sm font-semibold text-[#3a2240]">
                  {deckIndex + 1} / {filteredMemories.length}
                </p>
                <p className="text-xs text-[#7d5d84]">Swipe card left or right</p>
              </div>

              <button
                type="button"
                aria-label="Next memory card"
                onClick={nextDeckCard}
                className="min-h-[48px] min-w-[48px] rounded-2xl glass-tile flex items-center justify-center text-[#5c3d64] active:scale-95 transition-transform cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Story Reel / Lightbox Viewer */}
      <AnimatePresence>
        {activeLightbox && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={activeLightbox.caption}
            onClick={() => {
              setIsStoryPlaying(false);
              setLightboxIndex(null);
            }}
            className="fixed inset-0 z-50 bg-[#1a0f1f]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl overflow-hidden bg-white/95 shadow-2xl border border-white"
            >
              {/* Story Progress Bars */}
              <div className="px-4 pt-3 pb-2 bg-[#1a0f1f] flex items-center gap-1">
                {filteredMemories.map((m, i) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-label={`Jump to memory ${i + 1}`}
                    onClick={() => setLightboxIndex(i)}
                    className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/25 cursor-pointer"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        i < lightboxIndex
                          ? 'w-full bg-pink-300'
                          : i === lightboxIndex
                          ? 'w-full bg-gradient-to-r from-pink-400 to-amber-300'
                          : 'w-0'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="relative w-full bg-[#1a0f1f] flex items-center justify-center min-h-[260px]">
                {activeLightboxType === 'video' ? (
                  <video
                    key={activeLightbox.id}
                    src={activeLightbox.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                    onEnded={() => {
                      if (isStoryPlaying) {
                        setLightboxIndex((lightboxIndex + 1) % filteredMemories.length);
                      }
                    }}
                    className="max-h-[68dvh] w-full object-contain"
                  />
                ) : (
                  <motion.img
                    key={activeLightbox.id}
                    src={activeLightbox.mediaUrl}
                    alt={activeLightbox.caption}
                    referrerPolicy="no-referrer"
                    initial={{ scale: 1.03, opacity: 0.75 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="max-h-[68dvh] w-full object-contain"
                  />
                )}

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={isStoryPlaying ? 'Pause slideshow' : 'Play slideshow'}
                    onClick={() => setIsStoryPlaying((p) => !p)}
                    className="min-h-[44px] px-3.5 rounded-full bg-white/90 backdrop-blur-md text-[#3a2240] text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-white cursor-pointer"
                  >
                    {isStoryPlaying ? (
                      <>
                        <Pause className="w-4 h-4" aria-hidden="true" />
                        <span>Pause Reel</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" aria-hidden="true" />
                        <span>Auto Play</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Close memory viewer"
                    onClick={() => {
                      setIsStoryPlaying(false);
                      setLightboxIndex(null);
                    }}
                    className="min-h-[44px] min-w-[44px] rounded-full bg-white/90 backdrop-blur-md text-[#3a2240] flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-gradient-to-r from-[#fff9fc] to-[#faf4ff]">
                <div className="min-w-0">
                  <p className="font-script text-2xl sm:text-3xl text-[#3a2240] leading-tight">
                    {activeLightbox.caption}
                  </p>
                  <p className="mt-1 text-xs text-[#88688e] tabular-nums">
                    {activeLightbox.dateLabel ? `${activeLightbox.dateLabel} · ` : ''}
                    {lightboxIndex + 1} of {filteredMemories.length}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label="Previous memory"
                    onClick={() =>
                      setLightboxIndex(
                        (lightboxIndex - 1 + filteredMemories.length) %
                          filteredMemories.length
                      )
                    }
                    className="min-h-[44px] min-w-[44px] rounded-2xl bg-pink-50 text-[#5c3d64] flex items-center justify-center hover:bg-pink-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next memory"
                    onClick={() =>
                      setLightboxIndex((lightboxIndex + 1) % filteredMemories.length)
                    }
                    className="min-h-[44px] min-w-[44px] rounded-2xl bg-pink-50 text-[#5c3d64] flex items-center justify-center hover:bg-pink-100 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
