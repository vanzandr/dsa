"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { useCars } from "./CarContext"
import { useNotifications } from "./NotificationContext"
import apiClient from "../services/apiClient.js";
import axios from "axios"

// Create the reservation context
const ReservationContext = createContext(null)

// Initial reservation data
const initialReservations = [
  {
    id: "R001",
    carId: "1",
    userId: "user1",
    customerName: "Diwata Pares",
    firstName: "Diwata",
    middleName: "",
    lastName: "Pares",
    mobilePhone: "63912-345-6789",
    nationality: "Filipino",
    startDate: "2025-05-01",
    endDate: "2025-05-08",
    status: "Active",
    totalPrice: 31500,
    createdAt: "2025-04-28T10:00:00Z",
    hasLicenseFile: true,
    hasContractFile: true,
  },
  {
    id: "R002",
    carId: "2",
    userId: "user1",
    customerName: "Diwata Pares",
    firstName: "Diwata",
    middleName: "",
    lastName: "Pares",
    mobilePhone: "63912-345-6789",
    nationality: "Filipino",
    startDate: "2025-05-10",
    endDate: "2025-05-17",
    status: "Pending Confirmation",
    totalPrice: 29400,
    createdAt: "2025-04-29T14:30:00Z",
    hasLicenseFile: true,
    hasContractFile: true,
  },
]

