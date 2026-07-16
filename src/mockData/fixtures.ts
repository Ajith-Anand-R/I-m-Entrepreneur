export interface MentorPersona {
  id: string;
  name: string;
  role: string;
  specialty: string;
  color: string; // Tailored HSL/Hex color token matches
  iconName: string; // Lucide icon reference
  knowsAbout: string[]; // Document types they can access
  starterPrompts: string[];
}

export interface JourneyLevel {
  id: number;
  title: string;
  learnContent: string;
  activityPrompt: string;
  unlockState: 'locked' | 'current' | 'completed';
  conceptExplanation: string;
}

export interface GeneratorTemplate {
  id: string;
  title: string;
  description: string;
  prefillFields: string[]; // Fields that can map from the Knowledge Base
}

export interface AcademyLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'notes' | 'quiz' | 'worksheet';
  completed: boolean;
}

export interface AcademyModule {
  id: string;
  title: string;
  lessons: AcademyLesson[];
}

export const MENTORS: MentorPersona[] = [
  {
    id: 'startup-mentor',
    name: 'Sarah Jenkins',
    role: 'Generalist Startup Coach',
    specialty: 'Validating early concepts, building MVPs, and general strategy.',
    color: '#0B1B3F', // ink-900
    iconName: 'Compass',
    knowsAbout: ['Lean Canvas', 'SWOT Analysis', 'Customer interviews'],
    starterPrompts: [
      'How do I pivot my business model based on current validation?',
      'Review my problem statement for EcoSphere Solutions.',
      'What are the next steps for my MVP stage?'
    ]
  },
  {
    id: 'funding-mentor',
    name: 'David Chen',
    role: 'Funding Specialist',
    specialty: 'Navigating venture capital, seed rounds, and cap table design.',
    color: '#2BB8A6', // accent-teal
    iconName: 'DollarSign',
    knowsAbout: ['Financial Projection', 'Pitch Deck', 'Grant Proposal'],
    starterPrompts: [
      'What funding options are best for a validating stage startup?',
      'How do I estimate pre-seed valuation?',
      'Review my pitch deck structure.'
    ]
  },
  {
    id: 'marketing-mentor',
    name: 'Elena Rostova',
    role: 'Growth Marketer',
    specialty: 'Inbound marketing campaigns, SEO strategy, and brand narrative.',
    color: '#7C5CF2', // accent-violet
    iconName: 'Megaphone',
    knowsAbout: ['Market Research', 'SWOT Analysis', 'Customer interviews'],
    starterPrompts: [
      'How can I structure customer acquisition loops on a zero budget?',
      'Draft a growth marketing campaign for EcoSphere.',
      'What channels are best for circular economy brands?'
    ]
  },
  {
    id: 'sales-mentor',
    name: 'Marcus Brody',
    role: 'B2B Sales Architect',
    specialty: 'Enterprise sales processes, closing frameworks, and CRM pipelines.',
    color: '#F2A93B', // accent-amber
    iconName: 'TrendingUp',
    knowsAbout: ['Business Plan', 'Lean Canvas'],
    starterPrompts: [
      'How do I draft a sales pitch for retail managers?',
      'Create a standard sales pipeline structure for kiosks.',
      'How to handle enterprise contract objections?'
    ]
  },
  {
    id: 'product-mentor',
    name: 'Tariq Al-Mansoor',
    role: 'Product Strategy Lead',
    specialty: 'Product-market fit, user flows, wireframing, and features.',
    color: '#1B2E5C', // ink-700
    iconName: 'Layers',
    knowsAbout: ['Customer interviews', 'Lean Canvas'],
    starterPrompts: [
      'What core features should be in my refill kiosk MVP?',
      'How can I design user flows to encourage bottle returns?',
      'Assess my product roadmap timeline.'
    ]
  },
  {
    id: 'technical-mentor',
    name: 'Dr. Evelyn Carter',
    role: 'Hardware & Systems Advisor',
    specialty: 'IoT networks, mechanical assemblies, and system scalability.',
    color: '#7C5CF2', // accent-violet
    iconName: 'Cpu',
    knowsAbout: ['DPR', 'Research papers'],
    starterPrompts: [
      'What IoT protocols are most reliable for dispensing kiosk monitoring?',
      'Review the draft technology architecture.',
      'How do we approach hardware manufacturer scaling?'
    ]
  },
  {
    id: 'legal-mentor',
    name: 'Rajesh Sen',
    role: 'Compliance & Corporate Counsel',
    specialty: 'Incorporation, IP registration, NDAs, and founder agreements.',
    color: '#F2545B', // accent-coral
    iconName: 'Shield',
    knowsAbout: ['NDA', 'Founder Agreement'],
    starterPrompts: [
      'What business structure should we select for a circular kiosk startup?',
      'Review my draft NDA specifications.',
      'What elements must go into our Co-Founder Vesting Agreement?'
    ]
  },
  {
    id: 'finance-mentor',
    name: 'Clara Dupont',
    role: 'Chief Financial Analyst',
    specialty: 'Unit economics, runway calculation, and pricing logic.',
    color: '#2BB8A6', // accent-teal
    iconName: 'Percent',
    knowsAbout: ['Financial Projection', 'Business Plan'],
    starterPrompts: [
      'Help me calculate unit margin per ml of fluid refill.',
      'How do I structure a 12-month runway projection table?',
      'What should our hardware depreciation rates be?'
    ]
  },
  {
    id: 'investor-mentor',
    name: 'Vikram Mehta',
    role: 'Active Angel Investor',
    specialty: 'Reviewing pitches from the lens of investor terms and returns.',
    color: '#1B2E5C', // ink-700
    iconName: 'Award',
    knowsAbout: ['Pitch Deck', 'Financial Projection'],
    starterPrompts: [
      'Does our problem statement sound big enough for angels?',
      'Critique my revenue model slide.',
      'What questions should I expect on seed round dilution?'
    ]
  },
  {
    id: 'government-mentor',
    name: 'Sunita Sharma',
    role: 'Govt Schemes Specialist',
    specialty: 'Startup India compliance, DPIIT registration, and municipal grants.',
    color: '#2E9E5B', // accent-green
    iconName: 'FileText',
    knowsAbout: ['Grant Proposal', 'DPR'],
    starterPrompts: [
      'Is EcoSphere Solutions eligible for DPIIT startup benefits?',
      'How do I apply for the Startup India Seed Fund Scheme (SISFS)?',
      'What municipal clean-energy grants can we access?'
    ]
  }
];

