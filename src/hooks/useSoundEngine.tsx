import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from 'react';
interface SoundEngineContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  enableSound: (enabled: boolean) => void;
  playHover: () => void;
  playClick: () => void;
  playBootSequence: () => void;
  playTransition: () => void;
  playTypingTick: () => void;
  playEngageSound: () => void;
}
const SoundEngineContext = createContext<SoundEngineContextType | null>(null);
export const useSoundEngine = () => {
  const context = useContext(SoundEngineContext);
  if (!context) {
    throw new Error('useSoundEngine must be used within a SoundProvider');
  }
  return context;
};
export const SoundProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('site_sounds');
    if (saved === 'true') {
      setIsSoundEnabled(true);
    }
  }, []);
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);
  const startAmbient = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ambientOscRef.current) return; // Already playing
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    // Deep drone
    osc.type = 'sine';
    osc.frequency.value = 55; // Low hum
    // Filter to make it muffled
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    // LFO for subtle pulsing
    lfo.type = 'sine';
    lfo.frequency.value = 0.1; // Very slow
    lfoGain.gain.value = 10; // Frequency modulation amount
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    // Volume setup
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2); // Fade in
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    lfo.start();
    ambientOscRef.current = osc;
    ambientGainRef.current = gain;
    lfoRef.current = lfo;
  }, []);
  const stopAmbient = useCallback(() => {
    if (ambientGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      ambientGainRef.current.gain.linearRampToValueAtTime(
        0,
        ctx.currentTime + 1,
      );
      setTimeout(() => {
        ambientOscRef.current?.stop();
        lfoRef.current?.stop();
        ambientOscRef.current?.disconnect();
        ambientGainRef.current?.disconnect();
        lfoRef.current?.disconnect();
        ambientOscRef.current = null;
        ambientGainRef.current = null;
        lfoRef.current = null;
      }, 1000);
    }
  }, []);
  useEffect(() => {
    if (isSoundEnabled) {
      initAudio();
      startAmbient();
    } else {
      stopAmbient();
    }
  }, [isSoundEnabled, initAudio, startAmbient, stopAmbient]);
  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('site_sounds', String(next));
      return next;
    });
  };
  const enableSound = useCallback((enabled: boolean) => {
    setIsSoundEnabled(enabled);
    localStorage.setItem('site_sounds', String(enabled));
  }, []);
  const playHover = useCallback(() => {
    if (!isSoundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    // Sci-fi hover: quick high-pitched chirp
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }, [isSoundEnabled]);
  const playClick = useCallback(() => {
    if (!isSoundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    // Sci-fi click: sharp metallic tick
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }, [isSoundEnabled]);
  const playTransition = useCallback(() => {
    if (!isSoundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    // Warp/whoosh transition
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(50, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }, [isSoundEnabled]);
  const playBootSequence = useCallback(() => {
    if (!isSoundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    // Complex startup sequence
    let time = ctx.currentTime;
    for (let i = 0; i < 20; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
      osc.frequency.value = 800 + Math.random() * 3000;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.03, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.06);
      time += 0.03 + Math.random() * 0.04;
    }
  }, [isSoundEnabled]);
  const playTypingTick = useCallback(() => {
    if (!isSoundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    // High-tech data processing tick
    osc.type = 'square';
    osc.frequency.value = 1200 + Math.random() * 800;
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  }, [isSoundEnabled]);
  const playEngageSound = useCallback(() => {
    if (!isSoundEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    // Low rumble sweeping up
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(60, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 1.5);
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.5);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 1.5);
    // Mid-range sweep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(100, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.2);
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 1.2);
    // High-pitched confirmation ping at the end
    setTimeout(() => {
      if (!audioCtxRef.current) return;
      const pingOsc = ctx.createOscillator();
      const pingGain = ctx.createGain();
      pingOsc.type = 'sine';
      pingOsc.frequency.setValueAtTime(2000, ctx.currentTime);
      pingOsc.frequency.exponentialRampToValueAtTime(
        3000,
        ctx.currentTime + 0.3,
      );
      pingGain.gain.setValueAtTime(0, ctx.currentTime);
      pingGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      pingGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      pingOsc.connect(pingGain);
      pingGain.connect(ctx.destination);
      pingOsc.start();
      pingOsc.stop(ctx.currentTime + 0.3);
    }, 800);
  }, [isSoundEnabled]);
  return (
    <SoundEngineContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        enableSound,
        playHover,
        playClick,
        playBootSequence,
        playTransition,
        playTypingTick,
        playEngageSound,
      }}
    >
      {children}
    </SoundEngineContext.Provider>
  );
};
