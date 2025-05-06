"use client"

import { useState } from "react"
import { Eye } from "lucide-react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {useAuth} from "../context/AuthContext.jsx";

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth() // Get the login function from auth context
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "", // Changed from birthdate to birthDate
    maritalStatus: "Single",
    nationality: "",
    mobilePhone: "", // Changed from mobileNumber to mobilePhone
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        birthDate: formData.birthDate, // Already in YYYY-MM-DD format
        mobilePhone: formData.mobilePhone,
        email: formData.email,
        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality,
      }

      console.log("Submitting with payload:", payload)
      const response = await axios.post("http://localhost:8080/api/auth/customer/register", payload)
      console.log("Registration successful:", response.data)

      // Option 1: Auto-login after signup
      try {
        await login(formData.username, formData.password)
        navigate("/")
      } catch (loginError) {
        console.error("Auto-login failed:", loginError)
        // If auto-login fails, redirect to login page
        navigate("/login", { state: { message: "Registration successful! Please log in." } })
      }
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({
        ...errors,
        server: error.response?.data?.message || "Registration failed. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h2 className="text-2xl font-bold mb-2">Create an account</h2>
            <p className="text-gray-600 mb-6">Enter your information to create an account</p>

            {/* Display server errors */}
            {errors.server && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{errors.server}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                        errors.username ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 shadow-sm focus:border-black focus:outline-none`}
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 shadow-sm focus:border-black focus:outline-none`}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                  Middle Name (Optional)
                </label>
                <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 shadow-sm focus:border-black focus:outline-none`}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  Birth Date (YYYY-MM-DD)
                </label>
                <div className="relative mt-1">
                  <input
                      type="text"
                      id="birthDate"
                      name="birthDate"
                      placeholder="YYYY-MM-DD"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className={`block w-full rounded-md border ${
                          errors.birthDate ? "border-red-500" : "border-gray-300"
                      } px-3 py-2 shadow-sm focus:border-black focus:outline-none`}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD (e.g., 2000-03-15)</p>
                {errors.birthDate && <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>}
              </div>

              <div>
                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
                <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Annuled">Annuled</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                        errors.nationality ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 shadow-sm focus:border-black focus:outline-none`}
                />
                {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
              </div>

              <div>
                <label htmlFor="mobilePhone" className="block text-sm font-medium text-gray-700">
                  Mobile Phone
                </label>
                <input
                    type="tel"
                    id="mobilePhone"
                    name="mobilePhone"
                    value={formData.mobilePhone}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                        errors.mobilePhone ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 shadow-sm focus:border-black focus:outline-none`}
                    placeholder="e.g., 09797257218"
                />
                {errors.mobilePhone && <p className="mt-1 text-sm text-red-600">{errors.mobilePhone}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                    } px-3 py-2 shadow-sm focus:border-black focus:outline-none`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full rounded-md border ${
                          errors.password ? "border-red-500" : "border-gray-300"
                      } px-3 py-2 shadow-sm focus:border-black focus:outline-none`}
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
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full rounded-md border ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                      } px-3 py-2 shadow-sm focus:border-black focus:outline-none`}
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

              <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                  disabled={isSubmitting}
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-black hover:text-gray-800">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}

