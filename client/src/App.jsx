import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import UserDetails from "./UserDetails";
import Museum from "./Museum";
import UserRoom from "./UserRoom";
import Rooms from "./Rooms";
import RoomForm from "./RoomForm";
// import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";

function App() {

//     let box;

// const onSceneReady = (scene) => {
//   // This creates and positions a free camera (non-mesh)
//   const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

//   // This targets the camera to scene origin
//   camera.setTarget(Vector3.Zero());

//   const canvas = scene.getEngine().getRenderingCanvas();

//   // This attaches the camera to the canvas
//   camera.attachControl(canvas, true);

//   // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
//   const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

//   // Default intensity is 1. Let's dim the light a small amount
//   light.intensity = 0.7;

//   // Our built-in 'box' shape.
//   box = MeshBuilder.CreateBox("box", { size: 1 }, scene);

//   // Move the box upward 1/2 its height
//   box.position.y = 1;

//   // Our built-in 'ground' shape.
//   MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
// };

// /**
//  * Will run on every frame render.  We are spinning the box on y-axis.
//  */
// const onRender = (scene) => {
//   if (box !== undefined) {
//     const deltaTimeInMillis = scene.getEngine().getDeltaTime();

//     const rpm = 10;
//     box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
//   }
// };


    const [currentUser, setCurrentUser] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [objs, setObjs] = useState([]);
    const [userObjs, setUserObjs] = useState([]);

    const [showMuseum, setShowMuseum] = useState(true);

    function handleClickSetShowMuseum() {
        setShowMuseum(!showMuseum)
    }

    

    // const [objMenu, showObjMenu] = useState([]);

    // useEffect (() => {

    // })

    useEffect(() =>{
        fetch("/rooms/userroom").then((res) => {
            if (res.ok) {
                res.json().then((userObjs) => setUserObjs(userObjs));
            }else{
                console.log(res)
            }
        });
    }, []);

    useEffect(() => {
        fetch("/rooms/museum").then((res) => {
            if (res.ok) {
                res.json().then((objs) => setObjs(objs));
            }else{
                console.log(res)
            }
        });
    }, []);

    useEffect(() => {
        fetch("/check_session").then((res) => {
            if (res.ok) {
                res.json().then((user) => setCurrentUser(user));
            }
        });
    }, []);

    useEffect(() => {
        fetch("/rooms").then((res) => {
            if (res.ok) {
                res.json().then((data) => {console.log(data);setRooms(data)});
            } else {
                //res.text().then((data) => console.log(data));
                setRooms([]);
            }
        });
    }, [currentUser]);

    function attemptSignup(userInfo) {
        console.log(userInfo)
        fetch("/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accepts: "application/json",
            },
            body: JSON.stringify(userInfo),
        })
            .then((res) => res.json())
            .then((data) => setCurrentUser(data));
    }

    function attemptLogin(userInfo) {
        console.log(userInfo)
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accepts: "application/json",
            },
            body: JSON.stringify(userInfo),
        })
            .then((res) => res.json())
            .then((data) => setCurrentUser(data));
    }

    function logout() {
        fetch("/logout", { method: "DELETE" }).then((res) => {
            if (res.ok) {
                setCurrentUser(null);
            }
        });
    }

    function attemptRoomForm(roomInfo) {
        console.log(roomInfo)
        fetch("/rooms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accepts: "application/json",
            },
            body: JSON.stringify(roomInfo),
        })
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }

    return (
        <div className="App">
            <div className="Rooms">
            <h3 className="main_title">METASEUM
            {/* <img src='blackpyramidtransparent.gif' alt='pyramid' /> */}
            </h3>
            {showMuseum ? (
                <Museum antialias objs={objs} id="my-canvas" />
                ) : <UserRoom antialias  userObjs={userObjs}  id="my-canvas" />}  
            
            
            </div>
            <div className="Nav">
                <ul className="Nav_list">
                
                {/* <div className="logo"> */}
                    <img className='logo' src='blackpyramidtransparent.gif' alt='pyramid' />
                {/* </div> */}

                {currentUser ? (
                <UserDetails currentUser={currentUser} logout={logout} />
                ) : null}  

            {currentUser ? (
                <button className="myRoom_button" onClick={handleClickSetShowMuseum}>
                    {showMuseum ? 
                    "My Room" : "Museum"}
                    
                </button>

            ) : null}

            {!currentUser ? (
                <Signup attemptSignup={attemptSignup} />
                ) : null} 
            {!currentUser ? (
                <Login attemptLogin={attemptLogin} />
                ) : null} 
            

            

            
            <RoomForm currentUser={currentUser} attemptRoomForm={attemptRoomForm} />
                </ul>
            </div>
            
            
        </div>
    );
}

export default App;
