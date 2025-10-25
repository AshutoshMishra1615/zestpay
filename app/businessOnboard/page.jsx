"use client"
import React from "react"
import Navbar from "@/components/business/Navbar"
import Form from "@/components/business/Form"
import Image from "next/image"
import Features from "@/components/business/Features"

export default function BusinessOnboard() {
  return (
    <div className="font-sans">
      {/* Navbar */}
      <Navbar />
      <Form />

      {/* Hero Section */}
      <section className="relative w-full h-[calc(100vh-88px)] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/businessPage.png" // make sure this is in your /public folder
            alt="Business background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Overlay (for contrast) */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Text Content */}
        <div className="relative z-10 px-6">
          <h1 className="mb-6 max-w-4xl text-5xl font-bold md:text-7xl mx-auto">
            Financial benefits for everyday empowerment
          </h1>

          <p className="mb-10 max-w-2xl text-lg md:text-xl mx-auto">
           Go beyond PF and Gratuity. Offer Instant Salary Advance and simple financial wellness solutions that help employees reduce financial stress and build security—starting today.
          </p>

          <a
            href="#"
            className="rounded-full bg-yellow-400 px-10 py-4 text-lg font-bold text-black transition hover:bg-yellow-300"
          >
            Book a demo
          </a>
        </div>
      </section>
      <Features />
      {/* Additional Content Section */}
    
    </div>
  )
}
