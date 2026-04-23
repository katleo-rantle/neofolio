import { useState } from 'react';
import './App.css'
import { LoadingScreen } from './components/LoadingScreen';
import { ProjectedBorder } from './components/ProjectedBoarder';
import { HeroSection } from './components/HeroSection';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className='min-h-screen relative selection:bg-hud-primary selection:text-hud-bg'>
      <ProjectedBorder/>
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <>
        <div className="flex relative z-10">
              <main className="flex-1 lg:pr-[25.5rem] w-full">
                <HeroSection />
              </main>
              <aside className="hidden lg:block absolute top-0 right-0 w-[25.5rem] h-full bg-hud-surface/80 backdrop-blur-lg border-l border-hud-primary/20 p-8">
                <h2 className="text-xl font-heading text-hud-primary mb-4">Sidebar</h2>
                <p className="text-sm text-hud-text">This is a sidebar that appears on larger screens.</p>
              </aside>
        </div>
        </>
      )}
    </div>
  );
}

export default App
