/**
 * fake-identity.ts
 * ────────────────────────────────────────────────────────────
 * Mock AI engine for identity discovery flows.
 *
 * Provides:
 * 1. Conversational reflections for each discovery question
 * 2. Entrepreneur profile generation from collected identity data
 * 3. Personalized roadmap step generation
 * 4. Hunch Book pattern detection
 *
 * All responses are deterministic (based on input data) with simulated
 * latency to mimic real AI processing.
 * ────────────────────────────────────────────────────────────
 */

import type {
  PersonalityDimension,
  ValueItem,
  PassionItem,
  SkillItem,
  LifeStoryEntry,
  ProblemEntry,
  EntrepreneurProfile,
  HunchBookEntry,
} from '../store/useIdentityStore';

// ──────────────────────────────────────────────────────────
// SIMULATED LATENCY
// ──────────────────────────────────────────────────────────

async function simulateThinking(ms = 1200): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

// ──────────────────────────────────────────────────────────
// 1. PERSONALITY REFLECTIONS
// ──────────────────────────────────────────────────────────

const personalityReflections: Record<string, string[]> = {
  'problem-solving': [
    "Interesting! Your approach to problem-solving says a lot about how you'll lead a startup. Deep researchers often build the most defensible companies.",
    "A hands-on builder mindset is the engine of every great MVP. You learn by doing — that's powerful.",
    "Seeking out people who've solved similar problems shows strong network intelligence. Founders who learn from others avoid costly mistakes.",
    "Reframing problems is the hallmark of disruptive thinkers. You don't just solve problems — you redefine them.",
  ],
  'building-vs-leading': [
    "Builders create things the world has never seen. That energy drives product innovation.",
    "Organizers and leaders multiply the efforts of teams. Every great company needs someone who can orchestrate talent.",
    "You enjoy both building and leading — that's rare. The best founders do both, especially in the early stages.",
  ],
  'uncertainty': [
    "Embracing uncertainty is the entrepreneurial superpower. Markets change, plans break — but you adapt.",
    "Preferring structure shows discipline. The best founders combine creative vision with operational rigor.",
    "You're somewhere in the middle — comfortable enough to take risks, but grounded enough to plan. That's a strong balance.",
  ],
  'research-vs-execution': [
    "Research-first founders build deeper moats. Understanding the problem space before building prevents wasted effort.",
    "Execution-first founders ship faster. Speed is a competitive advantage when you're testing product-market fit.",
    "Balancing research and execution is ideal. You validate before building, but you don't overthink.",
  ],
  'dream-project': [
    "The way you'd invest $10,000 reveals your deepest entrepreneurial instincts. Your answer tells us where your passion meets your skills.",
  ],
};

export async function getPersonalityReflection(
  questionId: string,
  answerIndex: number,
): Promise<string> {
  await simulateThinking(800);
  const pool = personalityReflections[questionId] ?? personalityReflections['dream-project']!;
  return pool[Math.min(answerIndex, pool.length - 1)]!;
}

// ──────────────────────────────────────────────────────────
// 2. LIFE STORY REFLECTIONS
// ──────────────────────────────────────────────────────────

const lifeStoryReflections: Record<string, string> = {
  'about-yourself':
    "Thank you for sharing that. Knowing who you are beyond your resume is where real self-awareness begins. Let's keep going.",
  'proud-of':
    "That's a powerful moment. The things we're proudest of often point to the impact we want to create in the world.",
  'challenges':
    "Challenges shape resilience. Every founder's greatest strength was forged in their toughest moment. Yours will be your foundation.",
  'dream-future':
    "Your vision of the future is the compass for your entrepreneurial journey. Let's work toward making that real.",
  'inspiration':
    "The people who inspire us reveal the values we hold deepest. There's a pattern here — let's explore it.",
};

export async function getLifeStoryReflection(questionId: string): Promise<string> {
  await simulateThinking(1000);
  return (
    lifeStoryReflections[questionId] ??
    "That's a thoughtful response. Every piece of your story adds to the picture of who you are as a founder."
  );
}

// ──────────────────────────────────────────────────────────
// 3. PROBLEM DISCOVERY PROMPTS
// ──────────────────────────────────────────────────────────

