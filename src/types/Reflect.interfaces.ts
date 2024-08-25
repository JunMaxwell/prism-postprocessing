import { GroupProps, ThreeElements } from "@react-three/fiber";
import { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { Intersection, Object3D, Vector3 } from "three";

export type ExtendObject3D = Object3D & { isMesh?: boolean, onRayOver?: (event: ThreeEvent<PointerEvent>) => void; onRayOut?: (event: ThreeEvent<PointerEvent>) => void; onRayMove?: (event: ThreeEvent<PointerEvent>) => void; };
export interface ReflectIntersect extends Intersection {
    direction?: Vector3;
    reflect?: Vector3;
    object: ExtendObject3D
}

export interface ReflectProps extends GroupProps {
    start?: [number, number, number];
    end?: [number, number, number];
    bounce?: number;
    far?: number;
    children?: React.ReactNode;
}

export interface ReflectHit {
    stopped: boolean;
    intersect: ReflectIntersect;
    key: string;
}

export interface ReflectApi {
    number: number;
    objects: Array<ExtendObject3D>;
    hits: Map<string, ReflectHit>;
    start: Vector3;
    end: Vector3;
    raycaster: ThreeElements['raycaster'];
    positions: Float32Array;
    setRay: (start: [number, number, number], end: [number, number, number]) => void;
    update: () => number;
}

export interface ReflectEvent extends ThreeEvent<PointerEvent> {
    api: ReflectApi;
    position: Vector3;
    direction?: Vector3;
    reflect?: Vector3;
    intersect: ReflectIntersect;
    intersects: ReflectIntersect[];
    normal?: Vector3;
}
