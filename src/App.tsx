import { useState, useEffect } from 'react';
import './App.css';
import { LoadingScreen } from './components/LoadingScreen';
import { ProjectedBorder } from './components/ProjectedBoarder';
import { HeroSection } from './components/HeroSection';
import { Navigation } from './components/Navigation';
import { useTheme } from './hooks/useTheme';
import { useSoundEngine } from './hooks/useSoundEngine';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isNavMinimized, setIsNavMinimized] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [forceClosePortal, setForceClosePortal] = useState(false);
  const { playHover, playClick, playTransition } = useSoundEngine();

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
          <div className='flex relative z-10'>
            <main className='flex-1 lg:pr-[25.5rem] w-full'>
              <HeroSection />
            </main>
            <aside className='hidden lg:block absolute top-0 right-0 w-[25.5rem] h-full bg-hud-surface/80 backdrop-blur-lg border-l border-hud-primary/20 p-8'>
              <h2 className='text-xl font-heading text-hud-primary mb-4'>
                Sidebar
              </h2>
              <p className='text-sm text-hud-text'>
                This is a sidebar that appears on larger screens.
              </p>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
