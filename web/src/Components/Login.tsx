import { useState } from "react";
//import { getUser, updateActiveUser } from "../Users";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { getUserByUserName } from "../db/services/userService";

interface UserLogin {
    username: string;
    password: string;
}

const Login = () => { // arrow function
    const [user, setUser] = useState<UserLogin>({ username: "", password: "" });

    const navigate =  useNavigate(); // hook to navigate to another page
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.id; // get the id of the input field
        const value = e.target.value; // get the value of the input field

        setUser({ ...user, [id]: value }); // set the user object with the new value
        setMessage(""); // reset the message when the user types in the input fields
    }

    const [message, setMessage] = useState<string>("");

    const handleFromSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user.username === "" || user.password === "") {
            setMessage("Please fill in all fields");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, password: user.password }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }
    
            localStorage.setItem("activeUser", JSON.stringify(data));
            setUser({ username: "", password: "" });
            navigate("/");
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };
    
    
    // const handleFromSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault(); // prevent the default behavior of the form (refreshing the page)
    //     if (user.username === "" || user.password === "") {
    //         setMessage("Please fill in all fields");
    //         return;
    //     }

    //     const foundUser = getUser(user.username); // get the user from the local storage
        
    //     //if acount does not exist in the database, show error message
    //     if(foundUser == null) { // check if the user exists in the local storage
    //         setMessage("Username or password is incorrect");
    //         return;
    //     }
        
    //     const passwordMatch = await bcrypt.compare(user.password, foundUser.password);

    //     if (!passwordMatch) { // check if the password is correct
    //         setMessage("Username or password is incorrect");
    //         return;
    //     }

    //     setUser({ username: "", password: "" });
    //     updateActiveUser(foundUser); // update the active user in the local storage
    //     navigate("/"); // navigate to the home page
    // }

    return (
        <>
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
            <form onSubmit = {handleFromSubmit}>
                <h3>Log in</h3>

                <label>Username</label>
                <input type="text" placeholder="Username" id="username" value={user.username} onChange={handleInput} />

                <label>Password</label>
                <input type="password" placeholder="Password" id="password" value={user.password} onChange={handleInput}/>

                <button>Log In</button>

                <div className="message">
                    {message ? <h4>{message}</h4> : <h4>Create an account? <a href="/register">Register</a></h4>} {/* show error message if it exists */}
                </div>
            </form>
        </>
    )
}

export default Login;