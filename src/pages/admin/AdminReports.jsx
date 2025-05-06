"use client"

import { useState } from "react"
import { Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, DollarSign, Users } from "lucide-react"
import AdminSidebar from "./components/AdminSidebar.jsx"

// Demo data for transactions
const transactions = [
    {
        id: "T001",
        date: "May 05, 2025",
        customer: "Diwata Pares",
        car: "2016 Toyota Camry",
        type: "Booking Payment",
        amount: 31500,
        paymentMethod: "Cash",
        status: "Completed",
    },
    {
        id: "T002",
        date: "May 04, 2025",
        customer: "John Smith",
        car: "2018 Honda Civic",
        type: "Booking Payment",
        amount: 29400,
        paymentMethod: "Credit Card",
        status: "Completed",
    },
    {
        id: "T003",
        date: "May 03, 2025",
        customer: "Maria Garcia",
        car: "2020 Ford Explorer",
        type: "Booking Payment",
        amount: 45500,
        paymentMethod: "Debit Card",
        status: "Completed",
    },
    {
        id: "T004",
        date: "May 02, 2025",
        customer: "Diwata Pares",
        car: "2019 Mitsubishi Montero",
        type: "Late Return Fee",
        amount: 4500,
        paymentMethod: "Cash",
        status: "Completed",
    },
    {
        id: "T005",
        date: "May 01, 2025",
        customer: "Miguel Lim",
        car: "2021 Mazda 3",
        type: "Booking Payment",
        amount: 33600,
        paymentMethod: "Credit Card",
        status: "Completed",
    },
    {
        id: "T006",
        date: "Apr 30, 2025",
        customer: "Sofia Cruz",
        car: "2017 Toyota Fortuner",
        type: "Booking Payment",
        amount: 38500,
        paymentMethod: "Cash",
        status: "Completed",
    },
    {
        id: "T007",
        date: "Apr 29, 2025",
        customer: "Carlos Reyes",
        car: "2016 Toyota Camry",
        type: "Damage Repair Fee",
        amount: 8500,
        paymentMethod: "Debit Card",
        status: "Completed",
    },
]

// Demo data for monthly revenue
const monthlyRevenue = [
    { month: "Jan", revenue: 156000 },
    { month: "Feb", revenue: 187000 },
    { month: "Mar", revenue: 205000 },
    { month: "Apr", revenue: 245000 },
    { month: "May", revenue: 191500 },
]

// Demo data for car performance
const carPerformance = [
    { car: "Toyota Camry", bookings: 24, revenue: 108000 },
    { car: "Honda Civic", bookings: 18, revenue: 75600 },
    { car: "Ford Explorer", bookings: 15, revenue: 97500 },
    { car: "Mitsubishi Montero", bookings: 12, revenue: 69600 },
    { car: "Mazda 3", bookings: 10, revenue: 48000 },
]

export default function AdminReports() {
    const [dateRange, setDateRange] = useState({
        startDate: "2025-05-01",
        endDate: "2025-05-31",
    })
    const [reportType, setReportType] = useState("transactions")

    const handleDateChange = (e) => {
        const { name, value } = e.target
        setDateRange((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleExportReport = () => {
        alert("Report exported successfully!")
    }

    // Calculate total revenue
    const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.amount, 0)

    // Calculate revenue by payment method
    const revenueByPaymentMethod = transactions.reduce((acc, transaction) => {
        const method = transaction.paymentMethod
        if (!acc[method]) {
            acc[method] = 0
        }
        acc[method] += transaction.amount
        return acc
    }, {})

    // Calculate revenue by transaction type
    const revenueByType = transactions.reduce((acc, transaction) => {
        const type = transaction.type
        if (!acc[type]) {
            acc[type] = 0
        }
        acc[type] += transaction.amount
        return acc
    }, {})

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar active="reports" />

            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <p className="text-gray-600">View and analyze business performance</p>
                </div>

                {/* Report Controls */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Generate Report</h2>
                            <p className="text-sm text-gray-600">Select date range and report type</p>
                        </div>
                        <button
                            onClick={handleExportReport}
                            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-black text-white rounded-md"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <input
                                    type="date"
                                    name="startDate"
                                    value={dateRange.startDate}
                                    onChange={handleDateChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <input
                                    type="date"
                                    name="endDate"
                                    value={dateRange.endDate}
                                    onChange={handleDateChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                            <div className="flex items-center">
                                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                    <option value="transactions">Transactions</option>
                                    <option value="revenue">Revenue Analysis</option>
                                    <option value="cars">Car Performance</option>
                                    <option value="customers">Customer Analysis</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
                            <DollarSign className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold">₱ {totalRevenue.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span>12.5% from last month</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-medium text-gray-500">Total Bookings</h2>
                            <Calendar className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold">79</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span>8.3% from last month</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-medium text-gray-500">Average Rental Duration</h2>
                            <Clock className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold">5.8 days</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-red-600">
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                            <span>2.1% from last month</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-medium text-gray-500">Active Customers</h2>
                            <Users className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-bold">42</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-green-600">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            <span>15.2% from last month</span>
                        </div>
                    </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Revenue by Payment Method</h2>
                        <div className="space-y-4">
                            {Object.entries(revenueByPaymentMethod).map(([method, amount]) => (
                                <div key={method} className="flex items-center">
                                    <div className="w-32 text-sm text-gray-600">{method}</div>
                                    <div className="flex-1 mx-2">
                                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-black" style={{ width: `${(amount / totalRevenue) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="w-24 text-right font-medium">₱ {amount.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Revenue by Transaction Type</h2>
                        <div className="space-y-4">
                            {Object.entries(revenueByType).map(([type, amount]) => (
                                <div key={type} className="flex items-center">
                                    <div className="w-40 text-sm text-gray-600">{type}</div>
                                    <div className="flex-1 mx-2">
                                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-black" style={{ width: `${(amount / totalRevenue) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="w-24 text-right font-medium">₱ {amount.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Revenue Chart */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
                    <div className="h-64 flex items-end justify-between">
                        {monthlyRevenue.map((data) => (
                            <div key={data.month} className="flex flex-col items-center">
                                <div
                                    className="w-16 bg-black rounded-t-md"
                                    style={{ height: `${(data.revenue / 250000) * 100}%` }}
                                ></div>
                                <div className="mt-2 text-sm font-medium">{data.month}</div>
                                <div className="text-xs text-gray-500">₱ {data.revenue.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Car Performance */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Car Performance</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Car Model
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Bookings
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Revenue Generated
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Utilization Rate
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {carPerformance.map((car) => (
                                <tr key={car.car}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{car.car}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.bookings}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₱ {car.revenue.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-black h-2.5 rounded-full"
                                                    style={{ width: `${(car.bookings / 30) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="ml-2 text-sm text-gray-600">{Math.round((car.bookings / 30) * 100)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Car
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.car}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₱ {transaction.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.paymentMethod}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${transaction.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                            >
                                                {transaction.status}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Clock({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}