"use client"

import { useState, useEffect } from "react"
import { Search, AlertCircle, CheckCircle, UserPlus, Trash2 } from "lucide-react"
import AdminSidebar from "./components/AdminSidebar.jsx"
import AddEmployeeModal from "./components/AddEmployeeModal.jsx"

export default function AdminEmployees() {
    const [employees, setEmployees] = useState([
        {
            id: "EMP001",
            name: "John Doe",
            email: "john.doe@example.com",
            role: "Manager",
            department: "Operations",
            joinDate: "2023-01-15",
            status: "Active",
        },
        {
            id: "EMP002",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "Rental Agent",
            department: "Customer Service",
            joinDate: "2023-03-22",
            status: "Active",
        },
        {
            id: "EMP003",
            name: "Robert Johnson",
            email: "robert.johnson@example.com",
            role: "Maintenance",
            department: "Technical",
            joinDate: "2023-02-10",
            status: "Active",
        },
        {
            id: "EMP004",
            name: "Sarah Williams",
            email: "sarah.williams@example.com",
            role: "Rental Agent",
            department: "Customer Service",
            joinDate: "2023-04-05",
            status: "Inactive",
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [filteredEmployees, setFilteredEmployees] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Filter employees based on search term
        const filtered = employees.filter(
            (employee) =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredEmployees(filtered)
    }, [employees, searchTerm])

    const handleAddEmployee = (newEmployee) => {
        // Generate a new employee ID
        const newId = `EMP${String(employees.length + 1).padStart(3, "0")}`

        const employeeWithId = {
            ...newEmployee,
            id: newId,
            joinDate: new Date().toISOString().split("T")[0],
            status: "Active",
        }

        setEmployees([...employees, employeeWithId])

        setStatusMessage({
            type: "success",
            message: "Employee added successfully",
        })

        setTimeout(() => {
            setStatusMessage({ type: "", message: "" })
        }, 3000)
    }

    const handleDeleteEmployee = (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            setEmployees(employees.filter((employee) => employee.id !== id))

            setStatusMessage({
                type: "success",
                message: "Employee deleted successfully",
            })

            setTimeout(() => {
                setStatusMessage({ type: "", message: "" })
            }, 3000)
        }
    }

    const handleToggleStatus = (id) => {
        setEmployees(
            employees.map((employee) =>
                employee.id === id ? { ...employee, status: employee.status === "Active" ? "Inactive" : "Active" } : employee,
            ),
        )

        setStatusMessage({
            type: "success",
            message: "Employee status updated successfully",
        })

        setTimeout(() => {
            setStatusMessage({ type: "", message: "" })
        }, 3000)
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar active="employees" />

            <div className="flex-1 p-8">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Employees</h1>
                        <p className="text-gray-600">Manage your employees</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-md"
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Employee
                    </button>
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
                            placeholder="Search employees..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Employees Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {filteredEmployees.length === 0 ? (
                        <div className="p-8 text-center">
                            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
                            <p className="text-gray-600">Try adjusting your search or add a new employee.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employee ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Join Date
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
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(employee.joinDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              employee.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                      >
                        {employee.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleToggleStatus(employee.id)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title={employee.status === "Active" ? "Deactivate" : "Activate"}
                                            >
                                                {employee.status === "Active" ? "Deactivate" : "Activate"}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEmployee(employee.id)}
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

            {/* Add Employee Modal */}
            {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} onAddEmployee={handleAddEmployee} />}
        </div>
    )
}