export const JOURNEY_LEVELS: JourneyLevel[] = [
  {
    id: 1,
    title: 'Vision Clarification',
    conceptExplanation: 'A startup begins with a clean long-term vision. It specifies the ideal outcome you intend to build over the next decade.',
    learnContent: 'Learn how to avoid buzzwords and write a concrete, inspiring vision statement that anchors team building and investor pitches.',
    activityPrompt: 'Draft a one-sentence vision statement explaining what the world looks like if your startup completely solves its problem.',
    unlockState: 'completed'
  },
  {
    id: 2,
    title: 'Mission Anchoring',
    conceptExplanation: 'Your mission is the tactical vehicle to deliver your vision. It outlines the specific metrics, timeline, and actions you take.',
    learnContent: 'A strong mission states what you do, who you serve, and how you do it, grounding your day-to-day work in actionable milestones.',
    activityPrompt: 'Formulate a mission statement defining your primary goal, target user, and key success metrics for the next 2-3 years.',
    unlockState: 'completed'
  },
  {
    id: 3,
    title: 'Problem Identification',
    conceptExplanation: 'The single most common reason startups fail is lack of market need. Focus entirely on the user pain point, not the solution.',
    learnContent: 'Deep dive into problem validation: separating symptoms from root causes, estimating the cost of the status quo, and verifying severity.',
    activityPrompt: 'Describe the primary problem you are solving, including who feels it most acutely and why current solutions fall short.',
    unlockState: 'current'
  },
  {
    id: 4,
    title: 'Idea Discovery',
    conceptExplanation: 'Ideation is about matching validated problems with creative, scalable solutions. Avoid falling in love with your first mechanism.',
    learnContent: 'Examine design ideation matrices to match your validated problem statement to three different possible mechanical/business models.',
    activityPrompt: 'Outline three potential solutions to your problem and rank them based on feasibility, cost, and user friction.',
    unlockState: 'locked'
  },
  {
    id: 5,
    title: 'Customer Validation',
    conceptExplanation: 'Talking to users is a non-negotiable step. Avoid leading questions and focus on past behaviors, not future promises.',
    learnContent: 'Review methodology from "The Mom Test." Structuring open ended discussions, spotting false positives, and capturing valid quotes.',
    activityPrompt: 'Upload a summary or transcript of at least 5 customer validation interviews focusing on their current workarounds.',
    unlockState: 'locked'
  },
  {
    id: 6,
    title: 'Market Research & Sizing',
    conceptExplanation: 'Investors require a large addressable market. Calculate TAM, SAM, and SOM using bottom-up sizing metrics.',
    learnContent: 'Define total addressable market parameters and detail pricing variables to map market potential in your local geographic area.',
    activityPrompt: 'State your TAM, SAM, and SOM calculations along with the pricing model used to derive these numbers.',
    unlockState: 'locked'
  },
  {
    id: 7,
    title: 'Business Model Canvas',
    conceptExplanation: 'A business model maps the flow of value between partners, operations, channels, costs, and revenues.',
    learnContent: 'Fill the 9 essential blocks of the Business Model Canvas. Focus on value proposition alignment and cost-revenue dynamics.',
    activityPrompt: 'Draft your Business Model Canvas details, explaining how you create, deliver, and capture value.',
    unlockState: 'locked'
  },
  {
    id: 8,
    title: 'MVP & Prototype Spec',
    conceptExplanation: 'An MVP is the smallest iteration that lets you start learning. It is not a buggy version of your final product.',
    learnContent: 'Build high-fidelity wireframe flows or mechanical descriptions containing only the minimum necessary functions to validate utility.',
    activityPrompt: 'Draft the functional specification of your MVP, detailing the core user flow and success metrics.',
    unlockState: 'locked'
  },
  {
    id: 9,
    title: 'Branding & Identity',
    conceptExplanation: 'Branding is how your startup sounds, acts, and looks. It builds trust through cohesive consistency.',
    learnContent: 'Design design frameworks, typography palettes, and messaging voices tailored directly to your primary buyer persona.',
    activityPrompt: 'Define your startup brand voice guidelines and specify color Hex parameters and logomark guidelines.',
    unlockState: 'locked'
  },
  {
    id: 10,
    title: 'Financial Model Scaffolding',
    conceptExplanation: 'Startups run on cash. Understanding your burn rate, runway, and break-even milestones is vital for survival.',
    learnContent: 'Build structured financial projection sheets mapping direct overheads, material margins, and marketing CAC against runway lines.',
    activityPrompt: 'Provide a 12-month financial projection overview showing monthly overhead costs and target sales margins.',
    unlockState: 'locked'
  },
  {
    id: 11,
    title: 'Funding Readiness',
    conceptExplanation: 'Raising capital is a full-time process. Prepare cap structures, dilution projections, and funding requirements.',
    learnContent: 'Determine what financing paths (grant, debt, equity, incubation) align with your market stage and regulatory framework.',
    activityPrompt: 'Explain how much capital you are raising, what milestones it unlocks, and the preferred investor structures.',
    unlockState: 'locked'
  },
  {
    id: 12,
    title: 'Pitch Preparation',
    conceptExplanation: 'A pitch deck is a visual narrative. Tell a compelling story covering problem, solution, market size, and momentum.',
    learnContent: 'Review 10-slide outline guides, visual hierarchies, dynamic charts, and delivery structures that hold attention.',
    activityPrompt: 'Upload or draft your 10-slide pitch outline, focusing on the clarity of your core transition slides.',
    unlockState: 'locked'
  },
  {
    id: 13,
    title: 'Launch Strategy',
    conceptExplanation: 'Going to market requires coordination across launch partners, PR lists, and user invitation loops.',
    learnContent: 'Design pilot launch systems, promotional content plans, and feedback pipelines to support initial operational testing.',
    activityPrompt: 'Draft a day-by-day checklist for your pilot launch stage, naming your initial 3 target channels.',
    unlockState: 'locked'
  },
  {
    id: 14,
    title: 'Growth Engineering',
    conceptExplanation: 'Growth is driven by scalable, repeatable customer loops, not one-off marketing tricks.',
    learnContent: 'Leverage analytics frameworks (AARRR) to structure activation, retention, and referral metrics for growth tracking.',
    activityPrompt: 'Detail your referral loops or distribution channels, explaining the CAC-to-LTV metrics.',
    unlockState: 'locked'
  },
  {
    id: 15,
    title: 'Scaling Operations',
    conceptExplanation: 'Scaling means increasing throughput without a linear increase in cost. Build systems, policies, and teams.',
    learnContent: 'Establish team hiring templates, regional expansion systems, corporate governance structures, and standard procedures.',
    activityPrompt: 'Detail your plans for team scaling and regional licensing over the next 18 months.',
    unlockState: 'locked'
  }
];

