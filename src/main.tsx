
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { SoundProvider } from './hooks/useSoundEngine.tsx';

createRoot(document.getElementById('root')!).render(
    <SoundProvider>
      <App />
    </SoundProvider>
  
);
