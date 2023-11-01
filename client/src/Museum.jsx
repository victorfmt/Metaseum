import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, objs, ...rest }) => {
  const reactCanvas = useRef(null);

  const addShapesToScene = (scene) => {
    // const box = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
    // box.position.x = -1.5;


    console.log(objs)

    objs.forEach(obj =>{

      BABYLON.SceneLoader.Append("", "data:" + obj.file, scene, function (scene) {
          // do something with the scene
          scene.createDefaultCameraOrLight(true, true, true);

          // The default camera looks at the back of the asset.
          // Rotate the camera by 180 degrees to the front of the asset.
          scene.activeCamera.alpha += Math.PI;
          console.log(scene)
        });


  })
    // const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, scene);
    // sphere.position.z = 1.5;

    // const pyramid = BABYLON.MeshBuilder.CreateCylinder("pyramid", {
    //     height: 1, 
    //     diameterTop: 0,
    //     diameterBottom: 1,
    //     tessellation: 4,
    // }, scene);
    // pyramid.position.x = 1.5;

    // const rectangularCube = BABYLON.MeshBuilder.CreateBox("rectangularCube", { 
    //     width: 0.5,
    //     height: 1,
    //     depth: 2
    //  }, scene);
    //  rectangularCube.position.x = 3;
    };
    /*
    usestate objs[{file:string}]

    useEffect(() => {
    fetch('/museum')
        setState(data)

    */
   


  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
      addShapesToScene(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => {
        onSceneReady(scene);
        addShapesToScene(scene);
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

  return ( 
      <canvas ref={reactCanvas} {...rest} 
      // {...objs.map((obj)=> {obj.obj_file} )}
      /> 
      
      )
};