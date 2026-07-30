"use client";
import { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";

interface ImageSliderProps {
    images: string[];
    autoPlayDelay?: number;
}

export default function ImageSlider({ images, autoPlayDelay = 3000 }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="relative rounded-[12px] overflow-hidden">
            <ImageGallery
                items={images.map((src) => ({ original: `/slide_images/${src}` }))}
                showPlayButton={false}
                showFullscreenButton={false}
                onBeforeSlide={(index) => setCurrentIndex(index)}
                autoPlay
                slideInterval={autoPlayDelay}
                renderItem={(item) => (
                    <img
                        src={item.original}
                        className="w-full object-cover"
                    />
                )}
                renderLeftNav={(onClick, disabled) => (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onClick}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer"
                    >
                        ‹
                    </button>
                )}
                renderRightNav={(onClick, disabled) => (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={onClick}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer"
                    >
                        ›
                    </button>
                )}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                            i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}