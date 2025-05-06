"use client"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { Car, Calendar, Camera, Clock } from "lucide-react"
import { Link } from "react-router-dom"

export default function UserProfile() {
    const auth = useAuth()
    const currentUser = auth?.currentUser

    console.log(" currentUser at render:", currentUser)


    const [loadingData, setLoadingData] = useState(true)
    const [avatar, setAvatar] = useState("/placeholder.svg")
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobilePhone: "",
        birthdate: "",
        maritalStatus: "Single",
        nationality: "",
    })

    const fileInputRef = useRef(null)

    useEffect(() => {
        if (!currentUser?.id) {
            console.warn(" No currentUser.id yet — skipping fetch")
            return
        }

        console.log("📡 Fetching customer data for ID:", currentUser.id)

        const fetchCustomerDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/customer/${currentUser.id}`, {
                    credentials: "include",
                })

                console.log("📥 Fetch response:", response)

                if (!response.ok) throw new Error("Failed to fetch customer details")

                const data = await response.json()
                console.log("✅ Customer data:", data)

                setFormData({
                    username: data.username || "",
                    firstName: data.firstName || "",
                    middleName: data.middleName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    mobilePhone: data.mobilePhone || "",
                    birthdate: data.birthdate || "",
                    maritalStatus: data.maritalStatus || "Single",
                    nationality: data.nationality || "",
                })
                setAvatar(data.avatar || "/placeholder.svg")
            } catch (error) {
                console.error(" Error fetching customer details:", error)
            } finally {
                console.log("✅ Finished fetch. Setting loadingData = false")
                setLoadingData(false)
            }
        }

        fetchCustomerDetails()
    }, [currentUser?.id])

    const handleAvatarClick = () => fileInputRef.current?.click()

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatar(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`http://localhost:8080/api/customer/${currentUser.id}/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Update failed:", errorData.message || "Unknown error")
                return
            }

            const updatedUser = await response.json()
            console.log("🎉 User updated successfully:", updatedUser)
            alert("Profile updated!")
        } catch (error) {
            console.error("🚨 Error updating profile:", error)
        }
    }

    if (!currentUser) return <div className="p-4 text-center">Loading user...</div>
    if (loadingData) return <div className="p-4 text-center">Loading profile...</div>

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold">Profile</h1>
                        <p className="text-gray-600">Manage your personal information</p>
                    </div>

                    <div className="p-6">
                        <div className="flex justify-center mb-8">
                            <div className="relative">
                                <div
                                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer"
                                    onClick={handleAvatarClick}
                                >
                                    <img
                                        src={avatar || "/placeholder.svg"}
                                        alt={formData.firstName}
                                        onError={(e) => (e.target.src = "/placeholder.svg")}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div
                                    className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer"
                                    onClick={handleAvatarClick}
                                >
                                    <Camera className="h-4 w-4" />
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {[
                                    ["username", "Username"],
                                    ["firstName", "First Name"],
                                    ["middleName", "Middle Name (Optional)"],
                                    ["lastName", "Last Name"],
                                    ["birthdate", "Birthdate", "date"],
                                    ["nationality", "Nationality"],
                                    ["mobilePhone", "Mobile Phone"],
                                    ["email", "Email", "email"],
                                ].map(([field, label, type = "text"]) => (
                                    <div key={field}>
                                        <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                                            {label}
                                        </label>
                                        <input
                                            type={type}
                                            id={field}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                        />
                                    </div>
                                ))}

                                <div>
                                    <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Marital Status
                                    </label>
                                    <select
                                        id="maritalStatus"
                                        name="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                    >
                                        {["Single", "Married", "Divorced", "Widowed", "Separated", "Other"].map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium mb-4">Change Password</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    // Add password change logic here
                                    alert("Password changed successfully!")
                                }}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <button type="submit" className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-medium mb-4">Quick Links</h2>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/reserved-cars"
                                    className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                                >
                                    <Car className="h-4 w-4 mr-2" />
                                    Reserved Cars
                                </Link>
                                <Link
                                    to="/rented-cars"
                                    className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Rented Cars
                                </Link>
                                <Link
                                    to="/rental-history"
                                    className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Rental History
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
