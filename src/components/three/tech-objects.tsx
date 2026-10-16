"use client";

import { Float, Html, RoundedBox } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CanvasTexture, MathUtils, SRGBColorSpace, type Group } from "three";

interface InteractiveObjectProps {
  label: string;
  position: [number, number, number];
  scale?: number;
  spin?: number;
  floatSpeed?: number;
  children: ReactNode;
}

function InteractiveObject({ label, position, scale = 1, spin = 0.4, floatSpeed = 1.6, children }: InteractiveObjectProps) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const boost = useRef(0);

  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    boost.current = Math.max(0, boost.current - delta * 2.5);
    group.rotation.y += delta * (spin + (hovered ? 1.8 : 0) + boost.current * 6);
    const target = scale * (hovered ? 1.3 : 1);
    group.scale.setScalar(MathUtils.damp(group.scale.x, target, 8, delta));
  });

  const onOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  };
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    boost.current = 1;
  };

  return (
    <Float speed={floatSpeed} rotationIntensity={0.5} floatIntensity={1.1}>
      <group position={position}>
        <group ref={ref} scale={scale} onPointerOver={onOver} onPointerOut={() => setHovered(false)} onClick={onClick}>
          {children}
        </group>
        {hovered ? (
          <Html center position={[0, 0.62 * scale + 0.25, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
            <span className="glass rounded-full px-3 py-1 font-mono text-[11px] whitespace-nowrap text-cyan-100">
              {label}
            </span>
          </Html>
        ) : null}
      </group>
    </Float>
  );
}

function glow(color: string, intensity = 1.6) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />;
}

function ReactAtom() {
  const color = "#5eead4";
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.11, 24, 24]} />
        {glow(color, 2.4)}
      </mesh>
      {[0, Math.PI / 3, -Math.PI / 3].map((rotation) => (
        <mesh key={rotation} rotation={[0, 0, rotation]} scale={[1, 0.38, 1]}>
          <torusGeometry args={[0.42, 0.018, 12, 80]} />
          {glow(color, 1.8)}
        </mesh>
      ))}
    </group>
  );
}

function NodeHex() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.36, 0.36, 0.12, 6]} />
        <meshStandardMaterial color="#0f2a1f" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.38, 0.38, 0.06, 6, 1, true]} />
        {glow("#34d399", 1.5)}
      </mesh>
    </group>
  );
}

function DatabaseStack() {
  return (
    <group>
      {[-0.2, 0, 0.2].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 0.15, 40]} />
            <meshStandardMaterial color="#1c1650" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.078, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.012, 8, 48]} />
            {glow("#a78bfa", 2)}
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Cloud() {
  const puffs: Array<[number, number, number, number]> = [
    [0, 0.05, 0, 0.26],
    [-0.26, -0.04, 0, 0.19],
    [0.26, -0.04, 0, 0.2],
    [0.1, 0.16, 0.02, 0.18],
  ];
  return (
    <group>
      {puffs.map(([x, y, z, r]) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]}>
          <sphereGeometry args={[r, 28, 28]} />
          <meshStandardMaterial color="#cffafe" emissive="#22d3ee" emissiveIntensity={0.55} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function AICore() {
  const inner = useRef<Group>(null);
  useFrame((_, delta) => {
    if (inner.current) inner.current.rotation.x += delta * 0.8;
  });
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.36, 0]} />
        <meshStandardMaterial color="#c084fc" emissive="#a855f7" emissiveIntensity={1.4} wireframe toneMapped={false} />
      </mesh>
      <group ref={inner}>
        <mesh>
          <octahedronGeometry args={[0.16, 0]} />
          {glow("#f0abfc", 2.6)}
        </mesh>
      </group>
    </group>
  );
}

function drawLabel(texture: CanvasTexture, text: string, color: string) {
  const ctx = (texture.image as HTMLCanvasElement).getContext("2d");
  if (!ctx) return;
  const family =
    getComputedStyle(document.documentElement).getPropertyValue("--font-space-grotesk").trim() || "sans-serif";
  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = color;
  ctx.font = `700 ${text.length > 2 ? 78 : 112}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 136);
  texture.needsUpdate = true;
}

function useLabelTexture(text: string, color: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    return result;
  }, []);

  useEffect(() => {
    const draw = () => drawLabel(texture, text, color);
    draw();
    void document.fonts.ready.then(draw);
  }, [color, text, texture]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function BadgeChip({ text, base, ink }: { text: string; base: string; ink: string }) {
  const texture = useLabelTexture(text, ink);
  return (
    <group>
      <RoundedBox args={[0.62, 0.62, 0.12]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color={base} metalness={0.4} roughness={0.25} emissive={base} emissiveIntensity={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[0.56, 0.56]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.065]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.56, 0.56]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Floating, hoverable technology objects arranged around the workspace. */
export function TechObjects() {
  return (
    <group>
      <InteractiveObject label="React / React Native" position={[-1.35, 3.3, -1.2]} spin={0.6}>
        <ReactAtom />
      </InteractiveObject>
      <InteractiveObject label="Next.js" position={[2.15, 3.35, -1.0]} scale={0.85} spin={0.5} floatSpeed={1.3}>
        <BadgeChip text="N" base="#0b0f24" ink="#ffffff" />
      </InteractiveObject>
      <InteractiveObject label="TypeScript" position={[-1.3, 0.45, 1.55]} scale={0.7} spin={0.45} floatSpeed={1.9}>
        <BadgeChip text="TS" base="#1d4ed8" ink="#ffffff" />
      </InteractiveObject>
      <InteractiveObject label="Node.js / NestJS" position={[3.05, 1.3, 0.45]} scale={0.85} spin={0.5}>
        <NodeHex />
      </InteractiveObject>
      <InteractiveObject label="MongoDB / PostgreSQL / Redis" position={[1.95, 0.5, 1.4]} scale={0.65} spin={0.35}>
        <DatabaseStack />
      </InteractiveObject>
      <InteractiveObject label="AWS" position={[0.45, 3.6, -1.7]} scale={1} spin={0.25} floatSpeed={1.1}>
        <Cloud />
      </InteractiveObject>
      <InteractiveObject label="LLMs / RAG / AI Agents" position={[2.95, 2.75, -0.6]} scale={0.7} spin={0.55}>
        <AICore />
      </InteractiveObject>
    </group>
  );
}
