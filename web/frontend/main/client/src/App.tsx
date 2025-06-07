import { Switch, Route, StringRouteParams  } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SharedNote from "@/pages/SharedNote";
import { useEffect } from "react";
import Cookie from "@/pages/Cookie";

function CookieHandler({ username }: { username: string }) {
  useEffect(() => {
    const setCookie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/cookie/${username}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          window.location.href = "/";
        } else {
          console.error("Failed to set cookie");
        }
      } catch (error) {
        console.error("Error setting cookie:", error);
      }
    };

    setCookie();
  }, [username]);

  return <div>Setting your session, please wait...</div>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/:username">
        {(params?: StringRouteParams<"/:username">) => {
          if (!params || !params.username) {
            return null;
          }
        
          return <Cookie username={params.username} />;
        }}
      </Route>
      <Route path="/shared/:shareId" component={SharedNote} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
