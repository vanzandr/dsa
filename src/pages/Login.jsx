"use client"

import { Eye } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {useEffect, useState} from "react"
import { useAuth } from "../context/AuthContext"

export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { login, loginAsDemo, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const result = await login(username, password)
        if (result.success) {
            navigate("/")
        } else {
            setError(result.error)
        }
    }

    const handleDemoLogin = async (role) => {
        const result = await loginAsDemo(role)
        if (result.success) {
            if (role === "admin") {
                navigate("/admin")
            } else {
                navigate("/")
            }
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h2 className="text-2xl font-bold mb-2">Login</h2>
                    <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>

                    {error && (
                        <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input

                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <Eye className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
                            Log In
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or use demo accounts</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin("user")}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Demo User
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin("admin")}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Demo Admin
                            </button>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-medium text-black hover:text-gray-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
