"use client";

import { ContactShadows, Float, Grid, PerformanceMonitor, RoundedBox, Sparkles, Stars } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import { MathUtils, type Group, type Mesh } from "three";
import { monitorCode, sidePanels, type CodePanelSpec } from "./code-lines";
import { TechObjects } from "./tech-objects";
import { CODE_TEXTURE_ASPECT, useCodeTexture } from "./use-code-texture";

const COLORS = {
  violet: "#8b5cf6",
  cyan: "#22d3ee",
  desk: "#0b1030",
  metal: "#171d4a",
  background: "#02030a",
} as const;

function usePointerAndScroll() {
  const state = useRef({ x: 0, y: 0, scroll: 0 });
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      state.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      state.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      state.current.scroll = Math.min(1, window.scrollY / window.innerHeight);
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return state;
}

/** Mouse parallax plus a scroll-driven dolly. */
function CameraRig({ focusX }: { focusX: number }) {
  const input = usePointerAndScroll();
  useFrame((state, delta) => {
    const { camera } = state;
    const { x, y, scroll } = input.current;
    camera.position.x = MathUtils.damp(camera.position.x, focusX * 0.35 + x * 1.1, 3, delta);
    camera.position.y = MathUtils.damp(camera.position.y, 1.9 - y * 0.55 + scroll * 1.6, 3, delta);
    camera.position.z = MathUtils.damp(camera.position.z, 7.4 + scroll * 3, 3, delta);
    camera.lookAt(focusX * 0.55, 1.2 - scroll * 0.4, 0);
  });
  return null;
}

interface CodeScreenProps {
  spec: CodePanelSpec;
  width: number;
  typing?: boolean;
  opacity?: number;
}

