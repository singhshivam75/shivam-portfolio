"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, DoubleSide, Object3D, type Group, type InstancedMesh, type Mesh } from "three";
import { SCENE_LAYOUTS } from "../layout";
import { COLORS, FlowParticles, GlowTube, Hotspot, arc, glow, seeded, type SceneProps } from "./shared";

const { points } = SCENE_LAYOUTS.rag;
const p = (id: string) => points[id] ?? ([0, 0, 0] as const);
const dummy = new Object3D();

function DocumentStack() {
  const group = useRef<Group>(null);
  const line = useMemo(() => glow(COLORS.violetSoft, 1.4), []);
  useFrame((state) => {
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
  });
  return (
    <group ref={group}>
      {[-1, 0, 1].map((offset) => (
        <group key={offset} position={[offset * 0.16, offset * -0.06, offset * -0.18]} rotation={[0, 0.35, offset * 0.12]}>
          <RoundedBox args={[0.85, 1.1, 0.03]} radius={0.04} smoothness={2}>
            <meshStandardMaterial color={COLORS.deep} emissive={COLORS.violet} emissiveIntensity={0.25} metalness={0.4} roughness={0.35} />
          </RoundedBox>
          {[0.3, 0.15, 0, -0.15, -0.3].map((y, i) => (
            <mesh key={y} position={[i === 0 ? -0.08 : 0, y, 0.02]}>
              <boxGeometry args={[i === 0 ? 0.4 : 0.58, 0.035, 0.005]} />
              <meshBasicMaterial color={line} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function EmbeddingCube() {
  const group = useRef<Group>(null);
  const mesh = useRef<InstancedMesh>(null);
  const cells = useMemo(() => {
    const list: Array<[number, number, number]> = [];
    for (let x = -1; x <= 1; x += 1) for (let y = -1; y <= 1; y += 1) for (let z = -1; z <= 1; z += 1) list.push([x, y, z]);
    return list;
  }, []);

  useEffect(() => {
    const instanced = mesh.current;
    if (!instanced) return;
    const color = new Color();
    cells.forEach(([x, y, z], i) => {
      instanced.setColorAt(i, color.set(COLORS.violet).lerp(new Color(COLORS.cyan), (x + y + z + 3) / 6).multiplyScalar(2));
    });
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
  }, [cells]);

  useFrame((state, delta) => {
    const instanced = mesh.current;
    if (group.current) {
      group.current.rotation.y += delta * 0.45;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
    if (!instanced) return;
    const t = state.clock.elapsedTime;
    cells.forEach(([x, y, z], i) => {
      dummy.position.set(x * 0.26, y * 0.26, z * 0.26);
      dummy.scale.setScalar(0.7 + Math.sin(t * 2.4 + (x + y * 2 + z * 3)) * 0.3);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    });
    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]}>
        <boxGeometry args={[0.13, 0.13, 0.13]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function VectorDatabase() {
  const cloud = useRef<Group>(null);
  const dots = useRef<InstancedMesh>(null);
  const rim = useMemo(() => glow(COLORS.cyan, 2), []);
  const positions = useMemo(() => {
    const random = seeded(5);
    return Array.from({ length: 70 }, () => {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * 0.62;
      return [Math.cos(angle) * radius, (random() - 0.5) * 1.15, Math.sin(angle) * radius] as const;
    });
  }, []);

  useEffect(() => {
    const instanced = dots.current;
    if (!instanced) return;
    const color = new Color();
    positions.forEach((position, i) => {
      dummy.position.set(...position);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
      instanced.setColorAt(i, color.set(i % 3 === 0 ? COLORS.violetSoft : COLORS.cyanSoft).multiplyScalar(2));
    });
    instanced.instanceMatrix.needsUpdate = true;
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;
  }, [positions]);

  useFrame((_, delta) => {
    if (cloud.current) cloud.current.rotation.y += delta * 0.3;
  });

  return (
    <group>
      {[-0.45, 0, 0.45].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.78, 0.78, 0.34, 48, 1, true]} />
            <meshStandardMaterial color={COLORS.metal} emissive={COLORS.cyan} emissiveIntensity={0.12} transparent opacity={0.28} depthWrite={false} side={DoubleSide} />
          </mesh>
          <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.78, 0.012, 8, 64]} />
            <meshBasicMaterial color={rim} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <group ref={cloud}>
        <instancedMesh ref={dots} args={[undefined, undefined, positions.length]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      </group>
    </group>
  );
}

function LlmBrain() {
  const shell = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);
  const orbit = useRef<Group>(null);
  const shellColor = useMemo(() => glow(COLORS.violetSoft, 1.5), []);
  const coreColor = useMemo(() => glow(COLORS.violet, 2.2), []);
  const orbitColor = useMemo(() => glow(COLORS.cyan, 2), []);
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y += delta * 0.25;
      shell.current.rotation.z += delta * 0.1;
    }
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.1);
    if (orbit.current) orbit.current.rotation.z += delta * 0.8;
  });
  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshBasicMaterial color={shellColor} wireframe transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color={coreColor} transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <group rotation={[1.1, 0.3, 0]}>
        <group ref={orbit}>
          <mesh>
            <torusGeometry args={[1, 0.01, 8, 80]} />
            <meshBasicMaterial color={orbitColor} transparent opacity={0.7} toneMapped={false} />
          </mesh>
          <mesh position={[1, 0, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color={orbitColor} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function ResponseBubble() {
  const lines = useRef<Array<Mesh | null>>([]);
  const lineColor = useMemo(() => glow(COLORS.cyanSoft, 1.8), []);
  const widths = [0.85, 0.7, 0.5];
  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.5) % 1.6;
    lines.current.forEach((line, i) => {
      if (!line) return;
      const progress = Math.min(1, Math.max(0.001, (t - i * 0.3) * 2.2));
      line.scale.x = progress;
      line.position.x = -0.45 + ((widths[i] ?? 0.5) * progress) / 2;
    });
  });
  return (
    <group rotation={[0, -0.3, 0]}>
      <RoundedBox args={[1.3, 0.9, 0.08]} radius={0.12} smoothness={3}>
        <meshStandardMaterial color={COLORS.deep} emissive={COLORS.cyan} emissiveIntensity={0.18} metalness={0.5} roughness={0.3} />
      </RoundedBox>
      <mesh position={[-0.42, -0.5, 0]} rotation={[0, 0, Math.PI * 0.8]}>
        <coneGeometry args={[0.1, 0.22, 3]} />
        <meshStandardMaterial color={COLORS.deep} emissive={COLORS.cyan} emissiveIntensity={0.18} />
      </mesh>
      {widths.map((width, i) => (
        <mesh
          key={width}
          ref={(el) => {
            lines.current[i] = el;
          }}
          position={[-0.45 + width / 2, 0.2 - i * 0.2, 0.05]}
        >
          <boxGeometry args={[width, 0.05, 0.005]} />
          <meshBasicMaterial color={lineColor} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

const STATIONS = [
  { id: "documents", radius: 0.8, Object: DocumentStack },
  { id: "embeddings", radius: 0.6, Object: EmbeddingCube },
  { id: "vectordb", radius: 0.9, Object: VectorDatabase },
  { id: "llm", radius: 0.95, Object: LlmBrain },
  { id: "response", radius: 0.8, Object: ResponseBubble },
] as const;

const grow = (t: number) => Math.sin(t * Math.PI) * (1 - t * 0.4);

export function RagScene({ selected, onSelect, labels }: SceneProps) {
  const curves = useMemo(
    () => ({
      chunk: arc(p("documents"), p("embeddings"), 0.7, 0.3),
      vector: arc(p("embeddings"), p("vectordb"), 0.6),
      retrieve: arc(p("vectordb"), p("llm"), 0.7, 0.2),
      answer: arc(p("llm"), p("response"), 0.6),
    }),
    [],
  );

  return (
    <group>
      <GlowTube curve={curves.chunk} color={COLORS.violet} opacity={0.4} />
      <GlowTube curve={curves.vector} color={COLORS.violetSoft} opacity={0.4} />
      <GlowTube curve={curves.retrieve} color={COLORS.cyan} opacity={0.4} />
      <GlowTube curve={curves.answer} color={COLORS.cyanSoft} opacity={0.4} />
      <FlowParticles curve={curves.chunk} count={6} speed={0.22} size={0.05} shape="cube" from={COLORS.violetSoft} to={COLORS.violet} scaleAt={grow} />
      <FlowParticles curve={curves.vector} count={9} speed={0.26} size={0.04} from={COLORS.violet} to={COLORS.cyan} />
      <FlowParticles curve={curves.retrieve} count={7} speed={0.22} size={0.05} from={COLORS.cyan} to={COLORS.violetSoft} />
      <FlowParticles curve={curves.answer} count={8} speed={0.26} size={0.045} from={COLORS.violetSoft} to={COLORS.cyanSoft} />

      {STATIONS.map(({ id, radius, Object }) => (
        <Hotspot
          key={id}
          id={id}
          position={p(id)}
          label={labels?.[id]}
          radius={radius}
          selected={selected === id}
          onSelect={onSelect}
        >
          <Object />
        </Hotspot>
      ))}
    </group>
  );
}
