import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../api/auth";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => { // function to check if the user is logged in
      const authenticated = await checkAuth();
      setIsLoggedIn(authenticated);
    };

    verifyAuth();
  }, []);

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
