import React from 'react';

// --- Placeholder Icons ---
// You can replace these with your own <img /> tags or SVG components.
const icons = {
  cashOut: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75-3 3m0 0-3-3m3 3V1.5m6 5.25v11.25m0 0A2.25 2.25 0 0 1 18 18.75m0 0H6.75A2.25 2.25 0 0 1 4.5 16.5V6.75A2.25 2.25 0 0 1 6.75 4.5h11.25m0 0A2.25 2.25 0 0 0 18 2.25m0 0H6.75A2.25 2.25 0 0 0 4.5 4.5v11.25m13.5-13.5Z" />
    </svg>
  ),
  livePay: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  ),
  earlyPay: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  balanceShield: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.662-.509-3.227-1.402-4.502A11.959 11.959 0 0 1 15 2.714v.001Z" />
    </svg>
  ),
  creditMonitoring: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  tipYourself: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6V5.25M3.75 4.5v-.75A.75.75 0 0 0 3 3.75V4.5m0 9.75v1.5a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V14.25m1.5 0v-1.5a.75.75 0 0 0-.75-.75H3a.75.75 0 0 0-.75.75v1.5m1.5 0v.75a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V15m3.75-9.75v-.75a.75.75 0 0 0-.75-.75H6a.75.75 0 0 0-.75.75v.75m1.5 0v.75a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V5.25m3.75 0v-.75a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0-.75.75v.75m1.5 0v.75a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75V5.25m9.75 9.75v1.5a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75V14.25m1.5 0v-1.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v1.5m1.5 0v.75a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75V15" />
    </svg>
  ),
};

// --- Data for the cards ---
const featuresData = [
  {
    title: 'Cash Out',
    description: (
      <>
        Access your money in 1–3 business days at no cost / in minutes starting at
        $3.99.<sup>1</sup> No mandatory fees, no credit check, no interest.
      </>
    ),
    icon: icons.cashOut,
  },
  {
    title: 'Live Pay',
    badge: 'Early access',
    description: (
      <>
        Access your pay in real time with Live Pay, up to $1,500/pay period.
        <sup>2</sup>
      </>
    ),
    icon: icons.livePay,
  },
  {
    title: 'Early Pay',
    description: (
      <>
        Now your direct deposit can land in your bank account up to 2 days
        sooner—just $2.99 per expedited transfer.<sup>3</sup>
      </>
    ),
    icon: icons.earlyPay,
  },
  {
    title: 'Balance Shield',
    description: (
      <>
        Help protect against overdrafts wherever you bank with custom alerts and
        automatic $100 transfers.<sup>4</sup>
      </>
    ),
    icon: icons.balanceShield,
  },
  {
    title: 'Credit Monitoring',
    description: (
      <>
        See your VantageScore 3.0® by Experian® right in the app.<sup>*</sup>{' '}
        Stay ahead of surprises and potential fraud — did we mention it's free?
      </>
    ),
    icon: icons.creditMonitoring,
  },
  {
    title: 'Tip Yourself',
    description: (
      <>
        Set yourself up to save every time you get paid with a no-cost,
        FDIC-insured account.<sup>5</sup> Then kick back and ace your goals.
      </>
    ),
    icon: icons.tipYourself,
  },
];

// --- The Component ---
function FeaturesGrid() {
  return (
    <section className="w-full bg-white py-12 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="flex min-h-[300px] flex-col rounded-2xl bg-neutral-50 p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Icon / Illustration */}
              <div className="mb-12 h-14">
                {/* This is where your icon is rendered.
                  You can replace `feature.icon` with:
                  <img src="/path/to/your-image.png" alt="" className="h-14 w-auto" />
                */}
                {feature.icon}
              </div>

              {/* Badge (conditionally rendered) */}
              {feature.badge && (
                <span className="mb-2 self-start rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-yellow-800">
                  {feature.badge}
                </span>
              )}

              {/* Title */}
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-base text-gray-600">
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