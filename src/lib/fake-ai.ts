import type { DocumentRecord } from './db';
import type { StartupProfile } from '../store/useStartupStore';

interface MentorReplyData {
  text: string;
  suggestedAction?: {
    type: 'generate_doc' | 'builder_task' | 'journey_level';
    id: string;
    label: string;
  };
}

// Mentor-specific response generators
export async function generateMentorResponse(
  mentorId: string,
  prompt: string,
  profile: StartupProfile,
  documents: DocumentRecord[]
): Promise<MentorReplyData> {
  // Simulate AI thinking latency
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const promptLower = prompt.toLowerCase();
  const docTypes = documents.map((d) => d.category);
  const startupName = profile.startupName || 'your startup';
  const stage = profile.stage;

  switch (mentorId) {
    case 'startup-mentor':
      if (promptLower.includes('pivot') || promptLower.includes('business model')) {
        return {
          text: `Hi ${profile.founderName}, pivots are normal in the ${stage} stage. Looking at the **${profile.businessModel}** model you outlined, a key vulnerability is B2B kiosk adoption. If retailers push back, have you considered a consumer container lease system instead? I suggest updating your **Lean Canvas** to model this variant.`,
          suggestedAction: { type: 'generate_doc', id: 'lean-canvas', label: 'Draft Lean Canvas' }
        };
      }
      if (promptLower.includes('problem') || promptLower.includes('eco')) {
        return {
          text: `Your problem statement for **${startupName}** is clear: single-use plastic waste has less than 9% recycling efficiency. However, to make this pitch-ready, you should specify the localized cost metrics (e.g., how much retail waste costs municipalities). Let's refine this in **Level 3: Problem Discovery**!`,
          suggestedAction: { type: 'journey_level', id: '3', label: 'Go to Level 3: Problem Discovery' }
        };
      }
      return {
        text: `Interesting question! For **${startupName}** (currently in the **${stage}** stage), my core advice is to focus entirely on user retention. If users don't bring back the packaging, the circular loop breaks. What does your current pilot feedback show?`
      };

    case 'funding-mentor':
      if (promptLower.includes('pitch') || promptLower.includes('deck')) {
        const hasPitch = docTypes.includes('Pitch deck');
        return {
          text: hasPitch
            ? `I reviewed the **Pitch Deck** file you uploaded. The problem slide is punchy, but your market slide lacks detail. Investors will want to see the bottom-up calculation of your SAM and SOM in the circular recycling market. Let's rebuild the deck using the generator.`
            : `I see you haven't uploaded a **Pitch Deck** document yet. For a startup in the **${stage}** stage, a 10-slide outline is crucial. Use the AI Document Generator to draft one pre-filled from your profile.`,
          suggestedAction: { type: 'generate_doc', id: 'pitch-deck', label: 'Generate Pitch Deck Outline' }
        };
      }
      return {
        text: `To raise capital for **${startupName}**, you first need validation metrics. Investors at the pre-seed stage look for team commitment and initial letters of intent (LOI). I recommend creating an **Investor Email** pitch block first.`,
        suggestedAction: { type: 'generate_doc', id: 'investor-email', label: 'Draft Investor Outreach' }
      };

    case 'marketing-mentor':
      return {
        text: `For a circular economy startup like **${startupName}**, your marketing isn't just about selling a product—it's about educating the consumer on the refill ritual. I recommend starting with local community hubs. Have you outlined a **SWOT Analysis** of local competitors?`,
        suggestedAction: { type: 'generate_doc', id: 'swot-analysis', label: 'Generate SWOT Analysis' }
      };

    case 'sales-mentor':
      return {
        text: `In a B2B model dispensing detergents or soaps, your main sales targets are retail store managers who care about revenue per square foot. You must pitch the kiosk as a foot-traffic driver. Let's add a task in the Builder to secure 3 pilot letter-of-intent agreements.`,
        suggestedAction: { type: 'builder_task', id: 'task-2', label: 'Check Customer validation task' }
      };

    case 'product-mentor':
      return {
        text: `Designing the dispenser interface for EcoSphere requires high tactile feedback. Users should easily select ml quantities. Let's ensure your **MVP Specification** document clearly delineates the manual overflow protection valves.`
      };

    case 'technical-mentor':
      return {
        text: `From a systems engineering perspective, a weight-based refill kiosk is much more robust than flow-meter sensors, which fail with high-viscosity fluids like dish soaps. If you write a **Detailed Project Report (DPR)**, make sure to document these technical telemetry specifications.`
      };

    case 'legal-mentor':
      if (promptLower.includes('nda') || promptLower.includes('agreement') || promptLower.includes('sign')) {
        return {
          text: `For legal compliance, protect your proprietary kiosk mechanical dispensing designs. Before sharing specifications with hardware manufacturers or distributors, you must execute a **Mutual Non-Disclosure Agreement**. I can generate one for you immediately.`,
          suggestedAction: { type: 'generate_doc', id: 'nda', label: 'Generate Mutual NDA' }
        };
      }
      return {
        text: `Regarding registration, since you mentioned an interest in government benefits, have you registered as a partnership or private limited entity? To get Startup India recognition, a registered deed or LLP registration is required.`
      };

    case 'finance-mentor':
      if (promptLower.includes('runway') || promptLower.includes('burn') || promptLower.includes('model')) {
        return {
          text: `Your business model requires kiosk amortization. If each kiosk costs $1,500 to assemble, and you lease them for $250/mo, pay-back is 6 months. We should structure a detailed **Financial Projection Summary** mapping these variables.`,
          suggestedAction: { type: 'generate_doc', id: 'financial-projection', label: 'Scaffold Financial Model' }
        };
      }
      return {
        text: `Let's focus on unit economics. A per-ml refill model succeeds on high turnover. If detergent fluid costs $0.03/ml bulk and you retail at $0.08/ml, your gross margins are 62.5%. This is a strong starting index.`
      };

    case 'investor-mentor':
      return {
        text: `If you pitched **${startupName}** to me today, my first question would be: 'What is the return rate of the glass containers?' If container loss exceeds 15%, your margins vanish. Ensure this risk and its mitigation are explicitly written in your **Business Plan**.`
      };

    case 'government-mentor':
      if (promptLower.includes('dpiit') || promptLower.includes('india') || promptLower.includes('scheme')) {
        return {
          text: `To secure tax exemptions and eligibility for the Startup India Seed Fund, register your entity and apply for **DPIIT Recognition**. This is highly relevant for EcoSphere because green-tech recycling projects receive priority reviews. We should prepare a **Grant Proposal** draft.`,
          suggestedAction: { type: 'generate_doc', id: 'grant-proposal', label: 'Generate Grant Proposal' }
        };
      }
      return {
        text: `There are specific state incentives for recycling kiosks under municipal clean environmental guidelines. Let's make sure we draft a **Detailed Project Report (DPR)** mapping these municipal provisions.`,
        suggestedAction: { type: 'generate_doc', id: 'dpr', label: 'Draft Detailed Project Report (DPR)' }
      };

    default:
      return {
        text: `Hello! I am here to help you build **${startupName}**. Let's upload context documents to the Workspace first, so I can give you custom-tailored strategic advice.`
      };
  }
}
