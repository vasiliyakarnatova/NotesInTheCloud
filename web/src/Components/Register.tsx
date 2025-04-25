import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserRegister {
    username: string;
    email: string;
    password: string;
}

const Register = () => {
    const [user, setUser] = useState<UserRegister>({ username: "", email: "", password: "" });
    const navigate =  useNavigate();
    
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.id; // get the id of the input field
        const value = e.target.value; // get the value of the input field
        setUser({ ...user, [id]: value }); // set the user object with the new value
        setMessage(""); // reset the message when the user types in the input fields
    }

    const [message, setMessage] = useState<string>("");

    const handleFromSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user.username === "" || user.email === "" || user.password === "") {
            setMessage("Please fill in all fields");
            return;
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            setMessage("Please enter a valid email address");
            return;
        }
    
        if (user.password.length < 6) {
            setMessage("Password must be at least 6 characters long");
            return;
        }
    
        console.log(user.username, user.email, user.password);

        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: user.username,  // <- Точно както очаква Express
                    email: user.email,
                    password: user.password,
                }),
            });
            console.log("RESPONSE:", response);
            const data = await response.json();
    
            if (!response.ok) {
                setMessage(data.message || "Registration failed");
                return;
            }
    
            setUser({ username: "", email: "", password: "" });
            navigate("/login");
        } catch (error) {
            console.error("ERROR in fetch:", error);
            setMessage("An error occurred. Please try again.");
        }
    };
    
    // const handleFromSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (user.username === "" || user.email === "" || user.password === "") {
    //         setMessage("Please fill in all fields");
    //         return;
    //     }

    //     //if username already exists in the database, show error message
    //     if (isUsernameTaken(user.username)) {
    //         setMessage("Username already taken, please choose another one");
    //         return;
    //     }

    //     // if email is not valid, show error message
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailRegex.test(user.email)) {
    //         setMessage("Please enter a valid email address");
    //         return;
    //     }

    //     //if email already exists in the database, show error message
    //     if (isUserRegistered(user.email)) {
    //         setMessage("Already registered, please login instead");
    //         return;
    //     }

    //     //if password is less than 6 characters, show error message
    //     if (user.password.length < 6) {
    //         setMessage("Password must be at least 6 characters long");
    //         return;
    //     }

    //     //hash the password
    //     const hashedPassword = await bcrypt.hash(user.password, 10);
    //     const newUser = { ...user, password: hashedPassword };

    //     addNewUser(newUser); // add the new user to the local storage
    //     setUser({ username: "", email: "", password: "" }); // reset the form
    //     navigate("/login"); // navigate to the login page
    // }

    return (
        <>
            <div className="background">
                <div className="shape"></div>
                <div className="shape"></div>
            </div>
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
                    {message ? <h4>{message}</h4> : <h4>Already have an account? <a href="/login">Log in</a></h4>} {/* show error message if it exists */}
                </div>
            </form>
        </>
    )
}

export default Register;