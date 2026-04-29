import { useState } from 'react';
import { ProfilePanel } from './PanelProfile';
import { RobotChat } from './PanelRobot';

import { BiUser, BiMessageSquare, BiX } from 'react-icons/bi';
export function StickyAside() {
  const [activeTab, setActiveTab] = useState<'profile' | 'chat'>('profile');
  const [isOpen, setIsOpen] = useState(false); // For mobile toggle
  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className='lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-hud-primary text-hud-bg rounded-full shadow-[0_0_15px_var(--hud-primary)]'
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <BiX className='w-6 h-6' />
        ) : (
          <BiMessageSquare className='w-6 h-6' />
        )}
      </button>

      {/* Aside Container */}
      <aside
        className={`
        fixed top-12 right-6 ml-60 bottom-12 z-49 w-full sm:w-96 bg-hud-surface transition-transform duration-300 ease-in-out flex flex-col border border-hud-border clip-angled overflow-hidden
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}
      >
        {/* Tabs */}
        <div className='flex h-12 shrink-0 border-b border-hud-border bg-hud-bg'>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 font-mono text-sm transition-colors ${activeTab === 'profile' ? 'text-hud-primary border-b-2 border-hud-primary bg-hud-surface' : 'text-hud-text-muted hover:text-hud-text'}`}
          >
            <BiUser className='w-4 h-4' />
            PROFILE
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 font-mono text-sm transition-colors ${activeTab === 'chat' ? 'text-hud-primary border-b-2 border-hud-primary bg-hud-surface' : 'text-hud-text-muted hover:text-hud-text'}`}
          >
            <BiMessageSquare  className='w-2 h-2' />
            AI_ASSISTANT
          </button>
        </div>

        {/* Content Area */}
        <div className='flex-1 overflow-hidden relative ml-12 sm:ml-0'>
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'profile' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <ProfilePanel />
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'chat' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <RobotChat />
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-45'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
