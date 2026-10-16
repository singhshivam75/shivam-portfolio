"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  MathUtils,
  Object3D,
  Quaternion,
  Vector3,
  type Group,
  type InstancedMesh,
  type Mesh,
  type MeshBasicMaterial,
  type QuadraticBezierCurve3,
} from "three";
import { SCENE_LAYOUTS } from "../layout";
import { COLORS, FlowParticles, GlowTube, Hotspot, arc, glow, type SceneProps } from "./shared";

const layout = SCENE_LAYOUTS.agent;
const p = (id: string) => layout.points[id] ?? ([0, 0, 0] as const);
const CHECKPOINTS = ["goal", "plan", "tools", "observe", "answer"] as const;
/** Route the agent flies: the plan → tools → observe loop runs twice before answering. */
const ROUTE = ["goal", "plan", "tools", "observe", "plan", "tools", "observe", "answer"] as const;
const TRAVEL = 1.4;
const DWELL = 0.55;
const FINAL_PAUSE = 1.6;
const TRAIL = 16;

interface Journey {
  at: string | null;
}

function buildCurves() {
  const forward: Record<string, QuadraticBezierCurve3> = {
    "goal>plan": arc(p("goal"), p("plan"), 0.5, 0.3),
    "plan>tools": arc(p("plan"), p("tools"), 0.35, 0.3),
    "tools>observe": arc(p("tools"), p("observe"), 0.35, 0.3),
    "observe>answer": arc(p("observe"), p("answer"), 0.5, 0.3),
  };
  const loop = arc(p("observe"), p("plan"), 1.7, -0.7);
  const route = ROUTE.slice(1).map((to, i) => {
    const key = `${ROUTE[i]}>${to}`;
    return key === "observe>plan" ? loop : (forward[key] ?? loop);
  });
  return { forward: Object.values(forward), loop, route };
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const UP = new Vector3(0, 1, 0);
const tangent = new Vector3();
const facing = new Quaternion();
const dummy = new Object3D();

function markArrival(journey: RefObject<Journey>, at: string | null) {
  if (journey.current) journey.current.at = at;
}

/** Recycles the oldest trail point as the newest, eased toward the rocket. */
function advanceTrail(history: Vector3[], head: Vector3) {
  const oldest = history.pop();
  if (!oldest) return;
  oldest.copy(history[0] ?? head).lerp(head, 0.5);
  history.unshift(oldest);
}

function Rocket({ route, journey }: { route: QuadraticBezierCurve3[]; journey: RefObject<Journey> }) {
  const rocket = useRef<Group>(null);
  const flame = useRef<Mesh>(null);
  const trail = useRef<InstancedMesh>(null);
  const history = useMemo(() => Array.from({ length: TRAIL }, () => new Vector3()), []);
  const colors = useMemo(
    () => ({ window: glow(COLORS.cyan, 2.5), flame: glow(COLORS.violetSoft, 2.6), trail: glow(COLORS.cyanSoft, 2) }),
    [],
  );
  const total = route.length * (TRAVEL + DWELL) + FINAL_PAUSE;

  useFrame((state, delta) => {
    const group = rocket.current;
    if (!group) return;
    const time = state.clock.elapsedTime % total;
    const segment = Math.min(route.length - 1, Math.floor(time / (TRAVEL + DWELL)));
    const local = time - segment * (TRAVEL + DWELL);
    const moving = local < TRAVEL && time < route.length * (TRAVEL + DWELL);
    const curve = route[segment];
    if (!curve) return;
    const t = moving ? easeInOut(local / TRAVEL) : 1;

    curve.getPointAt(t, group.position);
    curve.getTangentAt(Math.min(t, 0.999), tangent).normalize();
    facing.setFromUnitVectors(UP, tangent);
    group.quaternion.slerp(facing, Math.min(1, delta * 8));
    markArrival(journey, moving ? null : (ROUTE[segment + 1] ?? null));

    if (flame.current) flame.current.scale.set(1, (moving ? 1.2 : 0.4) + Math.sin(state.clock.elapsedTime * 40) * 0.15, 1);

    const mesh = trail.current;
    if (!mesh) return;
    advanceTrail(history, group.position);
    history.forEach((point, i) => {
      dummy.position.copy(point);
      dummy.scale.setScalar(moving ? (1 - i / TRAIL) * 0.9 : 0.001);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <group ref={rocket} scale={0.9}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.11, 0.38, 20]} />
          <meshStandardMaterial color="#c7d2fe" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <coneGeometry args={[0.09, 0.2, 20]} />
          <meshStandardMaterial color={COLORS.violet} emissive={COLORS.violet} emissiveIntensity={0.6} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.06, 0.085]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color={colors.window} toneMapped={false} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]} position={[0, -0.15, 0]}>
            <boxGeometry args={[0.02, 0.14, 0.32]} />
            <meshStandardMaterial color={COLORS.cyan} emissive={COLORS.cyan} emissiveIntensity={0.5} />
          </mesh>
        ))}
        <mesh ref={flame} position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.07, 0.3, 16]} />
          <meshBasicMaterial color={colors.flame} transparent opacity={0.85} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      <instancedMesh ref={trail} args={[undefined, undefined, TRAIL]} frustumCulled={false}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={colors.trail} transparent opacity={0.6} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function setGateState(material: MeshBasicMaterial | null, lit: boolean, delta: number) {
  if (!material) return;
  material.opacity = MathUtils.damp(material.opacity, lit ? 0.5 : 0.08, 6, delta);
}

