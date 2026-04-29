import React from 'react';
import { FiSun, FiMoon, FiTerminal } from 'react-icons/fi';
import { BiCommand } from 'react-icons/bi';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

import { useSoundEngine } from '../hooks/useSoundEngine';
interface NavigationProps {
  isDark: boolean;
  toggleTheme: () => void;
  onOpenTerminal: () => void;
  isMinimized?: boolean;
  isInPortal?: boolean;
  onNavClick?: (sectionId: string) => void;
}
export function Navigation({
  isDark,
  toggleTheme,
  onOpenTerminal,
  isMinimized = false,
  isInPortal = false,
  onNavClick,
}: NavigationProps) {
  const { isSoundEnabled, toggleSound } = useSoundEngine();
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: string,
  ) => {
    e.preventDefault();
    const sectionId = item.toLowerCase();
    if (onNavClick) {
      onNavClick(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };
  return (
    <div
      className={`fixed top-12 left-6 w-[calc(100%-3rem)] lg:right-[calc(24rem+1.5rem)] lg:w-auto lg:left-6 pointer-events-none transition-all duration-300 ${isInPortal ? 'z-[110]' : 'z-40'}`}
    >
      {/* Integrated Nav Bar - flush with top border */}
      <header className='w-full bg-hud-bg/80 backdrop-blur-md border border-hud-border pointer-events-auto relative transition-all duration-300 clip-angled'>


        <div
          className={`px-4 sm:px-6 lg:px-8 max-w-full flex items-center justify-between relative z-10 transition-all duration-300 ${isMinimized ? 'h-10' : 'h-14'}`}
        >
          <div className='flex items-center gap-3 group cursor-pointer'>
            <div
              className={`relative flex items-center justify-center transition-all duration-300 ${isMinimized ? 'w-5 h-5' : 'w-7 h-7'}`}
            >
              <svg
                className='absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]'
                viewBox='0 0 100 100'
              >
                <polygon
                  points='50,5 90,25 90,75 50,95 10,75 10,25'
                  fill='none'
                  stroke='var(--hud-primary)'
                  strokeWidth='2'
                />
              </svg>
              <FiTerminal
                className={`text-hud-primary group-hover:text-hud-accent transition-all duration-300 ${isMinimized ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'}`}
              />
            </div>
            <span
              className={`font-heading font-bold tracking-widest text-hud-text chromatic-text transition-all duration-300 ${isMinimized ? 'text-sm' : 'text-lg'}`}
              data-text='ALEX.DEV'
            >
              KATLEO<span className='text-hud-primary'>.DEV</span>
            </span>
          </div>

          <nav
            className={`hidden md:flex items-center font-mono transition-all duration-300 ${isMinimized ? 'gap-3 text-[10px]' : 'gap-6 text-xs'}`}
          >
            {['PROJECTS', 'SKILLS', 'CERTIFICATES', 'ALGORITHMS'].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => handleNavClick(e, item)}
                  className='group relative flex items-center gap-1.5 text-hud-text-muted hover:text-hud-primary transition-colors'
                >
                  <span className='text-[8px] text-hud-primary/50 group-hover:text-hud-accent transition-colors group-hover:animate-ping'>
                    ◆
                  </span>
                  <span className='tracking-widest'>{item}</span>
                  <div className='absolute -bottom-1 left-0 w-0 h-[1px] bg-hud-primary group-hover:w-full transition-all duration-300'></div>
                </a>
              ),
            )}
          </nav>

          <div className='flex items-center gap-3'>
            {/* Heartbeat Monitor SVG - hide when minimized */}
            {!isMinimized && (
              <div className='hidden lg:block w-14 h-5 relative opacity-40'>
                <svg
                  viewBox='0 0 100 30'
                  className='w-full h-full stroke-hud-accent fill-none'
                  strokeWidth='1.5'
                >
                  <path
                    d='M0,15 L20,15 L25,5 L35,25 L45,0 L55,30 L65,15 L100,15'
                    strokeDasharray='200'
                    strokeDashoffset='200'
                    className='animate-[heartbeat_2s_linear_infinite]'
                  />
                </svg>
              </div>
            )}

            <div className='flex items-center gap-1.5'>
              <button
                onClick={toggleSound}
                className={`p-1.5 border border-hud-border/50 text-hud-primary hover:bg-hud-primary hover:text-hud-bg transition-all duration-300 ${isMinimized ? 'scale-90' : ''}`}
                aria-label='Toggle sound'
                title='Toggle Sound'
              >
                {isSoundEnabled ? (
                  <FaVolumeUp className='w-3.5 h-3.5' />
                ) : (
                  <FaVolumeMute className='w-3.5 h-3.5' />
                )}
              </button>
              <button
                onClick={onOpenTerminal}
                className={`p-1.5 border border-hud-border/50 text-hud-primary hover:bg-hud-primary hover:text-hud-bg transition-all duration-300 flex items-center gap-1.5 group ${isMinimized ? 'scale-90' : ''}`}
                aria-label='Open Terminal'
                title='Open Terminal (`)'
              >
                <BiCommand className='w-3.5 h-3.5' />
                {!isMinimized && (
                  <span className='hidden sm:inline font-mono text-[10px] opacity-50 group-hover:opacity-100'>
                    CMD
                  </span>
                )}
              </button>
              <button
                onClick={toggleTheme}
                className={`p-1.5 border border-hud-border/50 text-hud-primary hover:bg-hud-primary hover:text-hud-bg transition-all duration-300 ${isMinimized ? 'scale-90' : ''}`}
                aria-label='Toggle theme'
              >
                {isDark ? (
                  <FiSun className='w-3.5 h-3.5' />
                ) : (
                  <FiMoon className='w-3.5 h-3.5' />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
