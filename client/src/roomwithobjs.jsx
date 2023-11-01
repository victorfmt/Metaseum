import { useEffect, useRef } from "react";
import { Engine, Scene, MeshBuilder } from "@babylonjs/core"; // Add MeshBuilder import here
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, ...rest }) => {
  const reactCanvas = useRef(null);

  const addShapesToScene = (scene) => {
    // Create and position the shapes:
    const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.x = -1.5;

    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
    sphere.position.x = 0;

    const pyramid = BABYLON.MeshBuilder.CreateCylinder("pyramid", {
      height: 1,
      diameterTop: 0,
      diameterBottom: 1,
      tessellation: 4
    }, scene);
    pyramid.position.x = 1.5;

    const rectangularCube = BABYLON.MeshBuilder.CreateBox("rectangularCube", {
      width: 0.5,
      height: 1,
      depth: 2
    }, scene);
    rectangularCube.position.x = 3;
  };

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
      addShapesToScene(scene); // Call the function to add shapes after the scene is ready
    } else {
      scene.onReadyObservable.addOnce((scene) => {
        onSceneReady(scene);
        addShapesToScene(scene); // Call the function to add shapes after the scene is ready
      });
    }

    engine.runRenderLoop(() => {
      if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

  return <canvas ref={reactCanvas} {...rest} />;
};
