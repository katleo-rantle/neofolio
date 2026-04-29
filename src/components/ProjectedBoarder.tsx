import { useEffect, useState } from 'react';
import { useWeather } from '../hooks/useWeather';
export function ProjectedBorder() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const { error } = useWeather();
  const isOffline = !!error;

  useEffect(() => {
    const timer = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <div className='fixed inset-0 pointer-events-none z-101 overflow-hidden'>
      {/* Vignette & Light Leaks */}
      <div className='absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-0 mix-blend-multiply dark:mix-blend-normal'></div>
      <div className='absolute inset-0 shadow-[inset_0_0_50px_var(--hud-glow)] z-0'></div>

      {/* Edge Glow Pulses */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hud-primary to-transparent opacity-50 animate-[pulse_3s_ease-in-out_infinite]'></div>
      <div className='absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hud-primary to-transparent opacity-50 animate-[pulse_3s_ease-in-out_infinite_1s]'></div>
      <div className='absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-hud-accent to-transparent opacity-30 animate-[pulse_4s_ease-in-out_infinite_0.5s]'></div>
      <div className='absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-hud-accent to-transparent opacity-30 animate-[pulse_4s_ease-in-out_infinite_1.5s]'></div>

      {/* Sweeping Scanner Line */}
      <div className='absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-transparent via-hud-primary/10 to-transparent animate-[scan-line_6s_linear_infinite] opacity-50'></div>

      {/* Corner Brackets */}
      {/* Top Left */}
      <div className='absolute top-4 left-4 w-32 h-32'>
        <div className='absolute top-0 left-0 w-full h-[2px] bg-hud-primary shadow-[0_0_10px_var(--hud-primary)]'></div>
        <div className='absolute top-0 left-0 w-[2px] h-full bg-hud-primary shadow-[0_0_10px_var(--hud-primary)]'></div>
        <div className='absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white animate-ping opacity-50'></div>
        {/* Tick marks */}
        <div className='absolute top-[2px] left-8 w-[1px] h-2 bg-hud-primary'></div>
        <div className='absolute top-[2px] left-16 w-[1px] h-3 bg-hud-primary'></div>
        <div className='absolute top-[2px] left-24 w-[1px] h-2 bg-hud-primary'></div>
        <div className='absolute top-8 left-[2px] w-2 h-[1px] bg-hud-primary'></div>
        <div className='absolute top-16 left-[2px] w-3 h-[1px] bg-hud-primary'></div>
      </div>

      {/* Top Right */}
      <div className='absolute top-4 right-4 w-32 h-32'>
        <div className='absolute top-0 right-0 w-full h-[2px] bg-hud-primary shadow-[0_0_10px_var(--hud-primary)]'></div>
        <div className='absolute top-0 right-0 w-[2px] h-full bg-hud-primary shadow-[0_0_10px_var(--hud-primary)]'></div>
        <div className='absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white animate-ping opacity-50'></div>
        {/* Tick marks */}
        <div className='absolute top-[2px] right-8 w-[1px] h-2 bg-hud-primary'></div>
        <div className='absolute top-[2px] right-16 w-[1px] h-3 bg-hud-primary'></div>
        <div className='absolute top-[2px] right-24 w-[1px] h-2 bg-hud-primary'></div>
        <div className='absolute top-8 right-[2px] w-2 h-[1px] bg-hud-primary'></div>
        <div className='absolute top-16 right-[2px] w-3 h-[1px] bg-hud-primary'></div>
      </div>

      {/* Bottom Left */}
      <div className='absolute bottom-4 left-4 w-32 h-32'>
        <div className='absolute bottom-0 left-0 w-full h-[2px] bg-hud-accent shadow-[0_0_10px_var(--hud-accent)]'></div>
        <div className='absolute bottom-0 left-0 w-[2px] h-full bg-hud-accent shadow-[0_0_10px_var(--hud-accent)]'></div>
        <div className='absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white animate-ping opacity-50'></div>
        {/* Tick marks */}
        <div className='absolute bottom-[2px] left-8 w-[1px] h-2 bg-hud-accent'></div>
        <div className='absolute bottom-[2px] left-16 w-[1px] h-3 bg-hud-accent'></div>
        <div className='absolute bottom-[2px] left-24 w-[1px] h-2 bg-hud-accent'></div>
        <div className='absolute bottom-8 left-[2px] w-2 h-[1px] bg-hud-accent'></div>
        <div className='absolute bottom-16 left-[2px] w-3 h-[1px] bg-hud-accent'></div>
      </div>

      {/* Bottom Right */}
      <div className='absolute bottom-4 right-4 w-32 h-32'>
        <div className='absolute bottom-0 right-0 w-full h-[2px] bg-hud-accent shadow-[0_0_10px_var(--hud-accent)]'></div>
        <div className='absolute bottom-0 right-0 w-[2px] h-full bg-hud-accent shadow-[0_0_10px_var(--hud-accent)]'></div>
        <div className='absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white animate-ping opacity-50'></div>
        {/* Tick marks */}
        <div className='absolute bottom-[2px] right-8 w-[1px] h-2 bg-hud-accent'></div>
        <div className='absolute bottom-[2px] right-16 w-[1px] h-3 bg-hud-accent'></div>
        <div className='absolute bottom-[2px] right-24 w-[1px] h-2 bg-hud-accent'></div>
        <div className='absolute bottom-8 right-[2px] w-2 h-[1px] bg-hud-accent'></div>
        <div className='absolute bottom-16 right-[2px] w-3 h-[1px] bg-hud-accent'></div>
      </div>

      {/* Data Readouts */}
      <div className='absolute top-8 left-8 font-mono text-[10px] text-hud-primary/70 tracking-widest hidden sm:block'>
        <div className='flex items-center gap-2'>
          <span className='w-1.5 h-1.5 bg-hud-primary rounded-full animate-pulse'></span>
          T-MINUS: {time}
        </div>
      </div>

      <div className='absolute top-8 right-8 font-mono text-[10px] tracking-widest text-right hidden sm:block'>
        <div
          className={`flex items-center justify-end gap-2 ${isOffline ? 'text-hud-accent' : 'text-hud-primary/70'}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-hud-accent' : 'bg-hud-success animate-pulse'}`}
          ></span>
          SYSTEM {isOffline ? 'OFFLINE' : 'ONLINE'}
        </div>
      </div>

      <div className='absolute bottom-6 left-8 font-mono text-[10px] text-hud-accent/70 tracking-widest hidden sm:block'>
        <div>MEM_ALLOC: 64TB</div>
        <div className='w-24 h-[2px] bg-hud-accent/30 mt-1'>
          <div className='h-full bg-hud-accent w-[78%] animate-pulse'></div>
        </div>
      </div>

      <div className='absolute bottom-6 right-8 font-mono text-[10px] text-hud-accent/70 tracking-widest text-right hidden sm:block'>
        <div>SYS_V2.4_ONLINE</div>
        {/* <div className='opacity-70 mt-1'>FRAME_RATE: 144HZ</div> */}
      </div>
    </div>
  );
}
