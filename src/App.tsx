import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

import {
  BirthdayBalloons,
  ConfettiCanvas,
  FloatingAmbient,
} from './components/CelebrationEffects';
import { CountdownSection } from './components/CountdownSection';
import { InteractiveCake } from './components/InteractiveCake';
import { InteractiveLetter } from './components/InteractiveLetter';
import { MemoriesGallery, MemoryItem } from './components/MemoriesGallery';
import { ReasonsFlipCards, SpecialReason } from './components/ReasonsFlipCards';
import { SurpriseModal } from './components/SurpriseModal';
import { WelcomeOverlay } from './components/WelcomeOverlay';
import { BirthdayWish, WishesSection } from './components/WishesSection';
import { getISTCountdown } from './utils/istCountdown';
import { DreamyMusicController } from './utils/musicPlayer';

/**
 * ============================================================================
 *  EDIT EVERYTHING HERE — BIRTHDAY_CONFIG
 *  Change the name, personal message, photo/video URLs, captions, wishes,
 *  flip cards, or surprise text in this one object.
 * ============================================================================
 */
export const BIRTHDAY_CONFIG = {
  friendName: 'Anushika',
  senderName: 'Hirok',

  // Birthday date in IST (Asia/Kolkata): 14 December
  birthdayMonth: 12,
  birthdayDay: 14,

  // Tip: Set this to `true` to start directly in Birthday Mode (or use the hero button)
  forceBirthdayMode: false,

  // Hero headings
  hero: {
    comingSoonTitle: 'Happy Birthday Anushika 🎂',
    comingSoonSubtitle:
      'Counting down every second in IST until 14 December — your special day is almost here 🎉',
    birthdayTitle: 'Happy Birthday Anushika 🎂',
    birthdaySubtitle:
      'Today is all about celebrating you, your laughter, and every wonderful memory we share.',
  },

  // Section 2: Personal Note from Hirok (edit these paragraphs anytime)
  personalMessage: {
    heading: 'A Note From Hirok',
    greeting: 'Dear Anushika,',
    paragraphs: [
      'Having you as my best friend has been one of the greatest blessings of my life. No matter how busy life gets, talking to you always feels like coming home—full of comfort, terrible jokes, and genuine laughter.',
      'Thank you for every late-night conversation, every quiet moment where you simply understood without needing words, and every time you showed up when it mattered most.',
      'As 14 December gets closer, I just want you to know how deeply appreciated you are. Here is to many more sunsets, spontaneous coffee runs, and unforgettable years ahead.',
    ],
    signOff: 'Always your best friend,',
  },

  // Section 3: Our Memories (All 18 uploaded photos + 2 videos from /public/memories/)
  memories: [
    {
      id: 'mem-1',
      mediaUrl:
        '/memories/Screenshot_2026-10-13-18-12-07-38_1c337646f29875672b5a61192b9010f9.jpg',
      mediaType: 'image',
      caption: 'A little moment worth saving forever.',
      dateLabel: '13 Oct',
    },
    {
      id: 'mem-2',
      mediaUrl: '/memories/IMG-20261101-WA0044.jpg',
      mediaType: 'image',
      caption: 'Smiles that make every day brighter.',
      dateLabel: '1 Nov',
    },
    {
      id: 'mem-3',
      mediaUrl: '/memories/IMG-20261101-WA0045.jpg',
      mediaType: 'image',
      caption: 'Good vibes and unforgettable company.',
      dateLabel: '1 Nov',
    },
    {
      id: 'mem-4',
      mediaUrl: '/memories/IMG-20261101-WA0046.jpg',
      mediaType: 'image',
      caption: 'Moments I always look back on with a smile.',
      dateLabel: '1 Nov',
    },
    {
      id: 'mem-5',
      mediaUrl: '/memories/IMG-20261102-WA0014.jpg',
      mediaType: 'image',
      caption: 'Candid captures and endless laughs.',
      dateLabel: '2 Nov',
    },
    {
      id: 'mem-6',
      mediaUrl: '/memories/IMG-20261102-WA0016.jpg',
      mediaType: 'image',
      caption: 'Just us being our favorite chaotic selves.',
      dateLabel: '2 Nov',
    },
    {
      id: 'mem-7',
      mediaUrl: '/memories/IMG-20261102-WA0018.jpg',
      mediaType: 'image',
      caption: 'Every frame holds a story.',
      dateLabel: '2 Nov',
    },
    {
      id: 'mem-8',
      mediaUrl: '/memories/IMG-20261102-WA0020.jpg',
      mediaType: 'image',
      caption: 'Another favorite memory in the collection.',
      dateLabel: '2 Nov',
    },
    {
      id: 'mem-9',
      mediaUrl: '/memories/VID-20261103-WA0030.mp4',
      mediaType: 'video',
      caption: 'Hit play to relive this moment.',
      dateLabel: '3 Nov',
    },
    {
      id: 'mem-10',
      mediaUrl: '/memories/IMG-20261103-WA0063.jpg',
      mediaType: 'image',
      caption: 'Pure joy caught in a single snapshot.',
      dateLabel: '3 Nov',
    },
    {
      id: 'mem-11',
      mediaUrl: '/memories/IMG-20261103-WA0064.jpg',
      mediaType: 'image',
      caption: 'Time flies, but memories like this stay.',
      dateLabel: '3 Nov',
    },
    {
      id: 'mem-12',
      mediaUrl: '/memories/IMG-20261103-WA0065.jpg',
      mediaType: 'image',
      caption: 'One of those days that felt effortless.',
      dateLabel: '3 Nov',
    },
    {
      id: 'mem-13',
      mediaUrl: '/memories/IMG-20261103-WA0066.jpg',
      mediaType: 'image',
      caption: 'Always shining, always uniquely you.',
      dateLabel: '3 Nov',
    },
    {
      id: 'mem-14',
      mediaUrl: '/memories/IMG-20261103-WA0069.jpg',
      mediaType: 'image',
      caption: 'Little moments that mean the most.',
      dateLabel: '3 Nov',
    },
    {
      id: 'mem-15',
      mediaUrl: '/memories/IMG-20261104-WA0020.jpg',
      mediaType: 'image',
      caption: 'Here is to many more days like this.',
      dateLabel: '4 Nov',
    },
    {
      id: 'mem-16',
      mediaUrl: '/memories/VID_20261106_074134_230.mp4',
      mediaType: 'video',
      caption: 'A special video clip from our memories.',
      dateLabel: '6 Nov',
    },
    {
      id: 'mem-17',
      mediaUrl: '/memories/IMG_20261106_214303_408.jpg',
      mediaType: 'image',
      caption: 'Evening glow and warm memories.',
      dateLabel: '6 Nov',
    },
    {
      id: 'mem-18',
      mediaUrl: '/memories/IMG-20261108-WA0020.jpg',
      mediaType: 'image',
      caption: 'Always grateful for moments like these.',
      dateLabel: '8 Nov',
    },
    {
      id: 'mem-19',
      mediaUrl: '/memories/IMG-20261109-WA0084.jpg',
      mediaType: 'image',
      caption: 'Counting down to celebrating you.',
      dateLabel: '9 Nov',
    },
    {
      id: 'mem-20',
      mediaUrl: '/memories/IMG-20261112-WA0035.jpg',
      mediaType: 'image',
      caption: 'Saved right before the birthday countdown began.',
      dateLabel: '12 Nov',
    },
  ] as MemoryItem[],

  // Section 4: Birthday Wishes & Blessings (edit or add your own wishes!)
  wishes: [
    {
      id: 'wish-1',
      title: 'Endless Smiles',
      message:
        'May every morning wake you up with a reason to smile, and every night end with peace in your heart.',
      from: 'Hirok',
    },
    {
      id: 'wish-2',
      title: 'Big Dreams Come True',
      message:
        'I hope this new chapter brings you closer to every single dream you have been quietly working toward.',
      from: 'Hirok',
    },
    {
      id: 'wish-3',
      title: 'Good Health & Calm',
      message:
        'Wishing you gentle days, zero stress, strong coffee, and all the good energy you give to others.',
      from: 'Hirok',
    },
    {
      id: 'wish-4',
      title: 'Unforgettable Adventures',
      message:
        'Here is to spontaneous plans, long drives, new places, and stories we will still laugh about years from now.',
      from: 'Hirok',
    },
    {
      id: 'wish-5',
      title: 'Always Surrounded by Love',
      message:
        'May you always feel just as loved, valued, and celebrated as you make everyone around you feel.',
      from: 'Hirok',
    },
    {
      id: 'wish-6',
      title: 'Best Year Yet',
      message:
        '14 December belongs to you—may the year ahead be your happiest, brightest, most magical one yet.',
      from: 'Hirok',
    },
  ] as BirthdayWish[],

  // Section 5: Reasons Why You're Special (6 interactive flip cards)
  reasons: [
    {
      id: 'reason-1',
      frontTitle: 'Your Laugh',
      backMessage:
        'Your laugh can turn the most ordinary, tiring day into my favorite memory in seconds.',
    },
    {
      id: 'reason-2',
      frontTitle: 'Your Kindness',
      backMessage:
        'You care so thoughtfully for the people around you and make everyone feel genuinely heard.',
    },
    {
      id: 'reason-3',
      frontTitle: 'Zero Judgment',
      backMessage:
        'With you, I never have to pretend. I can be completely myself, silly ideas and all.',
    },
    {
      id: 'reason-4',
      frontTitle: 'Your Strength',
      backMessage:
        'Even when things get tough, you handle life with grace, courage, and quiet resilience.',
    },
    {
      id: 'reason-5',
      frontTitle: 'Best Listener',
      backMessage:
        'Whether it is a 2 AM rant or good news, you always know the exact right thing to say.',
    },
    {
      id: 'reason-6',
      frontTitle: 'One of a Kind',
      backMessage:
        'There is truly no one else like you, Anushika. Life is simply better with you in it.',
    },
  ] as SpecialReason[],

  // Section 6: Surprise Button & Hidden Modal Message
  surprise: {
    buttonLabel: 'Tap for a Surprise 🎁',
    modalTitle: 'A Little Birthday Wish ✨',
    modalMessage:
      'No matter where life takes us, you will always have me cheering the loudest in your corner. Thank you for being the most amazing best friend anyone could ask for.',
    wishHighlight:
      'May your year ahead be filled with peace, exciting adventures, sweet surprises, and all the happiness you bring to everyone else.',
  },

  // Footer
  footerText: 'Made with ❤️ by Hirok, your best friend',

  // Extras: Background music MP3 path (served from /public/music/) & initial start time
  music: {
    customAudioUrl: '/music/shape-of-you.mp3',
    startAtSeconds: 6,
  },
};

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [previewBirthdayMode, setPreviewBirthdayMode] = useState(
    BIRTHDAY_CONFIG.forceBirthdayMode
  );
  const [countdown, setCountdown] = useState(() =>
    getISTCountdown(
      BIRTHDAY_CONFIG.birthdayMonth,
      BIRTHDAY_CONFIG.birthdayDay,
      BIRTHDAY_CONFIG.forceBirthdayMode
    )
  );
  const [burstKey, setBurstKey] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const musicRef = useRef<DreamyMusicController | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  // Live 1-second IST countdown ticker
  useEffect(() => {
    const update = () => {
      setCountdown(
        getISTCountdown(
          BIRTHDAY_CONFIG.birthdayMonth,
          BIRTHDAY_CONFIG.birthdayDay,
          previewBirthdayMode
        )
      );
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [previewBirthdayMode]);

  // Preload & clean up music controller on unmount
  useEffect(() => {
    const controller = new DreamyMusicController();
    controller.preload(
      BIRTHDAY_CONFIG.music.customAudioUrl,
      BIRTHDAY_CONFIG.music.startAtSeconds
    );
    musicRef.current = controller;
    return () => {
      controller.stop();
    };
  }, []);

  const handleEnterWithMusic = async () => {
    setHasEntered(true);
    setBurstKey((prev) => prev + 1);
    if (!musicRef.current) return;
    const started = await musicRef.current.start(
      BIRTHDAY_CONFIG.music.customAudioUrl,
      BIRTHDAY_CONFIG.music.startAtSeconds
    );
    setMusicOn(started);
  };

  const handleEnterMuted = () => {
    setHasEntered(true);
  };

  const toggleMusic = async () => {
    if (!musicRef.current) return;
    if (musicOn) {
      musicRef.current.stop();
      setMusicOn(false);
    } else {
      const started = await musicRef.current.start(
        BIRTHDAY_CONFIG.music.customAudioUrl,
        BIRTHDAY_CONFIG.music.startAtSeconds
      );
      setMusicOn(started);
    }
  };

  const triggerConfetti = () => {
    setBurstKey((prev) => prev + 1);
  };

  const togglePreviewMode = () => {
    setPreviewBirthdayMode((prev) => {
      const next = !prev;
      if (next) setBurstKey((k) => k + 1);
      return next;
    });
  };

  return (
    <div className="relative min-h-dvh flex flex-col">
      {/* Entry Splash Screen so user tap unlocks instant music playback */}
      <AnimatePresence>
        {!hasEntered && (
          <WelcomeOverlay
            friendName={BIRTHDAY_CONFIG.friendName}
            senderName={BIRTHDAY_CONFIG.senderName}
            onStartWithMusic={handleEnterWithMusic}
            onStartMuted={handleEnterMuted}
          />
        )}
      </AnimatePresence>

      {/* Smooth top scroll progress bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-[#df6498] via-[#9e76dc] to-[#d5a13f] z-50"
      />

      {/* Subtle floating sparkles/hearts + Birthday Mode balloons & confetti */}
      <FloatingAmbient />
      {countdown.isBirthdayMode && <BirthdayBalloons />}
      <ConfettiCanvas
        burstKey={burstKey}
        continuousBirthdayMode={countdown.isBirthdayMode}
      />

      {/* Compact Sticky Top Bar (56px height, 3-zone contract) */}
      <header className="sticky top-0 z-40 h-14 px-4 sm:px-6 bg-white/70 backdrop-blur-md border-b border-white/85">
        <div className="max-w-5xl mx-auto h-full flex items-center justify-between gap-8">
          <a
            href="#countdown"
            className="font-script text-2xl sm:text-[26px] font-bold text-[#3a2240] whitespace-nowrap shrink-0"
          >
            For {BIRTHDAY_CONFIG.friendName}
          </a>

          <nav
            aria-label="Page sections"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#64486c]"
          >
            <a
              href="#countdown"
              className="hover:text-[#b4487b] transition-colors whitespace-nowrap shrink-0"
            >
              Countdown
            </a>
            <a
              href="#message"
              className="hover:text-[#b4487b] transition-colors whitespace-nowrap shrink-0"
            >
              Letter
            </a>
            <a
              href="#memories"
              className="hover:text-[#b4487b] transition-colors whitespace-nowrap shrink-0"
            >
              Scrapbook
            </a>
            <a
              href="#wishes"
              className="hover:text-[#b4487b] transition-colors whitespace-nowrap shrink-0"
            >
              Wishes
            </a>
            <a
              href="#special"
              className="hover:text-[#b4487b] transition-colors whitespace-nowrap shrink-0"
            >
              Special
            </a>
          </nav>

          <button
            type="button"
            onClick={toggleMusic}
            aria-pressed={musicOn}
            aria-label={musicOn ? 'Turn background music off' : 'Turn background music on'}
            className={`min-h-[44px] px-3.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              musicOn
                ? 'bg-gradient-to-r from-[#df6498] to-[#9e76dc] text-white shadow-sm'
                : 'bg-white/80 border border-pink-100 text-[#573c5f] hover:bg-white'
            }`}
          >
            {musicOn ? (
              <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{musicOn ? 'Music On' : 'Music Off'}</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero & Live IST Countdown + Interactive Polaroid Stack */}
        <CountdownSection
          countdown={countdown}
          comingSoonTitle={BIRTHDAY_CONFIG.hero.comingSoonTitle}
          comingSoonSubtitle={BIRTHDAY_CONFIG.hero.comingSoonSubtitle}
          birthdayTitle={BIRTHDAY_CONFIG.hero.birthdayTitle}
          birthdaySubtitle={BIRTHDAY_CONFIG.hero.birthdaySubtitle}
          featuredMemories={BIRTHDAY_CONFIG.memories}
          isPreviewMode={previewBirthdayMode}
          onTogglePreviewMode={togglePreviewMode}
          onReplayCelebration={triggerConfetti}
        />

        {/* Interactive Wax-Sealed Envelope Letter from Hirok */}
        <InteractiveLetter
          heading={BIRTHDAY_CONFIG.personalMessage.heading}
          greeting={BIRTHDAY_CONFIG.personalMessage.greeting}
          paragraphs={BIRTHDAY_CONFIG.personalMessage.paragraphs}
          signOff={BIRTHDAY_CONFIG.personalMessage.signOff}
          senderName={BIRTHDAY_CONFIG.senderName}
          friendName={BIRTHDAY_CONFIG.friendName}
        />

        {/* Upgraded Masonry Collage & Swipeable Polaroid Deck + Story Reel */}
        <MemoriesGallery memories={BIRTHDAY_CONFIG.memories} />

        {/* Birthday Wishes Wall & Interactive Wishing Jar */}
        <WishesSection
          friendName={BIRTHDAY_CONFIG.friendName}
          initialWishes={BIRTHDAY_CONFIG.wishes}
          onWishCelebration={triggerConfetti}
        />

        {/* Reasons Why You're Special (Tap-to-Flip Cards) */}
        <ReasonsFlipCards
          reasons={BIRTHDAY_CONFIG.reasons}
          onAllRevealed={triggerConfetti}
        />

        {/* Interactive Birthday Cake with Tappable Candles */}
        <InteractiveCake
          friendName={BIRTHDAY_CONFIG.friendName}
          onAllCandlesBlown={triggerConfetti}
        />

        {/* Tap for a Surprise Button & Hidden Modal */}
        <SurpriseModal
          buttonLabel={BIRTHDAY_CONFIG.surprise.buttonLabel}
          modalTitle={BIRTHDAY_CONFIG.surprise.modalTitle}
          modalMessage={BIRTHDAY_CONFIG.surprise.modalMessage}
          wishHighlight={BIRTHDAY_CONFIG.surprise.wishHighlight}
          senderName={BIRTHDAY_CONFIG.senderName}
          onTriggerConfetti={triggerConfetti}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 px-4 border-t border-white/75 bg-white/45 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm font-medium text-[#5e4266]">
            {BIRTHDAY_CONFIG.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
}
