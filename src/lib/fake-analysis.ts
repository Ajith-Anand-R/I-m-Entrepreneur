import type { DocumentRecord } from './db';

// Simulated OCR extraction database based on category types
const EXTRACTION_TEMPLATES: Record<string, NonNullable<DocumentRecord['extractedSummary']>> = {
  Financial: {
    problemStatement: 'Runway is currently calculated at 8 months, with a burn rate of $12,000 monthly.',
    targetAudience: 'Early adopters in urban centers willing to pay retail premium for organic fluids.',
    competitors: 'Traditional consumer product packaging giants, local packaging recyclers.',
    revenueModel: 'Dispensing kiosk B2B lease fee ($250/mo) + consumer refill fees ($0.08 per milliliter).',
    stage: 'Validating',
    tech: 'IoT load-cell dispensing system tracking container weight changes.',
    team: '1 Founder + 2 Hardware Consultants.',
    risks: 'Machine depreciation rates, high kiosk unit cost, shipping bottlenecks.',
    opportunities: 'Bulk discount purchases of liquid detergents to increase margin by 18%.'
  },
  'Pitch deck': {
    problemStatement: 'Traditional packaging recycling systems recover less than 9% of plastics.',
    targetAudience: 'Environmentally-conscious urban consumers aged 22-45.',
    competitors: 'Single-use plastic bottles from traditional brands.',
    revenueModel: 'Direct per-ml product refill sales at kiosk locations.',
    stage: 'Building',
    tech: 'Decentralized refill kiosk system with custom flow valves and sensor integration.',
    team: 'Ajith (Founder) + local assembly partner.',
    risks: 'Consumer behavioral resistance to bottle reuse, retail footprint access.',
    opportunities: 'Partnerships with organic soap brands looking for distribution.'
  },
  'Customer interviews': {
    problemStatement: 'Users state that they feel guilty throwing soap bottles away but find driving to bulk refilling stores highly inconvenient.',
    targetAudience: 'Eco-conscious apartment dwellers who do grocery shopping nearby.',
    competitors: 'Bulk shops (too far), classic supermarket chains (too much plastic).',
    revenueModel: 'DTC payment via card/tap directly on the kiosk face.',
    stage: 'Validating',
    tech: 'Touchless payment terminal + standard LCD interface guidance.',
    team: 'Ajith (interviewer).',
    risks: 'Users forgetting to bring empty bottles, hygiene verification concerns.',
    opportunities: 'Integrating automated bottle rinsing sprays inside the kiosk.'
  },
  default: {
    problemStatement: 'Identified single-use packaging overheads as a primary operations friction point.',
    targetAudience: 'Eco-conscious consumer retail markets.',
    competitors: 'Traditional bulk packaging distribution pipelines.',
    revenueModel: 'Subscription leases + direct refill margins.',
    stage: 'Validating',
    tech: 'Basic digital weight sensor connected to cloud tracking API.',
    team: 'Founder.',
    risks: 'Regulatory compliance for liquid dispenser operations.',
    opportunities: 'Expanding kiosk licenses to local municipal libraries.'
  }
};

/**
 * Simulates document analysis (OCR + extraction) with a fake delay
 */
export async function analyzeDocument(
  title: string,
  category: string,
  fileSize: string
): Promise<DocumentRecord> {
  // Simulate network/OCR latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const id = `doc-${Date.now()}`;
  const extractedSummary = EXTRACTION_TEMPLATES[category] || EXTRACTION_TEMPLATES.default;

  return {
    id,
    category,
    title,
    tags: [category.toLowerCase().replace(/\s+/g, '-'), 'ai-analyzed'],
    fileSize,
    analyzedAt: new Date().toISOString(),
    extractedSummary
  };
}
