import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useState, useEffect } from "react";
import { InteractionStatus } from "@azure/msal-browser";

export const useMSALAuth = () => {
    const { instance, accounts, inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

    useEffect(() => {
        if (isAuthenticated && accounts.length > 0) {
            const account = accounts[0];
            setUser({
                name: account.name,
                email: account.username,
            });
        } else {
            setUser(null);
        }
    }, [isAuthenticated, accounts]);

    const login = async () => {
        try {
            await instance.loginPopup({
                scopes: ["User.Read"],
                prompt: "select_account"
            });
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const logout = () => {
        instance.logoutPopup().catch(console.error);
    };

    return {
        isAuthenticated,
        user,
        login,
        logout,
        isLoading: inProgress !== InteractionStatus.None,
    };
};
