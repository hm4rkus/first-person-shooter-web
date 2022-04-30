import React, { useCallback, useEffect, useState } from "react";
import { useBox } from "@react-three/cannon";
import niceColors from "nice-color-palettes";
const paletteIndex = 8;

export const Cube = (props) => {
  const [color, setColor] = useState("white");
  const [cubeRef, api] = useBox(() => ({
    mass: 1,
    args: [0.5, 0.5, 0.5],
    material: {
      friction: 1,
      restitution: 0
    },
    ...props
  }));

  useEffect(
    () =>
      setColor(
        niceColors[paletteIndex][
          Math.floor(Math.random() * niceColors[paletteIndex].length)
        ]
      ),
    []
  );

  return (
    <mesh ref={cubeRef} castShadow layers={props.layers}>
      <boxBufferGeometry args={[0.5, 0.5, 0.5]} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
};
