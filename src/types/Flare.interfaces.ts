import { GroupProps } from "@react-three/fiber";

export interface FlareProps extends GroupProps {
    streak?: [number, number, number];
    visible?: boolean;
}