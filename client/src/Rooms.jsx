import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";

import "@babylonjs/loaders/glTF";
import model from './assets/Gear2.gltf';
import SceneComponent from "./SceneComponent"; // uses above component in same directory
import Museum from "./Museum";
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
// import "./App.css";

function Rooms({ rooms, objs, userObjs }) {

    // let gltf = `{
    //     "asset": {
    //         "generator": "COLLADA2GLTF",
    //         "version": "2.0"
    //     },
    //     "scene": 0,
    //     "scenes": [
    //         {
    //             "nodes": [
    //                 0
    //             ]
    //         }
    //     ],
    //     "nodes": [
    //         {
    //             "children": [
    //                 1
    //             ],
    //             "matrix": [
    //                 1.0,
    //                 0.0,
    //                 0.0,
    //                 0.0,
    //                 0.0,
    //                 0.0,
    //                 -1.0,
    //                 0.0,
    //                 0.0,
    //                 1.0,
    //                 0.0,
    //                 0.0,
    //                 0.0,
    //                 0.0,
    //                 0.0,
    //                 1.0
    //             ]
    //         },
    //         {
    //             "mesh": 0
    //         }
    //     ],
    //     "meshes": [
    //         {
    //             "primitives": [
    //                 {
    //                     "attributes": {
    //                         "NORMAL": 1,
    //                         "POSITION": 2
    //                     },
    //                     "indices": 0,
    //                     "mode": 4,
    //                     "material": 0
    //                 }
    //             ],
    //             "name": "Mesh"
    //         }
    //     ],
    //     "accessors": [
    //         {
    //             "bufferView": 0,
    //             "byteOffset": 0,
    //             "componentType": 5123,
    //             "count": 36,
    //             "max": [
    //                 23
    //             ],
    //             "min": [
    //                 0
    //             ],
    //             "type": "SCALAR"
    //         },
    //         {
    //             "bufferView": 1,
    //             "byteOffset": 0,
    //             "componentType": 5126,
    //             "count": 24,
    //             "max": [
    //                 1.0,
    //                 1.0,
    //                 1.0
    //             ],
    //             "min": [
    //                 -1.0,
    //                 -1.0,
    //                 -1.0
    //             ],
    //             "type": "VEC3"
    //         },
    //         {
    //             "bufferView": 1,
    //             "byteOffset": 288,
    //             "componentType": 5126,
    //             "count": 24,
    //             "max": [
    //                 0.5,
    //                 0.5,
    //                 0.5
    //             ],
    //             "min": [
    //                 -0.5,
    //                 -0.5,
    //                 -0.5
    //             ],
    //             "type": "VEC3"
    //         }
    //     ],
    //     "materials": [
    //         {
    //             "pbrMetallicRoughness": {
    //                 "baseColorFactor": [
    //                     0.800000011920929,
    //                     0.0,
    //                     0.0,
    //                     1.0
    //                 ],
    //                 "metallicFactor": 0.0
    //             },
    //             "name": "Red"
    //         }
    //     ],
    //     "bufferViews": [
    //         {
    //             "buffer": 0,
    //             "byteOffset": 576,
    //             "byteLength": 72,
    //             "target": 34963
    //         },
    //         {
    //             "buffer": 0,
    //             "byteOffset": 0,
    //             "byteLength": 576,
    //             "byteStride": 12,
    //             "target": 34962
    //         }
    //     ],
    //     "buffers": [
    //         {
    //             "byteLength": 648,
    //             "uri": "Box0.bin"
    //         }
    //     ]
    // }`
    
    console.log(userObjs)
    let box;

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
        MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

        // const assetArrayBuffer = await BABYLON.Tools.LoadFileAsync("assets/hermes.gltf", true);
        // const assetBlob = new Blob([assetArrayBuffer]);
        // const assetUrl = URL.createObjectURL(assetBlob);
        
        // await BABYLON.SceneLoader.AppendAsync(assetUrl, undefined, scene, undefined, ".gltf");
    };
    
    /**
     * Will run on every frame render.  We are spinning the box on y-axis.
     */
    const onRender = (scene) => {
        if (box !== undefined) {
            const deltaTimeInMillis = scene.getEngine().getDeltaTime();

            const rpm = 10;
            box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
        }
    };



    return (
        <div classname="rooms">
            <h1>Museum</h1>
            
            <Museum antialias onSceneReady={onSceneReady} onRender={onRender} objs={objs} id="my-canvas" />
            <div>
                <h2>User Galleries</h2>
            {rooms.map((room) => (
                <h3 key={room.id}>
                    {room.id} {room.name} {room.roomInfo}
                    <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} userObjs={userObjs}  id={`canvas-${room.id}`} />
                </h3>
            ))}
            </div>
        </div>
    );
}

export default Rooms;
