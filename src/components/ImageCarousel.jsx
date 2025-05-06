"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ImageCarousel({ images, className = "" }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // If no images or empty array, show placeholder
    if (!images || images.length === 0) {
        return (
            <div className={`relative w-full h-48 bg-gray-200 ${className}`}>
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">No images available</div>
            </div>
        )
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
    }

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1
        const newIndex = isLastSlide ? 0 : currentIndex + 1
        setCurrentIndex(newIndex)
    }

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex)
    }

    return (
        <div className={`relative w-full h-full ${className}`}>
            {/* Main Image */}
            <div className="relative w-full h-full overflow-hidden">
                <img
                    src={images[currentIndex] || "/placeholder.svg"}
                    alt={`Car image ${currentIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-500"
                />
            </div>

            {/* Navigation Arrows - only show if there are multiple images */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 focus:outline-none"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 focus:outline-none"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Dots Indicator - only show if there are multiple images */}
            {images.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                    {images.map((_, slideIndex) => (
                        <button
                            key={slideIndex}
                            onClick={() => goToSlide(slideIndex)}
                            className={`w-2 h-2 rounded-full focus:outline-none ${slideIndex === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
                                }`}
                            aria-label={`Go to image ${slideIndex + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