export const ReservationProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const { updateCarAvailability, getCarById } = useCars()
  const { addNotification } = useNotifications()

  const storedReservations = localStorage.getItem("pahiramcar_reservations")
  const [reservations, setReservations] = useState(
      storedReservations ? JSON.parse(storedReservations) : []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReservations = async () => {
      if (!currentUser?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await apiClient.get(`/api/customer/reservations/${currentUser.id}`, {
          withCredentials: true,
        })

        if (response.data && Array.isArray(response.data)) {
          setReservations(response.data)
          localStorage.setItem("pahiramcar_reservations", JSON.stringify(response.data))
        } else {
          throw new Error("Invalid reservations data format")
        }
      } catch (error) {
        console.error("Failed to get reservations", error)
        if (storedReservations) {
          setReservations(JSON.parse(storedReservations))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [currentUser?.id])

  const persistReservations = (updated) => {
    setReservations(updated)
    localStorage.setItem("pahiramcar_reservations", JSON.stringify(updated))
  }

  const addReservation = async (reservation) => {
    if (!currentUser?.id || typeof currentUser.id !== "number") {
      throw new Error("❌ currentUser.id is invalid (must be a number).")
    }

    const reservationId = `R${Date.now().toString().slice(-6)}`
    const customerName = `${currentUser.firstName || ""} ${currentUser.middleName || ""} ${currentUser.lastName || ""}`.trim()

    const newReservation = {
      ...reservation,
      id: reservationId,
      userId: currentUser.id, // ✅ must be integer
      createdAt: new Date().toISOString(),
      status: "Waiting for Approval",
      customerName,
      firstName: currentUser.firstName || "",
      middleName: currentUser.middleName || "",
      lastName: currentUser.lastName || "",
      mobilePhone: currentUser.mobilePhone || "",
      nationality: currentUser.nationality || "Filipino",
    }

    try {
      const res = await apiClient.post(
          `/api/customer/${currentUser.id}/reservations`,
          newReservation,
          { withCredentials: true }
      )

      setReservations((prev) => [...prev, res.data])
      updateCarAvailability(newReservation.carId, false)

      const car = getCarById(newReservation.carId)
      addNotification({
        type: "reservation",
        title: "New Reservation",
        message: `${customerName} reserved a ${car?.name}`,
        data: {
          reservationId,
          carId: newReservation.carId,
          carName: car?.name,
          customerName,
          startDate: newReservation.startDate,
          days: newReservation.days,
          totalPrice: newReservation.totalPrice,
        },
      })

      return res.data
    } catch (error) {
      console.error("❌ Failed to add reservation:", error)
      throw error // ✅ correct variable name
    } finally {
      setLoading(false)
    }
  }
  const updateReservation = async (updatedData) => {
    try {
      setLoading(true)
      const response = await apiClient.put(`/api/reservations/${updatedData.id}`, updatedData, {
        withCredentials: true,
      })

      const updated = reservations.map((r) =>
          r.id === updatedData.id ? response.data : r
      )
      persistReservations(updated)

      return response.data
    } catch (err) {
      console.error("Failed to update reservation:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cancelReservation = async (reservationId) => {
    const reservation = reservations.find((r) => r.id === reservationId)
    if (!reservation) return false

    try {
      await apiClient.put(`/api/customer/reservation/${reservationId}/cancel`, {}, {
        withCredentials: true,
      })

      updateCarAvailability(reservation.carId, true)

      const updated = reservations.map((r) =>
          r.id === reservationId ? { ...r, status: "Cancelled" } : r
      )
      setReservations(updated)

      const car = getCarById(reservation.carId)

      addNotification({
        type: "cancellation",
        title: "Reservation Cancelled",
        message: `Reservation for ${car?.name} has been cancelled`,
        data: {
          reservationId,
          carId: reservation.carId,
          carName: car?.name,
          customerName: reservation.customerName,
          timestamp: new Date().toISOString(),
        },
      })

      if (currentUser) {
        addNotification({
          type: "cancellation",
          title: "Reservation Cancelled",
          message: `Your reservation for ${car?.name} has been cancelled`,
          userId: currentUser.id,
          data: {
            reservationId,
            carId: reservation.carId,
            carName: car?.name,
            timestamp: new Date().toISOString(),
          },
        })
      }

      return true
    } catch (error) {
      console.error("Failed to cancel reservation:", error)
      return false
    }
  }

  const convertToBooking = (reservationId, bookingData) => {
    const reservation = reservations.find((r) => r.id === reservationId)
    if (!reservation) return null
    setReservations((prev) =>
        prev.map((r) =>
            r.id === reservationId ? { ...r, status: "Converted to Booking" } : r
        )
    )
    return { ...reservation, ...bookingData }
  }

  const getUserReservations = () => {
    if (!currentUser) return []
    return reservations
        .filter((r) => r.userId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const getActiveReservations = () => {
    return reservations.filter(
        (r) => r.status === "Active" || r.status === "Pending Confirmation"
    )
  }

  const isCarReserved = (carId) => {
    return reservations.some(
        (r) =>
            r.carId === carId &&
            (r.status === "Active" || r.status === "Pending Confirmation")
    )
  }

  const getReservationsByCarId = (carId) => {
    return reservations.filter((r) => r.carId === carId)
  }

  const getUserRecentActivities = () => {
    if (!currentUser) return []
    const userReservations = reservations.filter(
        (r) => r.userId === currentUser.id
    )

    return userReservations
        .map((reservation) => {
          const car = getCarById(reservation.carId)
          return {
            id: reservation.id,
            type: "reservation",
            action: reservation.status === "Cancelled" ? "cancelled" : "created",
            carName: car?.name || "Unknown Car",
            timestamp:
                reservation.status === "Cancelled"
                    ? reservation.cancelledAt ||
                    reservation.updatedAt ||
                    reservation.createdAt
                    : reservation.createdAt,
            status: reservation.status,
          }
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  return (
      <ReservationContext.Provider
          value={{
            reservations,
            loading,
            addReservation,
            updateReservation,
            cancelReservation,
            convertToBooking,
            getUserReservations,
            getActiveReservations,
            isCarReserved,
            getReservationsByCarId,
            getUserRecentActivities,
          }}
      >
        {children}
      </ReservationContext.Provider>
  )
}

export const useReservations = () => {
  const context = useContext(ReservationContext)
  if (!context) {
    throw new Error("useReservations must be used within a ReservationProvider")
  }
  return context
}
