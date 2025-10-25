"use client"
import { useEffect } from "react"
import useBusinessStore from "@/stores/useBusiness"
import { Loader2, AlertCircle, Database } from "lucide-react"

function AdminDashboard() {
  const { businesses, isFetching, fetchError, fetchBusinesses } = useBusinessStore()

  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  if (isFetching) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-12 h-12 text-black animate-spin" />
          </div>
          <p className="text-lg text-black font-medium">Loading business data...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we fetch your submissions</p>
        </div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-lg text-black font-medium">Error Loading Data</p>
          <p className="text-sm text-gray-700 mt-2">{fetchError}</p>
        </div>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-black font-medium">No Businesses Found</p>
          <p className="text-sm text-gray-600 mt-2">Business submissions will appear here</p>
        </div>
      </div>
    )
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage and track all business submissions</p>
      </div>

      <div className="bg-white border-2 border-black rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black border-b-2 border-black">
                <th className="text-left py-4 px-6 text-sm font-semibold text-white uppercase tracking-wider">
                  Business Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white uppercase tracking-wider">City</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white uppercase tracking-wider">Size</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white uppercase tracking-wider">
                  Submitted
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-white uppercase tracking-wider">
                  Meeting
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {businesses.map((business, index) => (
                <tr key={business.id} className="hover:bg-yellow-50 transition-colors duration-200 group">
                  <td className="py-4 px-6 text-sm text-black font-medium group-hover:text-black">
                    {business.businessName}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">{business.businessEmail}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className="inline-block px-3 py-1 bg-yellow-300 text-black rounded-full text-xs font-medium">
                      {business.businessCategory}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700">{business.businessCity}</td>
                  <td className="py-4 px-6 text-sm">
                    <span className="inline-block px-3 py-1 bg-gray-200 text-black rounded text-xs font-medium">
                      {business.companySize}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{formatDate(business.createdAt)}</td>
                  <td className="py-4 px-6 text-sm">
                    {business.meetingScheduled ? (
                      <span className="inline-block px-3 py-1 bg-yellow-200 text-black rounded-full text-xs font-medium">
                        {formatDate(business.meetingScheduled)}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border-t-2 border-black px-6 py-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-semibold text-black">{businesses.length}</span> business submission
            {businesses.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
