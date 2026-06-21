/**
 * Universe data model — adding a new planet = one object in this file.
 * PHASE 2: replace with CMS/API fetch so planets are auto-generated.
 */

export const galaxies = [
  // ─── Creator Galaxy ───────────────────────────────────────────────────────
  {
    id: 'creator',
    name: 'Creator Galaxy',
    subtitle: 'Content & Personal Brand',
    icon: '📸',
    position: [-32, 6, -10],
    color: '#ff6b9d',
    emissive: '#aa1144',
    glowColor: '#ff2d78',
    description: 'Where creativity meets identity. Reels, design, and personal brand — all in one orbit.',
    planets: [
      {
        id: 'alireza-tak',
        name: 'Alireza Tak',
        client: 'Personal Brand',
        category: 'Instagram · Content Creation',
        label: '@alireza__tak',
        url: 'https://www.instagram.com/alireza__tak',
        color: '#ff6b9d',
        atmosphereColor: '#ff2d7844',
        ringColor: null,
        icon: '📸',
        size: 1.3,
        orbitRadius: 5,
        orbitSpeed: 0.18,
        theme: 'creator',
        stack: ['Instagram', 'Reels', 'Photography', 'Design'],
        metrics: [
          { label: 'Platform', value: 'Instagram' },
          { label: 'Content', value: 'Reels & Posts' },
          { label: 'Focus', value: 'Personal Brand' },
          { label: 'Style', value: 'Visual Storytelling' },
        ],
        description: 'Exploring creativity through video, design, and visual storytelling. Building a personal brand that connects and inspires.',
        tags: ['Content Creation', 'Instagram Reels', 'Design Work', 'Personal Brand', 'Social Growth'],
        screenshots: [],
        flagship: false,
      },
    ],
  },

  // ─── Web Agency Galaxy ────────────────────────────────────────────────────
  {
    id: 'agency',
    name: 'Web Agency Galaxy',
    subtitle: 'Design & Development',
    icon: '🌐',
    position: [30, -4, -18],
    color: '#00b4d8',
    emissive: '#005080',
    glowColor: '#0096c7',
    description: 'Full-service web agency — branding, development, and digital experiences that convert.',
    planets: [
      {
        id: 'rahweb',
        name: 'RahWeb',
        client: 'Agency',
        category: 'Web Design & Development',
        label: 'rahweb.com',
        url: 'https://rahweb.com',
        color: '#00b4d8',
        atmosphereColor: '#00b4d833',
        ringColor: '#00d4ff',
        icon: '🌐',
        size: 1.5,
        orbitRadius: 5,
        orbitSpeed: 0.14,
        theme: 'agency',
        stack: ['Next.js', 'React', 'Tailwind', 'UI/UX', 'Branding'],
        metrics: [
          { label: 'Type', value: 'Web Agency' },
          { label: 'Services', value: 'Design & Dev' },
          { label: 'Stack', value: 'Next.js · React' },
          { label: 'Clients', value: 'Multiple' },
        ],
        description: 'Professional web design and development agency. Crafting fast, beautiful, and functional digital experiences for ambitious clients.',
        tags: ['Web Design', 'Branding', 'Next.js', 'UI/UX', 'Client Projects', 'Agency'],
        screenshots: [],
        flagship: false,
      },
    ],
  },

  // ─── Elite Galaxy (Flagship) ──────────────────────────────────────────────
  {
    id: 'elite',
    name: 'Elite Galaxy',
    subtitle: 'Flagship SaaS Platform',
    icon: '💎',
    position: [-16, -8, -35],
    color: '#48cae4',
    emissive: '#004080',
    glowColor: '#00d4ff',
    description: 'The crown jewel — a luxury service platform reimagining premium car care in Denmark.',
    planets: [
      {
        id: 'elite-vask',
        name: 'Elite Vask',
        client: 'Elite Vask ApS',
        category: 'Premium SaaS · Booking Platform',
        label: 'elite-vask.dk',
        url: 'https://www.elite-vask.dk',
        color: '#00d4ff',
        atmosphereColor: '#00d4ff22',
        ringColor: '#ffffff44',
        icon: '💎',
        size: 1.9,
        orbitRadius: 5,
        orbitSpeed: 0.10,
        theme: 'elite',
        stack: ['Next.js', 'React 19', 'AI Booking', 'Vercel', 'Tailwind'],
        metrics: [
          { label: 'Platform', value: 'SaaS · Booking' },
          { label: 'Market', value: 'Denmark' },
          { label: 'Stack', value: 'Next.js · AI' },
          { label: 'Category', value: 'Premium Service' },
        ],
        description: 'Premium car cleaning platform with AI-powered booking, real-time scheduling, and luxury customer experience. Built from scratch — Denmark\'s finest.',
        tags: ['Luxury', 'Booking System', 'Service Automation', 'AI', 'Customer Experience', 'SaaS', 'Denmark'],
        screenshots: [],
        flagship: true, // gets "Enter Project World" iframe button
      },
    ],
  },

  // ─── Professional Network Galaxy ─────────────────────────────────────────
  {
    id: 'network',
    name: 'Network Galaxy',
    subtitle: 'Career & Professional Journey',
    icon: '💼',
    position: [24, 10, -30],
    color: '#0077b5',
    emissive: '#003366',
    glowColor: '#0a66c2',
    description: 'Professional journey — skills, certifications, and career milestones mapped across space.',
    planets: [
      {
        id: 'linkedin',
        name: 'LinkedIn',
        client: 'Alireza Makvandi',
        category: 'Professional Network · Career',
        label: 'Alireza Makvandi',
        url: 'https://dk.linkedin.com/in/alireza-makvandi-446704301',
        color: '#0077b5',
        atmosphereColor: '#0077b533',
        ringColor: '#00a0dc44',
        icon: '💼',
        size: 1.3,
        orbitRadius: 5,
        orbitSpeed: 0.12,
        theme: 'network',
        stack: ['Full-Stack', 'Next.js', 'React', 'Node.js', 'Three.js'],
        metrics: [
          { label: 'Role', value: 'Web Developer' },
          { label: 'Location', value: 'Denmark' },
          { label: 'Specialty', value: 'Full-Stack' },
          { label: 'Focus', value: 'SaaS & 3D' },
        ],
        description: 'Full-stack developer based in Denmark. Building scalable platforms, luxury digital experiences, and AI-powered products. Open to collaboration.',
        tags: ['Full-Stack Dev', 'Next.js', 'React', 'Three.js', 'Denmark', 'Career', 'Open to Work'],
        screenshots: [],
        flagship: false,
      },
    ],
  },

  // ─── Milky Way (Personal / Coming Soon) ──────────────────────────────────
  // PHASE 2: Add more planets here as projects grow
  {
    id: 'milky-way',
    name: 'Milky Way',
    subtitle: 'Experiments & R&D',
    icon: '🔬',
    position: [4, 14, -42],
    color: '#f4a261',
    emissive: '#7a3000',
    glowColor: '#e76f51',
    description: 'Classified experiments, side projects, and things not ready for the universe yet.',
    planets: [
      {
        id: 'secret-lab',
        name: 'Secret Lab',
        client: 'R&D',
        category: 'Experiments · Coming Soon',
        label: '???',
        url: '#',
        color: '#f4a261',
        atmosphereColor: '#f4a26133',
        ringColor: null,
        icon: '🔬',
        size: 1.0,
        orbitRadius: 5,
        orbitSpeed: 0.08,
        theme: 'lab',
        stack: ['WebGL', 'Three.js', 'WASM', 'Rust'],
        metrics: [
          { label: 'Status', value: 'Classified' },
          { label: 'Stage', value: 'R&D' },
          { label: 'ETA', value: 'Unknown' },
          { label: 'Type', value: 'Experiment' },
        ],
        description: 'Something massive is being built in the dark. Classified experiments and R&D that will change the game.',
        tags: ['Coming Soon', 'Experiments', 'WebGL', 'R&D', 'Classified'],
        screenshots: [],
        flagship: false,
      },
    ],
  },
]

export function getGalaxyById(id) {
  return galaxies.find(g => g.id === id) ?? null
}

export function getPlanetById(id) {
  for (const g of galaxies) {
    const p = g.planets.find(p => p.id === id)
    if (p) return { galaxy: g, planet: p }
  }
  return null
}
