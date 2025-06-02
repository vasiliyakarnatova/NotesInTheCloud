import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserHome } from "../componetsInterfaces/componentsInterfaces";

const Home = () => {
  const [user, setUser] = useState<UserHome | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/current-user", { // fetch current user
          credentials: "include", // include cookies in the request
        });

        if (response.ok) {
          const data = await response.json(); // parse the response as JSON
          setUser(data); // set the user state with the data received
        } else {
          setError(`Error ${response.status}: Failed to fetch user`);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setError(`Error ${StatusCodes.INTERNAL_SERVER_ERROR}: Could not fetch user`);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST", // POST request to logout
        credentials: "include", // include cookies in the request
      });

      setUser(null); // clear user state
      navigate("/login");

    } catch (error) {
      console.error("Failed to logout:", error);
      setError(`Error ${StatusCodes.INTERNAL_SERVER_ERROR}: Could not log out`);
    }
  };

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "20px" }}>
      <h1>Welcome {user?.username}!</h1>
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>Log Out</button>
    </div>
  );
};

export default Home;
