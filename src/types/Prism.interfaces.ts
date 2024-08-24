import { GroupProps } from "@react-three/fiber";
import { Material, Mesh } from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { ReflectEvent } from "./Reflect.interfaces";

export type GLTFResult = GLTF & {
	nodes: {
		Cone: Mesh;
	};
	materials: {
		[key: string]: Material;
	};
};

export interface PrismProps extends GroupProps {
	onRayOver?: (event: ReflectEvent) => void;
	onRayOut?: (event: ReflectEvent) => void;
	onRayMove?: (event: ReflectEvent) => void;
}
export class CustomMesh extends Mesh {
	onRayOver?: (event: ReflectEvent) => void;
	onRayOut?: (event: ReflectEvent) => void;
	onRayMove?: (event: ReflectEvent) => void;
}