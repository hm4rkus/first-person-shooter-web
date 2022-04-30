import React, { useEffect } from "react";
import { useThree } from "react-three-fiber";
import { CubeTextureLoader } from "three";

export const Skybox = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new CubeTextureLoader()
      .setPath("textures/skybox/")
      .load([
        "left.jpg",
        "right.jpg",
        "top.jpg",
        "bottom.jpg",
        "back.jpg",
        "front.jpg"
      ]);
  }, [scene]);

  return <> </>;
};
