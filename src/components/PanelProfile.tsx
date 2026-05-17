import { developerProfile } from '../utils/developerData';
import HudCubeDisplay from './HudCubeDisplay';

export function ProfilePanel() {
  return (
    <div className='h-full bg-hud-surface border-l border-hud-border overflow-y-auto p-6'>
      <div className='flex flex-col items-center text-center mb-6'>
        <div className='w-38 h-38 relative mb-4'>
          <div className='absolute inset-0 border-2 border-hud-primary clip-angled animate-glow-pulse'></div>
          <img
            src={developerProfile.avatar}
            alt={developerProfile.name}
            className='w-full h-full object-cover clip-angled p-1 grayscale hover:grayscale-0 transition-all duration-500'
          />
        </div>
        <h2 className='text-2xl font-heading font-bold text-hud-text'>
          {developerProfile.name}
        </h2>
        <p className='text-sm font-mono text-hud-primary mt-1'>
          {developerProfile.title}
        </p>
      </div>

      <div className='space-y-6 font-mono text-sm'>

        <div className='canvas-container'>
          <HudCubeDisplay />
        </div>


      </div>
    </div>
  );
}
