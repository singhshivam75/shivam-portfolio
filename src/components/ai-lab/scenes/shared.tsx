"use client";

import { Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AdditiveBlending,
  Color,
  MathUtils,
  Object3D,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
  type Curve,
  type Group,
  type InstancedMesh,
  type Mesh,
} from "three";
import type { Vec3 } from "../layout";

export const COLORS = {
  violet: "#8b5cf6",
  violetSoft: "#a78bfa",
  cyan: "#22d3ee",
  cyanSoft: "#67e8f9",
  emerald: "#34d399",
  white: "#e0f2ff",
  metal: "#141a45",
  deep: "#0a0f2c",
} as const;

/** HDR colour (> 1) so emissive parts cross the bloom threshold. */
export function glow(hex: string, intensity = 2): Color {
  return new Color(hex).multiplyScalar(intensity);
}

/** Deterministic pseudo-random generator so procedural geometry is stable between renders. */
export function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function toVector(point: Vec3): Vector3 {
  return new Vector3(point[0], point[1], point[2]);
}

/** Gently arched curve between two points. */
export function arc(from: Vec3, to: Vec3, lift = 0.6, depth = 0): QuadraticBezierCurve3 {
  const a = toVector(from);
  const b = toVector(to);
  const mid = a.clone().lerp(b, 0.5);
  mid.y += lift;
  mid.z += depth;
  return new QuadraticBezierCurve3(a, mid, b);
}

export interface SceneProps {
  selected: string | null;
  onSelect: (id: string) => void;
  /** Hotspot labels; `null` while the scene is off-camera so no DOM labels are rendered. */
  labels: Record<string, string> | null;
}

interface GlowTubeProps {
  curve: Curve<Vector3>;
  color: string;
  radius?: number;
  opacity?: number;
  intensity?: number;
}

export function GlowTube({ curve, color, radius = 0.02, opacity = 0.7, intensity = 1.6 }: GlowTubeProps) {
  const geometry = useMemo(() => new TubeGeometry(curve, 48, radius, 6, false), [curve, radius]);
  const tint = useMemo(() => glow(color, intensity), [color, intensity]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color={tint}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

interface FlowParticlesProps {
  curve: Curve<Vector3>;
  count?: number;
  speed?: number;
  size?: number;
  from?: string;
  to?: string;
  /** Particle scale follows this function of progress (0–1). */
  scaleAt?: (t: number) => number;
  shape?: "sphere" | "cube";
}

const dummy = new Object3D();
const mixed = new Color();

function placeParticles(
  mesh: InstancedMesh,
  curve: Curve<Vector3>,
  count: number,
  elapsed: number,
  speed: number,
  start: Color,
  end: Color,
  scaleAt: (t: number) => number,
) {
  for (let i = 0; i < count; i += 1) {
    const t = (i / count + elapsed * speed) % 1;
    curve.getPointAt(t, dummy.position);
    dummy.scale.setScalar(scaleAt(t));
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    mesh.setColorAt(i, mixed.copy(start).lerp(end, t));
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

const pulse = (t: number) => Math.sin(t * Math.PI);

/** Small glowing particles streaming along a curve. */
export function FlowParticles({
  curve,
  count = 10,
  speed = 0.18,
  size = 0.05,
  from = COLORS.violetSoft,
  to = COLORS.cyanSoft,
  scaleAt = pulse,
  shape = "sphere",
}: FlowParticlesProps) {
  const ref = useRef<InstancedMesh>(null);
  const colors = useMemo(() => [glow(from, 2.4), glow(to, 2.4)] as const, [from, to]);
  useFrame((state) => {
    if (ref.current) placeParticles(ref.current, curve, count, state.clock.elapsedTime, speed, colors[0], colors[1], scaleAt);
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      {shape === "cube" ? <boxGeometry args={[size * 2.4, size * 3, size * 0.4]} /> : <sphereGeometry args={[size, 10, 10]} />}
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

interface HotspotProps {
  id: string;
  position: Vec3;
  label?: string;
  /** Radius of the invisible hit area and selection ring. */
  radius?: number;
  selected: boolean;
  onSelect: (id: string) => void;
  /** Label offset below the object. */
  labelOffset?: number;
  children: ReactNode;
}

/** Interactive wrapper: hover/click targets, selection ring and a floating label. */
export function Hotspot({ id, position, label, radius = 0.8, selected, onSelect, labelOffset, children }: HotspotProps) {
  const [hovered, setHovered] = useState(false);
  const body = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const ringColor = useMemo(() => glow(COLORS.cyan, 2.2), []);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    const target = selected ? 1.18 : hovered ? 1.08 : 1;
    if (body.current) body.current.scale.setScalar(MathUtils.damp(body.current.scale.x, target, 6, step));
    if (ring.current) {
      ring.current.rotation.z += step * 0.6;
      ring.current.scale.setScalar(MathUtils.damp(ring.current.scale.x, selected ? 1 : 0.001, 8, step));
    }
  });

  const onOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  };
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(id);
  };

  return (
    <group position={position as [number, number, number]}>
      <group ref={body}>{children}</group>
      <mesh ref={ring} scale={0.001}>
        <torusGeometry args={[radius * 1.05, 0.015, 8, 64, Math.PI * 1.6]} />
        <meshBasicMaterial color={ringColor} toneMapped={false} />
      </mesh>
      <mesh onPointerOver={onOver} onPointerOut={() => setHovered(false)} onClick={onClick}>
        <sphereGeometry args={[radius, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {label ? (
        <Html
          position={[0, -(labelOffset ?? radius + 0.28), 0]}
          center
          zIndexRange={[10, 0]}
          style={{ pointerEvents: "none" }}
        >
          <span
            className={`block rounded-full border px-3 py-1 font-mono text-[11px] tracking-wide whitespace-nowrap backdrop-blur-sm transition duration-300 ${
              selected
                ? "border-cyan-glow/70 bg-cyan-glow/20 text-white"
                : hovered
                  ? "border-violet-glow/60 bg-midnight-900/80 text-white"
                  : "border-white/10 bg-midnight-950/60 text-ink-muted"
            }`}
          >
            {label}
          </span>
        </Html>
      ) : null}
    </group>
  );
}
