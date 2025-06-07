import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRegister } from "../componetsInterfaces/componentsInterfaces"
import "../styles/auth.css"

const Register = () => {
    useEffect(() => {
            document.title = "Register";
        }, []);

    const [user, setUser] = useState<UserRegister>({ username: "", email: "", password: "" });
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.id;
        const value = e.target.value;
        setUser({ ...user, [id]: value });
        setMessage("");
    }


    const handleFromSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (user.username === "" || user.email === "" || user.password === "") {
            const errorMessage = {
                errorCode: `Error ${StatusCodes.BAD_REQUEST}`,
                errorMessage: "Please fill in all fields.",
            };
            console.error(errorMessage.errorCode + ": " + errorMessage.errorMessage); // log the error message to the console
            setMessage(errorMessage.errorMessage);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            const errorMessage = {
                errorCode: `Error ${StatusCodes.BAD_REQUEST}`,
                errorMessage: "Please enter a valid email address",
            };
            console.error(errorMessage.errorCode + ": " + errorMessage.errorMessage); // log the error message to the console
            setMessage(errorMessage.errorMessage);
            return;
        }

        if (user.password.length < 6) {
            const errorMessage = {
                errorCode: `Error ${StatusCodes.BAD_REQUEST}`,
                errorMessage: "Password must be at least 6 characters long",
            };
            console.error(errorMessage.errorCode + ": " + errorMessage.errorMessage); // log the error message to the console
            setMessage(errorMessage.errorMessage);
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/api/NotesInTheCloud/register", {
                method: "POST",
                headers: { // Set the content type to JSON
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                }), // Convert the user object to a JSON string
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = {
                    errorCode: data.message ? `Error ${response.status}` : `Error ${StatusCodes.UNAUTHORIZED}`,
                    errorMessage: data.message ? data.message : "Registration failed.",
                };
                console.error(errorMessage.errorCode + ": " + errorMessage.errorMessage);
                setMessage(errorMessage.errorMessage);
                return;
            }

            setUser({ username: "", email: "", password: "" });
            setMessage("");
            navigate("/login");

        } catch (error) {
            const errorMessage = {
                errorCode: `Error ${StatusCodes.INTERNAL_SERVER_ERROR}`,
                errorMessage: "An error occurred. Please try again.",
            };
            console.error(errorMessage.errorCode + ": " + errorMessage.errorMessage); // log the error message to the console
            setMessage(errorMessage.errorMessage);
        }
    };

    return (
        <>
            <form onSubmit={handleFromSubmit}>
                <h3>Registration</h3>

                <label>Username</label>
                <input type="text" placeholder="Username" id="username" value={user.username} onChange={handleInput} />

                <label>Email</label>
                <input type="text" placeholder="Email" id="email" value={user.email} onChange={handleInput} />

                <label>Password</label>
                <input type="password" placeholder="Password" id="password" value={user.password} onChange={handleInput} />

                <button>Register</button>
                <div className="message">
                    {<h4>Already have an account? <a href="/login">Log in</a></h4>} {/* show error message if it exists */}
                </div>
                <div className="errorMessage">
                    {<h4>{message}</h4>}
                </div>
            </form>
        </>
    )
}

export default Register;