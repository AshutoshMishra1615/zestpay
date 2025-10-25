'use client'
import React, { useState } from 'react';
import  useBusinessStore  from '@/stores/useBusiness';




const MenuIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

/**
 * Close (X) Icon
 */
const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// --- Navigation Links ---
// Defined as an array for easy mapping in both desktop and mobile menus.
const navLinks = [
  { href: "#", text: "For Individuals" },
  { href: "#", text: "For Businesses" },
  { href: "#", text: "Who We Are" },
  { href: "#", text: "Impact" },
];


export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const { form , setForm  } = useBusinessStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // The font-inter class is used to match the common modern sans-serif look.
    // Tailwind's default `font-sans` will work well if Inter isn't loaded.
    <div className="font-sans">
      <nav className="relative bg-black text-white">
        {/* Container to center and pad the content */}
        <div className="container mx-auto flex items-center justify-between px-6 py-2">
          
          {/* Left Side: Logo and Desktop Nav Links */}
          <div className="flex items-center gap-x-10">
            {/* Logo */}
            <a
              href="#"
              className="inline-block rounded-full bg-white px-5 py-2  font-bold text-black"
            >
              <span>zest<span className='text-yellow-500'>pay</span> </span>
            </a>
            
            {/* Desktop Nav Links */}
            <div className="hidden items-center gap-x-8 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="text-base font-semibold text-white transition-colors hover:text-gray-300"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Desktop CTA Button and Mobile Menu Toggle */}
          <div className="flex items-center gap-x-4">
            {/* Desktop CTA Button */}
            <a
              onClick={setForm}
              className="hidden rounded-full bg-white px-3 py-2 text-base font-semibold text-black text-[16px] transition-colors hover:bg-gray-200 md:block"
            >
              Book a demo
            </a>
            
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={toggleMobileMenu}
              className="rounded-md p-2 text-white transition-colors hover:bg-gray-800 md:hidden"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
        {/* This section is rendered conditionally based on state */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 top-full w-full bg-black shadow-lg md:hidden">
            <div className="flex flex-col space-y-4 px-6 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-base font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  {link.text}
                </a>
              ))}
              <a
                onClick={setForm}
                className="block w-full rounded-full bg-white px-7 py-3 text-center text-base font-semibold text-black transition-colors hover:bg-gray-200"
              >
                Book a demo
              </a>
            </div>
          </div>
        )}
      </nav>

    
     
    </div>
  );
}
