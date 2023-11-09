import { useEffect, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
import * as GUI from 'babylonjs-gui'
import { AdvancedDynamicTexture, Button } from "@babylonjs/gui/2D";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, objs, ...rest }) => {
  const reactCanvas = useRef(null);
  let box;
  console.log(GUI)
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

  const addShapesToScene = (scene) => {
    // const box = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
    // box.position.x = -1.5;
  
     BABYLON.SceneLoader.Append(process.env.PUBLIC_URL, "naos_2.gltf", scene, function (scene) {
      scene.createDefaultCameraOrLight(true, true, true);
      scene.activeCamera.alpha += Math.PI;
      

     });
    console.log(objs)

    objs.forEach(obj =>{

      BABYLON.SceneLoader.Append("", "data:" + obj.file, scene, function (scene) {
          // do something with the scene
          scene.createDefaultCameraOrLight(true, true, true);

          // The default camera looks at the back of the asset.
          // Rotate the camera by 180 degrees to the front of the asset.
          scene.activeCamera.alpha += Math.PI;
          // scene.mesh.addRotation(0, 0, Math.PI / 3);
          let i = 0
          scene.meshes.forEach(mesh => {
            console.log(mesh.name)
            if (mesh.name !== '__root__' && mesh.name !== 'ground'){
              if(mesh.name === 'Circle'){
                mesh.position.addInPlace(new Vector3(0,1.25, -1))
              }
              
              if (!mesh.actionManager) {
                mesh.actionManager = new BABYLON.ActionManager(scene);
              }
              mesh.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                  BABYLON.ActionManager.OnPickTrigger,
                  () => {
                    if(mesh.name === "Circle"){
                      alert('information about the vase')
                    }
                    


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
      // let manager = new GUI.GUI3DManager(scene)
      // console.log(manager)
      // var panel = new GUI.StackPanel3D();
      // panel.margin = 0.02;
    
      // manager.addControl(panel);
      // panel.position.z = -1.5;
  
      // // Let's add some buttons!
      // var addButton = function() {
      //     var button = new GUI.Button3D("orientation");
      //     panel.addControl(button);
      //     button.onPointerUpObservable.add(function(){
      //         panel.isVertical = !panel.isVertical;
      //     });   
          
      //     var text1 = new GUI.TextBlock();
      //     text1.text = "change orientation";
      //     text1.color = "white";
      //     text1.fontSize = 24;
      //     button.content = text1;  
      // }
  
      // addButton();    
      // addButton();
      // addButton();
        // const advTexture = AdvancedDynamicTexture.CreateFullscreenUI('ui1')
        // let button = new Button.CreateSimpleButton("but","TEST")
        // button.width = "100px"
        // button.height = "100px"
        // advTexture.addControl(button)
      
    } else {
      scene.onReadyObservable.addOnce((scene) => {
        console.log("AS:LKJD:LFKJDFLK")
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