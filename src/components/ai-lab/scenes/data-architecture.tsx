"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, CylinderGeometry, DoubleSide, EdgesGeometry, type Group, type Mesh } from "three";
import { SCENE_LAYOUTS } from "../layout";
import { COLORS, FlowParticles, GlowTube, Hotspot, arc, glow, type SceneProps } from "./shared";

const { points } = SCENE_LAYOUTS.data;
const p = (id: string) => points[id] ?? ([0, 0, 0] as const);

function Screen({ width, height }: { width: number; height: number }) {
  const line = useMemo(() => glow(COLORS.cyanSoft, 1.4), []);
  const backlight = useMemo(() => glow(COLORS.violet, 0.35), []);
  const rows = Math.max(2, Math.round(height / 0.14));
  return (
    <group position={[0, 0, 0.03]}>
      <mesh>
        <planeGeometry args={[width * 0.88, height * 0.82]} />
        <meshBasicMaterial color={backlight} toneMapped={false} />
      </mesh>
      {Array.from({ length: rows }, (_, i) => (
        <mesh key={i} position={[-width * 0.08 * (i % 2), height * 0.3 - (i * height * 0.6) / (rows - 1), 0.002]}>
          <planeGeometry args={[width * (0.6 - (i % 3) * 0.12), 0.03]} />
          <meshBasicMaterial color={line} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Clients() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = 0.35 + Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
  });
  return (
    <group ref={group}>
      <group position={[-0.15, 0.15, 0]}>
        <RoundedBox args={[1.05, 0.7, 0.05]} radius={0.03} smoothness={2}>
          <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.25} />
        </RoundedBox>
        <Screen width={1.05} height={0.7} />
        <mesh position={[0, -0.47, -0.02]}>
          <boxGeometry args={[0.08, 0.25, 0.04]} />
          <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
      <group position={[0.5, -0.2, 0.35]} rotation={[0, -0.25, 0]}>
        <RoundedBox args={[0.32, 0.62, 0.04]} radius={0.04} smoothness={2}>
          <meshStandardMaterial color={COLORS.metal} metalness={0.8} roughness={0.25} />
        </RoundedBox>
        <Screen width={0.32} height={0.6} />
      </group>
    </group>
  );
}

function ApiTower() {
  const upper = useRef<Mesh>(null);
  const lower = useRef<Mesh>(null);
  const edges = useMemo(() => new EdgesGeometry(new CylinderGeometry(0.42, 0.42, 1.2, 6)), []);
  useEffect(() => () => edges.dispose(), [edges]);
  const colors = useMemo(() => ({ edge: glow(COLORS.violetSoft, 2), ring: glow(COLORS.cyan, 2) }), []);
  useFrame((_, delta) => {
    if (upper.current) upper.current.rotation.z += delta * 0.9;
    if (lower.current) lower.current.rotation.z -= delta * 0.6;
  });
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 1.2, 6]} />
        <meshStandardMaterial color={COLORS.deep} emissive={COLORS.violet} emissiveIntensity={0.25} metalness={0.6} roughness={0.3} transparent opacity={0.85} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={colors.edge} toneMapped={false} />
      </lineSegments>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={upper} position={[0, 0, -0.3]}>
          <torusGeometry args={[0.66, 0.012, 8, 64, Math.PI * 1.4]} />
          <meshBasicMaterial color={colors.ring} toneMapped={false} />
        </mesh>
        <mesh ref={lower} position={[0, 0, 0.3]}>
          <torusGeometry args={[0.6, 0.012, 8, 64, Math.PI * 1.2]} />
          <meshBasicMaterial color={colors.edge} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function RedisCluster() {
  const group = useRef<Group>(null);
  const core = useMemo(() => glow(COLORS.cyan, 1.8), []);
  const cubes = useMemo(() => {
    const list: Array<[number, number, number]> = [];
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) list.push([x * 0.17, y * 0.17, z * 0.17]);
    return list;
  }, []);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.8;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.35;
    const spread = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.12;
    group.current.scale.setScalar(spread);
  });
  return (
    <group ref={group}>
      {cubes.map((position) => (
        <mesh key={position.join()} position={position}>
          <boxGeometry args={[0.26, 0.26, 0.26]} />
          <meshStandardMaterial color={COLORS.deep} emissive={COLORS.cyan} emissiveIntensity={0.9} metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={core} toneMapped={false} />
      </mesh>
    </group>
  );
}

const JOBS = 5;

function QueueConveyor() {
  const jobs = useRef<Array<Mesh | null>>([]);
  const tube = useMemo(() => glow(COLORS.violetSoft, 1.4), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.25;
    jobs.current.forEach((job, i) => {
      if (!job) return;
      const progress = (t + i / JOBS) % 1;
      job.position.x = -0.8 + progress * 1.6;
      job.scale.setScalar(Math.min(1, Math.sin(progress * Math.PI) * 2.5));
    });
  });
  return (
    <group rotation={[0, -0.25, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 1.8, 32, 1, true]} />
        <meshStandardMaterial color={COLORS.metal} emissive={COLORS.violet} emissiveIntensity={0.15} transparent opacity={0.25} side={DoubleSide} depthWrite={false} />
      </mesh>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.24, 0.015, 8, 40]} />
          <meshBasicMaterial color={tube} toneMapped={false} />
        </mesh>
      ))}
      {Array.from({ length: JOBS }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            jobs.current[i] = el;
          }}
        >
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={COLORS.deep} emissive={i % 2 ? COLORS.violet : COLORS.cyan} emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  );
}

