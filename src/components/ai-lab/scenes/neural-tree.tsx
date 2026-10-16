"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, CatmullRomCurve3, Object3D, Vector3, type Group, type InstancedMesh, type Mesh } from "three";
import { SCENE_LAYOUTS } from "../layout";
import { COLORS, FlowParticles, GlowTube, Hotspot, glow, seeded, toVector, type SceneProps } from "./shared";

const layout = SCENE_LAYOUTS.neural;
const TIPS = ["llm", "rag", "automation", "agents", "prompt"] as const;
const TIP_COLORS = [COLORS.violet, COLORS.violetSoft, "#818cf8", COLORS.cyanSoft, COLORS.cyan] as const;

interface TreeGeometry {
  trunk: CatmullRomCurve3;
  branches: CatmullRomCurve3[];
  flows: CatmullRomCurve3[];
  twigs: CatmullRomCurve3[];
  roots: CatmullRomCurve3[];
  neurons: Vector3[];
}

function buildTree(): TreeGeometry {
  const random = seeded(11);
  const root = toVector(layout.points._root ?? [0, -3, 0]);
  const fork = toVector(layout.points._fork ?? [0, -1, 0]);
  const trunk = new CatmullRomCurve3([root, new Vector3(0.12, -2, 0.05), new Vector3(-0.08, -1.4, 0), fork]);

  const branches: CatmullRomCurve3[] = [];
  const flows: CatmullRomCurve3[] = [];
  const twigs: CatmullRomCurve3[] = [];
  const neurons: Vector3[] = [];

  for (const id of TIPS) {
    const tip = toVector(layout.points[id] ?? [0, 0, 0]);
    const bend = fork.clone().lerp(tip, 0.45);
    bend.y -= 0.35;
    bend.x *= 0.85;
    const branch = new CatmullRomCurve3([fork, bend, tip]);
    branches.push(branch);
    flows.push(new CatmullRomCurve3([root, new Vector3(0.12, -2, 0.05), fork, bend, tip]));

    for (const t of [0.35, 0.55, 0.78]) {
      const start = branch.getPointAt(t);
      const direction = new Vector3(random() - 0.5, 0.6 + random() * 0.5, random() - 0.5).normalize();
      const length = 0.45 + random() * 0.6;
      const mid = start.clone().addScaledVector(direction, length * 0.55);
      mid.x += (random() - 0.5) * 0.25;
      const end = start.clone().addScaledVector(direction, length);
      twigs.push(new CatmullRomCurve3([start, mid, end]));
      neurons.push(end);
    }
  }

  const roots = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + random() * 0.4;
    const spread = 1 + random() * 0.9;
    return new CatmullRomCurve3([
      root,
      new Vector3(Math.cos(angle) * spread * 0.4, root.y - 0.18, Math.sin(angle) * spread * 0.4),
      new Vector3(Math.cos(angle) * spread, root.y - 0.42, Math.sin(angle) * spread),
    ]);
  });

  return { trunk, branches, flows, twigs, roots, neurons };
}

function Neurons({ points }: { points: Vector3[] }) {
  const ref = useRef<InstancedMesh>(null);
  const tint = useMemo(() => glow(COLORS.white, 1.6), []);
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    points.forEach((point, i) => {
      dummy.position.copy(point);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [points]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, points.length]}>
      <sphereGeometry args={[0.045, 10, 10]} />
      <meshBasicMaterial color={tint} toneMapped={false} />
    </instancedMesh>
  );
}

function SkillOrb({ color, index }: { color: string; index: number }) {
  const halo = useRef<Mesh>(null);
  const shell = useRef<Mesh>(null);
  const core = useMemo(() => glow(color, 2.6), [color]);
  const soft = useMemo(() => glow(color, 1.2), [color]);
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime + index;
    if (halo.current) halo.current.scale.setScalar(1 + Math.sin(t * 1.8) * 0.12);
    if (shell.current) {
      shell.current.rotation.y += delta * 0.5;
      shell.current.rotation.x += delta * 0.2;
    }
  });
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial color={core} toneMapped={false} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color={soft} transparent opacity={0.18} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.36, 0]} />
        <meshBasicMaterial color={soft} wireframe transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </>
  );
}

export function NeuralTree({ selected, onSelect, labels }: SceneProps) {
  const tree = useMemo(() => buildTree(), []);
  const group = useRef<Group>(null);
  const rootGlow = useMemo(() => glow(COLORS.violet, 1.4), []);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
  });

  return (
    <group ref={group}>
      <GlowTube curve={tree.trunk} color={COLORS.violet} radius={0.07} opacity={0.9} />
      {tree.branches.map((curve, i) => (
        <GlowTube key={`b${i}`} curve={curve} color={TIP_COLORS[i] ?? COLORS.cyan} radius={0.035} opacity={0.85} />
      ))}
      {tree.twigs.map((curve, i) => (
        <GlowTube key={`t${i}`} curve={curve} color={COLORS.violetSoft} radius={0.012} opacity={0.5} />
      ))}
      {tree.roots.map((curve, i) => (
        <GlowTube key={`r${i}`} curve={curve} color={COLORS.violet} radius={0.018} opacity={0.45} />
      ))}
      {tree.flows.map((curve, i) => (
        <FlowParticles key={`f${i}`} curve={curve} count={7} speed={0.12 + i * 0.015} size={0.045} to={TIP_COLORS[i]} />
      ))}
      <Neurons points={tree.neurons} />

      <mesh position={[0, -3.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 48]} />
        <meshBasicMaterial color={rootGlow} transparent opacity={0.05} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>

      {TIPS.map((id, i) => (
        <Hotspot
          key={id}
          id={id}
          position={layout.points[id] ?? [0, 0, 0]}
          label={labels?.[id]}
          radius={0.55}
          selected={selected === id}
          onSelect={onSelect}
        >
          <SkillOrb color={TIP_COLORS[i] ?? COLORS.cyan} index={i} />
        </Hotspot>
      ))}
    </group>
  );
}
