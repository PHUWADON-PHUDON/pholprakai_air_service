"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface ImageSliderProps {
    images: string[];
    autoPlayDelay?: number;
}

export default function ImageSlider({ images, autoPlayDelay = 3000 }: ImageSliderProps) {
    // เพิ่ม clone รูปแรกไปต่อท้าย
    const slides = [...images, images[0]];
    const [current, setCurrent] = useState(0);
    const [withTransition, setWithTransition] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const goToNext = useCallback(() => {
        setCurrent((prev) => prev + 1);
    }, []);

    const goToPrev = useCallback(() => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToSlide = useCallback((index: number) => {
        setWithTransition(true);
        setCurrent(index);
    }, []);

    // auto slide
    useEffect(() => {
        resetTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [current]);

    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            goToNext();
        }, autoPlayDelay);
    };

    // พอเลื่อนไปถึง clone (index สุดท้าย) ให้สลับกลับไปรูปแรกแบบไม่มี transition
    useEffect(() => {
        if (current === slides.length - 1) {
            const timeout = setTimeout(() => {
                setWithTransition(false);
                setCurrent(0);
            }, 700); // ต้องเท่ากับ duration ของ transition (700ms)
            return () => clearTimeout(timeout);
        }
    }, [current, slides.length]);

    // เปิด transition กลับมาใหม่หลังจาก jump แบบไม่มี transition เสร็จแล้ว
    useEffect(() => {
        if (!withTransition) {
            const raf = requestAnimationFrame(() => setWithTransition(true));
            return () => cancelAnimationFrame(raf);
        }
    }, [withTransition]);

    if (images.length === 0) return null;

    return (
        <div className="relative w-full aspect-video max-h-[500px] overflow-hidden rounded-[12px]">
            <div
                className={`flex h-full ${withTransition ? "transition-transform duration-700 ease-in-out" : ""}`}
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {slides.map((src, i) => (
                    <img
                        key={i}
                        src={`./slide_images/${src}`}
                        alt=""
                        className="w-full h-full flex-shrink-0"
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={goToPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer"
                aria-label="Previous slide"
            >
                ‹
            </button>

            <button
                type="button"
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer"
                aria-label="Next slide"
            >
                ›
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => goToSlide(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                            i === current % images.length ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}