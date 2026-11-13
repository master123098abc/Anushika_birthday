import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, MailOpen, Sparkles } from 'lucide-react';

interface InteractiveLetterProps {
  heading: string;
  greeting: string;
  paragraphs: string[];
  signOff: string;
  senderName: string;
  friendName: string;
}

export function InteractiveLetter({
  heading,
  greeting,
  paragraphs,
  signOff,
  senderName,
  friendName,
}: InteractiveLetterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="message" className="relative z-20 py-10 sm:py-14 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="font-script text-4xl sm:text-5xl font-bold text-[#3a2240]">
            {heading}
          </h2>
          <p className="mt-1.5 text-sm text-[#6e5276]">
            {isOpen ? 'Fold or keep reading anytime' : `Tap the wax seal to open your letter, ${friendName}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="envelope-closed"
              type="button"
              onClick={() => setIsOpen(true)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full relative overflow-hidden rounded-3xl p-8 sm:p-12 glass-card text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              {/* Envelope flap geometric lines */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-pink-100/60 to-transparent pointer-events-none"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 92%)',
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-18 h-18 rounded-full bg-gradient-to-br from-[#d9538f] via-[#b45bb8] to-[#c89b3c] shadow-lg shadow-pink-300/50 flex items-center justify-center text-white ring-4 ring-white/85">
                  <Heart className="w-8 h-8 fill-white/90" aria-hidden="true" />
                </div>

                <p className="mt-5 font-script text-3xl sm:text-4xl font-bold text-[#3a2240]">
                  For {friendName}
                </p>
                <p className="mt-2 text-xs sm:text-sm font-medium text-[#8a5d8b] inline-flex items-center gap-1.5">
                  <MailOpen className="w-4 h-4 text-[#c89b3c]" aria-hidden="true" />
                  <span>Tap to unseal letter from {senderName}</span>
                </p>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="envelope-open"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-pink-100/80">
                <div className="flex items-center gap-2 text-xs font-medium text-[#8a5d8b]">
                  <Sparkles className="w-4 h-4 text-[#c89b3c]" aria-hidden="true" />
                  <span>Personal Keepsake</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-h-[40px] px-3.5 rounded-xl bg-pink-50/80 hover:bg-pink-100 text-xs font-medium text-[#70466c] transition-colors cursor-pointer"
                >
                  Fold Envelope
                </button>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#4c3453] leading-relaxed">
                <p className="font-script text-2xl sm:text-3xl font-bold text-[#3a2240]">
                  {greeting}
                </p>
                {paragraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>

              <div className="mt-7 pt-5 border-t border-pink-100/80 flex flex-col items-end">
                <span className="text-xs sm:text-sm text-[#7e5e84]">
                  {signOff}
                </span>
                <span className="font-script text-3xl font-bold text-[#a64d79] mt-0.5">
                  {senderName}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
