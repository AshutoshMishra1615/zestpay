"use client"
import { useState, useEffect } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

const slides = [
  {
    id: 1,
    image: "/image1.png",
    title: "Save every time you get paid",
    description: "Automate your savings with intelligent financial tools",
    buttonText: "Get started",
    buttonLink: "#",
  },
  {
    id: 2,
    image: "/image2.jpg",
    title: "Stress less about low bank balance",
    description: "Stress less about low bank balance",
    buttonText: "Learn More",
    buttonLink: "#",
  },
]

const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
  }

  useEffect(() => {
    if (!isAutoPlay) {
      const timer = setTimeout(() => setIsAutoPlay(true), 8000)
      return () => clearTimeout(timer)
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlay])

  const slide = slides[currentSlide]

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image with subtle gradient overlay */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.image})` }}>
            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/40 to-black/70"></div>
          </div>
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6 sm:px-8">
        <div className="mb-8 sm:mb-10">
          <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/60 transition-opacity duration-500">
            Premium Experience
          </span>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black leading-tight mb-6 sm:mb-8 text-balance max-w-5xl tracking-tight">
          {slide.title}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/75 mb-12 sm:mb-16 max-w-2xl leading-relaxed font-light">
          {slide.description}
        </p>

        <a
          href={slide.buttonLink}
          className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 bg-white text-black font-semibold rounded-full transition-all duration-300 hover:bg-white/90 active:scale-95 shadow-lg hover:shadow-2xl"
        >
          {slide.buttonText}
        </a>

        <div className="absolute bottom-16 sm:bottom-20 flex gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide ? "bg-white w-8 h-2.5" : "bg-white/30 w-2.5 h-2.5 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <div className="absolute top-8 right-8 z-20 text-white/50 text-xs sm:text-sm font-medium tracking-wide">
        <span className="text-white/80 font-semibold">{String(currentSlide + 1).padStart(2, "0")}</span>
        <span> / {String(slides.length).padStart(2, "0")}</span>
      </div>
    </div>
  )
}

export default ImageCarousel
