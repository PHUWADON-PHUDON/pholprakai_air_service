"use client";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";

interface ImageSliderProps {
    images: string[];
    autoPlayDelay?: number;
    altPrefix?: string;
}

const THUMBNAIL_COUNT = 4;

export default function ImageSlider({
    images,
    autoPlayDelay = 3000,
    altPrefix = "ผลงานบริการแอร์ พลประกาย แอร์ เซอร์วิส ชลบุรี",
}: ImageSliderProps) {
    const galleryRef = useRef<any>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [thumbnailStart, setThumbnailStart] = useState(0);

    const goToSlide = (index: number) => {
        galleryRef.current?.slideToIndex(index);
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (currentIndex < thumbnailStart) {
            setThumbnailStart(currentIndex);
        } else if (
            currentIndex >=
            thumbnailStart + THUMBNAIL_COUNT
        ) {
            setThumbnailStart(
                currentIndex - THUMBNAIL_COUNT + 1
            );
        }
    }, [currentIndex, thumbnailStart]);

    const thumbnailPrev = () => {
        setThumbnailStart((prev) =>
            Math.max(0, prev - 1)
        );
    };

    const thumbnailNext = () => {
        const maxStart = Math.max(
            0,
            images.length - THUMBNAIL_COUNT
        );

        setThumbnailStart((prev) =>
            Math.min(maxStart, prev + 1)
        );
    };

    if (images.length === 0) {
        return null;
    }

    const thumbnails = images.slice(
        thumbnailStart,
        thumbnailStart + THUMBNAIL_COUNT
    );

    const leftNavClass =
        "absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer disabled:opacity-30";

    const rightNavClass =
        "absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer disabled:opacity-30";

    return (
        <div className="relative w-full overflow-hidden">
            <div className="rounded-[4px] overflow-hidden">
                <ImageGallery
                    ref={galleryRef}
                    items={images.map((src, index) => ({
                        original: `/activity/${src}`,
                        originalAlt: `${altPrefix} รูปที่ ${index + 1}`,
                    }))}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    showThumbnails={false}
                    autoPlay
                    slideInterval={autoPlayDelay}
                    onBeforeSlide={(index) => {
                        setCurrentIndex(index);
                    }}
                    renderItem={(item) => (
                        <div className="w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] flex items-center justify-center">
                            <img
                                src={item.original}
                                alt={
                                    item.originalAlt ||
                                    altPrefix
                                }
                                loading="lazy"
                                decoding="async"
                                className="rounded-[4px] object-cover h-full"
                            />
                        </div>
                    )}
                    renderLeftNav={(onClick, disabled) => (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={onClick}
                            className={leftNavClass}
                        >
                            ‹
                        </button>
                    )}
                    renderRightNav={(onClick, disabled) => (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={onClick}
                            className={rightNavClass}
                        >
                            ›
                        </button>
                    )}
                />
            </div>

            <div className="relative w-full py-3">

                {/* Previous */}

                {/* {thumbnailStart > 0 && (
                    <button
                        type="button"
                        onClick={thumbnailPrev}
                        aria-label="Thumbnail ก่อนหน้า"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg transition cursor-pointer"
                    >
                        ‹
                    </button>
                )} */}

                {/* Thumbnail */}

                <div
                    className="overflow-hidden w-full"
                    style={{
                        "--thumbnail-width":
                            "calc((100% - 24px) / 4)",
                    } as React.CSSProperties}
                >
                    <div
                        className="flex gap-2 transition-transform duration-300 ease-in-out"
                        style={{
                            transform: `translateX(calc(-${thumbnailStart} * (var(--thumbnail-width) + 8px)))`,
                        }}
                    >
                        {images.map((src, index) => {
                            const isActive =
                                index === currentIndex;

                            return (
                                <button
                                    key={`${src}-${index}`}
                                    type="button"
                                    onClick={() =>
                                        goToSlide(index)
                                    }
                                    className={`
                                        relative
                                        shrink-0
                                        aspect-[4/3]
                                        overflow-hidden
                                        rounded-[4px]
                                        cursor-pointer
                                        transition-all
                                        duration-300
                                        ${
                                            isActive
                                                ? "ring-2 ring-white"
                                                : "opacity-60 hover:opacity-100"
                                        }
                                    `}
                                    style={{
                                        width:
                                            "var(--thumbnail-width)",
                                    }}
                                >
                                    <img
                                        src={`/activity/${src}`}
                                        alt={`${altPrefix} thumbnail ${
                                            index + 1
                                        }`}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />

                                    {isActive && (
                                        <span className="absolute inset-0 bg-white/10" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Next */}

                {/* {thumbnailStart <
                    images.length -
                        THUMBNAIL_COUNT && (
                    <button
                        type="button"
                        onClick={thumbnailNext}
                        aria-label="Thumbnail ถัดไป"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg transition cursor-pointer"
                    >
                        ›
                    </button>
                )} */}
            </div>
        </div>
    );
}