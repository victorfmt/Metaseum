import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
// import * as GUI from 'babylonjs-gui'

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, objs, ...rest }) => {
  const reactCanvas = useRef(null);

  // var manager = new GUI.GUI3DManager(Scene);

  // var panel = new GUI.StackPanel3D();
  //   panel.margin = 0.02;
  
  //   manager.addControl(panel);
  //   panel.position.z = -1.5;

  // const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  // const button = GUI.Button.CreateSimpleButton('myBtn', 'Click Me!');
  // button.width = '100px';
  // button.height = '20px';
  // button.collor = 'white';
  // button.background = 'black';
  // advancedTexture.addControl(button);

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
                    alert('you clicked me!')


                    addToUserRoom(obj.id);
                  }
                )
              );
            }
          });
         /*
        if not '__root__' or 'ground' then add ActionManager
         */

          // BABYLON.ActionManager.registerAction(
          //   new BABYLON.ExecuteCodeAction(
          //     BABYLON.ActionManager.OnPickTrigger,
          //     function() {
          //       alert('obj was clicked!');
          //     }
          //   )
          // )
          scene.mesh.addRotation(0, 0, Math.PI / 3);
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
    function addToUserRoom(objectId) {
      // You should have the room ID available in your app, 
      // or you could prompt the user to select a room
      
      
      fetch('/rooms/userroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers as necessary, like authorization tokens
        },
        body: JSON.stringify({
          obj_id: objectId,
        }),
      })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server
        if (data.success) {
          console.log('Object added to the room successfully.');
        } else {
          console.error('Failed to add object to the room:', data.error);
        }
      })
      .catch(error => {
        console.error('Error adding object to the room:', error);
      });
    } 

  
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
    scene.clearColor = new BABYLON.Color3(0.0, 0.0, 0.0);

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
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady, objs]);

  // var addButton = function() {
  //   var button = new GUI.Button3D("orientation");
  //   panel.addControl(button);
  //   button.onPointerUpObservable.add(function(){
  //       panel.isVertical = !panel.isVertical;
  //   });   
    
  //   var text1 = new GUI.TextBlock();
  //   text1.text = "change orientation";
  //   text1.color = "white";
  //   text1.fontSize = 24;
  //   button.content = text1;  
  // }

  // addButton();    
  // addButton();
  // addButton();

  return ( 
      <canvas ref={reactCanvas} {...rest} 
      // {...objs.map((obj)=> {obj.obj_file} )}
      /> 
      
      )
};