import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserLogin } from "../componetsInterfaces/componentsInterfaces";
import "../styles/auth.css"

const Login = () => {
    const [user, setUser] = useState<UserLogin>({ username: "", password: "" });
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("");

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.id; // get the id of the input field (username or password)
        const value = e.target.value; // get the value of the input field (username or password)

        setUser({ ...user, [id]: value }); // set the user object with the new value
        setMessage("");
    }

    const handleFromSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent the default form submission

        if (user.username === "" || user.password === "") {
            const errorMessage = {
                errorCode: `Error ${StatusCodes.BAD_REQUEST}`,
                errorMessage: "Please fill in all fields.",
            };
            console.error(errorMessage.errorCode + ": " + errorMessage.errorMessage);
            setMessage(errorMessage.errorMessage);
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/api/NotesInTheCloud/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username, password: user.password }),
                credentials: "include",
            });
            const data = await response.json();

            if (!response.ok) {
                const errorMessage = {
                    errorCode: data.message ? `Error ${response.status}` : `Error ${StatusCodes.UNAUTHORIZED}`,
                    errorMessage: data.message ? data.message : "Login failed",
                };
                console.error(errorMessage.errorCode + ": " + errorMessage.errorMessage);
                setMessage(errorMessage.errorMessage);
                return;
            }

            setUser({ username: "", password: "" });
            setMessage("");
            navigate("/home");

        } catch (error) {
            const errorMessage = {
                errorCode: `Error ${StatusCodes.INTERNAL_SERVER_ERROR}`,
                errorMessage: "An error occurred. Please try again.",
            };
            console.error(errorMessage.errorCode + ": " + errorMessage.errorMessage);
            setMessage(errorMessage.errorMessage);
        }
    };

    return (
        <>
            <form onSubmit={handleFromSubmit}>
                <h3>Log in</h3>

                <label>Username</label>
                <input type="text" placeholder="Username" id="username" value={user.username} onChange={handleInput} />

                <label>Password</label>
                <input type="password" placeholder="Password" id="password" value={user.password} onChange={handleInput} />

                <button>Log In</button>

                <div className="message">
                    {<h4>Create an account? <a href="/register">Register</a></h4>}
                </div>
                <div className="errorMessage">
                    {<h4>{message}</h4>}
                </div>
            </form>
        </>
    )
}

export default Login;