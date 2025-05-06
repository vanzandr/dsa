"use client"

import { useState } from "react"
import { X, Plus, ImageIcon } from "lucide-react"
import apiClient from "../../../services/apiClient.js";


export default function AddCarModal({ onClose, onAddCar }) {
    const [formData, setFormData] = useState({
        name: "",
        year: 0,
        plateNumber: "",
        carType: "",
        mileage: 3000,
        transmissionType: "",
        fuelType: "",
        engineNumber: "1234",
        chassisNumber: "",
        seats: 0,
        pricePerDay: 0,
        description: "",
        status: "Available",
    })

    const [carImages, setCarImages] = useState([])
    const [previewImages, setPreviewImages] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        // Create preview URLs for the images
        const newPreviewImages = files.map((file) => URL.createObjectURL(file))

        // Add new images to existing ones
        setCarImages((prev) => [...prev, ...files])
        setPreviewImages((prev) => [...prev, ...newPreviewImages])
    }

    const removeImage = (index) => {
        // Remove the image at the specified index
        setCarImages((prev) => prev.filter((_, i) => i !== index))
        setPreviewImages((prev) => {
            // Revoke the URL to prevent memory leaks
            URL.revokeObjectURL(prev[index])
            return prev.filter((_, i) => i !== index)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const requestData = new FormData()
        requestData.append("carJson", JSON.stringify(formData))

        for (let i = 0; i < carImages.length; i++) {
            requestData.append("images", carImages[i])
        }

        try {
            // Send the request without manually setting the Content-Type header
            const bookingResponse = await apiClient.post(
                "http://localhost:8080/api/admin/cars",
                requestData
            );

            console.log("Car added successfully:", bookingResponse.data);
        } catch (error) {
            console.error("Error adding car:", error.response ? error.response.data : error.message);
        }



        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Car Images */}
                    <div className="bg-gray-50 p-8 flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Car Images</h3>

                        {/* Image Preview Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {previewImages.length > 0 ? (
                                previewImages.map((url, index) => (
                                    <div key={index} className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={url || "/placeholder.svg"}
                                            alt={`Car Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-90"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center p-4">
                                        <ImageIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-500">No images selected</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => document.getElementById("carImagesUpload").click()}
                            className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-md"
                        >
                            <Plus size={18} className="mr-2" />
                            Add Images
                        </button>
                        <input
                            id="carImagesUpload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />

                        <p className="text-sm text-gray-500 mt-2">
                            You can upload multiple images. The first image will be used as the main display image.
                        </p>
                    </div>

                    {/* Car Form */}
                    <div className="p-8">
                        <h2 className="text-xl font-bold mb-6">Add New Car</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder="Car ni Diwata"
                                    />
                                </div>

                                {/* Added Chassis Number Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
                                    <input
                                        type="text"
                                        name="chassisNumber"
                                        value={formData.chassisNumber}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder="Enter chassis number"
                                    />
                                </div>

                                {/* Engine Number Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
                                    <input
                                        type="text"
                                        name="engineNumber"
                                        value={formData.engineNumber}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder="Enter engine number"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
                                        <select
                                            name="carType"
                                            value={formData.carType}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        >
                                            <option value="">Select Car Type</option>
                                            <option value="Sedan">Sedan</option>
                                            <option value="SUV">SUV</option>
                                            <option value="Hatchback">Hatchback</option>
                                            <option value="Luxury">Luxury</option>
                                            <option value="Sports">Sports</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                        <select
                                            name="fuelType"
                                            value={formData.fuelType}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        >
                                            <option value="">Select Fuel Type</option>
                                            <option value="Gasoline">Gasoline</option>
                                            <option value="Diesel">Diesel</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Transmission Type</label>
                                    <select
                                        name="transmissionType"
                                        value={formData.transmissionType}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                    >
                                        <option value="">Select Transmission Type</option>
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Seats</label>
                                        <input
                                            type="number"
                                            name="seats"
                                            value={formData.seats}
                                            onChange={handleChange}
                                            min="1"
                                            max="10"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per day</label>
                                        <div className="flex items-center">
                                            <span className="mr-2">₱</span>
                                            <input
                                                type="number"
                                                name="pricePerDay"
                                                value={formData.pricePerDay}
                                                onChange={handleChange}
                                                min="0"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                        <input
                                            type="number"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            min="1990"
                                            max={new Date().getFullYear()}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                                        <input
                                            type="text"
                                            name="plateNumber"
                                            value={formData.plateNumber}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                            placeholder="DIWATA009"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        placeholder="Enter short description here"
                                    ></textarea>
                                </div>

                                <div className="flex justify-end space-x-4 pt-4">
                                    <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">
                                        Add
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
