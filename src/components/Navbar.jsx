"use client"

import { Car, LogOut, ChevronDown, LayoutDashboard, User } from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import DropdownMenu from "./DropdownMenu"

export default function Navbar() {
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if current path is an admin path
  const isAdminPage = location.pathname.startsWith("/admin")

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Car className="h-6 w-6 text-black" />
                <span className="ml-2 text-xl font-bold">PahiramCar</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              {/* Only show these links if not on admin pages */}
              {!isAdminPage && (
                  <>
                    <Link to="/browse-cars" className="text-gray-700 hover:text-black">
                      Browse Cars
                    </Link>
                    <Link to="/about" className="text-gray-700 hover:text-black">
                      About
                    </Link>
                    <Link to="/contact" className="text-gray-700 hover:text-black">
                      Contact
                    </Link>
                  </>
              )}

              {isAuthenticated && (
                  <>
                    {isAdmin ? (
                        <Link to="/admin" className="text-gray-700 hover:text-black">
                          Admin Dashboard
                        </Link>
                    ) : (
                        <Link to="/user/dashboard" className="text-gray-700 hover:text-black flex items-center">
                          <LayoutDashboard className="h-4 w-4 mr-1" />
                          Dashboard
                        </Link>
                    )}
                  </>
              )}

              {isAuthenticated ? (
                  <DropdownMenu
                      trigger={
                        <div className="flex items-center space-x-2 text-gray-700 hover:text-black">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                                src={currentUser.avatar || "/placeholder.svg"}
                                alt={currentUser.fullName}
                                className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{isAdmin ? "Admin User" : currentUser.fullName}</span>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      }
                  >
                    {isAdmin ? (
                        <>
                          <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Settings
                          </Link>
                        </>
                    ) : (
                        <>
                          <Link
                              to="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Link>
                        </>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </DropdownMenu>
              ) : (
                  <>
                    <Link to="/login" className="text-gray-700 hover:text-black px-3 py-2 rounded-md">
                      Log In
                    </Link>
                    <Link to="/signup" className="bg-black text-white px-3 py-2 rounded-md hover:bg-gray-800">
                      Sign Up
                    </Link>
                  </>
              )}
            </div>
          </div>
        </div>
      </nav>
  )
}

