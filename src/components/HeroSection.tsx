import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { developerProfile } from '../utils/developerData';

import { FaEye, FaGithub, FaUsers, FaBookOpen } from 'react-icons/fa';
import {
  FiActivity,
  FiAlertTriangle,
  FiChevronDown,
  FiGitCommit,
} from 'react-icons/fi';

import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { useVisitCounter } from '../hooks/useVisitCounter';
import { useGitHubStats } from '../hooks/useGitHubStats';
import { WeatherHUD } from './HUDElements';

export function HeroSection() {
  const [showScroll, setShowScroll] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { displayVisits } = useVisitCounter();
  const {
    stats: ghStats,
    isLoading: ghLoading,
    error: ghError,
  } = useGitHubStats('katleo-rantle');

  useLayoutEffect(() => {
    gsap.registerPlugin(TextPlugin);
    const ctx = gsap.context(() => {
      // Random glitch effect on name
      const glitchInterval = setInterval(() => {
        const nameEls = document.querySelectorAll('.hero-name-layer');
        nameEls.forEach((el) => {
          el.classList.add('animate-ping');
          setTimeout(() => el.classList.remove('animate-ping'), 200);
        });
      }, 4000);

      // Store original texts
      const greetingEl = document.querySelector('.hero-greeting');
      const nameEls = document.querySelectorAll('.hero-name-text');
      const titleEl = document.querySelector('.hero-title-text');
      const bioEl = document.querySelector('.hero-bio-text');
      const greetingText = greetingEl?.textContent || '> INITIATING_USER:';
      const nameText = developerProfile.name;
      const titleText = developerProfile.title;
      const bioText = developerProfile.bio;
      // Clear texts initially
      if (greetingEl) greetingEl.textContent = '';
      nameEls.forEach((el) => (el.textContent = ''));
      if (titleEl) titleEl.textContent = '';
      if (bioEl) bioEl.textContent = '';
      const tl = gsap.timeline({
        delay: 0.5,
      });
      tl.fromTo(
        '.hero-status-panel',
        {
          opacity: 0,
          x: -50,
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        },
        {
          opacity: 1,
          x: 0,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 0.8,
          ease: 'power3.out',
        },
      )
        .to('.hero-greeting', {
          text: greetingText,
          duration: 0.5,
          ease: 'none',
        })
        .fromTo(
          '.hero-name-container',
          {
            opacity: 0,
            scale: 0.9,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.4,
            ease: 'back.out(1.5)',
          },
        )
        .to('.hero-name-text', {
          text: nameText,
          duration: 0.8,
          ease: 'none',
        })
        .fromTo(
          '.hero-bio-container',
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
          },
        )
        .to('.hero-title-text', {
          text: titleText,
          duration: 0.6,
          ease: 'none',
        })
        .to('.hero-bio-text', {
          text: bioText,
          duration: 1.5,
          ease: 'none',
        })
        .fromTo(
          '.hero-gh-panel',
          {
            opacity: 0,
            y: 40,
            rotationX: -15,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4',
        )
        .fromTo(
          '.hero-cta',
          {
            opacity: 0,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.1,
            ease: 'back.out(2)',
          },
          '-=0.2',
        )
        .fromTo(
          '.hero-scroll',
          {
            opacity: 0,
            y: -20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          '-=0.1',
        );
      return () => clearInterval(glitchInterval);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // scroll arrow
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY < 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id='home'
      ref={sectionRef}
      className='relative min-h-screen flex items-center pt-24 px-4 sm:px-6 lg:px-8 overflow-hidden'
    >
      {/* Layered Background - Intense Neon (Adaptive) */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none z-0'>
        <div className='absolute inset-0 circuit-bg opacity-30'></div>
        <div className='absolute -bottom-48 -right-48 w-[800px] h-[800px] radar-sweep opacity-30'></div>

        {/* Strong Pulse Rings */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-hud-primary/70 animate-[pulse-ring_2.8s_infinite]'></div>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-hud-primary/50 animate-[pulse-ring_3.6s_infinite_0.8s]'></div>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-hud-primary/30 animate-[pulse-ring_4.8s_infinite_2.2s]'></div>

        {/* Adaptive Neon Grid - Visible in Light Mode */}
        <div className='absolute inset-0 bg-[linear-gradient(to_right,var(--hud-primary)_1px,transparent_1px),linear-gradient(to_bottom,var(--hud-primary)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 dark:opacity-20'></div>

        {/* Powerful Scan Lines */}
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-hud-primary/30 to-transparent animate-[scan_4s_linear_infinite]'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-hud-primary/20 to-transparent animate-[scan_5.5s_linear_infinite_1.5s]'></div>


        {/* Corner Brackets */}
        
        <div className='absolute top-4 right-4 w-5 h-5 border-r-2 border-t-2 border-hud-primary shadow-[0_0_15px_var(--hud-primary)]'></div>
        
        <div className='absolute bottom-4 right-4 w-5 h-5 border-r-2 border-b-2 border-hud-primary shadow-[0_0_15px_var(--hud-primary)]'></div>
      </div>

      <div className='max-w-5xl mx-auto w-full z-10 relative'>
        {/* Complex HUD Status Panel */}
        <div className='hero-status-panel flex flex-wrap gap-4 mb-8 font-mono text-xs mt-4'>
          <div className='flex items-center gap-3 p-2 border border-hud-border bg-hud-surface/50 backdrop-blur-sm clip-angled'>
            <div className='w-8 h-8 border border-hud-primary/50 relative flex items-center justify-center bg-hud-primary/10'>
              <div className='absolute inset-0 circuit-bg opacity-30'></div>
              <div className='w-1.5 h-1.5 bg-hud-primary rounded-full animate-ping'></div>
            </div>
            <div>
              <div className='text-hud-text-muted'>LOCATION_SYNC</div>
              <div className='text-hud-primary'>
                {developerProfile.location}
              </div>
            </div>
          </div>
          <WeatherHUD />

          <div className='flex items-center gap-3 p-2 border border-hud-border bg-hud-surface/50 backdrop-blur-sm clip-angled'>
            <FaEye className='w-4 h-4 text-hud-primary' />
            <div>
              <div className='text-hud-text-muted'>VISIT_LOG</div>
              <div className='text-hud-primary font-bold tracking-widest'>
                {String(displayVisits).padStart(6, '0')}
              </div>
            </div>
          </div>
        </div>

        <h1 className='text-3xl sm:text-7xl md:text-8xl font-heading font-black tracking-tighter mb-6 uppercase relative z-10'>
          <span className='hero-greeting block text-hud-text-muted text-xl sm:text-2xl mb-2 tracking-widest'>
            &gt; INITIATING_USER:
          </span>
          {/* 3-Layer Chromatic Aberration Name */}

          <div className='hero-name-container relative inline-block font-heading-2 text-4xl sm:text-6xl uppercase tracking-tighter'>
            {/* Base Layer */}
            <span className='relative z-10 text-hud-text hero-name-text'>
              {developerProfile.name}
            </span>
            {/* Glitch Slices */}
            <span className='glitch-layer glitch-top text-cyan-500 hero-name-text'>
              {developerProfile.name}
            </span>
            <span className='glitch-layer glitch-bottom text-fuchsia-500 hero-name-text'>
              {developerProfile.name}
            </span>
          </div>
        </h1>
        {/* Bio + GitHub Row */}
        <div className='flex flex-col md:flex-row gap-6 mb-6'>
          <div className='hero-bio-container relative p-6 flex-1 bg-hud-surface/30 backdrop-blur-md border-l-4 border-hud-primary '>
            <div className='absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-hud-primary/30'></div>
            <div className='absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-hud-primary/30'></div>
            <h2 className='text-2xl sm:text-3xl font-body font-bold text-hud-primary mb-4 flex items-center gap-2'>
              <span className='w-2 h-2 bg-hud-accent animate-pulse'></span>
              <span className='hero-title-text'>{developerProfile.title}</span>
            </h2>
            <p className='hero-bio-text text-lg text-hud-text leading-relaxed font-body min-h-[80px]'>
              {developerProfile.bio}
            </p>
          </div>

          <div className='hero-gh-panel flex-1 relative group'>
            <div className='absolute -inset-1 bg-gradient-to-r from-hud-primary to-hud-accent opacity-20 blur group-hover:opacity-40 transition duration-1000'></div>
            <div className='hud-bg-surface border border-hud-border clip-notched p-5 relative overflow-hidden h-full'>
              <div className='holo-shimmer opacity-50'></div>
              <div className='absolute top-0 left-0 w-full h-[2px] bg-hud-primary animate-[scan-line_3s_linear_infinite]'></div>

              <div className='flex items-center gap-2 mb-4 border-b border-hud-border/50 pb-3 relative z-10'>
                <FaGithub className='w-5 h-5 text-hud-primary' />
                <h3 className='font-mono text-sm font-bold text-hud-text tracking-wider'>
                  GITHUB.TERMINAL // Katleo-Rantle
                </h3>
                {ghLoading && (
                  <span className='ml-auto flex gap-1'>
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
                  </span>
                )}
              </div>

              {ghError ? (
                <div className='flex items-center gap-2 text-hud-warning font-mono text-xs py-2 relative z-10'>
                  <FiAlertTriangle className='w-4 h-4' />
                  CONNECTION FAILED: {ghError}
                </div>
              ) : ghStats ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs relative z-10'>
                  <div className='space-y-3'>
                    <div className='flex items-center gap-3 text-hud-text-muted bg-hud-bg/50 p-2 border border-hud-border/30'>
                      <FaBookOpen className='w-4 h-4 text-hud-primary' />
                      <span>
                        PUBLIC_REPOS:{' '}
                        <span className='text-hud-text font-bold'>
                          {ghStats.publicRepos}
                        </span>
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-hud-text-muted bg-hud-bg/50 p-2 border border-hud-border/30'>
                      <FaUsers className='w-4 h-4 text-hud-primary' />
                      <span>
                        FOLLOWERS:{' '}
                        <span className='text-hud-text font-bold'>
                          {ghStats.followers}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className='space-y-3'>
                    {ghStats.latestRepo && (
                      <div className='flex items-center gap-3 text-hud-text-muted bg-hud-bg/50 p-2 border border-hud-border/30'>
                        <FiActivity className='w-4 h-4 text-hud-accent' />
                        <span className='truncate'>
                          LATEST:{' '}
                          <span className='text-hud-text'>
                            {ghStats.latestRepo.name}
                          </span>
                        </span>
                      </div>
                    )}
                    {ghStats.latestActivity && (
                      <div className='flex items-center gap-3 text-hud-text-muted bg-hud-bg/50 p-2 border border-hud-border/30'>
                        <FiGitCommit className='w-4 h-4 text-hud-accent' />
                        <span className='truncate'>
                          ACT:{' '}
                          <span className='text-hud-text'>
                            {ghStats.latestActivity.type}
                          </span>{' '}
                          ({ghStats.latestActivity.timeAgo})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className='h-16'></div>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-4 relative z-10 mb-12'>
          <a
            href='#projects'
            className='hero-cta relative overflow-hidden px-8 py-4 bg-hud-primary text-hud-bg font-heading font-bold tracking-widest hover:bg-hud-accent transition-colors clip-notched shadow-[0_0_15px_var(--hud-primary)] group'
          >
            <div className='absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12'></div>
            INITIATE_VIEW
          </a>
          <a
            href={developerProfile.socialLinks.github}
            target='_blank'
            rel='noreferrer'
            className='hero-cta relative overflow-hidden px-8 py-4 border border-hud-primary text-hud-primary font-heading font-bold tracking-widest hover:bg-hud-primary hover:text-hud-bg transition-colors clip-notched group'
          >
            <div className='absolute inset-0 bg-hud-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12'></div>
            GITHUB.EXE
          </a>
        </div>
      </div>

      {showScroll && (
        <div className='hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-0'>
          <FiChevronDown className='w-8 h-8 text-hud-primary opacity-50' />
        </div>
      )}
    </section>
  );
}