export const DOCUMENT_TEMPLATES: GeneratorTemplate[] = [
  {
    id: 'dpr',
    title: 'Detailed Project Report (DPR)',
    description: 'A comprehensive feasibility report containing technical, financial, and operational plans for grant reviews.',
    prefillFields: ['startupName', 'vision', 'problemStatement', 'solution', 'businessModel']
  },
  {
    id: 'business-plan',
    title: 'Executive Business Plan',
    description: 'A formal business plan detailing market analysis, execution timelines, and management profiles.',
    prefillFields: ['startupName', 'mission', 'problemStatement', 'solution', 'businessModel']
  },
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Slide Outline',
    description: 'A 10-slide narrative layout optimized for angel investor introductions.',
    prefillFields: ['startupName', 'vision', 'problemStatement', 'solution', 'stage']
  },
  {
    id: 'financial-projection',
    title: 'Financial Projections Summary',
    description: 'A structured projection showing startup expenses, pricing margins, and monthly runways.',
    prefillFields: ['startupName', 'businessModel']
  },
  {
    id: 'lean-canvas',
    title: 'Lean Canvas',
    description: 'A single-page business model template that focus on product-market validation.',
    prefillFields: ['startupName', 'problemStatement', 'solution', 'businessModel']
  },
  {
    id: 'business-model-canvas',
    title: 'Business Model Canvas',
    description: 'A detailed 9-box canvas mapping company assets, partners, channels, and cost flows.',
    prefillFields: ['startupName', 'problemStatement', 'solution', 'businessModel']
  },
  {
    id: 'swot-analysis',
    title: 'SWOT Analysis Matrix',
    description: 'A 2x2 matrix highlighting internal Strengths & Weaknesses against external Opportunities & Threats.',
    prefillFields: ['startupName', 'problemStatement', 'solution']
  },
  {
    id: 'market-research',
    title: 'Market Sizing Research',
    description: 'Detailed analysis of TAM, SAM, SOM targets for local demographics.',
    prefillFields: ['startupName', 'problemStatement']
  },
  {
    id: 'investor-email',
    title: 'Investor Outreach Draft',
    description: 'A brief, highly structured email optimized for cold outreach campaigns.',
    prefillFields: ['founderName', 'startupName', 'vision', 'stage']
  },
  {
    id: 'founder-agreement',
    title: 'Co-Founder Equity Vesting Agreement',
    description: 'A standard framework covering shares allocation, vesting schedules, and separation protocols.',
    prefillFields: ['startupName', 'founderName']
  },
  {
    id: 'nda',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    description: 'Standard legal protection covering proprietary secrets and product discussions.',
    prefillFields: ['startupName', 'founderName']
  },
  {
    id: 'grant-proposal',
    title: 'Sarmang / Govt Grant Proposal',
    description: 'A proposal optimized for clean energy or recycling schemes.',
    prefillFields: ['startupName', 'problemStatement', 'solution', 'stage']
  }
];

