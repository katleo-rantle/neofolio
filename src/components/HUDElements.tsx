import { useEffect, useState, useRef } from 'react';
import { FaExclamationTriangle, FaUserCheck } from 'react-icons/fa';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useWeather } from '../hooks/useWeather';

const scanMessages = [
  'ANALYZING BIOMETRICS...',
  'PLEASE DO NOT BLINK...',
  'JUST KIDDING, BLINK ALL YOU WANT.',
  'RETICULATING SPLINES...',
  'ACCESS GRANTED.',
];
import {
  BiCloud as Cloud,
  BiCloudRain as CloudRain,
  BiCloudSnow as CloudSnow,
  BiSun as Sun,
  BiCloudDrizzle as CloudDrizzle,
  BiWind as Wind,
} from 'react-icons/bi';

const ICON_MAP: Record<string, React.ReactNode> = {
  Clear: <Sun className='w-4 h-4' />,
  Cloudy: <Cloud className='w-4 h-4' />,
  Fog: <Wind className='w-4 h-4' />,
  Drizzle: <CloudDrizzle className='w-4 h-4' />,
  Rain: <CloudRain className='w-4 h-4' />,
  Snow: <CloudSnow className='w-4 h-4' />,
  Storm: <CloudRain className='w-4 h-4' />,
};

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
          color: 'var(--hud-primary)', // Use your success variable
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
        className='absolute inset-0 flex items-center justify-center text-hud-accent'
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
};

// 1. Define the helper function outside the component to keep the render clean
// Map WMO weather codes to conditions and icons

export const WeatherHUD = () => {
  const { weatherData, loading, error } = useWeather();
  if (loading) {
    return (
        <div className='flex items-center gap-4 p-2 border border-hud-border bg-hud-surface/50 backdrop-blur-sm clip-angled flex-1 min-w-[250px]'>
          <div className='flex-1 flex items-center justify-center gap-2 text-hud-primary'>
            <span className='w-1.5 h-1.5 bg-hud-primary rounded-full animate-bounce'></span>
            <span
              className='w-1.5 h-1.5 bg-hud-primary rounded-full animate-bounce'
              style={{
                animationDelay: '150ms',
              }}
            ></span>
            <span
              className='w-1.5 h-1.5 bg-hud-primary rounded-full animate-bounce'
              style={{
                animationDelay: '300ms',
              }}
            ></span>
            <span className='text-xs font-mono'>WEATHER_SYNC</span>
          </div>
        </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center gap-2 text-hud-accent'>
        <FaExclamationTriangle className='w-3 h-3' />
        <span className='font-monotemp text-[10px] uppercase'>SIGNAL LOST</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-4 p-2 border border-hud-border bg-hud-surface/50 backdrop-blur-sm clip-angled flex-1 min-w-[250px]'>
      {weatherData.map((data) => (
        <div key={data.city} className='flex-1'>
          <div className='flex items-center justify-start gap-5 text-hud-text-muted mb-1 text-[10px]'>
            <span className='truncate'>{data.city}</span>
            <div className='flex items-center gap-1 text-hud-primary'>
              {/* Look up the icon using the string from state */}
              {ICON_MAP[data.condition] || <Cloud className='w-4 h-4' />}
            </div>
          </div>
          <div className='flex items-baseline gap-1'>
            <span className='text-hud-primary font-bold text-sm'>
              {data.temperature}°
            </span>
            <span className='text-hud-text-muted text-[9px]'>
              {data.condition}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};