export const checkAuth = async (): Promise<boolean> => {
    try {
        const response = await fetch("http://localhost:3000/api/current-user", {
            credentials: "include",
        });
        return response.ok;
    } catch (error) {
        console.error("Auth check failed:", error);
        return false;
    }
};
