"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { Eye } from "lucide-react"

export default function UserSettings() {
    const { currentUser } = useAuth()
    const [formData, setFormData] = useState({
        username: currentUser.username || "",
        firstName: currentUser.firstName || "",
        middleName: currentUser.middleName || "",
        surname: currentUser.surname || "",
        email: currentUser.email,
        phone: currentUser.phone || "",
        birthdate: currentUser.birthdate || "",
        maritalStatus: currentUser.maritalStatus || "Single",
        nationality: currentUser.nationality || "",
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [editing, setEditing] = useState({
        username: false,
        firstName: false,
        middleName: false,
        surname: false,
        email: false,
        phone: false,
        birthdate: false,
        maritalStatus: false,
        nationality: false,
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const toggleEdit = (field) => {
        setEditing((prev) => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically update the user's information
        console.log("Updated user info:", formData)
        // Reset all editing states
        setEditing({
            username: false,
            firstName: false,
            middleName: false,
            surname: false,
            email: false,
            phone: false,
            birthdate: false,
            maritalStatus: false,
            nationality: false,
        })
    }

    const handlePasswordSubmit = (e) => {
        e.preventDefault()
        // Here you would typically update the user's password
        console.log("Password change requested:", passwordData)
        // Reset password fields
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
    }

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-bold">Settings</h1>
                        <p className="text-gray-600">Manage your account</p>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            disabled={!editing.username}
                                            className={`flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none ${!editing.username ? "bg-gray-50" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            className="ml-4 px-4 py-2 bg-black text-white rounded-md"
                                            onClick={() => toggleEdit("username")}
                                        >
                                            {editing.username ? "Done" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            disabled={!editing.firstName}
                                            className={`flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none ${!editing.firstName ? "bg-gray-50" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            className="ml-4 px-4 py-2 bg-black text-white rounded-md"
                                            onClick={() => toggleEdit("firstName")}
                                        >
                                            {editing.firstName ? "Done" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Middle Name (Optional)
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="middleName"
                                            name="middleName"
                                            value={formData.middleName}
                                            onChange={handleChange}
                                            disabled={!editing.middleName}
                                            className={`flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none ${!editing.middleName ? "bg-gray-50" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            className="ml-4 px-4 py-2 bg-black text-white rounded-md"
                                            onClick={() => toggleEdit("middleName")}
                                        >
                                            {editing.middleName ? "Done" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                                        Surname
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="surname"
                                            name="surname"
                                            value={formData.surname}
                                            onChange={handleChange}
                                            disabled={!editing.surname}
                                            className={`flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none ${!editing.surname ? "bg-gray-50" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            className="ml-4 px-4 py-2 bg-black text-white rounded-md"
                                            onClick={() => toggleEdit("surname")}
                                        >
                                            {editing.surname ? "Done" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                                        Birthdate
                                    </label>
                                    <div className="flex">
                                        {editing.birthdate ? (
                                            <input
                                                type="date"
                                                id="birthdate"
                                                name="birthdate"
                                                value={formData.birthdate}
                                                onChange={handleChange}
                                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                            />
                                        ) : (
                                            <div className="flex-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-50">
                                                {formData.birthdate ? formatDate(formData.birthdate) : "Not set"}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="ml-4 px-4 py-2 bg-black text-white rounded-md"
                                            onClick={() => toggleEdit("birthdate")}
                                        >
                                            {editing.birthdate ? "Done" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Marital Status
                                    </label>
                                    <div className="flex">
                                        {editing.maritalStatus ? (
                                            <select
                                                id="maritalStatus"
                                                name="maritalStatus"
                                                value={formData.maritalStatus}
                                                onChange={handleChange}
                                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                            >
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Divorced">Divorced</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <div className="flex-1 rounded-md border border-gray-300 px-3 py-2 bg-gray-50">
                                                {formData.maritalStatus || "Not set"}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            className="ml-4 px-4 py-2 bg-black text-white rounded-md"
                                            onClick={() => toggleEdit("maritalStatus")}
                                        >
                                            {editing.maritalStatus ? "Done" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nationality
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="nationality"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleChange}
                                            disabled={!editing.nationality}
                                            className={`flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none ${!editing.nationality ? "bg-gray-50" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            className="ml-4 px-4 py-2 bg-black text-white rounded-md"
                                            onClick={() => toggleEdit("nationality")}
                                        >
                                            {editing.nationality ? "Done" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mobile Number
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!editing.phone}
                                            className={`flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none ${!editing.phone ? "bg-gray-50" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            className="ml-4 px-4 py-2 bg-black text-white rounded-md"
                                            onClick={() => toggleEdit("phone")}
                                        >
                                            {editing.phone ? "Done" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!editing.email}
                                            className={`flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none ${!editing.email ? "bg-gray-50" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            className="ml-4 px-4 py-2 bg-black text-white rounded-md"
                                            onClick={() => toggleEdit("email")}
                                        >
                                            {editing.email ? "Done" : "Edit"}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Change Password Section */}
                    <div className="border-t border-gray-200 px-6 py-4">
                        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


