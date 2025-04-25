import { useEffect, useState } from "react";
import { deleteActiveUser, getActiveUser, User } from "../Users";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [activeUser, setActiveUser] = useState<User>();
    const navigate =  useNavigate(); // hook to navigate to another page
    
    useEffect(() => {
        const user = getActiveUser(); // get the active user from the local storage, we know it exists because of the ProtectedRoute in App.tsx
        setActiveUser(user); // set the active user in the state
    }, []); // run this effect only once when the component mounts

    const handleLogout = () => {
        deleteActiveUser(); // remove the active user from the local storage
        navigate("/login"); // navigate to the login page
    }

    return (
        <>
        <div style = {{color: "white", textAlign: "center", marginTop: "20px"}}>
            <h1>Welcome {activeUser?.username} {activeUser?.email} {activeUser?.password} </h1>    
        </div>
        <div style = {{textAlign: "center"}}>
            <button onClick={handleLogout} style = {{marginTop: "20px"}}>Log Out</button>
        </div>
        </>
    );
}

export default Home;