function DatabaseStack() {
  const rim = useMemo(() => glow(COLORS.cyan, 2), []);
  const glowDisc = useMemo(() => glow(COLORS.violet, 1.2), []);
  const top = useRef<Mesh>(null);
  useFrame((state) => {
    if (top.current) top.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.06);
  });
  return (
    <group>
      {[-0.42, 0, 0.42].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <cylinderGeometry args={[0.58, 0.58, 0.34, 48]} />
            <meshStandardMaterial color={COLORS.metal} emissive={COLORS.violet} emissiveIntensity={0.2} metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.172, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.58, 0.014, 8, 64]} />
            <meshBasicMaterial color={rim} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <mesh ref={top} position={[0, 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 48]} />
        <meshBasicMaterial color={glowDisc} transparent opacity={0.35} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

const NODES = [
  { id: "clients", radius: 0.85, Object: Clients },
  { id: "api", radius: 0.8, Object: ApiTower },
  { id: "redis", radius: 0.6, Object: RedisCluster },
  { id: "queue", radius: 0.9, Object: QueueConveyor },
  { id: "database", radius: 0.85, Object: DatabaseStack },
] as const;

export function DataArchitecture({ selected, onSelect, labels }: SceneProps) {
  const curves = useMemo(
    () => ({
      request: arc(p("clients"), p("api"), 0.35, 0.2),
      response: arc(p("api"), p("clients"), -0.35, 0.2),
      cacheIn: arc(p("api"), p("redis"), 0.15, 0.25),
      cacheOut: arc(p("redis"), p("api"), -0.15, -0.25),
      read: arc(p("api"), p("database"), 0.1, -0.4),
      enqueue: arc(p("api"), p("queue"), -0.15, 0.25),
      work: arc(p("queue"), p("database"), -0.25, 0.2),
    }),
    [],
  );

  return (
    <group>
      <GlowTube curve={curves.request} color={COLORS.violetSoft} opacity={0.35} />
      <GlowTube curve={curves.response} color={COLORS.cyan} opacity={0.3} />
      <GlowTube curve={curves.cacheIn} color={COLORS.cyan} opacity={0.35} />
      <GlowTube curve={curves.read} color={COLORS.violet} opacity={0.35} />
      <GlowTube curve={curves.enqueue} color={COLORS.violetSoft} opacity={0.35} />
      <GlowTube curve={curves.work} color={COLORS.violet} opacity={0.35} />

      <FlowParticles curve={curves.request} count={6} speed={0.3} from={COLORS.violetSoft} to={COLORS.violet} />
      <FlowParticles curve={curves.response} count={6} speed={0.3} from={COLORS.cyan} to={COLORS.cyanSoft} />
      <FlowParticles curve={curves.cacheIn} count={5} speed={0.55} size={0.04} from={COLORS.violet} to={COLORS.cyan} />
      <FlowParticles curve={curves.cacheOut} count={5} speed={0.55} size={0.04} from={COLORS.cyan} to={COLORS.cyanSoft} />
      <FlowParticles curve={curves.read} count={6} speed={0.2} from={COLORS.violetSoft} to={COLORS.cyan} />
      <FlowParticles curve={curves.enqueue} count={4} speed={0.18} from={COLORS.violetSoft} to={COLORS.violet} />
      <FlowParticles curve={curves.work} count={4} speed={0.12} from={COLORS.violet} to={COLORS.cyan} />

      {NODES.map(({ id, radius, Object }) => (
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
