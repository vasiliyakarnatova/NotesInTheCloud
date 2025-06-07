import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface CookieProps {
  username: string;
}

export default function Cookie({ username }: CookieProps) {
  useEffect(() => {
    const setCookie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/cookie/${username}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          console.log("Cookie set successfully, redirecting...");
          window.location.href = "/";
        } else {
          console.error("Failed to set cookie");
        }
      } catch (error) {
        console.error("Error setting cookie:", error);
      }
    };

    if (username) {
      setCookie();
    }
  }, [username]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center text-gray-700 text-lg">
        Setting your session, please wait...
      </div>
    </div>
  );
}