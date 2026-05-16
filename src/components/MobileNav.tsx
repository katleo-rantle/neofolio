import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSoundEngine } from '../hooks/useSoundEngine';
import { navItems } from '../utils/types';
import { BiMenu, BiX } from 'react-icons/bi';

interface MobileNavFabProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string; // Add this prop to track current location
}

export function MobileNavFab({ onNavClick, activeSection }: MobileNavFabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { playClick, playHover, playTransition } = useSoundEngine();

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // FIXED: GSAP Pulse logic
  useGSAP(() => {
    if (!isOpen) return;

    // Find the index of the active section
    const activeIndex = navItems.findIndex((item) => item.id === activeSection);
    const activeEl =
      groupRefs.current[activeIndex]?.querySelector('.satellite-button');

    if (activeEl) {
      gsap.to(activeEl, {
        boxShadow: '0 0 20px 2px rgba(var(--hud-primary-rgb), 0.8)',
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: 'sine.inOut',
      });
    }
  }, [isOpen, activeSection]);

  const toggleMenu = contextSafe((forceClose?: boolean) => {
    const newState = forceClose ? false : !isOpen;
    if (newState === isOpen) return;

    setIsOpen(newState);
    const tl = gsap.timeline();
    const radius = 130;
    const angleStep = 120 / (navItems.length - 1);

    if (newState) {
      playTransition();
      tl.to(backdropRef.current, {
        opacity: 1,
        display: 'block',
        duration: 0.3,
      });

      groupRefs.current.forEach((group, i) => {
        if (!group) return;
        const angle = (120 + i * angleStep) * (Math.PI / 180);
        tl.fromTo(
          group,
          { opacity: 0, x: 0, y: 0, scale: 0 },
          {
            opacity: 1,
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.2)',
            display: 'flex',
          },
          i * 0.03,
        );
      });
    } else {
      playClick();
      tl.to(groupRefs.current, {
        opacity: 0,
        x: 0,
        y: 0,
        scale: 0.5,
        duration: 0.2,
        stagger: { each: 0.02, from: 'end' },
      });
      tl.to(
        backdropRef.current,
        { opacity: 0, display: 'none', duration: 0.2 },
        '-=0.1',
      );
    }
  });

  return (
    <div
      ref={containerRef}
      className='md:hidden fixed inset-0 pointer-events-none z-[200]'
    >
      <div
        ref={backdropRef}
        onClick={(e) => {
          e.stopPropagation();
          toggleMenu(true);
        }}
        className='absolute inset-0 bg-hud-bg/70 backdrop-blur-md hidden opacity-0 pointer-events-auto'
      />

      <div className='absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}
          onMouseEnter={playHover}
          className={`w-14 h-14 bg-hud-surface border-2 rounded-full flex items-center justify-center z-50 relative transition-all duration-300 ${
            isOpen
              ? 'border-hud-primary shadow-[0_0_20px_var(--hud-primary)]'
              : 'border-hud-primary/50 shadow-lg'
          }`}
        >
          {isOpen ? (
            <BiX className='w-8 h-8 text-hud-primary' />
          ) : (
            <BiMenu className='w-8 h-8 text-hud-primary animate-pulse' />
          )}
        </button>

        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <div
              key={item.id}
              ref={(el) => {
                if (el) groupRefs.current[i] = el;
              }}
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden items-center'
              style={{ opacity: 0 }}
            >
              <span
                className={`absolute right-full mr-4 text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-1 border-l-2 transition-colors ${
                  isActive
                    ? 'text-hud-primary border-hud-primary bg-hud-primary/10 font-bold'
                    : 'text-hud-text-muted border-hud-border bg-hud-surface/90'
                }`}
              >
                {item.label}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavClick(item.id);
                  toggleMenu(true);
                }}
                onMouseEnter={() => {
                  playHover();
                  gsap.to(groupRefs.current[i], { scale: 1.15, duration: 0.2 });
                }}
                onMouseLeave={() => {
                  gsap.to(groupRefs.current[i], { scale: 1, duration: 0.2 });
                }}
                // Added "satellite-button" class for GSAP to find
                className={`satellite-button w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md group/sat ${
                  isActive
                    ? 'bg-hud-primary border-2 border-hud-primary shadow-[0_0_15px_var(--hud-primary)]'
                    : 'bg-hud-surface border border-hud-border hover:border-hud-primary hover:shadow-[0_0_10px_var(--hud-primary)]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${isActive ? 'text-hud-bg' : 'text-hud-primary group-hover/sat:text-hud-primary'}`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}