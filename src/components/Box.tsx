import * as THREE from "three";
import { forwardRef, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { lerpC } from "../utils";
import { CustomMesh } from "../types/Prism.interfaces";

const w = 1;
const h = 1;
const r = 0.1;
const depth = 1;
const s = new THREE.Shape();
s.moveTo(-w / 2, -h / 2 + r);
s.lineTo(-w / 2, h / 2 - r);
s.absarc(-w / 2 + r, h / 2 - r, r, 1 * Math.PI, 0.5 * Math.PI, true);
s.lineTo(w / 2 - r, h / 2);
s.absarc(w / 2 - r, h / 2 - r, r, 0.5 * Math.PI, 0 * Math.PI, true);
s.lineTo(w / 2, -h / 2 + r);
s.absarc(w / 2 - r, -h / 2 + r, r, 2 * Math.PI, 1.5 * Math.PI, true);
s.lineTo(-w / 2 + r, -h / 2);
s.absarc(-w / 2 + r, -h / 2 + r, r, 1.5 * Math.PI, 1 * Math.PI, true);

const boxGeometry = new THREE.BoxGeometry();
const roundedBoxGeometry = new THREE.ExtrudeGeometry(s, {
	depth: 1,
	bevelEnabled: false,
});
roundedBoxGeometry.translate(0, 0, -depth / 2);
roundedBoxGeometry.computeVertexNormals();

export const Box = forwardRef<THREE.Group, JSX.IntrinsicElements["group"]>((props, ref) => {
	const [hovered, hover] = useState(false);
	const inner = useRef<CustomMesh | null>(null);
	useFrame(() => {
		if (inner.current) {
			const material = inner.current.material as THREE.MeshStandardMaterial;
			lerpC(material.emissive, hovered ? "white" : "#454545", 0.1);
		}
	});
	return (
		<group scale={0.5} ref={ref} {...props}>
			<customMesh visible={false} onRayOver={() => hover(true)} onRayOut={() => hover(false)} geometry={boxGeometry} />
			<customMesh ref={inner} geometry={roundedBoxGeometry}>
				<meshStandardMaterial color="#333" toneMapped={false} emissiveIntensity={2} />
			</customMesh>
		</group>
	);
});