function CodeScreen({ spec, width, typing = false, opacity = 1 }: CodeScreenProps) {
  const texture = useCodeTexture(spec, typing);
  return (
    <mesh>
      <planeGeometry args={[width, width / CODE_TEXTURE_ASPECT]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
}

function Monitor() {
  return (
    <group position={[0, 1.62, -0.35]}>
      <RoundedBox args={[3.1, 1.98, 0.1]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color={COLORS.metal} metalness={0.85} roughness={0.22} />
      </RoundedBox>
      <mesh position={[0, -0.96, 0.052]}>
        <boxGeometry args={[2.9, 0.012, 0.005]} />
        <meshBasicMaterial color={COLORS.cyan} toneMapped={false} />
      </mesh>
      <group position={[0, 0.02, 0.056]}>
        <CodeScreen spec={monitorCode} width={2.92} typing />
      </group>
      <mesh position={[0, -1.2, -0.06]}>
        <boxGeometry args={[0.14, 0.5, 0.07]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.9} roughness={0.2} />
      </mesh>
      <RoundedBox args={[0.95, 0.04, 0.48]} radius={0.02} position={[0, -1.45, 0]}>
        <meshStandardMaterial color={COLORS.metal} metalness={0.9} roughness={0.2} />
      </RoundedBox>
      <pointLight position={[0, 0, 1.1]} intensity={3} distance={4.5} color={COLORS.cyan} />
    </group>
  );
}

function SideMonitor({ spec }: { spec: CodePanelSpec }) {
  return (
    <group position={[-1.75, 1.2, 0.15]} rotation={[0, 0.6, 0]}>
      <RoundedBox args={[1.25, 0.82, 0.06]} radius={0.04} smoothness={3}>
        <meshStandardMaterial color={COLORS.metal} metalness={0.85} roughness={0.25} />
      </RoundedBox>
      <group position={[0, 0, 0.033]}>
        <CodeScreen spec={spec} width={1.17} />
      </group>
      <mesh position={[0, -0.62, -0.03]}>
        <boxGeometry args={[0.08, 0.42, 0.05]} />
        <meshStandardMaterial color={COLORS.metal} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Keyboard() {
  const keys: Array<[number, number]> = [];
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 14; col += 1) keys.push([col, row]);
  }
  return (
    <group position={[0, 0.06, 0.8]} rotation={[-0.05, 0, 0]}>
      <RoundedBox args={[1.95, 0.06, 0.64]} radius={0.03} smoothness={3}>
        <meshStandardMaterial color={COLORS.metal} metalness={0.7} roughness={0.35} />
      </RoundedBox>
      {keys.map(([col, row]) => {
        const accent = (col * 3 + row * 5) % 11 === 0;
        return (
          <mesh key={`${col}-${row}`} position={[-0.8 + col * 0.123, 0.045, -0.2 + row * 0.13]}>
            <boxGeometry args={[0.1, 0.03, 0.1]} />
            <meshStandardMaterial
              color="#0e1438"
              emissive={accent ? COLORS.violet : COLORS.cyan}
              emissiveIntensity={accent ? 1.6 : 0.18}
              toneMapped={!accent}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Mug() {
  return (
    <group position={[1.45, 0.2, 0.6]}>
      <mesh>
        <cylinderGeometry args={[0.13, 0.11, 0.3, 32]} />
        <meshStandardMaterial color="#1a1f52" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.07, 0.02, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#1a1f52" />
      </mesh>
      <Sparkles count={10} scale={[0.25, 0.6, 0.25]} position={[0, 0.4, 0]} size={1.4} speed={0.6} color="#ffffff" opacity={0.5} />
    </group>
  );
}

function Desk() {
  return (
    <group>
      <RoundedBox args={[4.8, 0.12, 2.1]} radius={0.05} position={[0, -0.04, 0.25]}>
        <meshStandardMaterial color={COLORS.desk} metalness={0.55} roughness={0.28} />
      </RoundedBox>
      <mesh position={[0, -0.04, 1.31]}>
        <boxGeometry args={[4.7, 0.02, 0.01]} />
        <meshBasicMaterial color={COLORS.violet} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.04, -0.81]}>
        <boxGeometry args={[4.7, 0.02, 0.01]} />
        <meshBasicMaterial color={COLORS.cyan} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Halo() {
  const outer = useRef<Mesh>(null);
  const inner = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (outer.current) outer.current.rotation.z += delta * 0.08;
    if (inner.current) inner.current.rotation.z -= delta * 0.12;
  });
  return (
    <group position={[0, 1.7, -1.6]}>
      <mesh ref={outer}>
        <torusGeometry args={[2.35, 0.012, 16, 160, Math.PI * 1.6]} />
        <meshBasicMaterial color={COLORS.violet} toneMapped={false} />
      </mesh>
      <mesh ref={inner}>
        <torusGeometry args={[2.05, 0.008, 16, 160, Math.PI * 1.2]} />
        <meshBasicMaterial color={COLORS.cyan} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.4]}>
        <circleGeometry args={[2.2, 64]} />
        <meshBasicMaterial color="#1b1060" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function FloatingPanel({ spec }: { spec: CodePanelSpec }) {
  return (
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.7}>
      <group position={[2.25, 2.2, -0.35]} rotation={[0, -0.5, 0]}>
        <CodeScreen spec={spec} width={1.35} opacity={0.9} />
      </group>
    </Float>
  );
}

function Workspace({ effects }: { effects: boolean }) {
  const width = useThree((state) => state.size.width);
  const focusX = width >= 1440 ? 2.9 : width >= 1280 ? 2.6 : width >= 1024 ? 2.2 : 0;
  const group = useRef<Group>(null);
  const [stackPanel, terminalPanel] = sidePanels;

  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.05 - 0.12;
  });

  return (
    <>
      <color attach="background" args={[COLORS.background]} />
      <fog attach="fog" args={[COLORS.background, 9, 22]} />

      <ambientLight intensity={0.2} />
      <spotLight position={[-5, 7, 4]} angle={0.45} penumbra={1} intensity={80} color={COLORS.violet} />
      <spotLight position={[5, 6, 3]} angle={0.5} penumbra={1} intensity={60} color={COLORS.cyan} />
      <pointLight position={[0, 2.5, -2.5]} intensity={6} distance={7} color={COLORS.violet} />
      <directionalLight position={[0, 5, 6]} intensity={0.35} />

      <group ref={group} position={[focusX, -0.35, 0]}>
        <Halo />
        <Desk />
        <Monitor />
        {stackPanel ? <SideMonitor spec={stackPanel} /> : null}
        {terminalPanel ? <FloatingPanel spec={terminalPanel} /> : null}
        <Keyboard />
        <Mug />
        <TechObjects />
        <ContactShadows position={[0, 0.03, 0.25]} opacity={0.7} scale={9} blur={2.6} far={2.2} />
        <Grid
          position={[0, -1.2, 0]}
          args={[40, 40]}
          infiniteGrid
          cellSize={0.6}
          cellThickness={0.6}
          cellColor="#1b2466"
          sectionSize={3}
          sectionThickness={1.1}
          sectionColor={COLORS.violet}
          fadeDistance={22}
          fadeStrength={1.6}
        />
      </group>

      <Sparkles count={90} scale={[14, 7, 8]} position={[focusX, 2, 0]} size={2.4} speed={0.3} color={COLORS.cyan} opacity={0.7} />
      <Stars radius={50} depth={40} count={1800} factor={3.2} saturation={0} fade speed={0.5} />
      <CameraRig focusX={focusX} />

      {effects ? (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.55} luminanceSmoothing={0.25} radius={0.7} />
          <Vignette eskil={false} offset={0.2} darkness={0.75} />
        </EffectComposer>
      ) : null}
    </>
  );
}

interface WorkspaceSceneProps {
  active: boolean;
  onReady?: () => void;
}

export default function WorkspaceScene({ active, onReady }: WorkspaceSceneProps) {
  const [dpr, setDpr] = useState(1.5);
  const [effects, setEffects] = useState(true);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      camera={{ position: [0, 1.9, 7.4], fov: 40 }}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false }}
      onCreated={() => onReady?.()}
    >
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
      <Workspace effects={effects} />
    </Canvas>
  );
}
