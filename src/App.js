import React from "react";
import { Canvas } from "react-three-fiber";
import { Crosshair } from "./components/Crosshair";
import { UI } from "./components/UI";
import { DefaultScene } from "./scene/DefaultScene";
import "./styles.css";

export default function App() {
  return (
    <>
      <UI>
        <Crosshair />
      </UI>
      <Canvas shadowMap>
        <DefaultScene />
      </Canvas>
    </>
  );
}
