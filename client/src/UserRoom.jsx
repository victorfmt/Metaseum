import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

export default ({ antialias, userObjs, ...rest }) => {
  let box
  const reactCanvas = useRef(null);
  async function onSceneReady(scene) {
       
    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 30, 10), scene);

    // This targets the camera to scene origin
    //camera.setTarget(Vector3.Zero());

    const canvas = scene.getEngine().getRenderingCanvas();

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);



    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'box' shape.
    //box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    // objs.forEach(obj =>{

    //     BABYLON.SceneLoader.Append("", "data:" + obj.file, scene, function (scene) {
    //         // do something with the scene
    //         scene.createDefaultCameraOrLight(true, true, true);

    //         // The default camera looks at the back of the asset.
    //         // Rotate the camera by 180 degrees to the front of the asset.
    //         scene.activeCamera.alpha += Math.PI;
    //         console.log(scene)
    //       });


    // })
    
    //   BABYLON.SceneLoader.Append(process.env.PUBLIC_URL, "box.gltf", scene, function (scene) {
    //             //     // do something with the scene

    //   });


    //   BABYLON.SceneLoader.Append(process.env.PUBLIC_URL, "box.gltf", scene, function (scene) {
    
    //     // ... [your existing code inside this function]
    //     scene.createDefaultCameraOrLight(true, true, true);

    //     // The default camera looks at the back of the asset.
    //     // Rotate the camera by 180 degrees to the front of the asset.
    //     scene.activeCamera.alpha += Math.PI;
    //     console.log(scene)
    //     // Assuming your model has a single root mesh, or you know the name of the mesh:
    //     const boxMesh = scene.getMeshByName("node1"); // Replace 'theNameOfYourMesh' with the actual name of your mesh. If you're unsure about the name, you can check it in a 3D editor like Blender or in Babylon's inspector.
    //     console.log(scene.meshes)
    //     console.log(boxMesh)
        
        
    //     if (boxMesh) {
    //         // Ensure the mesh has an action manager
    //         if (!boxMesh.actionManager) {
    //             boxMesh.actionManager = new BABYLON.ActionManager(scene);
    //             console.log("if statement")
                
    //         }
    
    //         // Add a pointer down action to the mesh
    //         boxMesh.actionManager.registerAction(
    //             new BABYLON.ExecuteCodeAction(
    //                 BABYLON.ActionManager.OnPickTrigger,
    //                 function() {
    //                     /*
    //                     fetch()
    //                     {
    //                         clickedObjId: 
    //                         userId: 
    //                     }
    //                     */ 
    //                     alert('box.gltf was clicked!');
    //                 }
    //             )
    //         );
    //     }
    // });
    

    
    // Move the box upward 1/2 its height
    //box.position.y = 1;

    // Our built-in 'ground' shape.
    // MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    // const assetArrayBuffer = await BABYLON.Tools.LoadFileAsync("assets/hermes.gltf", true);
    // const assetBlob = new Blob([assetArrayBuffer]);
    // const assetUrl = URL.createObjectURL(assetBlob);
    
    // await BABYLON.SceneLoader.AppendAsync(assetUrl, undefined, scene, undefined, ".gltf");
};
  const onRender = (scene) => {
    if (box !== undefined) {
        const deltaTimeInMillis = scene.getEngine().getDeltaTime();

        const rpm = 10;
        box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }
};
  const renderUserObjs = (scene) => {
    console.log(userObjs)

    userObjs.forEach(userObj => {

      BABYLON.SceneLoader.Append("", "data:" + userObj.file, scene, function (scene) {
        scene.createDefaultCameraOrLight(true, true, true);
        scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);
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
                  removeFromUserRoom(userObj.id)
                }
              )
            )
          }
          
        })
      })
    })
  }

  function removeFromUserRoom(userObjId) {

    fetch('/rooms/userroom/removeUserObj' + userObjId, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => console.log(data))

  }
  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;
    let engineOptions
    let adaptToDeviceRatio
    let sceneOptions
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
  }, [userObjs]);

  return <canvas ref={reactCanvas} {...rest} />;
};