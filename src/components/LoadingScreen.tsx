import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useSoundEngine } from '../hooks/useSoundEngine';
import { BiCheckCircle, BiVolumeMute } from 'react-icons/bi';
import { BsShieldCheck, BsVolumeUp } from 'react-icons/bs';
import { BiometricScanContainer } from './HUDElements';
import { FaUserCheck } from 'react-icons/fa';

gsap.registerPlugin(TextPlugin);
interface LoadingScreenProps {
  onComplete: () => void;
}
const ASSETS = [
  'neural_core.wasm',
  'hud_matrix.glsl',
  'biometric_db.enc',
  'quantum_router.sys',
  'holo_projector.dll',
  'sec_protocols.bin',
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const faceScanRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const accessRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const [showSoundPrompt, setShowSoundPrompt] = useState(true);
  const [scanStatus, setScanStatus] = useState('INITIALIZING...');
  const [isFaceScanned, setIsFaceScanned] = useState(false);
  const [loadingAsset, setLoadingAsset] = useState(ASSETS[0]);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const {
    playBootSequence,
    playTypingTick,
    isSoundEnabled,
    enableSound,
    playEngageSound,
  } = useSoundEngine();
  useEffect(() => {
    const timer = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (isSoundEnabled && !showSoundPrompt) {
      playBootSequence();
    }
  }, [isSoundEnabled, playBootSequence, showSoundPrompt]);
  // Sound Prompt Entrance Animatipaon
  useLayoutEffect(() => {
    if (showSoundPrompt && promptRef.current) {
      gsap.fromTo(
        promptRef.current,
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.5)',
        },
      );
    }
  }, [showSoundPrompt]);
  const handleSoundChoice = (enable: boolean) => {
    enableSound(enable);
    if (enable) {
      playEngageSound();
    }
    if (promptRef.current) {
      gsap.to(promptRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          setShowSoundPrompt(false);
        },
      });
    } else {
      setShowSoundPrompt(false);
    }
  };
  useLayoutEffect(() => {
    if (showSoundPrompt) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Phase 5: Horizontal wipe reveal
          gsap.to(containerRef.current, {
            clipPath: 'inset(0 50% 0 50%)',
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete,
            delay: 0.5,
          });
        },
      });
      // Initial Setup
      gsap.set([identityRef.current, accessRef.current, loadingRef.current], {
        opacity: 0,
        scale: 0.9,
      });
      gsap.set(faceScanRef.current, {
        opacity: 0,
        scale: 0.8,
      });
      // Phase 0: Power On
      tl.to(containerRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.in',
      });
      // Phase 1: Face Scan (Center)
      tl.to(faceScanRef.current, {
        opacity: 1,
        scale: 1,
        duration: 3,
        ease: 'back.out(1.5)',
        onStart: () => {
          setTimeout(() => setScanStatus('SCANNING...'), 500);
          setTimeout(() => {
            setScanStatus('MATCH FOUND');
            setIsFaceScanned(true);
            playTypingTick();
          }, 2000);
        },
      });
      // Phase 2: Identity Confirmed (Right)
      tl.to(
        identityRef.current,
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.5,
          ease: 'power3.out',
        },
        '+=2',
      ); // Wait for scan to finish
      // Phase 3: Access Granted (Left)
      tl.to(
        accessRef.current,
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 0.5,
          ease: 'power3.out',
        },
        '+=0.5',
      );
      // Phase 4: Asset Loading (Bottom)
      tl.to(
        loadingRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          onStart: () => {
            // Simulate progress
            let currentProgress = 0;
            let assetIndex = 0;
            const interval = setInterval(() => {
              currentProgress += Math.random() * 15;
              if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);
              }
              setProgress(Math.floor(currentProgress));
              if (currentProgress < 100 && Math.random() > 0.5) {
                assetIndex = (assetIndex + 1) % ASSETS.length;
                setLoadingAsset(ASSETS[assetIndex]);
                playTypingTick();
              } else if (currentProgress === 100) {
                setLoadingAsset('ALL SYSTEMS NOMINAL');
              }
            }, 150);
          },
        },
        '+=0.5',
      );
      // Wait for progress bar to finish before wipe
      tl.to(
        {},
        {
          duration: 2.5,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [onComplete, playTypingTick, showSoundPrompt]);
  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden crt-curvature ${showSoundPrompt ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className='noise-overlay opacity-50'></div>

      {showSoundPrompt && (
        <div className='absolute inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <div
            ref={promptRef}
            className='hud-bg-surface border border-hud-primary clip-angled p-8 sm:p-12 max-w-lg w-full mx-4 shadow-[0_0_50px_var(--hud-glow)] relative overflow-hidden text-center'
          >
            <div className='absolute inset-0 holo-shimmer opacity-30'></div>
            <div className='absolute top-0 left-0 w-full h-[2px] bg-hud-primary animate-[scan-line_3s_linear_infinite]'></div>

            <div className='relative z-10 flex flex-col items-center gap-6'>
              <div className='w-20 h-20 rounded-full border-2 border-hud-primary flex items-center justify-center bg-hud-primary/10 relative animate-glow-pulse'>
                <div className='absolute inset-0 rounded-full border border-hud-primary animate-ping opacity-50'></div>
                <BsVolumeUp className='w-10 h-10 text-hud-primary' />
              </div>

              <div>
                <h2 className='font-heading text-2xl sm:text-3xl font-bold text-hud-primary tracking-widest mb-2 chromatic-text'>
                  AUDIO SUBSYSTEM DETECTED
                </h2>
                <p className='font-mono text-sm text-hud-text-muted'>
                  This experience features immersive sound design.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 w-full mt-4'>
                <button
                  onClick={() => handleSoundChoice(true)}
                  className='flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-hud-primary text-hud-bg font-heading font-bold tracking-widest hover:bg-hud-accent transition-colors clip-angled shadow-[0_0_15px_var(--hud-primary)] group pointer-events-auto'
                >
                  <BsVolumeUp className='w-5 h-5' />
                  ENGAGE AUDIO
                </button>
                <button
                  onClick={() => handleSoundChoice(false)}
                  className='flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-hud-primary text-hud-primary font-heading font-bold tracking-widest hover:bg-hud-primary/20 transition-colors clip-angled pointer-events-auto'
                >
                  <BiVolumeMute className='w-5 h-5' />
                  SILENT MODE
                </button>
              </div>

              <p className='font-mono text-[10px] text-hud-text-muted/70 mt-2'>
                You can change this anytime in the navigation bar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`relative z-10 w-full max-w-6xl h-full flex flex-col items-center justify-center p-8 ${showSoundPrompt ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        {/* Phase 1: Face Scan Panel (Center) */}
        <div
          className={`w-full h-full p-8 transition-colors duration-500 ${isFaceScanned ? 'text-green-500' : 'text-hud-primary'}`}
        >
          <div ref={faceScanRef}></div>
          <BiometricScanContainer paused={showSoundPrompt}/>
        </div>

        {/* Phase 2: Identity Confirmed (Right) */}

        <div
          ref={identityRef}
          className='absolute top-1/4 right-8 sm:right-16 translate-x-8'
        >
          <div className='hud-bg-surface border border-hud-accent/50 p-6 shadow-[0_0_20px_var(--hud-accent)] backdrop-blur-md'>
            <div className='flex items-center gap-4 mb-4 border-b border-hud-accent/30 pb-4'>
              <FaUserCheck className='w-8 h-8 text-hud-success' />
              <div>
                <h3 className='font-heading font-bold text-hud-success tracking-wider uppercase'>
                  Humanity Verified
                </h3>
                <p className='font-mono text-xs text-hud-accent/70'>
                  SYSTEM: ACCESS GRANTED
                </p>
              </div>
            </div>

            <div className='space-y-3 font-mono text-xs text-hud-text-muted mb-4'>
              <div className='flex justify-between gap-8'>
                <span>BIOLOGICAL_SIG:</span>
                <span className='text-hud-success'>DETECTED</span>
              </div>
              <div className='flex justify-between gap-8'>
                <span>SECURITY_HANDSHAKE:</span>
                <span className='text-hud-success'>COMPLETE</span>
              </div>
              <div className='flex justify-between gap-8'>
                <span>NEURAL_LINK:</span>
                <span className='text-hud-accent'>STABLE</span>
              </div>
            </div>

            <div className='border-t border-hud-accent/20 pt-4 text-center'>
              <p className='font-heading text-sm text-hud-primary tracking-widest animate-pulse'>
                READY TO VIEW KATLEO'S WEBSITE...
              </p>
            </div>
          </div>
        </div>

        {/* Phase 3: Access Granted (Left) */}
        <div
          ref={accessRef}
          className='absolute top-1/3 left-8 sm:left-16 -translate-x-8'
        >
          <div className='hud-bg-surface border border-hud-primary  p-6 shadow-[0_0_30px_var(--hud-glow)] backdrop-blur-md relative overflow-hidden group'>
            <div className='absolute inset-0 bg-hud-primary/10 animate-pulse'></div>
            <div className='relative z-10 flex items-center gap-4'>
              <BsShieldCheck className='w-10 h-10 text-hud-primary' />
              <div>
                <h2 className='font-heading text-2xl font-black text-hud-primary tracking-widest drop-shadow-[0_0_8px_var(--hud-primary)]'>
                  ACCESS GRANTED
                </h2>
                <p className='font-mono text-sm text-hud-accent mt-1'>
                  CLEARANCE: LEVEL 5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4: Asset Loading (Bottom) */}
        <div
          ref={loadingRef}
          className='absolute bottom-16 sm:bottom-24 w-full max-w-2xl px-8 translate-y-8'
        >
          <div className='hud-bg-surface border border-hud-border p-4 backdrop-blur-md'>
            <div className='flex justify-between font-mono text-xs text-hud-primary mb-2'>
              <span className='flex items-center gap-2'>
                <span className='w-2 h-2 bg-hud-primary animate-ping'></span>
                {progress === 100 ? 'SYSTEM READY' : 'LOADING ASSETS...'}
              </span>
              <span>{progress}%</span>
            </div>
            <div className='w-full h-2 bg-hud-primary/20 relative overflow-hidden'>
              <div
                className='absolute top-0 left-0 h-full bg-hud-primary shadow-[0_0_10px_var(--hud-primary)] transition-all duration-150 ease-out'
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>
            <div className='mt-2 font-mono text-[10px] text-hud-text-muted truncate'>
              &gt;{' '}
              {progress === 100
                ? 'ALL SYSTEMS NOMINAL'
                : `LOADING: ${loadingAsset}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
