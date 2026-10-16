export type LabSceneId = "neural" | "rag" | "agent" | "data";

/**
 * `resume`: skills listed on the resume.
 * `concept`: explains how a technique works; not a deployed project.
 * `shipped`: patterns taken from projects listed on the resume.
 */
export type LabSceneKind = "resume" | "concept" | "shipped";

export interface LabHotspot {
  id: string;
  label: string;
  /** One or two short sentences, revealed when the node is selected. */
  detail: string;
  /** Resume skills this node represents. */
  skills?: readonly string[];
  /** Resume projects this node is drawn from. */
  sources?: readonly string[];
}

export interface LabScene {
  id: LabSceneId;
  label: string;
  kind: LabSceneKind;
  tagline: string;
  hotspots: readonly LabHotspot[];
}