export const problemDomains = [
  {
    id: 'daily',
    label: 'Daily Life',
    icon: '☀️',
    prompt: 'What frustrates you every single day? What small or big problems do you face regularly?',
    followUp: 'How long has this problem existed? Who else faces it?',
  },
  {
    id: 'college',
    label: 'College / Workplace',
    icon: '🎓',
    prompt: 'What problems exist in your college, school, or workplace that nobody is solving?',
    followUp: 'Have you talked to others about this? How do they cope with it currently?',
  },
  {
    id: 'family',
    label: 'Family & Parents',
    icon: '👨‍👩‍👧‍👦',
    prompt: 'What problems do your parents or family members face? Think about health, finance, daily routines.',
    followUp: "Why hasn't this been solved yet? What would a perfect solution look like?",
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    icon: '🏥',
    prompt: 'What problems exist in hospitals, clinics, or the healthcare system that you\'ve noticed?',
    followUp: 'Who suffers most from this problem? How does it impact lives?',
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    icon: '🌾',
    prompt: 'What problems do farmers face? Think about supply chains, technology access, water, markets.',
    followUp: 'How could technology help solve this? What stops farmers from adopting solutions?',
  },
  {
    id: 'education',
    label: 'Education',
    icon: '📚',
    prompt: 'What is broken about how we learn? What problems do students, teachers, or institutions face?',
    followUp: 'If you could redesign one aspect of education, what would it be?',
  },
  {
    id: 'environment',
    label: 'Environment & Climate',
    icon: '🌍',
    prompt: 'What environmental or sustainability problems concern you? Think local and global.',
    followUp: 'What would motivate people to change their behavior around this?',
  },
  {
    id: 'finance',
    label: 'Finance & Money',
    icon: '💰',
    prompt: 'What financial problems do people around you face? Think about savings, payments, insurance, investments.',
    followUp: 'Who is most underserved by current financial products?',
  },
];

export async function getProblemReflection(
  domain: string,
  problemDescription: string,
): Promise<string> {
  await simulateThinking(1000);

  const responses: Record<string, string> = {
    daily: `Everyday friction is where the biggest consumer opportunities hide. The fact that "${problemDescription.slice(0, 60)}..." still bothers you means current solutions are failing.`,
    college: `Institutional problems often reveal systemic inefficiencies. If this problem exists at your college, it likely exists at thousands of others.`,
    family: `Problems that affect families carry deep emotional weight. Solutions to family-level pain points create the most loyal users.`,
    healthcare: `Healthcare is one of the most impactful sectors to innovate in. Regulatory barriers are high, but the reward — saving lives — is priceless.`,
    agriculture: `Agriculture technology is ripe for disruption. Most farmers still use methods from decades ago. Simple solutions can transform livelihoods.`,
    education: `Education shapes generations. The problems you've identified here could impact millions of learners worldwide.`,
    environment: `Climate and environment problems are existential. Startups in this space attract both impact investors and mission-driven talent.`,
    finance: `Financial inclusion is one of the most powerful forces for reducing inequality. The problems you see here matter deeply.`,
  };

  return (
    responses[domain] ??
    `That's a sharp observation. Problems that genuinely frustrate you are the ones worth solving — because you'll have the stamina to keep going when it gets hard.`
  );
}

// ──────────────────────────────────────────────────────────
// 4. ENTREPRENEUR PROFILE GENERATION
// ──────────────────────────────────────────────────────────

const archetypeMap: Record<string, { name: string; tagline: string }> = {
  'AI': { name: 'AI Pioneer', tagline: 'Building intelligent systems that augment human potential' },
  'Healthcare': { name: 'Healthcare Innovator', tagline: 'Reimagining health systems to save and improve lives' },
  'Agriculture': { name: 'AgriTech Visionary', tagline: 'Transforming how the world grows and distributes food' },
  'Education': { name: 'EdTech Architect', tagline: 'Redesigning how humanity learns and grows' },
  'Robotics': { name: 'Robotics Engineer', tagline: 'Building machines that extend human capability' },
  'Finance': { name: 'FinTech Disruptor', tagline: 'Making financial tools accessible to everyone' },
  'Sustainability': { name: 'Impact Builder', tagline: 'Creating solutions that heal the planet while building value' },
  'Gaming': { name: 'Gaming Innovator', tagline: 'Crafting experiences that connect and inspire millions' },
  'Manufacturing': { name: 'Deep Tech Builder', tagline: 'Engineering the physical infrastructure of the future' },
  'Space': { name: 'Space Pioneer', tagline: 'Pushing the boundaries of exploration and science' },
  'Climate': { name: 'Climate Warrior', tagline: 'Developing solutions for the defining challenge of our generation' },
  'Social Media': { name: 'Community Architect', tagline: 'Building platforms that bring people together meaningfully' },
  'Retail': { name: 'Commerce Innovator', tagline: 'Transforming how people discover and buy what they need' },
  'Logistics': { name: 'Supply Chain Pioneer', tagline: 'Optimizing the invisible networks that power the world' },
  'Entertainment': { name: 'Creative Technologist', tagline: 'Blending art and technology to create unforgettable experiences' },
};

