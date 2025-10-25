import React from 'react';

// Data for the 6 cards, updated for the ZestPay EWA model in India
const featuresData = [
  {
    title: "Instant Salary Advance",
    description: (
      <>
        Access your earned salary before payday. No interest, no credit check.
        Just a small, flat transaction fee starting from ₹49.
      </>
    ),
    icon: "📱",
    backgroundColor: "bg-yellow-50",
  },
  {
    title: "CIBIL Score Tracking",
    description: (
      <>
        Track your CIBIL score for free. Get alerts on changes and learn what
        affects your score, all inside the ZestPay app.
      </>
    ),
    icon: "📈",
    backgroundColor: "bg-gray-50",
    cta: "Get started",
  },
  {
    title: "Automated Savings",
    description: (
      <>
        Set aside a small amount every time you get paid. Build your
        savings pot without thinking about it. A little goes a long way.
      </>
    ),
    icon: "🏺",
    backgroundColor: "bg-green-50",
  },
  {
    title: "Low Balance Shield",
    description: "Avoid low balance charges. Get smart alerts when your linked bank account is running low, helping you stay in control.",
    icon: "🛡️",
    backgroundColor: "bg-purple-50",
  },
  {
    title: "Smart Budgeting",
    description: "See where your money goes. Our simple tools help you track your monthly spending, set budgets, and plan for expenses.",
    icon: "📊",
    backgroundColor: "bg-gray-50",
  },
  {
    title: "Bill Pay Reminders",
    description: "Never miss a due date. Get timely reminders for your electricity, mobile, and other utility bills. Pay them directly from the app.",
    icon: "📅",
    backgroundColor: "bg-purple-50",
  },
];

// Reusable card component with Tailwind classes
// (This component remains unchanged)
const FeatureCard = ({ title, description, icon, badge, backgroundColor, cta }) => {
  // Combine base classes with the dynamic background color
  const cardClasses = `
    rounded-2xl p-6 min-h-[250px] flex flex-col justify-between 
    shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-1
    ${backgroundColor}
  `;

  return (
    <div className={cardClasses}>
      <div className="flex justify-between items-start min-h-[60px]">
        {badge && (
          <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-md uppercase">
            {badge}
          </span>
        )}
        {/* Placeholder icon */}
        <span className="text-5xl opacity-70 ml-auto">{icon}</span>
      </div>
      <div className="mt-auto">
        <h3 className="text-2xl font-semibold mb-3 text-gray-900">{title}</h3>
        <p className="text-base text-gray-600 leading-normal">
          {description}
        </p>
        {cta && (
          <button className="bg-gray-900 text-white font-semibold py-2 px-5 rounded-full mt-4 hover:bg-gray-700 transition-colors">
            {cta}
          </button>
        )}
      </div>
    </div>
  );
};

// Main section component
// (This component remains unchanged)
const FeaturesSection = () => {
  return (
    <section className="font-sans max-w-6xl mx-auto my-12 p-5">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
        It's your money — take control of it
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            badge={feature.badge}
            backgroundColor={feature.backgroundColor}
            cta={feature.cta}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;