function Checkpoint({ id, index, journey }: { id: string; index: number; journey: RefObject<Journey> }) {
  const ring = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);
  const disc = useRef<MeshBasicMaterial>(null);
  const color = index === CHECKPOINTS.length - 1 ? COLORS.cyan : index === 0 ? COLORS.violet : COLORS.violetSoft;
  const ringColor = useMemo(() => glow(color, 2), [color]);
  const coreColor = useMemo(() => glow(COLORS.white, 1.8), []);

  useFrame((state, delta) => {
    const step = Math.min(delta, 0.05);
    const lit = journey.current?.at === id;
    setGateState(disc.current, lit, step);
    if (ring.current) ring.current.rotation.z += step * (lit ? 1.6 : 0.3);
    if (core.current) {
      core.current.rotation.y += step;
      core.current.scale.setScalar(MathUtils.damp(core.current.scale.x, lit ? 1.5 : 1, 6, step));
      core.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.05;
    }
  });

  return (
    <group rotation={[0, 0.25, 0]}>
      <mesh ref={ring}>
        <torusGeometry args={[0.5, 0.03, 10, 64, Math.PI * 1.75]} />
        <meshBasicMaterial color={ringColor} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.62, 0.008, 6, 64]} />
        <meshBasicMaterial color={ringColor} transparent opacity={0.4} toneMapped={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.48, 48]} />
        <meshBasicMaterial ref={disc} color={ringColor} transparent opacity={0.08} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={core}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshBasicMaterial color={coreColor} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function AgentJourney({ selected, onSelect, labels }: SceneProps) {
  const curves = useMemo(() => buildCurves(), []);
  const journey = useRef<Journey>({ at: null });

  return (
    <group>
      {curves.forward.map((curve, i) => (
        <GlowTube key={i} curve={curve} color={i % 2 ? COLORS.cyan : COLORS.violetSoft} radius={0.018} opacity={0.45} />
      ))}
      <GlowTube curve={curves.loop} color={COLORS.violet} radius={0.01} opacity={0.3} />
      <FlowParticles curve={curves.loop} count={14} speed={0.08} size={0.03} from={COLORS.violet} to={COLORS.violetSoft} scaleAt={() => 1} />

      <Rocket route={curves.route} journey={journey} />

      {CHECKPOINTS.map((id, i) => (
        <Hotspot
          key={id}
          id={id}
          position={p(id)}
          label={labels?.[id]}
          radius={0.7}
          selected={selected === id}
          onSelect={onSelect}
        >
          <Checkpoint id={id} index={i} journey={journey} />
        </Hotspot>
      ))}
    </group>
  );
}
