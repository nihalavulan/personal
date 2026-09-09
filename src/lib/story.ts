/**
 * Turns a project's free-form `metadata.raw` object into an ordered list of
 * story sections, each tagged with a narrative phase so the UI can present
 * every project as: Problem → Thinking → Solution → Result.
 *
 * Raw shapes differ per project, so this is deliberately tolerant: strings
 * become paragraphs, string arrays become lists, and nested objects become
 * definition lists.
 */

export type Phase = "Problem" | "Thinking" | "Solution" | "Result";

export type StoryNode =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "defs"; items: { term: string; desc: string }[] };

export interface StorySection {
  key: string;
  label: string;
  phase: Phase;
  nodes: StoryNode[];
}

const LABELS: Record<string, string> = {
  clientContext: "The client",
  businessContext: "The business",
  business: "The business",
  product: "The product",
  problem: "The problem",
  problemStatement: "The problem",
  problemDiscovery: "What I found",
  idea: "The idea",
  productIdea: "The idea",
  coreIdea: "Core idea",
  whyWhatsApp: "Why WhatsApp",
  initialApproach: "Initial approach",
  approach: "The approach",
  mvpApproach: "MVP approach",
  requirement: "The requirement",
  contributions: "What I did",
  keyTechnicalProblem: "The core technical problem",
  solution: "The solution",
  implementation: "Implementation",
  howItWorked: "How it worked",
  popupBubble: "Popup / bubble system",
  followUp: "Follow-up system",
  telegramBot: "The Telegram bot",
  design: "Design",
  integration: "Integration",
  ownership: "What I owned",
  contentUiThinking: "Content & UI thinking",
  conversionStrategy: "Conversion strategy",
  productThinking: "Product thinking",
  decisions: "Key decisions",
  distribution: "Distribution & technical call",
  clientPreference: "Client constraints",
  funnel: "The funnel",
  aiTranslation: "AI translation",
  philosophy: "Product philosophy",
  stage: "Stage",
  nature: "Nature of the work",
  traction: "Traction",
  result: "The result",
  outcome: "The outcome",
  coreStory: "The core story",
};

const PHASE: Record<string, Phase> = {
  clientContext: "Problem",
  businessContext: "Problem",
  business: "Problem",
  product: "Problem",
  problem: "Problem",
  problemStatement: "Problem",
  problemDiscovery: "Problem",
  idea: "Thinking",
  productIdea: "Thinking",
  coreIdea: "Thinking",
  whyWhatsApp: "Thinking",
  initialApproach: "Thinking",
  approach: "Thinking",
  mvpApproach: "Thinking",
  requirement: "Thinking",
  keyTechnicalProblem: "Thinking",
  contentUiThinking: "Thinking",
  productThinking: "Thinking",
  decisions: "Thinking",
  clientPreference: "Thinking",
  philosophy: "Thinking",
  solution: "Solution",
  implementation: "Solution",
  howItWorked: "Solution",
  popupBubble: "Solution",
  followUp: "Solution",
  telegramBot: "Solution",
  design: "Solution",
  integration: "Solution",
  ownership: "Solution",
  conversionStrategy: "Solution",
  distribution: "Solution",
  funnel: "Solution",
  aiTranslation: "Solution",
  contributions: "Solution",
  stage: "Solution",
  nature: "Solution",
  requirementResult: "Result",
  traction: "Result",
  result: "Result",
  outcome: "Result",
  coreStory: "Result",
};

const ORDER = Object.keys(PHASE);

function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function stringify(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(stringify).join("; ");
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${humanize(k)}: ${stringify(v)}`)
      .join(" · ");
  }
  return String(value ?? "");
}

function toNodes(value: unknown): StoryNode[] {
  if (typeof value === "string") return [{ type: "p", text: value }];
  if (Array.isArray(value)) {
    return [{ type: "list", items: value.map(stringify) }];
  }
  if (value && typeof value === "object") {
    const items = Object.entries(value as Record<string, unknown>).map(
      ([k, v]) => ({ term: humanize(k), desc: stringify(v) })
    );
    return [{ type: "defs", items }];
  }
  return [];
}

export function buildStory(raw: Record<string, unknown> | undefined): StorySection[] {
  if (!raw) return [];
  const keys = Object.keys(raw);
  keys.sort((a, b) => {
    const ia = ORDER.indexOf(a);
    const ib = ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return keys.map((key) => ({
    key,
    label: LABELS[key] ?? humanize(key),
    phase: PHASE[key] ?? "Solution",
    nodes: toNodes(raw[key]),
  }));
}
