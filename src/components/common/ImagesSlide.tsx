"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface ImageSliderProps {
    images: string[];
    autoPlayDelay?: number;
}

export default function ImageSlider({ images, autoPlayDelay = 3000 }: ImageSliderProps) {
    const len = images.length;
    const [index, setIndex] = useState(0); // index จริงของรูปที่กำลังแสดง (0..len-1)
    const [pos, setPos] = useState(1); // ตำแหน่งใน window 3 ช่อง: 0=prev,1=current,2=next
    const [withTransition, setWithTransition] = useState(true);
    const isBusyRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const prevIdx = (index - 1 + len) % len;
    const nextIdx = (index + 1) % len;
    const windowSlides = [images[prevIdx], images[index], images[nextIdx]];

    const goToNext = useCallback(() => {
        if (isBusyRef.current || len <= 1) return;
        isBusyRef.current = true;
        setWithTransition(true);
        setPos(2);
    }, [len]);

    const goToPrev = useCallback(() => {
        if (isBusyRef.current || len <= 1) return;
        isBusyRef.current = true;
        setWithTransition(true);
        setPos(0);
    }, [len]);

    const goToSlide = useCallback(
        (target: number) => {
            if (isBusyRef.current || target === index) return;
            isBusyRef.current = true;
            // จุดที่ไม่ใช่ prev/next ที่ติดกัน -> สลับแบบไม่มี transition (ตัดฉาก)
            setWithTransition(false);
            setIndex(target);
            setPos(1);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setWithTransition(true);
                    isBusyRef.current = false;
                });
            });
        },
        [index]
    );

    const handleTransitionEnd = () => {
        if (pos === 2) {
            // เลื่อนไป next เสร็จแล้ว -> เปลี่ยน index จริง แล้ว snap window กลับตำแหน่งกลางแบบไม่มี transition
            setWithTransition(false);
            setIndex(nextIdx);
            setPos(1);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setWithTransition(true);
                    isBusyRef.current = false;
                });
            });
        } else if (pos === 0) {
            setWithTransition(false);
            setIndex(prevIdx);
            setPos(1);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setWithTransition(true);
                    isBusyRef.current = false;
                });
            });
        }
    };

    // auto slide
    useEffect(() => {
        resetTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            goToNext();
        }, autoPlayDelay);
    };

    if (len === 0) return null;

    return (
        <div className="relative w-full aspect-video max-h-[500px] overflow-hidden rounded-[12px]">
            <div
                onTransitionEnd={handleTransitionEnd}
                className={`flex h-full ${withTransition ? "transition-transform duration-700 ease-in-out" : ""}`}
                style={{ transform: `translateX(-${pos * 100}%)` }}
            >
                {windowSlides.map((src, i) => (
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
                            i === index ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}