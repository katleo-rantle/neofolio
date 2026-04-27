import React, { useEffect, useState, useRef } from 'react';

import { FaUserCheck } from 'react-icons/fa';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const scanMessages = [
  'ANALYZING BIOMETRICS...',
  'PLEASE DO NOT BLINK...',
  'JUST KIDDING, BLINK ALL YOU WANT.',
  'RETICULATING SPLINES...',
  'ACCESS GRANTED.',
];

export const HUDCorner = ({
  position,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
}) => {
  const baseClasses = 'absolute w-6 h-6 pointer-events-none z-10';
  const positions = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0 rotate-90',
    bl: 'bottom-0 left-0 -rotate-90',
    br: 'bottom-0 right-0 rotate-180',
  };
  return (
    <div className={`${baseClasses} ${positions[position]}`} aria-hidden='true'>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M0 0H24V2H2V24H0V0Z' fill='var(--hud-primary)' />
        <rect x='4' y='4' width='4' height='4' fill='var(--hud-primary)' />
        <rect
          x='8'
          y='0'
          width='2'
          height='6'
          fill='var(--hud-primary)'
          opacity='0.5'
        />
        <rect
          x='12'
          y='0'
          width='2'
          height='4'
          fill='var(--hud-primary)'
          opacity='0.5'
        />
        <rect
          x='16'
          y='0'
          width='2'
          height='2'
          fill='var(--hud-primary)'
          opacity='0.5'
        />
        <rect
          x='0'
          y='8'
          width='6'
          height='2'
          fill='var(--hud-primary)'
          opacity='0.5'
        />
        <rect
          x='0'
          y='12'
          width='4'
          height='2'
          fill='var(--hud-primary)'
          opacity='0.5'
        />
        <rect
          x='0'
          y='16'
          width='2'
          height='2'
          fill='var(--hud-primary)'
          opacity='0.5'
        />
      </svg>
    </div>
  );
};
export const HUDBox = ({
  children,
  className = '',
  glowing = false,
}: {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}) => {
  return (
    <div
      className={`relative p-6 hud-bg-surface hud-border clip-angled overflow-hidden group ${glowing ? 'animate-glow-pulse' : ''} ${className}`}
    >
      <div className='noise-overlay opacity-30'></div>
      <div className='holo-shimmer'></div>
      <div className='absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-hud-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[data-stream_2s_linear_infinite]'></div>

      <HUDCorner position='tl' />
      <HUDCorner position='tr' />
      <HUDCorner position='bl' />
      <HUDCorner position='br' />

      <div className='relative z-10'>{children}</div>
    </div>
  );
};
export const Scanlines = () => (
  <div className='fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-overlay crt-curvature'>
    <div className='absolute inset-0 scanline animate-scan-line opacity-40'></div>
    <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.25)_51%)] bg-[length:100%_4px]'></div>
  </div>
);
export const HUDDataReadout = ({
  label,
  length = 4,
  updateInterval = 100,
}: {
  label: string;
  length?: number;
  updateInterval?: number;
}) => {
  const [val, setVal] = useState('0000');
  useEffect(() => {
    const int = setInterval(() => {
      setVal(
        Math.floor(Math.random() * Math.pow(16, length))
          .toString(16)
          .toUpperCase()
          .padStart(length, '0'),
      );
    }, updateInterval);
    return () => clearInterval(int);
  }, [length, updateInterval]);
  return (
    <span className='font-mono text-[10px] sm:text-xs tracking-widest flex items-center gap-1'>
      <span className='text-hud-text-muted'>{label}:</span>
      <span className='text-hud-primary'>{val}</span>
    </span>
  );
};
export const HUDTitle = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative flex flex-col items-start gap-2 mb-8 ${className}`}>
    <div className='flex items-center gap-4 w-full'>
      <div className='flex items-center gap-2 text-hud-primary opacity-70'>
        <HUDDataReadout label='IDX' length={2} updateInterval={500} />
        <span className='font-mono text-xl animate-pulse'>[</span>
      </div>

      <h2 className='text-2xl sm:text-3xl font-heading text-hud-text tracking-widest uppercase chromatic-text transition-all duration-300'>
        {children}
      </h2>

      <div className='flex items-center gap-2 text-hud-primary opacity-70'>
        <span className='font-mono text-xl animate-pulse'>]</span>
        <div className='flex gap-1'>
          <span
            className='w-1 h-1 bg-hud-primary rounded-full animate-bounce'
            style={{
              animationDelay: '0ms',
            }}
          ></span>
          <span
            className='w-1 h-1 bg-hud-primary rounded-full animate-bounce'
            style={{
              animationDelay: '150ms',
            }}
          ></span>
          <span
            className='w-1 h-1 bg-hud-primary rounded-full animate-bounce'
            style={{
              animationDelay: '300ms',
            }}
          ></span>
        </div>
      </div>
    </div>

    <div className='w-full relative h-[2px] bg-hud-border/30 overflow-hidden'>
      <div className='absolute top-0 left-1/2 -translate-x-1/2 h-full w-0 bg-hud-primary animate-[border-draw-anim_1.5s_ease-out_forwards]'></div>
    </div>
  </div>
);
export const HUDDivider = () => (
  <div className='w-full h-12 relative flex items-center justify-center my-16 opacity-70'>
    <div className='absolute left-0 right-0 h-[1px] bg-hud-primary/50' />
    <div className='absolute left-1/4 w-2 h-2 rounded-full bg-hud-accent animate-pulse' />
    <div className='absolute right-1/4 w-2 h-2 rounded-full bg-hud-accent animate-pulse' />
    <div className='absolute left-1/2 -translate-x-1/2 w-6 h-6 border border-hud-primary rotate-45 bg-hud-bg flex items-center justify-center'>
      <div className='w-2 h-2 bg-hud-primary rotate-45 animate-ping' />
    </div>
    <div className='absolute left-1/3 top-0 bottom-0 w-[1px] bg-hud-primary/30' />
    <div className='absolute right-1/3 top-0 bottom-0 w-[1px] bg-hud-primary/30' />
  </div>
);

// face scan

// The specific Biometric Glyph you provided, wrapped in a component
const BiometricFaceGlyph = ({ className }: { className?: string }) => (
  <svg
    viewBox='0 0 24 24'
    fill='currentColor'
    className={className}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M7.5,3 C7.77614237,3 8,3.22385763 8,3.5 C8,3.77614237 7.77614237,4 7.5,4 L5.5,4 C4.67157288,4 4,4.67157288 4,5.5 L4,7.53112887 C4,7.80727125 3.77614237,8.03112887 3.5,8.03112887 C3.22385763,8.03112887 3,7.80727125 3,7.53112887 L3,5.5 C3,4.11928813 4.11928813,3 5.5,3 L7.5,3 Z M16.5,4 C16.2238576,4 16,3.77614237 16,3.5 C16,3.22385763 16.2238576,3 16.5,3 L18.5,3 C19.8807119,3 21,4.11928813 21,5.5 L21,7.5 C21,7.77614237 20.7761424,8 20.5,8 C20.2238576,8 20,7.77614237 20,7.5 L20,5.5 C20,4.67157288 19.3284271,4 18.5,4 L16.5,4 Z M20,16.5 C20,16.2238576 20.2238576,16 20.5,16 C20.7761424,16 21,16.2238576 21,16.5 L21,18.5 C21,19.8807119 19.8807119,21 18.5,21 L16.5,21 C16.2238576,21 16,20.7761424 16,20.5 C16,20.2238576 16.2238576,20 16.5,20 L18.5,20 C19.3284271,20 20,19.3284271 20,18.5 L20,16.5 Z M3,16.5 C3,16.2238576 3.22385763,16 3.5,16 C3.77614237,16 4,16.2238576 4,16.5 L4,18.5 C4,19.3284271 4.67157288,20 5.5,20 L7.5,20 C7.77614237,20 8,20.2238576 8,20.5 C8,20.7761424 7.77614237,21 7.5,21 L5.5,21 C4.11928813,21 3,19.8807119 3,18.5 L3,16.5 Z M8,8.5 C8,8.22385763 8.22385763,8 8.5,8 C8.77614237,8 9,8.22385763 9,8.5 L9,9.5 C9,9.77614237 8.77614237,10 8.5,10 C8.22385763,10 8,9.77614237 8,9.5 L8,8.5 Z M16,8.5 C16,8.22385763 16.2238576,8 16.5,8 C16.7761424,8 17,8.22385763 17,8.5 L17,9.5 C17,9.77614237 16.7761424,10 16.5,10 C16.2238576,10 16,9.77614237 16,9.5 L16,8.5 Z M12,8.5 C12,8.22385763 12.2238576,8 12.5,8 C12.7761424,8 13,8.22385763 13,8.5 L13,12.5 C13,13.3284271 12.3284271,14 11.5,14 C11.2238576,14 11,13.7761424 11,13.5 C11,13.2238576 11.2238576,13 11.5,13 C11.7761424,13 12,12.7761424 12,12.5 L12,8.5 Z M8.1,15.8 C7.93431458,15.5790861 7.9790861,15.2656854 8.2,15.1 C8.4209139,14.9343146 8.73431458,14.9790861 8.9,15.2 C9.81096778,16.4146237 10.8353763,17 12,17 C13.1646237,17 14.1890322,16.4146237 15.1,15.2 C15.2656854,14.9790861 15.5790861,14.9343146 15.8,15.1 C16.0209139,15.2656854 16.0656854,15.5790861 15.9,15.8 C14.8109678,17.252043 13.502043,18 12,18 C10.497957,18 9.18903222,17.252043 8.1,15.8 Z' />
  </svg>
);

export const BiometricScanContainer = ({ paused }: { paused: boolean }) => {
  // Create a ref to store the timeline so we can access it outside useGSAP
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const glyphRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const currentText = scanMessages[0];

  // useGSAP handles safe cleanup on unmount automatically
  useGSAP(
    () => {
      tlRef.current = gsap.timeline({
        paused: true, // Start paused, we'll control when it plays
        repeat: 0, // Run once
        delay: 1, // Wait for other loading elements
        onComplete: () => setIsComplete(true),
      });

      // Initial state setup
      gsap.set(successRef.current, { opacity: 0, scale: 0.5 });
      gsap.set(glyphRef.current, { scale: 0.5 });

      // --- Phase 1: Scan Line Animation ---
      // We animate the 'Scan Line' itself, which is a transparent gradient div
      tlRef.current.set(textRef.current, { text: scanMessages[0], opacity: 1 });
      tlRef.current.to('.scan-line', {
        y: '15000%', // Move from top to bottom
        duration: 1,
        ease: 'power2.inOut',
        repeat: 1, // Run back and forth twice
        yoyo: true, // Reverse animation
        // This function executes exactly when this specific tween finishes
        onComplete: () => {
          gsap.set('.scan-line', { opacity: 0 });
        },
      });
      tlRef.current
        .to(
          textRef.current,
          {
            text: {
              value: `${currentText}<br/>${scanMessages[1]}`,
              delimiter: '',
            },
            duration: 1,
            ease: 'none',
          },
          0.5,
        )
        .to(
          textRef.current,
          {
            text: {
              value: `${currentText}<br/>${scanMessages[1]}<br/>${scanMessages[2]}`,
              delimiter: '',
            },
            duration: 1.5,
            ease: 'none',
          },
          1.5,
        ) // 3. REMOVE TEXT: Fade out the container before transitioning to Success
        .to(
          textRef.current,
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
          },
          '+=0.5',
        ); // Happens after the messages finish displaying
      // --- Phase 2: MATCH Pulse ---
      // Occurs when scan-line finishes its yoyo
      tlRef.current.to(
        glyphRef.current,
        {
          scale: 0.75,
          filter: 'brightness(1.5) drop-shadow(0 0 15px var(--hud-glow))',
          color: 'var(--hud-success)', // Use your success variable
          duration: 0.1,
          ease: 'back.in',
        },
        '+=0.5',
      ); // Small offset after scan

      // --- Phase 3: Transition to Circle with Tick ---
      // Fade out the Glyph
      tlRef.current.to(
        glyphRef.current,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in',
        },
        '+=1',
      ); // Wait momentarily in pulsed state
    },
    { scope: containerRef },
  ); // Context scoping

  // WATCHER: This reacts whenever the 'paused' prop changes
  useEffect(() => {
    if (tlRef.current) {
      if (paused) {
        tlRef.current.pause();
      } else {
        tlRef.current.play();
      }
    }
  }, [paused]);

  return (
    <div
      ref={containerRef}
      className='relative w-full h-full p-4 flex items-center justify-center'
    >
      {/* 1. The Scanning Glyph Layer (State A & B) */}
      <div
        ref={glyphRef}
        className='relative transition-colors duration-300 w-full h-full text-hud-primary'
      >
        <BiometricFaceGlyph className='w-full h-full' />

        {/* The Technical 'Scan Line' Overlay */}
        {!isComplete && (
          <div
            className='scan-line absolute inset-0 w-full h-1 bg-gradient-to-b from-transparent via-hud-accent to-transparent shadow-[0_0_15px_var(--hud-accent)] opacity-80 z-10'
            style={{ top: '-10px' }} // Initial position off-top
          />
        )}
      </div>

      {/* 2. The Success Icon Layer (State C) */}
      {/* Positioned absolutely over the center of the container */}
      <div
        ref={successRef}
        className='absolute inset-0 flex items-center justify-center text-hud-success'
      >
        <FaUserCheck className='w-[65%] h-[65%]' />
      </div>
      {/* Added Missing Status Text Div */}
      <div className='absolute top-0 w-full text-center'>
        <div
          ref={textRef}
          className='font-mono text-s uppercase tracking-widest text-hud-accent'
        ></div>
      </div>
    </div>
  );
};;;
