"use client"
import React, { useState, useEffect, useRef } from "react"
import { useDescope, useSession, useUser } from "@descope/react-sdk"
import { Descope } from "@descope/react-sdk"
import { getSessionToken } from "@descope/react-sdk"
import ReactDOM from "react-dom/client"
import { AuthProvider } from "@descope/react-sdk"
import type { ComponentType } from "react"
import { useCallback } from "react"

const projectId = "P35AlPWcTE6gN9hXrEFjboLuqX8T"
const redirectPage = "https://bulky-system-868836.framer.app"
const googleProviderId = "google"

export const protectedComponent = (Component): ComponentType => {
    return (props) => {
        return (
            <ClientSideWrapper>
                <React.StrictMode>
                    <AuthProvider projectId={projectId}>
                        <AuthWrapperContent
                            Component={Component}
                            hidden={true}
                            redirect={false}
                            redirectURL=""
                            {...props}
                        />
                    </AuthProvider>
                </React.StrictMode>
            </ClientSideWrapper>
        )
    }
}

export const unprotectedComponent = (Component): ComponentType => {
    return (props) => {
        return (
            <ClientSideWrapper>
                <React.StrictMode>
                    <AuthProvider projectId={projectId}>
                        <AuthWrapperContent
                            Component={Component}
                            hidden={false}
                            redirect={false}
                            redirectURL=""
                            {...props}
                        />
                    </AuthProvider>
                </React.StrictMode>
            </ClientSideWrapper>
        )
    }
}

export const protectedPage = (Component): ComponentType => {
    return (props) => {
        return (
            <ClientSideWrapper>
                <React.StrictMode>
                    <AuthProvider projectId={projectId}>
                        <AuthWrapperContent
                            Component={Component}
                            hidden={true}
                            redirect={true}
                            redirectURL={redirectPage}
                            {...props}
                        />
                    </AuthProvider>
                </React.StrictMode>
            </ClientSideWrapper>
        )
    }
}

export const logoutButton = (Component): ComponentType => {
    return (props) => {
        return (
            <ClientSideWrapper>
                <React.StrictMode>
                    <AuthProvider projectId={projectId}>
                        <LogoutButtonContent Component={Component} {...props} />
                    </AuthProvider>
                </React.StrictMode>
            </ClientSideWrapper>
        )
    }
}

// Component to handle the session and conditional rendering
const LogoutButtonContent = ({ Component, ...props }) => {
    const { isAuthenticated, isSessionLoading } = useSession() // Check session status
    const user = useUser() // Optional: Fetch user details
    const { logoutAll } = useDescope()
    const handleLogout = useCallback(() => {
        logoutAll()
        window.location.reload()
    }, [logoutAll])

    return <Component {...props} onClick={handleLogout} />
}

// Component to handle the session and conditional rendering
const AuthWrapperContent = ({
    Component,
    hidden,
    redirect,
    redirectURL,
    ...props
}) => {
    const { refresh } = useDescope()
    useEffect(() => {
        refresh()
    }, [refresh])

    const { isAuthenticated, isSessionLoading, sessionToken } = useSession()
    const user = useUser() // Optional: Fetch user details
    if (isSessionLoading) {
        return <div>Loading...</div>
    }
    if (hidden == true) {
        if (isAuthenticated) {
            return <Component {...props} />
        } else if (redirect == true) {
            window.location.href = redirectPage
        }
    } else {
        if (!isAuthenticated) {
            return <Component {...props} />
        } else if (redirect == true) {
            window.location.href = redirectPage
        }
    }
}

const ClientSideWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return isClient ? <>{children}</> : null
}

export const oneTapPage = (Component): ComponentType => {
    return (props) => {
        return (
            <ClientSideWrapper>
                <React.StrictMode>
                    <AuthProvider projectId={projectId}>
                        <OneTapContent Component={Component} {...props} />
                    </AuthProvider>
                </React.StrictMode>
            </ClientSideWrapper>
        )
    }
}

const OneTapContent = ({ Component, ...props }) => {
    const sdk = useDescope()
    const { isAuthenticated, isSessionLoading } = useSession()

    useEffect(() => {
        const run = async () => {
            if (isSessionLoading) return
            if (!isAuthenticated) {
                try {
                    await sdk.fedcm.oneTap(googleProviderId)
                    await sdk.refresh()
                    window.location.reload()
                } catch (e) {
                    console.error("OneTap error:", e)
                }
            }
        }

        run()
    }, [isAuthenticated, isSessionLoading, sdk.fedcm, sdk.refresh])

    return <Component {...props} />
}
