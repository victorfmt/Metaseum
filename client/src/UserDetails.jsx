function UserDetails({ currentUser, logout }) {
    return (
        <div>
            <h2>Welcome {currentUser.username}!</h2>
            <button className="button" onClick={logout}>Logout</button>
        </div>
    );
}

export default UserDetails;
