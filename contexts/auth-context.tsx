"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string) => Promise<boolean>;
    signup: (name: string, email: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string): Promise<boolean> => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simple mock check: find user in stored "users" array
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const foundUser = users.find((u: User) => u.email === email);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem("currentUser", JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const signup = async (name: string, email: string): Promise<boolean> => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Check if user exists
        if (users.some((u: User) => u.email === email)) {
            return false;
        }

        const newUser = { id: Date.now().toString(), name, email };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // Auto login after signup
        setUser(newUser);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("currentUser");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
