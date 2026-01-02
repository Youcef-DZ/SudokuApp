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

    const login = async (domainHint?: string) => {
        try {
            const loginRequest: any = {
                scopes: ["User.Read"],
                domainHint: domainHint, // Top-level property for MSAL v3+
            };

            // Only force account selection if no specific domain is requested
            // providing prompt: 'select_account' often overrides domain_hint auto-acceleration
            if (!domainHint) {
                loginRequest.prompt = "select_account";
            }
            // Remove extraQueryParameters for domain_hint to avoid duplication/conflict
            if (domainHint) {
                // Ensure we don't send it twice if we were using it in extraQueryParameters before
            }
            await instance.loginPopup(loginRequest);
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
