"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Contact from "./pages/Contact"
import About from "./pages/About"
import BrowseCars from "./components/BrowseCars"
import AdminDashboard from "./pages/admin/AdminDashboard"
import CarManagement from "./pages/admin/CarManagement"
import AdminBookings from "./pages/admin/AdminBookings"
import AdminSettings from "./pages/admin/AdminSettings"
import AdminReservations from "./pages/admin/AdminReservations"
import AdminReports from "./pages/admin/AdminReports"
import AdminEmployees from "./pages/admin/AdminEmployees"
import AdminCustomers from "./pages/admin/AdminCustomers"
import UserProfile from "./pages/user/UserProfile"
import UserDashboard from "./pages/user/UserDashboard"
import ReservedCars from "./pages/user/ReservedCars"
import RentedCars from "./pages/user/RentedCars"
import RentalHistory from "./pages/user/RentalHistory"
import UserSettings from "./pages/user/UserSettings"
import EmployeeDashboard from "./pages/employee/EmployeeDashboard"
import EmployeeBookings from "./pages/employee/EmployeeBookings"
import EmployeeReservations from "./pages/employee/EmployeeReservations"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
import { CarProvider } from "./context/CarContext"
import { ReservationProvider } from "./context/ReservationContext"
import { BookingProvider } from "./context/BookingContext"

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false, requireEmployee = false }) => {
    const { isAuthenticated, isAdmin, isEmployee, loading } = useAuth()

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" />
    }

    if (requireEmployee && !isEmployee && !isAdmin) {
        return <Navigate to="/" />
    }

    return children
}

function AppRoutes() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/browse-cars" element={<BrowseCars />} />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/cars"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <CarManagement />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/reservations"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminReservations />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/bookings"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminBookings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/customers"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminCustomers />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminReports />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminSettings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/employees"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminEmployees />
                        </ProtectedRoute>
                    }
                />

                {/* Employee Routes */}
                <Route
                    path="/employee"
                    element={
                        <ProtectedRoute requireEmployee={true}>
                            <EmployeeDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee/bookings"
                    element={
                        <ProtectedRoute requireEmployee={true}>
                            <EmployeeBookings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee/reservations"
                    element={
                        <ProtectedRoute requireEmployee={true}>
                            <EmployeeReservations />
                        </ProtectedRoute>
                    }
                />

                {/* User Routes */}
                <Route
                    path="/user/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reserved-cars"
                    element={
                        <ProtectedRoute>
                            <ReservedCars />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/rented-cars"
                    element={
                        <ProtectedRoute>
                            <RentedCars />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/rental-history"
                    element={
                        <ProtectedRoute>
                            <RentalHistory />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <UserSettings />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <CarProvider>
                    <ReservationProvider>
                        <BookingProvider>
                            <Router>
                                <AppRoutes />
                            </Router>
                        </BookingProvider>
                    </ReservationProvider>
                </CarProvider>
            </NotificationProvider>
        </AuthProvider>
    )
}

export default App
