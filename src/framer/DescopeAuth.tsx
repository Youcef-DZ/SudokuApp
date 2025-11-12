"use client"
import React, { useState, useEffect } from "react"
import { useDescope, useSession } from "@descope/react-sdk"
import { AuthProvider } from "@descope/react-sdk"
import type { ComponentType } from "react"
import { useCallback } from "react"

const projectId = "P35AlPWcTE6gN9hXrEFjboLuqX8T"
const redirectPage = "https://bulky-system-868836.framer.app"
const googleProviderId = "google"

export const protectedComponent = (Component: React.ComponentType<any>): ComponentType => {
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

export const unprotectedComponent = (Component: React.ComponentType<any>): ComponentType => {
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

export const protectedPage = (Component: React.ComponentType<any>): ComponentType => {
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

export const logoutButton = (Component: React.ComponentType<any>): ComponentType => {
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
const LogoutButtonContent = ({ Component, ...props }: { Component: React.ComponentType<any>, [key: string]: any }) => {
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
}: { Component: React.ComponentType<any>, hidden: boolean, redirect: boolean, redirectURL: string, [key: string]: any }) => {
    const { refresh } = useDescope()
    useEffect(() => {
        refresh()
    }, [refresh])

    const { isAuthenticated, isSessionLoading } = useSession()
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

export const oneTapPage = (Component: React.ComponentType<any>): ComponentType => {
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

const OneTapContent = ({ Component, ...props }: { Component: React.ComponentType<any>, [key: string]: any }) => {
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