const skillLevelScore: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

export async function generateEntrepreneurProfile(
  personality: PersonalityDimension[],
  values: ValueItem[],
  passions: PassionItem[],
  skills: SkillItem[],
  lifeStory: LifeStoryEntry[],
  problems: ProblemEntry[],
): Promise<EntrepreneurProfile> {
  await simulateThinking(2500); // Longer delay for "deep analysis"

  // Determine primary passion (highest excitement)
  const sortedPassions = [...passions].sort((a, b) => b.excitementLevel - a.excitementLevel);
  const primaryPassion = sortedPassions[0]?.industry ?? 'Technology';

  // Determine archetype from primary passion
  const archetype = archetypeMap[primaryPassion] ?? {
    name: 'Startup Builder',
    tagline: 'Turning ideas into impactful ventures',
  };

  // Extract top traits from personality
  const topTraits = personality
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((p) => p.answer);

  // Extract top values
  const topValues = values
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3)
    .map((v) => v.label);

  // Strengths: top-rated skills
  const sortedSkills = [...skills].sort(
    (a, b) => (skillLevelScore[b.level] ?? 0) - (skillLevelScore[a.level] ?? 0),
  );
  const strengths = sortedSkills.slice(0, 4).map((s) => s.name);

  // Growth areas: lowest-rated skills
  const growthAreas = sortedSkills
    .slice(-3)
    .filter((s) => s.level === 'beginner' || s.level === 'intermediate')
    .map((s) => s.name);

  // Problem focus: most passionate problem domain
  const problemDomainCounts: Record<string, number> = {};
  for (const p of problems) {
    problemDomainCounts[p.domain] = (problemDomainCounts[p.domain] ?? 0) + p.passionScore;
  }
  const problemFocus =
    Object.entries(problemDomainCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? 'Daily Life';

  // Suggested roadmap focus
  const roadmapFocusMap: Record<string, string> = {
    'AI': 'AI/ML research and product development',
    'Healthcare': 'Healthcare systems research and patient experience design',
    'Agriculture': 'Agricultural technology and supply chain optimization',
    'Education': 'Learning science research and EdTech product design',
    'Finance': 'Financial systems research and product development',
    'Sustainability': 'Environmental impact assessment and circular economy design',
  };

  return {
    archetype: archetype.name,
    tagline: archetype.tagline,
    topTraits: topTraits.length > 0 ? topTraits : ['Curious Learner', 'Problem Solver', 'Purpose-Driven'],
    topValues: topValues.length > 0 ? topValues : ['Innovation', 'Impact', 'Freedom'],
    strengths: strengths.length > 0 ? strengths : ['Problem Solving', 'Research', 'Technology'],
    growthAreas: growthAreas.length > 0 ? growthAreas : ['Networking', 'Sales', 'Public Speaking'],
    primaryPassion,
    problemFocus,
    suggestedRoadmapFocus:
      roadmapFocusMap[primaryPassion] ?? `${primaryPassion} industry research and product validation`,
    generatedAt: Date.now(),
  };
}

// ──────────────────────────────────────────────────────────
// 5. PERSONALIZED ROADMAP GENERATION
// ──────────────────────────────────────────────────────────

export interface RoadmapStep {
  level: number;
  title: string;
  description: string;
  phase: 'discover' | 'validate' | 'build' | 'launch' | 'scale';
}

