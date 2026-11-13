import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Plus, Send, Sparkles, Wand2, X } from 'lucide-react';

export interface BirthdayWish {
  id: string;
  title: string;
  message: string;
  from: string;
}

interface WishesSectionProps {
  friendName: string;
  initialWishes: BirthdayWish[];
  onWishCelebration: () => void;
}

const STORAGE_KEY = 'anushika_custom_wishes_v1';

const CARD_GRADIENTS = [
  'from-[#fff4f9] via-[#fffafc] to-[#f8effe]',
  'from-[#f6f1ff] via-[#fcfaff] to-[#fff6ea]',
  'from-[#fff8ee] via-[#fffcf7] to-[#fdeef6]',
];

export function WishesSection({
  friendName,
  initialWishes,
  onWishCelebration,
}: WishesSectionProps) {
  const [customWishes, setCustomWishes] = useState<BirthdayWish[]>([]);
  const [spotlightWish, setSpotlightWish] = useState<BirthdayWish | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [senderInput, setSenderInput] = useState('');
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCustomWishes(parsed);
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const allWishes = [...customWishes, ...initialWishes];

  const pullRandomWish = () => {
    if (allWishes.length === 0) return;
    const pool =
      allWishes.length > 1 && spotlightWish
        ? allWishes.filter((w) => w.id !== spotlightWish.id)
        : allWishes;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setSpotlightWish(picked);
    onWishCelebration();
  };

  const handleAddWish = (e: FormEvent) => {
    e.preventDefault();
    const trimmedMsg = messageInput.trim();
    if (!trimmedMsg) return;

    const newWish: BirthdayWish = {
      id: `custom-${Date.now()}`,
      title: 'A Special Wish',
      message: trimmedMsg,
      from: senderInput.trim() || 'With Love',
    };

    const nextCustom = [newWish, ...customWishes];
    setCustomWishes(nextCustom);
    setSpotlightWish(newWish);
    setMessageInput('');
    setSenderInput('');
    setShowAddForm(false);
    onWishCelebration();

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCustom));
    } catch {
      // Ignore storage write errors
    }
  };

  const removeCustomWish = (id: string) => {
    const nextCustom = customWishes.filter((w) => w.id !== id);
    setCustomWishes(nextCustom);
    if (spotlightWish?.id === id) setSpotlightWish(null);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCustom));
    } catch {
      // Ignore storage write errors
    }
  };

  return (
    <section id="wishes" className="relative z-20 py-10 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-script text-4xl sm:text-5xl font-bold text-[#3a2240]">
            Wishes &amp; Blessings for {friendName}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6e5276] max-w-lg mx-auto">
            Draw a wish from the jar or pin your own heartfelt birthday note
          </p>

          {/* Interactive Wishing Jar + Add Wish Actions */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={pullRandomWish}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#df6498] via-[#9e76dc] to-[#d5a13f] text-white text-sm font-semibold shadow-lg shadow-pink-200/50 hover:brightness-105 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" aria-hidden="true" />
              <span>Pick a Wish From the Jar</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-2xl bg-white/85 hover:bg-white border border-pink-100 text-[#4f3356] text-sm font-semibold active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#b4487b]" aria-hidden="true" />
              <span>{showAddForm ? 'Close Form' : 'Write a Wish'}</span>
            </button>
          </div>
        </div>

        {/* Spotlight Drawn Wish Card */}
        <AnimatePresence mode="wait">
          {spotlightWish && (
            <motion.div
              key={spotlightWish.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl mx-auto mb-8 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#fff3f8] via-[#f7f0ff] to-[#fff8e8] border-2 border-[#f3d18d]/75 shadow-xl shadow-pink-200/35 relative"
            >
              <button
                type="button"
                aria-label="Dismiss spotlight wish"
                onClick={() => setSpotlightWish(null)}
                className="absolute top-3 right-3 min-h-[44px] min-w-[44px] rounded-full hover:bg-white/70 text-[#7d5d84] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#b4487b] mb-2">
                <Sparkles className="w-4 h-4 text-[#c89b3c]" aria-hidden="true" />
                <span>Drawn From the Wishing Jar</span>
              </div>

              <h3 className="font-script text-3xl font-bold text-[#3a2240]">
                {spotlightWish.title}
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-[#493050] leading-relaxed">
                &ldquo;{spotlightWish.message}&rdquo;
              </p>
              <p className="mt-4 font-script text-2xl text-[#9e4776] text-right">
                — {spotlightWish.from}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Custom Wish Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              onSubmit={handleAddWish}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto mb-8 glass-card rounded-3xl p-5 sm:p-7 space-y-4"
            >
              <h3 className="font-script text-3xl font-bold text-[#3a2240]">
                Leave a Birthday Wish
              </h3>
              <div>
                <label
                  htmlFor="wish-sender"
                  className="block text-xs font-semibold text-[#6b4d73] mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="wish-sender"
                  type="text"
                  value={senderInput}
                  onChange={(e) => setSenderInput(e.target.value)}
                  placeholder="e.g., Hirok or Bestie"
                  maxLength={40}
                  className="w-full min-h-[46px] px-4 rounded-2xl bg-white/85 border border-pink-100 text-sm text-[#3a2240] placeholder:text-[#a88dad] focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div>
                <label
                  htmlFor="wish-message"
                  className="block text-xs font-semibold text-[#6b4d73] mb-1.5"
                >
                  Your Wish for {friendName}
                </label>
                <textarea
                  id="wish-message"
                  rows={3}
                  required
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Write a warm birthday wish for ${friendName}...`}
                  maxLength={280}
                  className="w-full p-4 rounded-2xl bg-white/85 border border-pink-100 text-sm text-[#3a2240] placeholder:text-[#a88dad] focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="min-h-[44px] px-4 rounded-2xl text-sm font-medium text-[#6b4d73] hover:bg-pink-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#df6498] to-[#9e76dc] text-white text-sm font-semibold inline-flex items-center gap-2 hover:brightness-105 active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>Pin Wish</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Wishes Wall Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {allWishes.map((wish, idx) => {
            const gradient = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
            const isCustom = wish.id.startsWith('custom-');

            return (
              <motion.article
                key={wish.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.2) }}
                className={`relative rounded-3xl p-6 bg-gradient-to-br ${gradient} border border-white/95 shadow-lg shadow-pink-200/20 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-script text-2xl font-bold text-[#8a3f6b]">
                      {wish.title}
                    </span>
                    {isCustom ? (
                      <button
                        type="button"
                        aria-label="Remove wish"
                        onClick={() => removeCustomWish(wish.id)}
                        className="min-h-[36px] min-w-[36px] -mr-2 rounded-full text-[#9c7ca3] hover:text-[#3a2240] hover:bg-white/60 flex items-center justify-center cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <Heart
                        className="w-4 h-4 text-pink-400 shrink-0"
                        fill="#f9a8d4"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <p className="text-sm sm:text-[15px] text-[#493050] leading-relaxed">
                    {wish.message}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-pink-100/80 flex items-center justify-between text-xs text-[#83628a]">
                  <span>Birthday Blessing</span>
                  <span className="font-script text-xl font-bold text-[#a64d79]">
                    — {wish.from}
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
