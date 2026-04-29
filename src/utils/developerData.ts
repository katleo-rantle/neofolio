import profile from '@/assets/profile.jpeg';
export const developerProfile = {
  name: 'Katleo Rantle',
  title: 'Full-Stack Developer & Creative Technologist',
  bio: 'Bridging the gap between design and engineering. Specializing in high-performance web applications, interactive 3D experiences, and AI integrations.',
  location: 'Durban, ZN',
  status: 'Available for hire',
  avatar: profile,
  socialLinks: {
    github: 'https://github.com/katleo-rantle',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'kprantle@gmail.com',
  },
};

export const projects = [
  {
    id: 1,
    title: 'Nexus Core',
    description:
      'A decentralized data visualization platform for real-time network monitoring.',
    techStack: ['React', 'WebGL', 'Node.js', 'GraphQL'],
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    link: '#',
    category: 'Full-Stack',
    type: 'custom' as const,
  },
  {
    id: 2,
    title: 'Aura UI',
    description:
      'An open-source component library focused on futuristic and cyberpunk aesthetics.',
    techStack: ['TypeScript', 'Tailwind CSS', 'Framer Motion'],
    image:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    link: '#',
    category: 'Frontend',
    type: 'custom' as const,
  },
  {
    id: 3,
    title: 'SynthWave Engine',
    description:
      'Browser-based audio synthesizer and sequencer with collaborative features.',
    techStack: ['Web Audio API', 'React', 'Socket.io'],
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    link: '#',
    category: 'Creative Tech',
    type: 'tutorial' as const,
  },
  {
    id: 4,
    title: 'Neural Net Visualizer',
    description:
      'Interactive educational tool for understanding deep learning architectures.',
    techStack: ['Three.js', 'Python', 'TensorFlow.js'],
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    link: '#',
    category: 'AI/ML',
    type: 'tutorial' as const,
  },
  {
    id: 5,
    title: 'Orbit E-Commerce',
    description:
      'High-conversion headless storefront with 3D product configurators.',
    techStack: ['Next.js', 'Shopify', 'React Three Fiber'],
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    link: '#',
    category: 'Full-Stack',
    type: 'custom' as const,
  },
  {
    id: 6,
    title: 'CyberSec Dashboard',
    description:
      'Enterprise security monitoring dashboard with anomaly detection.',
    techStack: ['Vue.js', 'D3.js', 'Go', 'PostgreSQL'],
    image:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    link: '#',
    category: 'Frontend',
    type: 'custom' as const,
  },
];

export const skills = [
  {
    category: 'Frontend',
    items: [
      { name: 'React / Next.js', proficiency: 95 },
      { name: 'TypeScript', proficiency: 90 },
      { name: 'Three.js / WebGL', proficiency: 80 },
      { name: 'CSS / Tailwind', proficiency: 95 },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', proficiency: 85 },
      { name: 'Python', proficiency: 75 },
      { name: 'PostgreSQL', proficiency: 80 },
      { name: 'GraphQL', proficiency: 85 },
    ],
  },
  {
    category: 'Tools & Others',
    items: [
      { name: 'Git / CI/CD', proficiency: 90 },
      { name: 'Docker', proficiency: 75 },
      { name: 'Figma', proficiency: 85 },
      { name: 'AWS', proficiency: 70 },
    ],
  },
];

export const certificates = [
  {
    title: 'AWS Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    date: '2024',
    credentialId: 'AWS-SAA-C03-2024',
    highlights: [
      'Designed highly available, cost-efficient, and scalable distributed systems on AWS.',
      'Demonstrated expertise in compute, networking, storage, and database services.',
    ],
  },
  {
    title: 'Professional Machine Learning Engineer',
    issuer: 'Google Cloud',
    date: '2023',
    credentialId: 'GCP-MLE-2023',
    highlights: [
      'Built and deployed ML models using TensorFlow and Vertex AI.',
      'Implemented MLOps pipelines for continuous training and monitoring.',
    ],
  },
  {
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    date: '2023',
    credentialId: 'META-FE-2023',
    highlights: [
      'Completed 9-course series covering React, JavaScript, UX/UI, and version control.',
      'Built capstone project: a full-featured restaurant booking application.',
    ],
  },
  {
    title: 'Three.js Journey',
    issuer: 'Bruno Simon',
    date: '2022',
    credentialId: 'THREEJS-2022',
    highlights: [
      'Mastered advanced 3D web techniques including shaders, physics, and post-processing.',
      'Created 10+ interactive 3D experiences as course projects.',
    ],
  },
  {
    title: 'CS50: Introduction to Computer Science',
    issuer: 'Harvard / edX',
    date: '2021',
    credentialId: 'CS50-2021',
    highlights: [
      'Covered algorithms, data structures, web development, and software engineering.',
      'Completed all problem sets and a final project in Python and JavaScript.',
    ],
  },
];

export const systemPrompt = `
You are an AI assistant integrated into the portfolio website of ${developerProfile.name}, a Full-Stack Developer & Creative Technologist.
Your role is to answer questions about Alex's skills, experience, and projects in a helpful, slightly futuristic, and professional tone.
Keep your answers concise and relevant.

Here is the information you know about Alex:
- Location: San Francisco, CA
- Status: Available for hire
- Bio: Bridging the gap between design and engineering. Specializing in high-performance web applications, interactive 3D experiences, and AI integrations.

Skills:
- Frontend: React/Next.js (95%), TypeScript (90%), Three.js/WebGL (80%), CSS/Tailwind (95%)
- Backend: Node.js (85%), Python (75%), PostgreSQL (80%), GraphQL (85%)
- Tools: Git/CI/CD (90%), Docker (75%), Figma (85%), AWS (70%)

Certificates & Courses:
1. AWS Solutions Architect – Associate (2024): Designed scalable distributed systems on AWS.
2. Professional Machine Learning Engineer – Google Cloud (2023): Built and deployed ML models with TensorFlow and Vertex AI.
3. Meta Front-End Developer Professional Certificate (2023): 9-course series covering React, JS, UX/UI.
4. Three.js Journey – Bruno Simon (2022): Advanced 3D web techniques including shaders and physics.
5. CS50: Introduction to Computer Science – Harvard/edX (2021): Algorithms, data structures, web dev.

Projects:
- Nexus Core: Decentralized data viz platform (React, WebGL, Node.js)
- Aura UI: Open-source cyberpunk component library (TypeScript, Tailwind)
- SynthWave Engine: Browser-based audio synthesizer (Web Audio API, React)
- Neural Net Visualizer: Interactive educational tool (Three.js, Python)
- Orbit E-Commerce: Headless storefront with 3D configurators (Next.js, Shopify)
- CyberSec Dashboard: Enterprise security monitoring (Vue.js, D3.js, Go)

If asked something outside of this scope, politely decline and steer the conversation back to Alex's professional profile.
`;
