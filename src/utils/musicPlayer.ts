// Reliable background music controller supporting MP3 playback with preloading,
// configurable start offset (e.g. 6 seconds on first play), and Web Audio fallback.

interface NoteStep {
  freq: number;
  beats: number;
  chord?: number[];
}

const BIRTHDAY_MELODY: NoteStep[] = [
  { freq: 261.63, beats: 0.75, chord: [174.61, 220.0, 261.63] },
  { freq: 261.63, beats: 0.25 },
  { freq: 293.66, beats: 1.0 },
  { freq: 261.63, beats: 1.0 },
  { freq: 349.23, beats: 1.0, chord: [174.61, 220.0, 261.63, 329.63] },
  { freq: 329.63, beats: 2.0, chord: [130.81, 196.0, 246.94, 329.63] },

  { freq: 261.63, beats: 0.75 },
  { freq: 261.63, beats: 0.25 },
  { freq: 293.66, beats: 1.0 },
  { freq: 261.63, beats: 1.0 },
  { freq: 392.0, beats: 1.0, chord: [196.0, 246.94, 293.66] },
  { freq: 349.23, beats: 2.0, chord: [174.61, 220.0, 261.63, 329.63] },

  { freq: 261.63, beats: 0.75 },
  { freq: 261.63, beats: 0.25 },
  { freq: 523.25, beats: 1.0, chord: [174.61, 220.0, 261.63] },
  { freq: 440.0, beats: 1.0 },
  { freq: 349.23, beats: 1.0, chord: [146.83, 220.0, 261.63, 349.23] },
  { freq: 329.63, beats: 1.0 },
  { freq: 293.66, beats: 2.0, chord: [116.54, 174.61, 233.08, 293.66] },

  { freq: 466.16, beats: 0.75 },
  { freq: 466.16, beats: 0.25 },
  { freq: 440.0, beats: 1.0 },
  { freq: 349.23, beats: 1.0, chord: [130.81, 174.61, 220.0, 261.63] },
  { freq: 392.0, beats: 1.0, chord: [130.81, 196.0, 233.08, 293.66] },
  { freq: 349.23, beats: 2.5, chord: [174.61, 220.0, 261.63, 329.63] },
  { freq: 0, beats: 1.5 },
];

export class DreamyMusicController {
  private audioCtx: AudioContext | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private customUrl = '';
  private startOffsetSec = 0;
  private hasAppliedInitialSeek = false;
  private isPlaying = false;
  private timerId: number | null = null;
  private stepIndex = 0;

  public preload(customAudioUrl?: string, startOffsetSeconds = 0): void {
    const cleanUrl = customAudioUrl?.trim() ?? '';
    this.customUrl = cleanUrl;
    this.startOffsetSec = Math.max(0, startOffsetSeconds);
    if (!cleanUrl) return;

    if (!this.customAudio) {
      const audio = new Audio(cleanUrl);
      audio.loop = true;
      audio.volume = 0.55;
      audio.preload = 'auto';
      this.customAudio = audio;
      if (this.startOffsetSec > 0) {
        audio.addEventListener(
          'loadedmetadata',
          () => {
            if (!this.hasAppliedInitialSeek) {
              this.hasAppliedInitialSeek = true;
              try {
                audio.currentTime = this.startOffsetSec;
              } catch {
                // Ignore if browser restricts seek before play
              }
            }
          },
          { once: true }
        );
      }
    } else if (!this.customAudio.src.endsWith(cleanUrl)) {
      this.customAudio.src = cleanUrl;
      this.customAudio.load();
    }
  }

  private applyInitialSeek(audio: HTMLAudioElement, offsetSec: number): void {
    if (this.hasAppliedInitialSeek || offsetSec <= 0) return;

    const seek = () => {
      if (this.hasAppliedInitialSeek) return;
      this.hasAppliedInitialSeek = true;
      try {
        audio.currentTime = offsetSec;
      } catch {
        // Ignore seek errors
      }
    };

    if (audio.readyState >= 1) {
      seek();
    } else {
      audio.addEventListener('loadedmetadata', seek, { once: true });
    }
  }

  public async start(
    customAudioUrl?: string,
    startOffsetSeconds?: number
  ): Promise<boolean> {
    if (this.isPlaying) return true;
    this.isPlaying = true;

    const cleanUrl = (customAudioUrl ?? this.customUrl).trim();
    const offset = startOffsetSeconds ?? this.startOffsetSec;

    if (cleanUrl.length > 0) {
      this.preload(cleanUrl, offset);
      if (this.customAudio) {
        try {
          this.applyInitialSeek(this.customAudio, offset);
          await this.customAudio.play();
          return true;
        } catch {
          // Fall back to synthesized music box if MP3 fails
        }
      }
    }

    return this.startSynthFallback();
  }

  private startSynthFallback(): boolean {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) {
      this.isPlaying = false;
      return false;
    }

    if (!this.audioCtx) {
      this.audioCtx = new AudioCtx();
    }

    if (this.audioCtx.state === 'suspended') {
      void this.audioCtx.resume();
    }

    this.stepIndex = 0;
    this.scheduleNextNote();
    return true;
  }

  private scheduleNextNote(): void {
    if (!this.isPlaying || !this.audioCtx) return;

    const note = BIRTHDAY_MELODY[this.stepIndex];
    const beatMs = 540;
    const durationMs = note.beats * beatMs;

    if (note.freq > 0) {
      this.playMusicBoxTone(note.freq, durationMs / 1000);
    }
    if (note.chord && note.chord.length > 0) {
      this.playWarmPad(note.chord, (durationMs / 1000) * 2.2);
    }

    this.stepIndex = (this.stepIndex + 1) % BIRTHDAY_MELODY.length;
    this.timerId = window.setTimeout(() => this.scheduleNextNote(), durationMs);
  }

  private playMusicBoxTone(freq: number, durationSec: number): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const overtone = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const overtoneGain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.11, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.75, durationSec * 1.5));

    overtoneGain.gain.setValueAtTime(0.0001, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.028, now + 0.02);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + Math.max(0.85, durationSec * 1.6));
    overtone.stop(now + 0.5);
  }

  private playWarmPad(freqs: number[], durationSec: number): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    for (const freq of freqs) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.016, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(1.4, durationSec));

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + Math.max(1.5, durationSec + 0.1));
    }
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }
}
