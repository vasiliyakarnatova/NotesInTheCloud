import { Navigate } from "react-router-dom";
import { JSX, useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => { // children is the component that we want to protect
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => { // function to check if the user is logged in
      try {
        const response = await fetch("http://localhost:3000/api/current-user", {
          credentials: "include",
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children; // return the protected component because the user is logged in
};

export default ProtectedRoute;
