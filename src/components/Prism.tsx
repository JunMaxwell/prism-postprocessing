import { useGLTF } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { CustomMesh, GLTFResult, PrismProps } from "../types/Prism.interfaces";

extend({ CustomMesh });

export function Prism({ onRayOver, onRayOut, onRayMove, ...props }: PrismProps) {
	// Hacky assertion to get around the fact that useGLTF doesn't return the correct type
	const { nodes } = useGLTF(`${import.meta.env.VITE_PUBLIC_URL}/glb/prism.glb`) as GLTFResult;
	return (
		<group {...props}>
			{/* A low-res, invisible representation of the prism that gets hit by the raycaster */}
			<customMesh
				visible={false}
				scale={1.9}
				rotation={[Math.PI / 2, Math.PI, 0]}
				onRayOver={onRayOver}
				onRayOut={onRayOut}
				onRayMove={onRayMove}
			>
				<cylinderGeometry args={[1, 1, 1, 3, 1]} />
			</customMesh>
			{/* The visible hi-res prism */}
			<customMesh position={[0, 0, 0.6]} renderOrder={10} scale={2} dispose={null} geometry={nodes.Cone.geometry}>
				<meshPhysicalMaterial clearcoat={1} clearcoatRoughness={0} transmission={1} thickness={0.9} roughness={0} toneMapped={false} />
			</customMesh>
		</group>
	);
}
