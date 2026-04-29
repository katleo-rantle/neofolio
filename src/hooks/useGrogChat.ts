import { useState, useCallback } from 'react';
import { systemPrompt } from '../utils/developerData';

// IMPORTANT: Replace this with your actual Groq API key
const apiKey = import.meta.env.VITE_Groq_api_key;

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export function useGroqChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: systemPrompt },
    {
      role: 'assistant',
      content:
        'SYSTEM ONLINE. I am the AI assistant for Katleo Rantle. Ask me about their skills, experience, or projects.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const newUserMessage: Message = { role: 'user', content };
      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);
      setError(null);

      try {
        if (apiKey === 'YOUR_GROQ_API_KEY_HERE') {
          // Simulate response if no API key is provided
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content:
                  '[SIMULATION MODE]: Please add your Groq API key in hooks/useGroqChat.ts to enable real AI responses. Katleo is a great developer though!',
              },
            ]);
            setIsLoading(false);
          }, 1500);
          return;
        }

        const response = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [...messages, newUserMessage].map((m) => ({
                role: m.role,
                content: m.content,
              })),
              temperature: 0.7,
              max_tokens: 500,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage =
          data.choices[0]?.message?.content || 'Error generating response.';

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: assistantMessage },
        ]);
      } catch (err) {
        console.error('Chat error:', err);
        setError('Connection lost. Please try again later.');
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'SYSTEM ERROR: Unable to connect to neural network. Please try again.',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  return {
    messages: messages.filter((m) => m.role !== 'system'), // Hide system prompt from UI
    sendMessage,
    isLoading,
    isTyping: isLoading,
    error,
  };
}
