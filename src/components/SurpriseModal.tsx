import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Sparkles, X } from 'lucide-react';

interface SurpriseModalProps {
  buttonLabel: string;
  modalTitle: string;
  modalMessage: string;
  wishHighlight: string;
  senderName: string;
  onTriggerConfetti: () => void;
}

export function SurpriseModal({
  buttonLabel,
  modalTitle,
  modalMessage,
  wishHighlight,
  senderName,
  onTriggerConfetti,
}: SurpriseModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    onTriggerConfetti();
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <section className="relative z-20 py-10 sm:py-14 px-4">
      <div className="max-w-xl mx-auto text-center">
        <button
          type="button"
          onClick={handleOpen}
          className="w-full sm:w-auto min-h-[58px] px-8 py-4 rounded-2xl bg-gradient-to-r from-[#df6498] via-[#9e76dc] to-[#d5a13f] text-white font-semibold text-base sm:text-lg shadow-xl shadow-pink-300/40 hover:brightness-105 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
        >
          <Gift className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{buttonLabel}</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="surprise-modal-title"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-[#2d1a33]/45 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-gradient-to-b from-[#fff9fc] via-[#fdf3fa] to-[#f8f1fd] border border-white p-6 sm:p-8 shadow-2xl"
            >
              {/* Mobile sheet drag indicator */}
              <div className="sm:hidden w-10 h-1.5 rounded-full bg-pink-200 mx-auto mb-5" />

              <div className="flex items-start justify-between gap-4">
                <h3
                  id="surprise-modal-title"
                  className="font-script text-3xl sm:text-4xl font-bold text-[#3a2240]"
                >
                  {modalTitle}
                </h3>
                <button
                  type="button"
                  aria-label="Close surprise message"
                  onClick={() => setIsOpen(false)}
                  className="min-h-[44px] min-w-[44px] -mt-1 -mr-1 rounded-full bg-pink-50 text-[#6c4870] flex items-center justify-center hover:bg-pink-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="mt-4 text-sm sm:text-base text-[#4d3554] leading-relaxed">
                {modalMessage}
              </p>

              <div className="mt-5 rounded-2xl bg-white/80 border border-pink-100 p-4">
                <p className="text-sm font-medium text-[#7e4778] leading-relaxed">
                  {wishHighlight}
                </p>
              </div>

              <p className="mt-4 text-right font-script text-2xl text-[#a64d79]">
                — {senderName}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onTriggerConfetti}
                  className="min-h-[48px] flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#df6498] to-[#9e76dc] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>More Confetti</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-h-[48px] px-5 py-3 rounded-2xl bg-white border border-pink-100 text-[#4d3554] font-semibold text-sm hover:bg-pink-50 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
