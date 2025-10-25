
"use client";
import React, { useState } from 'react';
// Import the icons for the hamburger menu
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';

// Data for navigation links
const navLinks = [
  { name: 'For Individuals', href: '' },
  { name: 'For Businesses', href: '' },
  { name: 'Who We Are', href: '' },
  { name: 'Impact', href: '' },
];

const Navbar = () => {
  // State to manage mobile menu open/close
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-black font-sans shadow-sm">
      <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="shrink-0">
            <a href="#" className="flex items-center justify-center bg-black text-white w-28 py-3 rounded-full font-bold text-lg">
              {/* The text is reversed in the image, you can use CSS 'transform: scaleX(-1)' or an SVG */}
              <span>zest<span className='text-yellow-300'>pay</span></span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-black hover:text-gray-700 text-base font-semibold"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Login/Sign up Button */}
          <div className="hidden md:block">
            
             <Link href="/login" className='bg-black text-white py-3 px-6 rounded-full text-base font-semibold hover:bg-gray-800 transition-colors'>
              Login / Sign up
            </Link>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {/* This section is shown/hidden based on the 'isOpen' state */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
      >
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block rounded-md px-3 py-2 text-base font-semibold text-black hover:bg-gray-100"
            >
              {link.name}
            </a>
          ))}
          {/* Mobile Login Button */}
         <Link href="/login"> 
           
            className="block w-full text-left rounded-md px-3 py-3 text-base font-semibold text-white bg-black hover:bg-gray-800"
          
            Login / Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;