export function generatePersonalizedRoadmap(profile: EntrepreneurProfile): RoadmapStep[] {
  const passion = profile.primaryPassion;
  const focus = profile.problemFocus;

  return [
    { level: 1, title: 'Define Your Vision', description: `Articulate your vision for solving ${focus} problems through ${passion}`, phase: 'discover' },
    { level: 2, title: 'Deep Industry Research', description: `Study the ${passion} landscape — key players, trends, and gaps`, phase: 'discover' },
    { level: 3, title: 'Problem Deep Dive', description: `Interview people affected by ${focus} problems. Understand their pain deeply`, phase: 'discover' },
    { level: 4, title: 'Competitive Analysis', description: `Map existing solutions in ${passion}. Find what's missing`, phase: 'validate' },
    { level: 5, title: 'Customer Validation', description: `Talk to 20+ potential users. Validate your problem hypothesis`, phase: 'validate' },
    { level: 6, title: 'Solution Design', description: `Design your unique solution leveraging your strengths in ${profile.strengths[0] ?? 'technology'}`, phase: 'validate' },
    { level: 7, title: 'Business Model', description: `Define how your ${passion} solution creates and captures value`, phase: 'build' },
    { level: 8, title: 'Build Your Prototype', description: `Create an MVP that demonstrates your core value proposition`, phase: 'build' },
    { level: 9, title: 'User Testing', description: `Put your prototype in users' hands. Measure what works and what doesn't`, phase: 'build' },
    { level: 10, title: 'Financial Planning', description: `Build your financial model — revenue projections, unit economics, runway`, phase: 'build' },
    { level: 11, title: 'Team Building', description: `Identify co-founders or early team members. Build in your ${profile.growthAreas[0] ?? 'growth'} areas`, phase: 'launch' },
    { level: 12, title: 'Legal & Registration', description: `Register your company. Set up legal structures and IP protection`, phase: 'launch' },
    { level: 13, title: 'Funding Preparation', description: `Prepare pitch deck, financial model, and investor outreach strategy`, phase: 'launch' },
    { level: 14, title: 'Launch Your Startup', description: `Go to market! Acquire your first paying customers in ${passion}`, phase: 'scale' },
    { level: 15, title: 'Scale & Impact', description: `Grow your ${passion} venture. Measure impact. Build the future`, phase: 'scale' },
  ];
}

// ──────────────────────────────────────────────────────────
// 6. HUNCH BOOK PATTERN DETECTION
// ──────────────────────────────────────────────────────────

const themeKeywords: Record<string, string[]> = {
  'Healthcare': ['health', 'hospital', 'doctor', 'patient', 'medical', 'medicine', 'clinic', 'disease', 'treatment', 'diagnosis'],
  'Education': ['school', 'university', 'student', 'teacher', 'learn', 'course', 'education', 'study', 'classroom', 'exam'],
  'Agriculture': ['farm', 'crop', 'agriculture', 'soil', 'harvest', 'livestock', 'irrigation', 'food', 'organic', 'seeds'],
  'AI & Technology': ['ai', 'machine learning', 'robot', 'automation', 'software', 'app', 'algorithm', 'data', 'code', 'tech'],
  'Finance': ['money', 'payment', 'bank', 'invest', 'loan', 'savings', 'insurance', 'crypto', 'wallet', 'budget'],
  'Sustainability': ['environment', 'green', 'recycle', 'waste', 'solar', 'climate', 'pollution', 'carbon', 'renewable', 'eco'],
  'Logistics': ['delivery', 'transport', 'supply chain', 'shipping', 'warehouse', 'route', 'tracking', 'fleet', 'logistics'],
  'Social Impact': ['community', 'poverty', 'equality', 'access', 'rural', 'ngo', 'charity', 'volunteer', 'women', 'empowerment'],
};

export function detectIdeaTheme(content: string): { tags: string[]; theme: string | undefined } {
  const lower = content.toLowerCase();
  const detectedThemes: { theme: string; count: number }[] = [];
  const tags: string[] = [];

  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    let matchCount = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        matchCount++;
        if (!tags.includes(keyword)) tags.push(keyword);
      }
    }
    if (matchCount > 0) {
      detectedThemes.push({ theme, count: matchCount });
    }
  }

  // Sort by match count and return the strongest theme
  detectedThemes.sort((a, b) => b.count - a.count);

  return {
    tags: tags.slice(0, 5),
    theme: detectedThemes[0]?.theme,
  };
}

export interface PatternInsight {
  theme: string;
  count: number;
  message: string;
}

export function detectHunchPatterns(entries: HunchBookEntry[]): PatternInsight[] {
  const themeCounts: Record<string, number> = {};

  for (const entry of entries) {
    if (entry.aiTheme) {
      themeCounts[entry.aiTheme] = (themeCounts[entry.aiTheme] ?? 0) + 1;
    }
  }

  return Object.entries(themeCounts)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .map(([theme, count]) => ({
      theme,
      count,
      message: `You've had ${count} ideas related to ${theme}. This could be your sweet spot for startup innovation.`,
    }));
}
