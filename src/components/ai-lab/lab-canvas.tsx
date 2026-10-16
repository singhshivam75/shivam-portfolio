"use client";

import { PerformanceMonitor, Sparkles, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { MathUtils, Vector3, type Group } from "three";
import type { LabSceneId } from "@/types/ai-lab";
import { SCENE_LAYOUTS, SCENE_ORDER } from "./layout";
import { AgentJourney } from "./scenes/agent-journey";
import { DataArchitecture } from "./scenes/data-architecture";
import { NeuralTree } from "./scenes/neural-tree";
import { RagScene } from "./scenes/rag-scene";
import { COLORS, type SceneProps } from "./scenes/shared";

/** Scenes sit side by side in one world; switching flies the camera between them. */
const SCENE_GAP = 26;
const BACKGROUND = "#03051a";

const SCENES: Record<LabSceneId, ComponentType<SceneProps>> = {
  neural: NeuralTree,
  rag: RagScene,
  agent: AgentJourney,
  data: DataArchitecture,
};

function usePointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

interface RigProps {
  sceneIndex: number;
  sceneId: LabSceneId;
  selected: string | null;
}

/** Camera fly-through, focus on the selected node, pointer parallax; lights and stars travel with it. */
function CameraRig({ sceneIndex, sceneId, selected }: RigProps) {
  const pointer = usePointer();
  const look = useRef(new Vector3(0, 0, 0));
  const environment = useRef<Group>(null);
  const aspect = useThree((state) => state.size.width / Math.max(1, state.size.height));
  const baseZ = MathUtils.clamp(6.6 / (0.364 * aspect), 9.8, 15);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.12);
    const { camera } = state;
    const offset = sceneIndex * SCENE_GAP;
    const focus = selected ? SCENE_LAYOUTS[sceneId].points[selected] : undefined;
    const travel = Math.min(Math.abs(camera.position.x - offset), SCENE_GAP);

    const targetX = offset + (focus ? focus[0] * 0.45 : 0);
    const targetY = focus ? focus[1] * 0.35 : 0;
    camera.position.x = MathUtils.damp(camera.position.x, targetX + pointer.current.x * 0.9, 2.2, step);
    camera.position.y = MathUtils.damp(camera.position.y, 0.4 + targetY - pointer.current.y * 0.5, 2.2, step);
    camera.position.z = MathUtils.damp(camera.position.z, baseZ - (focus ? 2.2 : 0) + travel * 0.3, 2.2, step);

    look.current.x = MathUtils.damp(look.current.x, offset + (focus ? focus[0] * 0.6 : 0), 2.6, step);
    look.current.y = MathUtils.damp(look.current.y, focus ? focus[1] * 0.5 : 0, 2.6, step);
    camera.lookAt(look.current);

    if (environment.current) environment.current.position.x = look.current.x;
  });

  return (
    <group ref={environment}>
      <ambientLight intensity={0.35} />
      <spotLight position={[-7, 7, 6]} angle={0.6} penumbra={1} intensity={120} color={COLORS.violet} />
      <spotLight position={[7, 5, 6]} angle={0.6} penumbra={1} intensity={90} color={COLORS.cyan} />
      <directionalLight position={[0, 4, 8]} intensity={0.6} />
      <Stars radius={40} depth={30} count={900} factor={2.6} saturation={0} fade speed={0.4} />
      <Sparkles count={50} scale={[16, 8, 6]} size={2} speed={0.25} color={COLORS.cyan} opacity={0.5} />
    </group>
  );
}

function SceneSlot({ index, children }: { index: number; children: ReactNode }) {
  const group = useRef<Group>(null);
  useFrame(({ camera }) => {
    if (group.current) group.current.visible = Math.abs(camera.position.x - index * SCENE_GAP) < SCENE_GAP * 0.8;
  });
  return (
    <group ref={group} position={[index * SCENE_GAP, 0, 0]}>
      {children}
    </group>
  );
}

interface LabCanvasProps {
  sceneIndex: number;
  selected: string | null;
  labels: Record<string, string>;
  active: boolean;
  onSelect: (id: string) => void;
  onClear: () => void;
  onReady: () => void;
}

export default function LabCanvas({ sceneIndex, selected, labels, active, onSelect, onClear, onReady }: LabCanvasProps) {
  const [effects, setEffects] = useState(true);
  const [dpr, setDpr] = useState(1.5);
  const sceneId = SCENE_ORDER[sceneIndex] ?? "neural";

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      camera={{ position: [0, 0.4, 11], fov: 40 }}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false }}
      onCreated={onReady}
      onPointerMissed={onClear}
    >
      <color attach="background" args={[BACKGROUND]} />
      <fog attach="fog" args={[BACKGROUND, 14, 30]} />
      <PerformanceMonitor
        onDecline={() => {
          setDpr(1);
          setEffects(false);
        }}
        onIncline={() => {
          setDpr(1.5);
          setEffects(true);
        }}
        flipflops={3}
        onFallback={() => {
          setDpr(1);
          setEffects(false);
        }}
      />
      <CameraRig sceneIndex={sceneIndex} sceneId={sceneId} selected={selected} />
      {SCENE_ORDER.map((id, index) => {
        const Scene = SCENES[id];
        return (
          <SceneSlot key={id} index={index}>
            <Scene
              selected={index === sceneIndex ? selected : null}
              onSelect={onSelect}
              labels={index === sceneIndex ? labels : null}
            />
          </SceneSlot>
        );
      })}
      {effects ? (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.75} luminanceSmoothing={0.2} radius={0.7} />
          <Vignette eskil={false} offset={0.25} darkness={0.7} />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
