import { RainbowMaterial } from "../shaders/RainbowShader";

// Extend the Object3DNode type to include custom properties
declare module "@react-three/fiber" {
	interface ThreeElements {
		rainbowMaterial: Object3DNode<CustomShaderMaterial, typeof RainbowMaterial>;
	}
}