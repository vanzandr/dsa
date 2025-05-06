"use client"

import { useState, useEffect } from "react"
import { Search, Plus } from "lucide-react"
import AdminSidebar from "./components/AdminSidebar.jsx"
import AddCarModal from "./components/AddCarModal"
import EditCarModal from "./components/EditCarModal"
import ImageCarousel from "../../components/ImageCarousel"
import { useCars } from "../../context/CarContext"
import axios from "axios";


export default function CarManagement() {
    const { cars, addCar, updateCar, deleteCar, loading } = useCars()

    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({
        carType: "",
        transmission: "",
        fuelType: "",
    })
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedCar, setSelectedCar] = useState(null)
    const [filteredCars, setFilteredCars] = useState([])

    // Initialize filtered cars when cars are loaded
    useEffect(() => {
        if (!loading) {
            setFilteredCars(cars)
        }
    }, [cars, loading])

    // Apply filters and search
    useEffect(() => {
        if (loading) return

        let result = [...cars]

        // Apply filters
        if (filters.carType) {
            result = result.filter((car) => car.type === filters.carType)
        }

        if (filters.transmission) {
            result = result.filter((car) => car.transmission === filters.transmission)
        }

        if (filters.fuelType) {
            result = result.filter((car) => car.fuelType === filters.fuelType)
        }

        // Apply search
        if (searchTerm) {
            result = result.filter(
                (car) =>
                    car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    car.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    car.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        setFilteredCars(result)
    }, [searchTerm, filters, cars, loading])

    const handleAddCar = () => {
        setShowAddModal(true)
    }

    const handleEditCar = (car) => {
        setSelectedCar(car)
        setShowEditModal(true)
    }

    const handleCloseAddModal = () => {
        setShowAddModal(false)
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false)
        setSelectedCar(null)
    }

    const handleAddCarSubmit = async (newCar) => {
        try {
            await addCar(newCar);
            setShowAddModal(false);
        } catch (error) {
            console.error("Failed to add car", error);
        }
    }

    const handleEditCarSubmit = (updatedCar) => {
        updateCar(updatedCar)
        setShowEditModal(false)
        setSelectedCar(null)
    }

    const handleDeleteCar = (carId) => {
        if (window.confirm("Are you sure you want to delete this car?")) {
            deleteCar(carId)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar active="cars" />
                <div className="flex-1 p-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar active="cars" />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Car Management</h1>
                    <p className="text-gray-600">View and manage your car inventory</p>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search cars..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex gap-4">
                        <select
                            className="border rounded-md px-4 py-2"
                            onChange={(e) => setFilters({ ...filters, carType: e.target.value })}
                            value={filters.carType}
                        >
                            <option value="">All Car Types</option>
                            <option value="SUV">SUV</option>
                            <option value="Sedan">Sedan</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Sports">Sports</option>
                        </select>

                        <select
                            className="border rounded-md px-4 py-2"
                            onChange={(e) => setFilters({ ...filters, transmission: e.target.value })}
                            value={filters.transmission}
                        >
                            <option value="">All Transmission Types</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>

                        <select
                            className="border rounded-md px-4 py-2"
                            onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                            value={filters.fuelType}
                        >
                            <option value="">All Fuel Types</option>
                            <option value="Gasoline">Gasoline</option>
                            <option value="Diesel">Diesel</option>
                        </select>
                    </div>

                    <button className="bg-black text-white px-4 py-2 rounded-md flex items-center" onClick={handleAddCar}>
                        <Plus className="h-5 w-5 mr-2" />
                        Add New Car
                    </button>
                </div>

                {/* Car Grid */}
                {filteredCars.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <h3 className="text-lg font-semibold mb-2">No cars found</h3>
                        <p className="text-gray-600">Try adjusting your filters or add a new car.</p>
                        <button onClick={handleAddCar} className="mt-4 px-4 py-2 bg-black text-white rounded-md">
                            Add New Car
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredCars.map((car) => (
                            <div key={car.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                <div className="relative h-48">
                                    <ImageCarousel
                                        images={car.images && car.images.length > 0 ? car.images : [car.imageUrl]}
                                        className="h-full"
                                    />
                                    <span
                                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${car.available ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                                    >
                                        {car.available ? "Available" : "Unavailable"}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">{car.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{car.type}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <span className="text-xl font-bold">₱ {car.price}</span>
                                            <span className="text-gray-500 text-sm ml-1">per day</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                                        <div className="flex items-center gap-1">
                                            <span>{car.seats} Seats</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>{car.transmission}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>{car.fuelType}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            className="px-4 py-2 border border-black rounded-lg text-sm hover:bg-gray-50"
                                            onClick={() => handleEditCar(car)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                            onClick={() => handleDeleteCar(car.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Car Modal */}
            {showAddModal && <AddCarModal onClose={handleCloseAddModal} onAddCar={handleAddCarSubmit} />}

            {/* Edit Car Modal */}
            {showEditModal && selectedCar && (
                <EditCarModal car={selectedCar} onClose={handleCloseEditModal} onSave={handleEditCarSubmit} />
            )}
        </div>
    )
}