"use client"
import { Link, useLocation } from "react-router-dom"
import { Home, Calendar, Car, Users, LogOut, User, Clock, FileText, UserPlus } from "lucide-react"
import {useAuth} from "../../../context/AuthContext.jsx";


export default function AdminSidebar({ active }) {
    const location = useLocation()
    const { logout, currentUser } = useAuth()

    const menuItems = [
        { name: "Dashboard", icon: Home, path: "/admin", id: "dashboard" },
        { name: "Bookings", icon: Calendar, path: "/admin/bookings", id: "bookings" },
        { name: "Reservations", icon: Clock, path: "/admin/reservations", id: "reservations" },
        { name: "Cars", icon: Car, path: "/admin/cars", id: "cars" },
        { name: "Customers", icon: Users, path: "/admin/customers", id: "customers" },
        { name: "Employees", icon: UserPlus, path: "/admin/employees", id: "employees" },
        { name: "Reports", icon: FileText, path: "/admin/reports", id: "reports" },
    ]

    return (
        <div className="w-64 bg-white h-screen shadow-sm flex flex-col">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold">Car Rental</h1>
                <p className="text-sm text-gray-600">Admin Portal</p>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`flex items-center px-4 py-3 text-sm rounded-md ${
                                active === item.id ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t">
                <div className="flex items-center mb-4 px-4 py-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Admin</p>
                        <p className="text-xs text-gray-500">{currentUser?.email || "Admin"}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 w-full"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    )
}
