"use client"
import { useState } from "react"
import useBusinessStore from "@/stores/useBusiness"

function BusinessModalForm() {
  const { form, setForm, createBusiness, isLoading, error } = useBusinessStore()

  const [formData, setFormData] = useState({
    businessName: "",
    businessEmail: "",
    businessCategory: "",
    businessAddress: "",
    businessCity: "",
    companySize: "",
    custommsg: "",
  })

  const [customCategory, setCustomCategory] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    if (name === "businessCategory" && value !== "Other") {
      setCustomCategory("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const finalFormData = {
      ...formData,
      businessCategory: formData.businessCategory === "Other" ? customCategory : formData.businessCategory,
    }

    const result = await createBusiness(finalFormData)

    if (result.success) {
      console.log("Form data submitted successfully:", result.id)
      alert("Form submitted successfully!")

      setForm(false)
      setFormData({
        businessName: "",
        businessEmail: "",
        businessCategory: "",
        businessAddress: "",
        businessCity: "",
        companySize: "",
        custommsg: "",
      })
      setCustomCategory("")
    } else {
      alert(`Error submitting form: ${result.error}`)
    }
  }

  const closeModal = () => {
    if (isLoading) return
    setForm(false)
  }

  return (
    <>
      {form && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all"
            onClick={closeModal}
            aria-hidden="true"
          ></div>

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header: Black background, White text */}
            <div className="sticky top-0 bg-black px-8 py-6 flex justify-between items-center border-b border-gray-800">
              <div>
                <h2 id="modal-title" className="text-2xl font-bold text-white">
                  Business Information
                </h2>
                <p className="text-sm text-gray-300 mt-1">Tell us about your business</p>
              </div>
              <button
                onClick={closeModal}
                disabled={isLoading}
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Form Body: White background, Black/Gray text, Yellow focus */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    placeholder="Your business name"
                    required
                  />
                </div>

                {/* Business Email */}
                <div>
                  <label htmlFor="businessEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Email
                  </label>
                  <input
                    type="email"
                    id="businessEmail"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="businessCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Category
                </label>
                <select
                  id="businessCategory"
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option value="Software Consultant">Software Consultant</option>
                  <option value="Retail">Retail</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {formData.businessCategory === "Other" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <label htmlFor="customCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                    Please specify your category
                  </label>
                  <input
                    type="text"
                    id="customCategory"
                    name="customCategory"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    placeholder="e.g., Financial Services"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Address */}
                <div>
                  <label htmlFor="businessAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Address
                  </label>
                  <input
                    type="text"
                    id="businessAddress"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    placeholder="Street address"
                  />
                </div>

                {/* Business City */}
                <div>
                  <label htmlFor="businessCity" className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="businessCity"
                    name="businessCity"
                    value={formData.businessCity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                    placeholder="City"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="companySize" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="" disabled>
                    Select a size
                  </option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div>
                <label htmlFor="custommsg" className="block text-sm font-semibold text-gray-700 mb-2">
                  Any Queries
                </label>
                <textarea
                  id="custommsg"
                  name="custommsg"
                  rows="4"
                  value={formData.custommsg}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all resize-none"
                  placeholder="Any additional details about your business..."
                />
              </div>

              {/* Footer: White/Gray secondary, Yellow primary action */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                {error && <p className="text-sm text-red-600 font-medium">Error: {error}</p>}

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-8 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default BusinessModalForm