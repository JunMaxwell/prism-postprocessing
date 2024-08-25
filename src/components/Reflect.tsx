import * as THREE from "three";
import { forwardRef, useRef, useMemo, useLayoutEffect, useImperativeHandle } from "react";
import { invalidate } from "@react-three/fiber";
import { ThreeEvent } from "@react-three/fiber/dist/declarations/src/core/events";
import { ExtendObject3D, ReflectApi, ReflectEvent, ReflectHit, ReflectIntersect, ReflectProps } from "../types/Reflect.interfaces";

function isRayMesh(object: ExtendObject3D) {
	return object.isMesh && (object.onRayOver || object.onRayOut || object.onRayMove);
}

function createEvent(
	event: ThreeEvent<PointerEvent>,
	api: ReflectApi,
	hit: ReflectHit,
	intersect: ReflectIntersect,
	intersects: ReflectIntersect[]
): ReflectEvent {
	return {
		...event,
		api,
		object: intersect.object,
		position: intersect.point,
		direction: intersect.direction,
		reflect: intersect.reflect,
		normal: intersect.face?.normal,
		intersect,
		intersects,
		stopPropagation: () => (hit.stopped = true),
	};
}

export const Reflect = forwardRef<ReflectApi, ReflectProps>(
	({ children, start = [0, 0, 0], end = [0, 0, 0], bounce = 10, far = 100, ...props }, fRef) => {
		bounce = (bounce || 1) + 1;
		const vStart = new THREE.Vector3();
		const vEnd = new THREE.Vector3();
		const vDir = new THREE.Vector3();
		const vPos = new THREE.Vector3();

		let intersect: ReflectIntersect;
		let intersects: ReflectIntersect[] = [];

		const scene = useRef<THREE.Group>(null);
		const api: ReflectApi = useMemo(
			() => ({
				number: 0,
				objects: [],
				hits: new Map(),
				start: new THREE.Vector3(),
				end: new THREE.Vector3(),
				raycaster: new THREE.Raycaster(),
				positions: new Float32Array(Array.from({ length: (bounce + 10) * 3 }, () => 0)),
				setRay: (_start = [0, 0, 0], _end = [0, 0, 0]) => {
					api.start.set(..._start);
					api.end.set(..._end);
				},
				update: () => {
					api.number = 0;
					intersects = [];

					vStart.copy(api.start);
					vEnd.copy(api.end);
					vDir.subVectors(vEnd, vStart).normalize();
					vStart.toArray(api.positions, api.number++ * 3);

					// Run a full cycle until bounces run out or the ray points into nothing
					// This is necessary for over/out hit-testing
					while (api.raycaster.set && api.raycaster.intersectObjects) {
						api.raycaster.set(vStart, vDir);
						intersect = api.raycaster.intersectObjects(api.objects, false)[0];
						if (api.number < bounce && intersect && intersect.face) {
							//intersects.push({ point: intersect.point.clone(), direction: vDir.clone(), object: intersect.object });
							intersects.push(intersect);
							intersect.direction = vDir.clone();
							// Something was hit and we still haven't met bounce limit
							intersect.point.toArray(api.positions, api.number++ * 3);
							vDir.reflect(intersect.object.localToWorld(intersect.face.normal).sub(intersect.object.getWorldPosition(vPos)).normalize());
							intersect.reflect = vDir.clone();
							// console.log(intersect.face.normal);
							vStart.copy(intersect.point);
						} else {
							// Nothing was hit and the ray extends into "infinity" (dir * far)
							vEnd.addVectors(vStart, vDir.multiplyScalar(far)).toArray(api.positions, api.number++ * 3);
							break;
						}
					}
					// Reset and count up once again
					api.number = 1;
					// Check onRayOut
					api.hits.forEach((hit) => {
						// If a previous hit is no longer part of the intersects ...
						if (!intersects.find((intersect) => intersect.object.uuid === hit.key)) {
							// Remove the hit entry
							api.hits.delete(hit.key);
							// And call onRayOut
							if (hit.intersect.object.onRayOut) {
								invalidate();
								hit.intersect.object.onRayOut = (event) => {
									createEvent(event, api, hit, hit.intersect, intersects);
								};
							}
						}
					});

					// Check onRayOver
					for (intersect of intersects) {
						api.number++;
						// If the intersect hasn't been hit before
						if (!api.hits.has(intersect.object.uuid)) {
							// Create new entry
							const hit = {
								key: intersect.object.uuid,
								intersect,
								stopped: false,
							};
							api.hits.set(intersect.object.uuid, hit);
							// Call ray over
							// Handle types for the intersect object
							if (intersect.object.onRayOver) {
								invalidate();
								intersect.object.onRayOver = (event) => {
									createEvent(event, api, hit, intersect, intersects);
								};
							}
						}

						const hit = api.hits.get(intersect.object.uuid);
						if (!hit) continue;

						// Check onRayMove
						if (intersect.object.onRayMove) {
							invalidate();
							intersect.object.onRayMove = (event) => {
								createEvent(event, api, hit, intersect, intersects);
							};
						}

						// If the hit was stopped (by the user calling stopPropagation) then interrupt the loop
						if (hit.stopped) break;
						// If we're at the last hit and the ray hasn't been stopped it goes into the infinite
						if (intersect === intersects[intersects.length - 1]) api.number++;
					}
					return Math.max(2, api.number);
				},
			}),
			[bounce, far]
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
		useLayoutEffect(() => void api.setRay(start, end), [...start, ...end]);
		useImperativeHandle(fRef, () => api, [api]);

		useLayoutEffect(() => {
			// Collect all objects that fulfill the criteria
			api.objects = [];
			scene.current?.traverse((object) => {
				if (isRayMesh(object)) api.objects.push(object);
			});
			// Calculate world matrices at least once before it starts to raycast
			scene.current?.updateWorldMatrix(true, true);
		});

		return (
			<group ref={scene} {...props}>
				{children}
			</group>
		);
	}
);
