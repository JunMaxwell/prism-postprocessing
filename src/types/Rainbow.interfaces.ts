import { MeshProps } from "@react-three/fiber";
import { ShaderMaterial } from "three";

export interface RainbowProps extends MeshProps {
	startRadius?: number;
	endRadius?: number;
	emissiveIntensity?: number;
	fade?: number;
}

export interface CustomShaderMaterial extends ShaderMaterial {
	time: number;
	speed: number;
	startRadius: number;
	endRadius: number;
	emissiveIntensity: number;
	fade: number;
	ratio: number;
}