import { useState, useEffect } from 'react';
import './App.css';
import { LoadingScreen } from './components/LoadingScreen';
import { ProjectedBorder } from './components/ProjectedBoarder';
import { HeroSection } from './components/HeroSection';
import { Navigation } from './components/Navigation';
import { useTheme } from './hooks/useTheme';
import { useSoundEngine } from './hooks/useSoundEngine';
import { StickyAside } from './components/StickyAside';
import { CommandTerminal } from './components/CommandTerminal';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isNavMinimized, setIsNavMinimized] = useState(false);
  const [_forceClosePortal, setForceClosePortal] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const { playHover, playClick, playTransition } = useSoundEngine();

  // Scroll detection for navbar minimize
  useEffect(() => {
    if (isLoading) return;
    const handleScroll = () => {
      const heroSection = document.querySelector('#hero-section');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setIsNavMinimized(heroBottom < 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);


  // Global sound listeners
  useEffect(() => {
    let lastHoverTarget: HTMLElement | null = null;
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest(
        'button, a, .interactive',
      ) as HTMLElement;
      if (interactiveEl && interactiveEl !== lastHoverTarget) {
        playHover();
        lastHoverTarget = interactiveEl;
      } else if (!interactiveEl) {
        lastHoverTarget = null;
      }
    };
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .interactive')) {
        playClick();
      }
    };
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
    };
  }, [playHover, playClick]);
  const handleNavClick = (sectionId: string) => {
    playTransition();
    if (isPortalOpen) {
      // Force close portal, then scroll after animation
      setForceClosePortal(true);
      setIsPortalOpen(false);
      setTimeout(() => {
        setForceClosePortal(false);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 300);
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
    <div className='min-h-screen relative selection:bg-hud-primary selection:text-hud-bg'>
      <ProjectedBorder />
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <Navigation
            isDark={isDark}
            toggleTheme={toggleTheme}
            onOpenTerminal={() => setIsTerminalOpen(true)}
            isMinimized={isNavMinimized}
            isInPortal={isPortalOpen}
            onNavClick={handleNavClick}
          />
          <div className='flex relative'>
            <main className='flex-1 lg:pr-[25.5rem] w-full'>
              <HeroSection />
            </main>
            <StickyAside />
            <CommandTerminal
              isOpen={isTerminalOpen}
              onClose={() => setIsTerminalOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
