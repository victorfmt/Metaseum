import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, userObjs, ...rest }) => {
  const reactCanvas = useRef(null);

  const renderUserObjs = (scene) => {
    console.log(userObjs)

    userObjs.forEach(userObj => {

      BABYLON.SceneLoader.Append("", "data:" + userObj.file, scene, function (scene) {
        scene.createDefaultCameraOrLight(true, true, true);
        scene.activeCamera.alpha += Math.PI;
        scene.meshes.forEach(mesh => {
          console.log(mesh.name)
          if (mesh.name !== '__root__' && mesh.name !== 'ground'){
            if (!mesh.actionManager) {
              mesh.actionManager = new BABYLON.ActionManager(scene);
            }
            mesh.actionManager.registerAction(
              new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                () => {
                  alert ('userObj was clicked!')
                  // removeFromUserRoom(userObj.id)
                }
              )
            )
          }
          
        })
      })
    })
  }
  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
      renderUserObjs(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => {
        onSceneReady(scene)
        renderUserObjs(scene)});
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
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, userObjs]);

  return <canvas ref={reactCanvas} {...rest} />;
};