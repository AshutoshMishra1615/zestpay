import Image from "next/image";
import Navbar from "../components/Navbar";


const stepsData = [
  {
    number: '01',
    title: 'Sign up in minutes',
    description: 'Securely link your bank account, then verify your identity and employment.',
  },
  {
    number: '02',
    title: 'Access your money',
    description: (
      <>
        Transfer up to $150/day (with a max of $750 per pay period
        {/* Using <sup> for semantically correct superscript */}
        <sup>*</sup>) to a linked bank account.
      </>
    ),
  },
  {
    number: '03',
    title: 'Get more out of every day',
    description: (
      <>
        Get your paycheck up to 2 days early
        <sup>*</sup>, help avoid overdrafts
        <sup>*</sup>, and plan for what's next.
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="">
       <Navbar />
       <div className="bg-yellow-300 text-black py-20 px-5 flex flex-col items-center font-sans">
      
      {/* Main Title */}
      <h2 className="text-4xl font-bold mb-16">How it works</h2>

      {/* Steps List */}
      <div className="flex flex-col gap-10 max-w-md text-center mb-16">
        {stepsData.map((step) => (
          // Individual Step Item
          <div key={step.number} className="flex flex-col items-center">
            
            {/* Numbered Circle */}
            <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-4">
              {step.number}
            </div>
            
            {/* Step Title */}
            <h3 className="text-3xl font-semibold mb-3">{step.title}</h3>
            
            {/* Step Description */}
            <p className="text-base leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>

      {/* "Get started" Button */}
      <button className="bg-black text-white py-4 px-8 rounded-full text-base font-semibold cursor-pointer hover:bg-gray-800 transition-colors duration-300">
        Get started &rarr;
      </button>
    </div>
    </div>
  );
}





