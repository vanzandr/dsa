"use client"

import { useState, useRef } from "react"
import { useAuth } from "../../context/AuthContext"
import AdminSidebar from "./components/AdminSidebar.jsx"
import { Camera } from "lucide-react"

export default function AdminSettings() {
    const { currentUser } = useAuth()
    const [formData, setFormData] = useState({
        fullName: currentUser.fullName,
        email: currentUser.email,
        companyName: "PahiramCar Rental Services",
        address: "123 Main Street, Manila, Philippines",
        phone: "+63 912 345 6789",
        taxId: "123-456-789-000",
    })
    const [avatar, setAvatar] = useState(currentUser.avatar || "/placeholder.svg")
    const fileInputRef = useRef(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Here you would typically update the admin's information
        console.log("Updated admin info:", formData)
    }

    const handleAvatarClick = () => {
        fileInputRef.current.click()
    }

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

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar active="settings" />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-gray-600">Manage your account and business settings</p>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium">Account Information</h2>
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
                                        alt={formData.fullName}
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
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Business Address
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Business Phone
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tax ID
                                    </label>
                                    <input
                                        type="text"
                                        id="taxId"
                                        name="taxId"
                                        value={formData.taxId}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <button type="submit" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium">Security</h2>
                    </div>

                    <div className="p-6">
                        <button type="button" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}