import { BiAward, BiGitBranch } from "react-icons/bi";
import { BsCpu, BsHouse, BsLayers, BsNewspaper } from "react-icons/bs";

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
}

export interface CityConfig {
  name: string;
  lat: number;
  lon: number;
}

export const CITIES: CityConfig[] = [
  { name: 'DBN', lat: -29.8587, lon: 31.0218 },
  { name: 'JHB', lat: -26.2041, lon: 28.0473 },
  { name: 'CPT', lat: -33.9249, lon: 18.4241 },
];

// terminal
export interface CommandTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}
export interface OutputLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'ai';
  content: string | React.ReactNode;
}
export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
// nav
export interface NavigationProps {
  isDark: boolean;
  toggleTheme: () => void;
  onOpenTerminal: () => void;
  isMinimized?: boolean;
  isInPortal?: boolean;
  onNavClick?: (sectionId: string) => void;
}

export const navItems = [
  {
    id: 'home',
    label: 'HOME',
    icon: BsHouse,
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    icon: BsLayers,
  },
  {
    id: 'skills',
    label: 'SKILLS',
    icon: BsCpu,
  },
  {
    id: 'certificates',
    label: 'CERTIFICATES',
    icon: BiAward,
  },
  {
    id: 'algorithms',
    label: 'ALGORITHMS',
    icon: BiGitBranch,
  },
  {
    id: 'blog',
    label: 'BLOG',
    icon: BsNewspaper,
  },
];

