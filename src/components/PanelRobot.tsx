import React, { useEffect, useState, useRef } from 'react';
import { useGroqChat } from '../hooks/useGrogChat';
import { RobotSVG } from './RobotSVG';

import { BiSend } from 'react-icons/bi';
import { FiAlertCircle as AlertCircle } from 'react-icons/fi';
import { useWeather } from '../hooks/useWeather';

export function RobotChat() {
  const { error: err } = useWeather();
  const isOffline = !!err;
  const { messages, sendMessage, isLoading, isTyping, error } = useGroqChat();
  const [input, setInput] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
    }
  };
  const isUserTyping = input.length > 0;
  const robotState = isTyping
    ? 'typing'
    : isLoading
      ? 'responding'
      : isUserTyping
        ? 'user-typing'
        : isHovered
          ? 'hover'
          : 'idle';
  return (
    <div className='flex flex-col h-full bg-hud-surface border-l border-hud-border'>
      {/* Header with Robot */}
      <div
        className='p-6 border-b border-hud-border flex items-center gap-4 bg-hud-bg/50'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='w-16 h-16 shrink-0'>
          <RobotSVG state={robotState} />
        </div>
        <div>
          <h3 className='font-heading font-bold text-hud-primary tracking-wider'>
            K.A.T.L.E.O BOT
          </h3>
          <p className='text-xs font-mono text-hud-text-muted flex items-center gap-2'>
            <span
              className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-hud-accent' : 'bg-hud-success animate-pulse'}`}
            ></span>
            {isOffline ? 'OFFLINE' : 'ONLINE'}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth'>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 text-sm font-body clip-angled-br ${msg.role === 'user' ? 'bg-hud-primary/20 text-hud-text border border-hud-primary' : 'bg-hud-bg text-hud-text border border-hud-border'}`}
            >
              {msg.role === 'assistant' && (
                <div className='text-xs font-mono text-hud-primary mb-1 border-b border-hud-border/50 pb-1'>
                  &gt; SYSTEM_RESPONSE
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className='flex justify-start'>
            <div className='bg-hud-bg border border-hud-border p-3 clip-angled-br flex gap-1 items-center h-10'>
              <span
                className='w-2 h-2 bg-hud-primary rounded-full animate-bounce'
                style={{
                  animationDelay: '0ms',
                }}
              ></span>
              <span
                className='w-2 h-2 bg-hud-primary rounded-full animate-bounce'
                style={{
                  animationDelay: '150ms',
                }}
              ></span>
              <span
                className='w-2 h-2 bg-hud-primary rounded-full animate-bounce'
                style={{
                  animationDelay: '300ms',
                }}
              ></span>
            </div>
          </div>
        )}

        {error && (
          <div className='flex justify-center'>
            <div className='bg-red-500/10 border border-red-500 text-red-500 p-2 text-xs font-mono flex items-center gap-2'>
              <AlertCircle className='w-4 h-4' />
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className='p-4 border-t border-hud-border bg-hud-bg/50 relative overflow-hidden'
      >
        {/* Glow effect at bottom when typing */}
        <div
          className={`absolute bottom-0 left-0 w-full h-1 bg-hud-primary transition-all duration-300 ${isUserTyping ? 'opacity-100 shadow-[0_0_15px_var(--hud-primary)]' : 'opacity-0'}`}
        />

        <div className='relative flex items-center'>
          <span
            className={`absolute left-3 font-mono text-sm transition-colors duration-300 ${isUserTyping ? 'text-hud-accent' : 'text-hud-primary'}`}
          >
            &gt;
          </span>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask about my skills...'
            disabled={isLoading}
            className={`w-full bg-hud-surface border text-hud-text font-mono text-sm py-3 pl-8 pr-12 focus:outline-none transition-all disabled:opacity-50 ${isUserTyping ? 'border-hud-accent ring-1 ring-hud-accent/50' : 'border-hud-border focus:border-hud-primary focus:ring-1 focus:ring-hud-primary'}`}
          />

          <button
            type='submit'
            disabled={isLoading || !input.trim()}
            className={`absolute right-2 p-1.5 transition-colors disabled:opacity-50 ${isUserTyping ? 'text-hud-accent hover:text-hud-primary' : 'text-hud-primary hover:text-hud-accent'}`}
          >
            <BiSend className='w-5 h-5' />
          </button>
        </div>
      </form>
    </div>
  );
}
