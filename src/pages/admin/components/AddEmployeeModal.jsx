"use client"

import { useState } from "react"
import { X, Eye } from "lucide-react"

export default function AddEmployeeModal({ onClose, onAddEmployee }) {
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
        maritalStatus: "Single",
        nationality: "",
        mobilePhone: "",
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    // Function to validate date in YYYY-MM-DD format
    const isValidDate = (dateString) => {
        // Check if the format is YYYY-MM-DD
        const regex = /^\d{4}-\d{2}-\d{2}$/
        if (!regex.test(dateString)) return false

        // Extract year, month, day
        const [year, month, day] = dateString.split("-").map(Number)

        // Check if month is valid (1-12)
        if (month < 1 || month > 12) return false

        // Check if day is valid for the month
        const daysInMonth = new Date(year, month, 0).getDate()
        if (day < 1 || day > daysInMonth) return false

        return true
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.username.trim()) newErrors.username = "Username is required"
        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.birthDate) newErrors.birthDate = "Birth date is required"
        else if (!isValidDate(formData.birthDate)) newErrors.birthDate = "Please enter a valid date in YYYY-MM-DD format"
        if (!formData.mobilePhone) newErrors.mobilePhone = "Mobile phone is required"
        if (!formData.email) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"
        if (!formData.nationality) newErrors.nationality = "Nationality is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            const { confirmPassword, ...employeeData } = formData
            onAddEmployee(employeeData)
            setLoading(false)
            onClose()
        }, 1000)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">Add New Employee</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full rounded-md border ${
                                    errors.username ? "border-red-500" : "border-gray-300"
                                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full rounded-md border ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`w-full rounded-md border ${
                                    errors.firstName ? "border-red-500" : "border-gray-300"
                                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                            />
                            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                        </div>

                        <div>
                            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                                Middle Name (Optional)
                            </label>
                            <input
                                type="text"
                                id="middleName"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`w-full rounded-md border ${
                                    errors.lastName ? "border-red-500" : "border-gray-300"
                                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                            />
                            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Birth Date (YYYY-MM-DD)
                            </label>
                            <input
                                type="text"
                                id="birthDate"
                                name="birthDate"
                                placeholder="YYYY-MM-DD"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className={`w-full rounded-md border ${
                                    errors.birthDate ? "border-red-500" : "border-gray-300"
                                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                            />
                            <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD (e.g., 2000-03-15)</p>
                            {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
                        </div>

                        <div>
                            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                                Nationality
                            </label>
                            <input
                                type="text"
                                id="nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className={`w-full rounded-md border ${
                                    errors.nationality ? "border-red-500" : "border-gray-300"
                                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                            />
                            {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="mobilePhone" className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile Phone
                            </label>
                            <input
                                type="tel"
                                id="mobilePhone"
                                name="mobilePhone"
                                value={formData.mobilePhone}
                                onChange={handleChange}
                                className={`w-full rounded-md border ${
                                    errors.mobilePhone ? "border-red-500" : "border-gray-300"
                                } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                                placeholder="e.g., 09797257218"
                            />
                            {errors.mobilePhone && <p className="mt-1 text-sm text-red-600">{errors.mobilePhone}</p>}
                        </div>

                        <div>
                            <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                Marital Status
                            </label>
                            <select
                                id="maritalStatus"
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                            >
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Annuled">Annuled</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Separated">Separated</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full rounded-md border ${
                                        errors.password ? "border-red-500" : "border-gray-300"
                                    } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <Eye className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full rounded-md border ${
                                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                    } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black`}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Eye className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    <div className="pt-4 flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Processing...
                </span>
                            ) : (
                                "Add Employee"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
