import { useState } from "react";

function RoomForm({ attemptRoomForm }) {
    const [room, setRoom] = useState("");
    const [roomInfo, setRoomInfo] = useState("");

    const handleChangeRoom = (e) => setRoom(e.target.value);
    const handleChangeRoomInfo = (e) => setRoomInfo(e.target.value);

    function handleSubmit(e) {
        e.preventDefault();
        attemptRoomForm({ room, roomInfo });
    }

    return (
        <form onSubmit={handleSubmit} >
            <h2>Get a Room!</h2>

            <input
                type="text"
                onChange={handleChangeRoom}
                value={room}
                placeholder="room name"
            />

            <input 
                className="description_input"
                type="text"
                onChange={handleChangeRoomInfo}
                value={roomInfo}
                placeholder="write something about your room!"
            />

            <input className="button" type="submit" value="Create Room" />
        </form>
    );
}

export default RoomForm;
