"use client"
import React from 'react'
import Navbar from '@/components/business/Navbar'
import Image from 'next/image'
import Form from   '@/components/business/Form'

function businessOnboard() {
  return (
    <div className="font-sans">
      
      <Navbar />
      
      <Form/>
      <div className="relative w-full" style={{ height: 'calc(100vh - 88px)' }}> 
  
        {/* <img 
          src="/businessHomePage.png" 
          alt="Business Onboard" 
          className="absolute inset-0 h-full w-full object-cover"
        /> */}
     <Image 
  src="/image1.png" 
  alt="Business Onboard" 
  fill
  className="absolute inset-0 object-cover"
/>


        <div className="absolute inset-0 bg-black bg-opacity-40" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center text-white">
          
          <h1 className="mb-6 max-w-4xl text-5xl font-bold md:text-7xl">
            Financial benefits for everyday empowerment
          </h1>
          
          <p className="mb-10 max-w-2xl text-lg md:text-xl">
            Go beyond 401(k)s with on-demand pay and simple financial
            wellness solutions that help employees build financial freedom –
            starting today.
          </p>
          
          <a
            href="#"
            className="rounded-full bg-yellow-400 px-10 py-4 text-lg font-bold text-black transition-colors hover:bg-yellow-300"
          >
            Book a demo
          </a>
        </div>
      </div>

      {/* You can add the rest of your page content below */}
      <div className="container mx-auto p-10">
        <h2 className="text-3xl font-bold">More Content Goes Here</h2>
        <p>This is the rest of the page.</p>
      </div>
       
    </div>
  );
}

export default businessOnboard;