export const ACADEMY_CURRICULUM: AcademyModule[] = [
  {
    id: 'module-1',
    title: 'Phase 1: Concept & Validation',
    lessons: [
      { id: 'l1', title: 'Developing the Entrepreneur Mindset', duration: '12 min', type: 'video', completed: true },
      { id: 'l2', title: 'Sourcing and Filtering Ideas', duration: '15 min', type: 'video', completed: true },
      { id: 'l3', title: 'Problem Discovery Frameworks', duration: '20 min', type: 'video', completed: false },
      { id: 'l4', title: 'Validating Problems with Users', duration: '18 min', type: 'worksheet', completed: false }
    ]
  },
  {
    id: 'module-2',
    title: 'Phase 2: Business & Product Design',
    lessons: [
      { id: 'l5', title: 'Deep Dive: Lean Canvas Design', duration: '25 min', type: 'video', completed: false },
      { id: 'l6', title: 'Defining the MVP Scope', duration: '22 min', type: 'video', completed: false },
      { id: 'l7', title: 'Conducting Competitor Research', duration: '18 min', type: 'worksheet', completed: false },
      { id: 'l8', title: 'Creating Your First Financial Plan', duration: '30 min', type: 'quiz', completed: false }
    ]
  },
  {
    id: 'module-3',
    title: 'Phase 3: Incorporation & Government Schemes',
    lessons: [
      { id: 'l9', title: 'Choosing the Legal Business Form', duration: '14 min', type: 'video', completed: false },
      { id: 'l10', title: 'Registering with Startup India & DPIIT', duration: '28 min', type: 'video', completed: false },
      { id: 'l11', title: 'Accessing Clean Energy Grants', duration: '20 min', type: 'worksheet', completed: false },
      { id: 'l12', title: 'DPIIT Regulatory Quiz', duration: '10 min', type: 'quiz', completed: false }
    ]
  }
];
