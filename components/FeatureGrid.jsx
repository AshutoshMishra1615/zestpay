import React from "react";
import {
  CreditCard,
  BarChart3,
  PiggyBank,
  ShieldCheck,
  Wallet,
  BellRing,
} from "lucide-react"; // ✅ modern Lucide icons

// --- Data for the ZestPay features ---
const featuresData = [
  {
    title: "Instant Salary Advance",
    description: (
      <>
        Access your earned salary before payday. No interest, no credit check.
        Just a small, flat transaction fee starting from ₹49.
      </>
    ),
    icon: <CreditCard className="w-12 h-12 text-yellow-500" />, // 💳 Clean icon
  },
  {
    title: "CIBIL Score Tracking",
    description: (
      <>
        Track your CIBIL score right in the app. Get alerts on changes and see
        what affects your score. And yes, it's free.
      </>
    ),
    icon: <BarChart3 className="w-12 h-12 text-blue-500" />, // 📊 Data-related
  },
  {
    title: "Automated Savings",
    description: (
      <>
        Set aside a small amount every time you get paid. Build your savings pot
        without thinking about it. A little goes a long way.
      </>
    ),
    icon: <PiggyBank className="w-12 h-12 text-green-500" />, // 🐷 Classic savings
  },
  {
    title: "Low Balance Shield",
    description: (
      <>
        Avoid low balance charges. Get smart alerts when your linked bank
        account is running low, helping you stay in control.
      </>
    ),
    icon: <ShieldCheck className="w-12 h-12 text-teal-500" />, // 🛡️ Protection
  },
  {
    title: "Smart Budgeting",
    description: (
      <>
        See where your money goes. Our simple tools help you track your monthly
        spending, set budgets, and plan for expenses.
      </>
    ),
    icon: <Wallet className="w-12 h-12 text-orange-500" />, // 👛 Budget icon
  },
  {
    title: "Bill Pay Reminders",
    description: (
      <>
        Never miss a due date. Get timely reminders for your electricity,
        mobile, and other utility bills. Pay them directly from the app.
      </>
    ),
    icon: <BellRing className="w-12 h-12 text-purple-500" />, // 🔔 Reminder icon
  },
];

function FeaturesGrid() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
          It's your money — take control of it
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="flex min-h-[300px] flex-col rounded-2xl bg-neutral-50 p-8 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <div className="mb-10">{feature.icon}</div>

              <h3 className="mb-3 text-2xl font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesGrid;