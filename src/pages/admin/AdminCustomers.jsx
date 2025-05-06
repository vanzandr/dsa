"use client"

import { useState, useEffect } from "react"
import { Search, AlertCircle, CheckCircle, Trash2, Eye } from "lucide-react"
import AdminSidebar from "./components/AdminSidebar.jsx"

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([
    {
      id: "CUST001",
      username: "alexmorgan",
      firstName: "Alex",
      middleName: "",
      lastName: "Morgan",
      email: "alex.morgan@example.com",
      birthDate: "1992-07-15",
      maritalStatus: "Single",
      nationality: "Filipino",
      mobilePhone: "09123456789",
      joinDate: "2023-01-10",
      status: "Active",
      totalBookings: 5,
      totalSpent: 25000,
    },
    {
      id: "CUST002",
      username: "michaelsmith",
      firstName: "Michael",
      middleName: "James",
      lastName: "Smith",
      email: "michael.smith@example.com",
      birthDate: "1985-03-22",
      maritalStatus: "Married",
      nationality: "Filipino",
      mobilePhone: "09234567890",
      joinDate: "2023-02-15",
      status: "Active",
      totalBookings: 3,
      totalSpent: 18000,
    },
    {
      id: "CUST003",
      username: "sarahjohnson",
      firstName: "Sarah",
      middleName: "",
      lastName: "Johnson",
      email: "sarah.johnson@example.com",
      birthDate: "1990-11-08",
      maritalStatus: "Single",
      nationality: "Filipino",
      mobilePhone: "09345678901",
      joinDate: "2023-03-05",
      status: "Inactive",
      totalBookings: 1,
      totalSpent: 5000,
    },
    {
      id: "CUST004",
      username: "davidwilliams",
      firstName: "David",
      middleName: "Robert",
      lastName: "Williams",
      email: "david.williams@example.com",
      birthDate: "1988-05-20",
      maritalStatus: "Married",
      nationality: "Filipino",
      mobilePhone: "09456789012",
      joinDate: "2023-04-12",
      status: "Active",
      totalBookings: 2,
      totalSpent: 12000,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Filter customers based on search term
    const filtered = customers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobilePhone.includes(searchTerm),
    )
    setFilteredCustomers(filtered)
  }, [customers, searchTerm])

  const handleDeleteCustomer = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((customer) => customer.id !== id))

      setStatusMessage({
        type: "success",
        message: "Customer deleted successfully",
      })

      setTimeout(() => {
        setStatusMessage({ type: "", message: "" })
      }, 3000)
    }
  }

  const handleToggleStatus = (id) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === id ? { ...customer, status: customer.status === "Active" ? "Inactive" : "Active" } : customer,
      ),
    )

    setStatusMessage({
      type: "success",
      message: "Customer status updated successfully",
    })

    setTimeout(() => {
      setStatusMessage({ type: "", message: "" })
    }, 3000)
  }

  // Helper function to get full name
  const getFullName = (customer) => {
    return `${customer.firstName} ${customer.middleName ? customer.middleName + " " : ""}${customer.lastName}`.trim()
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar active="customers" />

      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage.message && (
          <div
            className={`mb-6 p-4 ${
              statusMessage.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            } rounded-md flex items-center`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {statusMessage.message}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">No customers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getFullName(customer)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.mobilePhone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.totalBookings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₱ {customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(customer.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title={customer.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          {customer.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
