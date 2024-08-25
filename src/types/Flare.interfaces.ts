import { GroupProps } from "@react-three/fiber";
import { Group } from "three";

export interface FlareRef extends Group {
    streak: [number, number, number];
    visible: boolean;
}

export interface FlareProps extends GroupProps {
    streak?: [number, number, number];
    visible?: boolean;
}