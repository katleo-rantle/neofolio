import React, { useCallback, useEffect, useState, useRef } from 'react';

import { BiTerminal as Terminal , BiX as X } from 'react-icons/bi';
import {
  developerProfile,
  skills,
  projects,
  systemPrompt,
} from '../utils/developerData';
import type { ChatMessage, CommandTerminalProps, OutputLine } from '../utils/types';

const GROQ_API_KEY = import.meta.env.VITE_Groq_api_key;

export function CommandTerminal({ isOpen, onClose }: CommandTerminalProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<ChatMessage[]>([
    {
      role: 'system',
      content: systemPrompt,
    },
  ]);
  // Initial welcome message
  useEffect(() => {
    if (isOpen && output.length === 0) {
      setOutput([
        {
          id: 'welcome-1',
          type: 'system',
          content: 'Katleo.DEV TERMINAL v2.4 [Version 10.0.19045.3324]',
        },
        {
          id: 'welcome-2',
          type: 'system',
          content: '(c) Katleo Rantle Corporation. All rights reserved.',
        },
        {
          id: 'welcome-3',
          type: 'system',
          content:
            'Type "help" to see available commands. Use "ask <question>" to chat with AI.',
        },
        {
          id: 'welcome-4',
          type: 'system',
          content: 'GITHUB: https://github.com/Katleo-Rantle',
        },
      ]);
    }
  }, [isOpen, output.length]);
  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  // Scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isTyping]);
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  const typeWriterEffect = async (
    lines: string[],
    type: 'output' | 'error' | 'system' | 'ai' = 'output',
  ) => {
    setIsTyping(true);
    for (const line of lines) {
      const id = Math.random().toString(36).substring(7);
      // Add empty line first
      setOutput((prev) => [
        ...prev,
        {
          id,
          type,
          content: '',
        },
      ]);
      // Type out character by character
      let currentText = '';
      for (let i = 0; i < line.length; i++) {
        currentText += line[i];
        setOutput((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  content: currentText,
                }
              : item,
          ),
        );
        // Small delay between characters
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      // Small delay between lines
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    setIsTyping(false);
    setTimeout(() => inputRef.current?.focus(), 10);
  };
  const sendAIMessage = useCallback(async (question: string) => {
    const userMsg: ChatMessage = {
      role: 'user',
      content: question,
    };
    chatHistoryRef.current.push(userMsg);
    setIsTyping(true);
    // Show thinking indicator
    const thinkingId = Math.random().toString(36).substring(7);
    setOutput((prev) => [
      ...prev,
      {
        id: thinkingId,
        type: 'system',
        content: '> NEURAL_NET: Processing query...',
      },
    ]);
    try {
      let assistantContent: string;
      if (GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
        // Simulation mode
        await new Promise((resolve) => setTimeout(resolve, 1500));
        assistantContent = `[SIMULATION] I'm Katleo's AI assistant. You asked: "${question}". To enable real AI responses, add your Groq API key in hooks/useGroqChat.ts and components/CommandTerminal.tsx. In the meantime — Katleo is a Full-Stack Developer specializing in React, TypeScript, Three.js, and AI integrations!`;
      } else {
        const response = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: chatHistoryRef.current.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              temperature: 0.7,
              max_tokens: 500,
            }),
          },
        );
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        assistantContent =
          data.choices[0]?.message?.content || 'Error generating response.';
      }
      chatHistoryRef.current.push({
        role: 'assistant',
        content: assistantContent,
      });
      // Remove thinking indicator
      setOutput((prev) => prev.filter((item) => item.id !== thinkingId));
      setIsTyping(false);
      // Split response into lines for typewriter
      const lines = assistantContent.split('\n').filter((l) => l.length > 0);
      await typeWriterEffect(lines, 'ai');
    } catch (err) {
      setOutput((prev) => prev.filter((item) => item.id !== thinkingId));
      setIsTyping(false);
      await typeWriterEffect(
        ['NEURAL_NET ERROR: Connection to AI failed. Try again later.'],
        'error',
      );
    }
  }, []);
  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    // Add to output
    setOutput((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        type: 'input',
        content: `guest@Katleo.dev:~$ ${cmd}`,
      },
    ]);
    // Add to history
    if (trimmedCmd) {
      setHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
    }
    if (!trimmedCmd) return;
    switch (trimmedCmd) {
      case 'help':
        await typeWriterEffect([
          'AVAILABLE COMMANDS:',
          '  help          - Show this message',
          '  whoami        - Display profile information',
          '  skills        - List technical capabilities',
          '  projects      - View project database',
          '  contact       - Get contact information',
          '  ask <query>   - Chat with AI assistant',
          '  clear         - Clear terminal output',
          '  matrix        - Enter the matrix',
          '  exit          - Close terminal session',
          '',
          'GITHUB: https://github.com/Katleo-Rantle',
          '',
          'EXAMPLES:',
          '  ask What technologies does Katleo use?',
          '  ask Tell me about the Nexus Core project',
          '  projects 1',
        ]);
        break;
      case 'whoami':
        await typeWriterEffect([
          `NAME: ${developerProfile.name}`,
          `TITLE: ${developerProfile.title}`,
          `LOCATION: ${developerProfile.location}`,
          `STATUS: ${developerProfile.status}`,
          '',
          `BIO: ${developerProfile.bio}`,
        ]);
        break;
      case 'skills':
        const skillLines = skills.flatMap((group) => [
          `[${group.category.toUpperCase()}]`,
          ...group.items.map(
            (skill) =>
              `  > ${skill.name.padEnd(20)} [${'#'.repeat(Math.floor(skill.proficiency / 10))}${' '.repeat(10 - Math.floor(skill.proficiency / 10))}] ${skill.proficiency}%`,
          ),
          '',
        ]);
        await typeWriterEffect(skillLines);
        break;
      case 'projects':
        const projectLines = projects.map(
          (p) =>
            `[${p.id}] ${p.title.padEnd(25)} | ${p.category.padEnd(15)} | ${p.techStack.slice(0, 2).join(', ')}`,
        );
        await typeWriterEffect([
          'PROJECT DATABASE:',
          '--------------------------------------------------------------',
          'ID  TITLE                     | CATEGORY        | TECH',
          '--------------------------------------------------------------',
          ...projectLines,
          '--------------------------------------------------------------',
          'Type "projects [id]" to view details (e.g., "projects 1")',
        ]);
        break;
      case 'contact':
        await typeWriterEffect([
          'INITIATING SECURE COMM CHANNEL...',
          `EMAIL:    ${developerProfile.socialLinks.email}`,
          `GITHUB:   ${developerProfile.socialLinks.github}`,
          `LINKEDIN: ${developerProfile.socialLinks.linkedin}`,
          `TWITTER:  ${developerProfile.socialLinks.twitter}`,
        ]);
        break;
      case 'clear':
        setOutput([]);
        break;
      case 'matrix':
        await typeWriterEffect(
          [
            'WAKE UP, NEO...',
            'THE MATRIX HAS YOU...',
            'FOLLOW THE WHITE RABBIT.',
            'KNOCK, KNOCK, NEO.',
          ],
          'system',
        );
        // Add a fun CSS class to the body temporarily
        document.body.classList.add('matrix-mode');
        setTimeout(() => document.body.classList.remove('matrix-mode'), 5000);
        break;
      case 'exit':
        await typeWriterEffect(['Terminating session...']);
        setTimeout(onClose, 500);
        break;
      case 'sudo':
      case 'su':
        await typeWriterEffect(
          ['nice try.', 'this incident will be reported.'],
          'error',
        );
        break;
      case 'ask':
        await typeWriterEffect(
          [
            'Usage: ask <your question>',
            "Example: ask What are Katleo's top skills?",
          ],
          'system',
        );
        break;
      default:
        // Check for parameterized commands
        if (trimmedCmd.startsWith('ask ')) {
          const question = cmd.trim().substring(4).trim();
          if (question) {
            await sendAIMessage(question);
          } else {
            await typeWriterEffect(
              [
                'Usage: ask <your question>',
                "Example: ask What are Katleo's top skills?",
              ],
              'system',
            );
          }
        } else if (trimmedCmd.startsWith('projects ')) {
          const id = parseInt(trimmedCmd.split(' ')[1]);
          const project = projects.find((p) => p.id === id);
          if (project) {
            await typeWriterEffect([
              `PROJECT: ${project.title}`,
              `CATEGORY: ${project.category}`,
              `DESCRIPTION: ${project.description}`,
              `TECH STACK: ${project.techStack.join(', ')}`,
              `LINK: ${project.link}`,
            ]);
          } else {
            await typeWriterEffect(
              [`Error: Project ID ${id} not found.`],
              'error',
            );
          }
        } else {
          await typeWriterEffect(
            [
              `Command not found: ${cmd}`,
              'Type "help" for available commands.',
            ],
            'error',
          );
        }
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTyping) return;
    handleCommand(input);
    setInput('');
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isTyping) {
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };
  if (!isOpen) return null;
  return (
    <div
      className='fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm'
    >
      <div
        className='w-full max-w-4xl h-[80vh] flex flex-col bg-hud-surface border border-hud-primary shadow-[0_0_30px_var(--hud-glow)] clip-angled overflow-hidden'
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className='flex items-center justify-between px-4 py-2 bg-hud-primary/10 border-b border-hud-primary/30'>
          <div className='flex items-center gap-2 text-hud-primary font-mono text-sm'>
            <Terminal className='w-4 h-4' />
            <span>TERMINAL // ROOT ACCESS</span>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-hud-text-muted font-mono text-xs hidden sm:inline'>
              <kbd className='px-1.5 py-0.5 bg-hud-primary/20 border border-hud-primary/30 text-hud-primary text-[10px]'>
                `
              </kbd>{' '}
              toggle
              <span className='mx-2 text-hud-border'>|</span>
              <kbd className='px-1.5 py-0.5 bg-hud-primary/20 border border-hud-primary/30 text-hud-primary text-[10px]'>
                ESC
              </kbd>{' '}
              close
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className='text-hud-primary hover:text-hud-accent transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className='flex-1 overflow-y-auto p-4 font-mono text-sm sm:text-base space-y-1'
        >
          {output.map((line) => (
            <div
              key={line.id}
              className={`
                ${line.type === 'input' ? 'text-hud-text-muted' : ''}
                ${line.type === 'output' ? 'text-hud-text' : ''}
                ${line.type === 'error' ? 'text-red-500' : ''}
                ${line.type === 'system' ? 'text-hud-primary' : ''}
                ${line.type === 'ai' ? 'text-hud-accent pl-4 border-l-2 border-hud-accent/30' : ''}
                whitespace-pre-wrap
              `}
            >
              {line.type === 'ai' && (
                <span className='text-hud-accent/50 text-xs mr-2'>AI&gt;</span>
              )}
              {line.content}
            </div>
          ))}

          {/* Input Line */}
          <form onSubmit={handleSubmit} className='flex items-center mt-2'>
            <span className='text-hud-accent mr-2'>guest@Katleo.dev:~$</span>
            <input
              ref={inputRef}
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className='flex-1 bg-transparent outline-none text-hud-text caret-hud-primary'
              autoComplete='off'
              spellCheck='false'
            />
          </form>
        </div>
      </div>
    </div>
  );
}
