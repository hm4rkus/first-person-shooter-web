import { useSphere } from "@react-three/cannon";
import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Vector3 } from "three";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { useMouseInput } from "../hooks/useMouseInput";
import { useVariable } from "../hooks/useVariable";
import { Bullet } from "./Bullet";
import { Raycaster } from "three";

/** Player movement constants */
const speed = 300;
const bulletSpeed = 30;
const bulletCoolDown = 300;
const jumpSpeed = 5;
const jumpCoolDown = 400;

export const Player = () => {
  /** Player collider */
  const [sphereRef, api] = useSphere(() => ({
    mass: 100,
    fixedRotation: true,
    position: [0, 1, 0],
    args: 0.2,
    material: {
      friction: 0,
    },
  }));
  /** Bullets */
  const [bullets, setBullets] = useState([]);

  /** Input hooks */
  const pressed = useKeyboardInput(["w", "a", "s", "d", " "]);
  const pressedMouse = useMouseInput();

  /** Converts the input state to ref so they can be used inside useFrame */
  const input = useVariable(pressed);
  const mouseInput = useVariable(pressedMouse);

  /** Player movement constants */
  const { camera, scene } = useThree();

  /** Player state */
  const state = useRef({
    timeToShoot: 0,
    timeTojump: 0,
    vel: [0, 0, 0],
    jumping: false,
  });

  useEffect(() => {
    api.velocity.subscribe((v) => (state.current.vel = v));
  }, [api]);

  /** Player loop */
  useFrame((_, delta) => {
    /** Handles movement */
    const { w, s, a, d } = input.current;
    const space = input.current[" "];

    let velocity = new Vector3(0, 0, 0);
    let cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);

    let forward = new Vector3();
    forward.setFromMatrixColumn(camera.matrix, 0);
    forward.crossVectors(camera.up, forward);

    let right = new Vector3();
    right.setFromMatrixColumn(camera.matrix, 0);

    let [horizontal, vertical] = [0, 0];

    if (w) {
      vertical += 1;
    }
    if (s) {
      vertical -= 1;
    }
    if (d) {
      horizontal += 1;
    }
    if (a) {
      horizontal -= 1;
    }

    if (horizontal !== 0 && vertical !== 0) {
      velocity
        .add(forward.clone().multiplyScalar(speed * vertical))
        .add(right.clone().multiplyScalar(speed * horizontal));
      velocity.clampLength(-speed, speed);
    } else if (horizontal !== 0) {
      velocity.add(right.clone().multiplyScalar(speed * horizontal));
    } else if (vertical !== 0) {
      velocity.add(forward.clone().multiplyScalar(speed * vertical));
    }

    /** Updates player velocity */
    api.velocity.set(
      velocity.x * delta,
      state.current.vel[1],
      velocity.z * delta
    );
    /** Updates camera position */
    camera.position.set(
      sphereRef.current.position.x,
      sphereRef.current.position.y + 1,
      sphereRef.current.position.z
    );

    /** Handles jumping */
    if (state.current.jumping && state.current.vel[1] < 0) {
      /** Ground check */
      const raycaster = new Raycaster(
        sphereRef.current.position,
        new Vector3(0, -1, 0),
        0,
        0.2
      );
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length !== 0) {
        state.current.jumping = false;
      }
    }

    if (space && !state.current.jumping) {
      const now = Date.now();
      if (now > state.current.timeTojump) {
        state.current.timeTojump = now + jumpCoolDown;
        state.current.jumping = true;
        api.velocity.set(state.current.vel[0], jumpSpeed, state.current.vel[2]);
      }
    }

    /** Handles shooting */
    const bulletDirection = cameraDirection.clone().multiplyScalar(bulletSpeed);
    const bulletPosition = camera.position
      .clone()
      .add(cameraDirection.clone().multiplyScalar(2));

    if (mouseInput.current.left) {
      const now = Date.now();
      if (now >= state.current.timeToShoot) {
        state.current.timeToShoot = now + bulletCoolDown;
        setBullets((bullets) => [
          ...bullets,
          {
            id: now,
            position: [bulletPosition.x, bulletPosition.y, bulletPosition.z],
            forward: [bulletDirection.x, bulletDirection.y, bulletDirection.z],
          },
        ]);
      }
    }
  });

  return (
    <>
      {/** Renders bullets */}
      {bullets.map((bullet) => {
        return (
          <Bullet
            key={bullet.id}
            velocity={bullet.forward}
            position={bullet.position}
          />
        );
      })}
    </>
  );
};
