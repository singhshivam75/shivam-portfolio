import type { LabScene } from "@/types/ai-lab";

/**
 * AI & Engineering Lab content.
 * `concept` scenes explain techniques from the resume skill list; they are not deployed projects.
 * The `shipped` scene only describes patterns from resume projects (Stelo, Admission DIY, AxelATS, My Property Fact).
 */
export const labScenes: readonly LabScene[] = [
  {
    id: "neural",
    label: "Neural skill tree",
    kind: "resume",
    tagline: "My AI / GenAI skills, grown as one network.",
    hotspots: [
      {
        id: "llm",
        label: "LLMs & GenAI",
        detail: "Models that read, write and transform text, at the core of every flow in this lab.",
        skills: ["LLMs", "Generative AI"],
      },
      {
        id: "rag",
        label: "RAG",
        detail: "Answer from your own documents: embed them, retrieve the closest chunks, then generate.",
        skills: ["RAG", "Embeddings", "Vector Search"],
      },
      {
        id: "automation",
        label: "AI automation",
        detail: "Models inside pipelines that remove repetitive manual work, with checks on the output.",
        skills: ["AI Automation"],
      },
      {
        id: "agents",
        label: "AI agents",
        detail: "LLMs that plan, call tools and loop until a goal is met.",
        skills: ["AI Agents", "Agentic Workflows"],
      },
      {
        id: "prompt",
        label: "Prompt engineering",
        detail: "Clear instructions, examples and output formats that make model behaviour reliable.",
        skills: ["Prompt Engineering"],
      },
    ],
  },
  {
    id: "rag",
    label: "RAG pipeline",
    kind: "concept",
    tagline: "How retrieval-augmented generation answers from documents.",
    hotspots: [
      {
        id: "documents",
        label: "Documents",
        detail: "Source text is cleaned and split into overlapping chunks of a few hundred tokens.",
        skills: ["RAG"],
      },
      {
        id: "embeddings",
        label: "Embeddings",
        detail: "Each chunk becomes a vector, so text with similar meaning lands close together.",
        skills: ["Embeddings"],
      },
      {
        id: "vectordb",
        label: "Vector database",
        detail: "Nearest-neighbour search (for example pgvector with an HNSW index) returns the top-k chunks.",
        skills: ["Vector Search"],
      },
      {
        id: "llm",
        label: "LLM",
        detail: "The retrieved chunks go into the prompt, and the model answers only from that context.",
        skills: ["LLMs", "Prompt Engineering"],
      },
      {
        id: "response",
        label: "Response",
        detail: "The answer streams back with citations to its sources.",
        skills: ["Generative AI"],
      },
    ],
  },
  {
    id: "agent",
    label: "AI agent journey",
    kind: "concept",
    tagline: "An agent loops plan → tool → observe until the goal is done.",
    hotspots: [
      {
        id: "goal",
        label: "Goal",
        detail: "The user's request plus a system prompt that sets the rules and the available tools.",
        skills: ["Prompt Engineering"],
      },
      {
        id: "plan",
        label: "Planning",
        detail: "The LLM chooses the next step and returns a structured tool call.",
        skills: ["LLMs", "Agentic Workflows"],
      },
      {
        id: "tools",
        label: "Tools",
        detail: "The app, not the model, validates the arguments and runs the tool, within set permissions.",
        skills: ["AI Automation"],
      },
      {
        id: "observe",
        label: "Observation",
        detail: "The tool's result goes back into context, and the loop repeats within a step limit.",
        skills: ["AI Agents"],
      },
      {
        id: "answer",
        label: "Answer",
        detail: "The final output, with human review before any consequential action.",
        skills: ["AI Agents"],
      },
    ],
  },
  {
    id: "data",
    label: "Data architecture",
    kind: "shipped",
    tagline: "Backend patterns from projects I've shipped.",
    hotspots: [
      {
        id: "clients",
        label: "Clients",
        detail: "Next.js web apps using SSR and ISR, and a React Native mobile app.",
        sources: ["Admission DIY", "Stelo"],
      },
      {
        id: "api",
        label: "API layer",
        detail: "Node.js, Express and NestJS services with JWT auth and RBAC for 5+ roles.",
        sources: ["Admission DIY", "AxelATS"],
      },
      {
        id: "redis",
        label: "Redis cache",
        detail: "Cache-aside reads. On Stelo, caching plus async jobs made APIs 30–40% faster.",
        sources: ["Stelo", "Admission DIY"],
      },
      {
        id: "queue",
        label: "BullMQ queue",
        detail: "Slow or retryable work runs in background workers, off the request path.",
        sources: ["Stelo"],
      },
      {
        id: "database",
        label: "Databases",
        detail: "Indexed PostgreSQL queries cut response time by about 30–40%; MongoDB and MySQL power the other projects.",
        sources: ["Admission DIY", "Stelo", "AxelATS", "My Property Fact"],
      },
    ],
  },
];
