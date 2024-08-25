import { forwardRef, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { RainbowMaterial } from "../shaders/RainbowShader";
import { CustomShaderMaterial, RainbowProps } from "../types/Rainbow.interfaces";
import { CustomMesh } from "../types/Prism.interfaces";

extend({ RainbowMaterial });

export const Rainbow = forwardRef<CustomMesh, RainbowProps>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	({ startRadius = 0, endRadius = 0.5, emissiveIntensity = 2.5, fade = 0.25, ...props }, fRef) => {
		const material = useRef<CustomShaderMaterial>(null);
		const { width, height } = useThree((state) => state.viewport);
		// calculate the maximum length the rainbow has to have to reach all screen corners
		const length = Math.hypot(width, height) + 1.5; // add 1.5 to due motion of the rainbow
		useFrame((_, delta) => {
			if (!material.current) return;
			material.current.time += delta * material.current.speed;
		});
		return (
			<customMesh ref={fRef} scale={[length, length, 1]} {...props}>
				<planeGeometry />
				<rainbowMaterial
					ref={material}
					key={RainbowMaterial.key}
					fade={fade}
					startRadius={startRadius}
					endRadius={endRadius}
					ratio={1}
					toneMapped={false}
				/>
			</customMesh>
		);
	}
);
