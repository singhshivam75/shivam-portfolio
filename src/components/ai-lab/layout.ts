import type { LabSceneId } from "@/types/ai-lab";

export type Vec3 = readonly [number, number, number];

export interface SceneLayout {
  /** Hotspot ids plus internal junction points (prefixed with `_`). */
  points: Record<string, Vec3>;
  /** Connections drawn between points; used by both the 3D scene and the SVG fallback. */
  edges: ReadonlyArray<readonly [string, string]>;
  /** Dashed return path, e.g. an agent loop. */
  loop?: readonly [string, string];
}

/** Scene-local coordinates, shared by the WebGL scenes and the SVG fallback. */
export const SCENE_LAYOUTS: Record<LabSceneId, SceneLayout> = {
  neural: {
    points: {
      _root: [0, -3, 0],
      _fork: [0, -0.9, 0],
      llm: [-3.9, 0.9, 0],
      rag: [-2, 2.2, 0.5],
      automation: [0, 2.85, 0],
      agents: [2, 2.2, -0.5],
      prompt: [3.9, 0.9, 0],
    },
    edges: [
      ["_root", "_fork"],
      ["_fork", "llm"],
      ["_fork", "rag"],
      ["_fork", "automation"],
      ["_fork", "agents"],
      ["_fork", "prompt"],
    ],
  },
  rag: {
    points: {
      documents: [-4.7, 0.2, 0],
      embeddings: [-2.35, -0.35, 0],
      vectordb: [0, 0.2, 0],
      llm: [2.4, -0.25, 0],
      response: [4.75, 0.3, 0],
    },
    edges: [
      ["documents", "embeddings"],
      ["embeddings", "vectordb"],
      ["vectordb", "llm"],
      ["llm", "response"],
    ],
  },
  agent: {
    points: {
      goal: [-4.8, -1.3, 0],
      plan: [-2.3, 0.7, 0],
      tools: [0.1, -0.9, 0.4],
      observe: [2.4, 0.9, 0],
      answer: [4.8, -0.9, 0],
    },
    edges: [
      ["goal", "plan"],
      ["plan", "tools"],
      ["tools", "observe"],
      ["observe", "answer"],
    ],
    loop: ["observe", "plan"],
  },
  data: {
    points: {
      clients: [-4.7, 0, 0],
      api: [-1.9, 0, 0],
      redis: [1, 1.55, 0],
      queue: [1, -1.55, 0],
      database: [4.1, 0, 0],
    },
    edges: [
      ["clients", "api"],
      ["api", "redis"],
      ["api", "database"],
      ["api", "queue"],
      ["queue", "database"],
    ],
  },
};

export const SCENE_ORDER: readonly LabSceneId[] = ["neural", "rag", "agent", "data"];
