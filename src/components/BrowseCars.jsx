"use client"

import { useState, useEffect } from "react"
import { Car, Users, Fuel, Sliders, Filter } from "lucide-react"
import CarDetails from "./CarDetails"
import ReservationModal from "./ReservationModal"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import ImageCarousel from "./ImageCarousel"
import { useCars } from "../context/CarContext"
import apiClient from "../services/apiClient.js";

const BrowseCars = () => {
    const { isAuthenticated } = useAuth()
    const { cars, loading } = useCars()
    const navigate = useNavigate()

    const [filters, setFilters] = useState({
        carType: "",
        transmission: "",
        fuelType: "",
        seats: "",
        priceRange: { min: "", max: "" },
    })

    const [selectedCar, setSelectedCar] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showReservationModal, setShowReservationModal] = useState(false)
    const [filteredCars, setFilteredCars] = useState([])
    const [reservations, setReservations] = useState([])

    // Initialize filtered cars when cars are loaded
    useEffect(() => {
        if (!loading) {
            setFilteredCars(cars)
        }

        async function fetchCars() {
            const carsFetched = await apiClient.get("/api/admin/cars")
            console.log(carsFetched)
        }

       fetchCars()

    }, [cars, loading])

    // Apply filters whenever filters state changes
    useEffect(() => {
        if (loading) return

        let result = [...cars]

        // Filter by car type
        if (filters.carType) {
            result = result.filter((car) => car.type === filters.carType)
        }

        // Filter by transmission
        if (filters.transmission) {
            result = result.filter((car) => car.transmission === filters.transmission)
        }

        // Filter by fuel type
        if (filters.fuelType) {
            result = result.filter((car) => car.fuelType === filters.fuelType)
        }

        // Filter by seats
        if (filters.seats) {
            result = result.filter((car) => car.seats >= Number.parseInt(filters.seats))
        }

        // Filter by price range
        if (filters.priceRange.min) {
            result = result.filter((car) => car.price >= Number.parseInt(filters.priceRange.min))
        }
        if (filters.priceRange.max) {
            result = result.filter((car) => car.price <= Number.parseInt(filters.priceRange.max))
        }

        // Filter by availability
        result = result.filter((car) => car.available)

        setFilteredCars(result)
    }, [filters, cars, loading])

    const handleOpenDetails = (car) => {
        setSelectedCar(car)
        setShowDetailsModal(true)
    }

    const handleCloseDetails = () => {
        setShowDetailsModal(false)
        setSelectedCar(null)
    }

    const handleReserve = (car) => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            navigate("/login")
            return
        }

        setSelectedCar(car)
        setShowReservationModal(true)
    }

    const handleCloseReservation = () => {
        setShowReservationModal(false)
    }

    const handleReservationComplete = (reservation) => {
        // Add the new reservation to the list
        setReservations((prev) => [...prev, reservation])

        // Show success message or redirect
        alert(`Car reserved successfully! Your reservation ID is ${reservation.id}`)
        navigate("/reserved-cars")
    }

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterType]: value,
        }))
    }

    const clearFilters = () => {
        setFilters({
            carType: "",
            transmission: "",
            fuelType: "",
            seats: "",
            priceRange: { min: "", max: "" },
        })
    }

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="container mx-auto px-6 py-8">
                {/* Page Title */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Available Cars</h1>
                        <p className="text-gray-600">Browse our selection of cars for rent</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Car size={24} className="text-gray-400" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full md:w-64 bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold">Filters</h2>
                            <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-black flex items-center">
                                <Filter size={14} className="mr-1" />
                                Clear all
                            </button>
                        </div>

                        <h2 className="font-bold mb-3">Car Type</h2>
                        <div className="space-y-2 mb-6">
                            {["SUV", "Sedan", "Hatchback", "Luxury", "Sports"].map((type) => (
                                <label key={type} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={filters.carType === type}
                                        onChange={(e) => handleFilterChange("carType", e.target.checked ? type : "")}
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>

                        <h2 className="font-bold mb-3">Transmission</h2>
                        <div className="space-y-2 mb-6">
                            {["Automatic", "Manual"].map((trans) => (
                                <label key={trans} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={filters.transmission === trans}
                                        onChange={(e) => handleFilterChange("transmission", e.target.checked ? trans : "")}
                                    />
                                    <span>{trans}</span>
                                </label>
                            ))}
                        </div>

                        <h2 className="font-bold mb-3">Fuel Type</h2>
                        <div className="space-y-2 mb-6">
                            {["Gasoline", "Diesel"].map((fuel) => (
                                <label key={fuel} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={filters.fuelType === fuel}
                                        onChange={(e) => handleFilterChange("fuelType", e.target.checked ? fuel : "")}
                                    />
                                    <span>{fuel}</span>
                                </label>
                            ))}
                        </div>

                        <h2 className="font-bold mb-3">Seats</h2>
                        <div className="flex gap-4 mb-6">
                            <select
                                className="w-full px-2 py-1 border rounded bg-white"
                                value={filters.seats}
                                onChange={(e) => handleFilterChange("seats", e.target.value)}
                            >
                                <option value="">Any</option>
                                <option value="2">2+ seats</option>
                                <option value="4">4+ seats</option>
                                <option value="5">5+ seats</option>
                                <option value="7">7+ seats</option>
                            </select>
                        </div>

                        <h2 className="font-bold mb-3">Price Range</h2>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <span className="mr-1">₱</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="w-full px-2 py-1 border rounded bg-white"
                                    value={filters.priceRange.min}
                                    onChange={(e) =>
                                        setFilters({ ...filters, priceRange: { ...filters.priceRange, min: e.target.value } })
                                    }
                                />
                            </div>
                            <div className="flex items-center">
                                <span className="mr-1">₱</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="w-full px-2 py-1 border rounded bg-white"
                                    value={filters.priceRange.max}
                                    onChange={(e) =>
                                        setFilters({ ...filters, priceRange: { ...filters.priceRange, max: e.target.value } })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Car Grid */}
                    <div className="flex-1">
                        {filteredCars.length === 0 ? (
                            <div className="bg-white rounded-lg p-8 text-center">
                                <Car size={48} className="mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-semibold mb-2">No cars found</h3>
                                <p className="text-gray-600">Try adjusting your filters to find available cars.</p>
                                <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-black text-white rounded-md">
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCars.map((car) => (
                                    <div key={car.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                        <div className="relative h-48">
                                            <ImageCarousel
                                                images={car.images && car.images.length > 0 ? car.images : [car.imageUrl]}
                                                className="h-full"
                                            />
                                            {car.available && (
                                                <span className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm">
                                                    Available
                                                </span>
                                            )}
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
                                                    <Users size={14} />
                                                    <span>{car.seats} Seats</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Sliders size={14} />
                                                    <span>{car.transmission}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Fuel size={14} />
                                                    <span>{car.fuelType}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    className="px-4 py-2 border border-black rounded-lg text-sm hover:bg-gray-50"
                                                    onClick={() => handleOpenDetails(car)}
                                                >
                                                    Details
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
                                                    onClick={() => handleReserve(car)}
                                                >
                                                    Reserve
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Car Details Modal */}
            {showDetailsModal && selectedCar && <CarDetails car={selectedCar} onClose={handleCloseDetails} />}

            {/* Reservation Modal */}
            {showReservationModal && selectedCar && (
                <ReservationModal car={selectedCar} onClose={handleCloseReservation} onReserve={handleReservationComplete} />
            )}
        </div>
    )
}

export default BrowseCars
