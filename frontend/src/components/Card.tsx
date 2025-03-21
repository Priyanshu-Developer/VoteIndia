"use client"
import React from 'react'
import Image from 'next/image';

interface Props{
    children: React.ReactNode;
}

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6">
      <div className="relative z-10 bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md text-center border-white border-[2px]">
        <div>
            {children}
        </div>
        </div>
        <footer className="absolute bottom-4 text-[#000080] text-xs sm:text-sm">Made with 🇮🇳 in India</footer>
    </div>
  )
}

export default Card
