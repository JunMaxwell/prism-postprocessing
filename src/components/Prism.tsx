import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export type GLTFResult = GLTF & {
	nodes: {
		Cone: THREE.Mesh;
	};
	materials: {
		[key: string]: THREE.Material;
	};
};

export function Prism({ onPointerOver, onPointerOut, onPointerMove, ...props }: JSX.IntrinsicElements["group"]) {
	// Hacky assertion to get around the fact that useGLTF doesn't return the correct type
	const { nodes } = useGLTF("/gltf/prism.glb") as unknown as GLTFResult;
	return (
		<group {...props}>
			{/* A low-res, invisible representation of the prism that gets hit by the raycaster */}
			<mesh
				visible={false}
				scale={1.9}
				rotation={[Math.PI / 2, Math.PI, 0]}
				onPointerOver={onPointerOver}
				onPointerOut={onPointerOut}
				onPointerMove={onPointerMove}
			>
				<cylinderGeometry args={[1, 1, 1, 3, 1]} />
			</mesh>
			{/* The visible hi-res prism */}
			<mesh position={[0, 0, 0.6]} renderOrder={10} scale={2} dispose={null} geometry={nodes.Cone.geometry}>
				<meshPhysicalMaterial clearcoat={1} clearcoatRoughness={0} transmission={1} thickness={0.9} roughness={0} toneMapped={false} />
			</mesh>
		</group>
	);
}
