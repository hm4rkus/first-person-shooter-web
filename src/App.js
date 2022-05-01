import React from "react";

// Three
import { Canvas } from "react-three-fiber";

// Components
import { Crosshair } from "./components/Crosshair";
import { UI } from "./components/UI";

//Scene
import { DefaultScene } from "./scene/DefaultScene";

// Styles
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
