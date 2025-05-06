"use client"

import { createContext, useContext, useState, useEffect } from "react"
import apiClient from "../services/apiClient.js";
import {data} from "autoprefixer";

const AuthContext = createContext(null)

// Enhanced demo accounts with better security
const DEMO_ACCOUNTS = {
    admin: {
        id: "admin_001",
        username: "admin_user",
        firstName: "Admin",
        middleName: "",
        lastName: "User",
        email: "admin@pahiramcar.com",
        password: "Admin@123", // More secure password
        role: "admin",
        avatar: "https://i.pravatar.cc/150?img=68",
        permissions: ["manage_users", "view_reports", "configure_settings"],
        birthdate: "1985-05-15",
        maritalStatus: "Married",
        nationality: "American",
    },
    employee: {
        id: "emp_007",
        username: "ella_employee",
        firstName: "Ella",
        middleName: "",
        lastName: "Empleyado",
        email: "employee@pahiramcar.com",
        password: "Employee@123",
        role: "employee",
        avatar: "https://i.pravatar.cc/150?img=47",
        permissions: ["manage_bookings", "view_customers"],
        birthdate: "1990-08-22",
        maritalStatus: "Single",
        nationality: "Filipino",
    },
    user: {
        id: "user_100",
        username: "diwata_user",
        firstName: "Diwata",
        middleName: "",
        lastName: "Pares",
        email: "user@example.com",
        password: "User@123",
        role: "user",
        avatar: "https://i.pravatar.cc/150?img=33",
        mobilePhone: "+639123456789",
        birthdate: "1995-03-10",
        maritalStatus: "Single",
        nationality: "Filipino",
    },
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = localStorage.getItem("pahiramcar_user")
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser)
                    // Basic validation of stored user
                    if (parsedUser?.id && parsedUser?.email && parsedUser?.role) {
                        setCurrentUser(parsedUser)
                    } else {
                        localStorage.removeItem("pahiramcar_user")
                    }
                }
            } catch (error) {
                console.error("Failed to initialize auth", error)
                localStorage.removeItem("pahiramcar_user")
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()
    }, [])

    // Persist user changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("pahiramcar_user", JSON.stringify(currentUser))
        } else {
            localStorage.removeItem("pahiramcar_user")
        }
    }, [currentUser])

    const login = async (username, password) => {
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/auth/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            setCurrentUser(data);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: error.message || "Network or server error" };
        } finally {
            setLoading(false);
        }
    };

    const loginAsDemo = async (role) => {
        try {
            setLoading(true)
            await new Promise((resolve) => setTimeout(resolve, 500))

            const account = DEMO_ACCOUNTS[role]
            if (!account) {
                return { success: false, error: "Invalid demo account type" }
            }

            const { password: _, ...userWithoutPassword } = account
            setCurrentUser(userWithoutPassword)
            return { success: true }
        } catch (error) {
            console.error("Demo login failed:", error)
            return { success: false, error: "Failed to login as demo user" }
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setCurrentUser(null)
        localStorage.removeItem("pahiramcar_user")
    }

    const value = {
        currentUser,
        login,
        loginAsDemo,
        logout,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === "admin",
        isEmployee: currentUser?.role === "employee",
        loading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
