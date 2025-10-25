'use client'
import React, { useState } from 'react';

// --- Icon Components (Inlined for simplicity) ---

const UserIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const BriefcaseIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const DollarSignIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const CalendarIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const BankIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m8 3 4 8 4-8"/><path d="M6 3h12"/><path d="M3 7v1"/><path d="M21 7v1"/><path d="M3 21h18"/><path d="M5 12v7"/><path d="M19 12v7"/><path d="M12 12v7"/></svg>;
const CheckIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>;

// --- Reusable Form Field Components ---

const InputField = ({ id, label, type, placeholder, icon, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="block w-full rounded-lg border-gray-600 bg-gray-700 p-3 pl-10 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const SelectField = ({ id, label, icon, value, onChange, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="block w-full appearance-none rounded-lg border-gray-600 bg-gray-700 p-3 pl-10 text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
      >
        {children}
      </select>
    </div>
  </div>
);

// --- The Main Onboarding Form Component ---

function OnboardingForm({ onSubmitSuccess }) {
  const [userType, setUserType] = useState(null); // 'gig' or 'employee'
  const [formData, setFormData] = useState({
    employmentStartDate: '',
    // Gig worker fields
    hourlyRate: '',
    mockBankName: '',
    mockAccountNumber: '',
    mockRoutingNumber: '',
    authCheckbox: false,
    // Salaried employee fields
    monthlySalary: '',
    paydayDate: '',
    employerName: '',
  });

  const handleDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", { userType, ...formData });
    onSubmitSuccess({ userType, ...formData }); // Pass all data up
  };

  const isFormValid = () => {
    const { employmentStartDate } = formData;
    if (!userType || !employmentStartDate) return false;

    if (userType === 'gig') {
      const { hourlyRate, mockBankName, mockAccountNumber, mockRoutingNumber, authCheckbox } = formData;
      return hourlyRate && mockBankName && mockAccountNumber && mockRoutingNumber && authCheckbox;
    }

    if (userType === 'employee') {
      const { monthlySalary, paydayDate } = formData;
      return monthlySalary && paydayDate;
    }
    
    return false;
  };

  return (
    <div className="rounded-xl bg-gray-800 shadow-xl sm:w-full sm:max-w-xl">
      <div className="px-6 py-8 sm:px-10">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Tell us about you
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            First, select your employment type to see the right form.
          </p>
        </div>

        {/* --- Step 1: User Type Selection --- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setUserType('gig')}
            className={`flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-all duration-150
              ${userType === 'gig'
                ? 'border-purple-500 bg-purple-900/50 ring-2 ring-purple-500'
                : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
              }`}
          >
            <UserIcon className={`h-10 w-10 mb-2 ${userType === 'gig' ? 'text-purple-400' : 'text-gray-400'}`} />
            <span className="font-semibold text-white">I am a Freelancer / Gig Worker</span>
          </button>
          
          <button
            type="button"
            onClick={() => setUserType('employee')}
            className={`flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-all duration-150
              ${userType === 'employee'
                ? 'border-blue-500 bg-blue-900/50 ring-2 ring-blue-500'
                : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
              }`}
          >
            <BriefcaseIcon className={`h-10 w-10 mb-2 ${userType === 'employee' ? 'text-blue-400' : 'text-gray-400'}`} />
            <span className="font-semibold text-white">I am a Salaried Employee</span>
          </button>
        </div>

        {/* --- Step 2: Dynamic Form Fields (Forms 1 & 2) --- */}
        {userType && (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="border-t border-gray-700 pt-6 space-y-6">

              {/* --- Common Field --- */}
              <InputField
                id="employmentStartDate"
                name="employmentStartDate"
                label="How long have you been working?"
                type="date"
                icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
                value={formData.employmentStartDate}
                onChange={handleDataChange}
              />
              
              {/* --- Form 1: Gig Worker Fields --- */}
              {userType === 'gig' && (
                <>
                  <InputField
                    id="hourlyRate"
                    name="hourlyRate"
                    label="What is your default hourly rate?"
                    type="number"
                    placeholder="e.g., 25"
                    icon={<DollarSignIcon className="h-5 w-5 text-gray-400" />}
                    value={formData.hourlyRate}
                    onChange={handleDataChange}
                  />
                  
                  {/* Mock Bank Linking Section (For Investors) */}
                  <div>
                    <h3 className="text-md font-semibold text-gray-200">
                      Link Bank for Repayments
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      This is how we'll automatically repay your advances.
                    </p>
                    <div className="space-y-4 rounded-lg border border-gray-600 bg-gray-700 p-4">
                      <InputField id="mockBankName" name="mockBankName" label="Bank Name" type="text" placeholder="Mock Bank Name" icon={<BankIcon className="h-5 w-5 text-gray-400" />} value={formData.mockBankName} onChange={handleDataChange} />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InputField id="mockAccountNumber" name="mockAccountNumber" label="Account Number" type="text" placeholder="**** **** 1234" icon={<div className="h-5 w-5 text-gray-400 font-bold">#</div>} value={formData.mockAccountNumber} onChange={handleDataChange} />
                        <InputField id="mockRoutingNumber" name="mockRoutingNumber" label="Routing Number" type="text" placeholder="000111222" icon={<div className="h-5 w-5 text-gray-400 font-bold">R</div>} value={formData.mockRoutingNumber} onChange={handleDataChange} />
                      </div>
                      <div className="relative flex items-start pt-2">
                        <div className="flex h-6 items-center">
                          <input id="authCheckbox" name="authCheckbox" type="checkbox" checked={formData.authCheckbox} onChange={handleDataChange} className="peer h-5 w-5 shrink-0 rounded border-gray-500 bg-gray-600 text-purple-600 focus:ring-purple-500" />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label htmlFor="authCheckbox" className="text-gray-300">I authorize PayFlow to auto-debit this account.</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* --- Form 2: Salaried Employee Fields --- */}
              {userType === 'employee' && (
                <>
                  <InputField
                    id="monthlySalary"
                    name="monthlySalary"
                    label="What is your monthly salary?"
                    type="number"
                    placeholder="e.g., 3000"
                    icon={<DollarSignIcon className="h-5 w-5 text-gray-400" />}
                    value={formData.monthlySalary}
                    onChange={handleDataChange}
                  />
                  <SelectField
                    id="paydayDate"
                    name="paydayDate"
                    label="When do you receive your payment?"
                    icon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
                    value={formData.paydayDate}
                    onChange={handleDataChange}
                  >
                    <option value="">Select your payday...</option>
                    <option value="15th">15th of the month</option>
                    <option value="30th">30th / End of the month</option>
                    <option value="last_friday">Last Friday of the month</option>
                    <option value="biweekly_friday">Every other Friday</option>
                  </SelectField>
                  <InputField
                    id="employerName"
                    name="employerName"
                    label="Employer Name (Optional)"
                    type="text"
                    placeholder="e.g., Acme Corporation"
                    icon={<BriefcaseIcon className="h-5 w-5 text-gray-400" />}
                    value={formData.employerName}
                    onChange={handleDataChange}
                  />
                </>
              )}
            </div>
            
            {/* --- Submit Button --- */}
            <div>
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`flex w-full justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-medium shadow-sm 
                  ${isFormValid() 
                    ? 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Complete Setup
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// --- Demo App Component (to show the form) ---

export default function App() {
  const [profileData, setProfileData] = useState(null);

  if (profileData) {
    // Show a success screen after the form is submitted
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white p-4">
        <div className="rounded-xl bg-gray-800 p-8 text-center shadow-xl max-w-lg w-full">
          <CheckIcon className="h-16 w-16 mx-auto text-green-500" />
          <h2 className="mt-4 text-2xl font-bold">Profile Created!</h2>
          <p className="mt-2 text-gray-300">You are now ready to use the dashboard.</p>
          <p className="text-gray-400 mt-2">User Type: <span className="text-white font-bold">{profileData.userType}</span></p>
          <div className="mt-6 text-left text-xs text-gray-400 bg-gray-900 p-4 rounded-md overflow-auto">
            <h3 className="text-sm text-gray-200 mb-2 font-bold">Data Collected:</h3>
            <pre>
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
          <button
            onClick={() => setProfileData(null)} // Reset button
            className="mt-6 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // Show the main onboarding form
  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gray-900 py-12 px-4">
      <OnboardingForm onSubmitSuccess={setProfileData} />
    </div>
  );
}