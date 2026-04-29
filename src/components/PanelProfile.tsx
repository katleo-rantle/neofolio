import { developerProfile } from '../utils/developerData';
import { BsMailbox as Mail, BsGithub as Github, BsLinkedin as Linkedin , BsTwitter as Twitter} from 'react-icons/bs';
import { BiMapPin as MapPin, BiBriefcase as Briefcase } from 'react-icons/bi';

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
        <div className='p-4 border border-hud-border bg-hud-bg clip-angled-br'>
          <h3 className='text-hud-text-muted mb-3 border-b border-hud-border pb-2'>
            SYS.INFO
          </h3>
          <ul className='space-y-3'>
            <li className='flex items-center gap-3 text-hud-text'>
              <MapPin className='w-4 h-4 text-hud-primary' />
              {developerProfile.location}
            </li>
            <li className='flex items-center gap-3 text-hud-text'>
              <Briefcase className='w-4 h-4 text-hud-primary' />
              {developerProfile.status}
            </li>
            <li className='flex items-center gap-3 text-hud-text'>
              <Mail className='w-4 h-4 text-hud-primary' />
              {developerProfile.email}
            </li>
          </ul>
        </div>

        <div className='p-4 border border-hud-border bg-hud-bg clip-angled-br'>
          <h3 className='text-hud-text-muted mb-3 border-b border-hud-border pb-2'>
            NETWORK.LINKS
          </h3>
          <div className='flex justify-around'>
            <a
              href={developerProfile.socialLinks.github}
              className='p-2 text-hud-text hover:text-hud-primary hover:bg-hud-primary/10 transition-colors border border-transparent hover:border-hud-primary'
            >
              <Github className='w-5 h-5' />
            </a>
            <a
              href={developerProfile.socialLinks.linkedin}
              className='p-2 text-hud-text hover:text-hud-primary hover:bg-hud-primary/10 transition-colors border border-transparent hover:border-hud-primary'
            >
              <Linkedin className='w-5 h-5' />
            </a>
            <a
              href={developerProfile.socialLinks.twitter}
              className='p-2 text-hud-text hover:text-hud-primary hover:bg-hud-primary/10 transition-colors border border-transparent hover:border-hud-primary'
            >
              <Twitter className='w-5 h-5' />
            </a>
          </div>
        </div>

        <div className='mt-8'>
          <a
            href='mailto:hello@alex.dev'
            className='block w-full py-3 text-center bg-hud-primary text-hud-bg font-heading font-bold tracking-widest hover:bg-hud-accent transition-colors clip-angled'
          >
            INITIATE_CONTACT
          </a>
        </div>
      </div>
    </div>
  );
}
