"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import { VideoEmbed } from "./VideoEmbedUrl";
import "react-image-gallery/styles/image-gallery.css";
import ChevronRight from "../icons/ChevronRight";
import ChevronLeft from "../icons/ChevronLeft";

interface ImageSliderProps {
    images: string[];
    videos?: string[];
    autoPlayDelay?: number;
    altPrefix?: string;
}

const THUMBNAIL_COUNT = 4;

export default function ImageSlider({
    images,
    videos = [],
    autoPlayDelay = 3000,
    altPrefix = "ผลงานบริการแอร์ พลประกาย แอร์ เซอร์วิส ชลบุรี",
}: ImageSliderProps) {
    const galleryRef = useRef<any>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const watchingVideoRef = useRef(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [thumbnailStart, setThumbnailStart] = useState(0);
    const [watchingVideo, setWatchingVideo] = useState(false);
    const [videoResetKey, setVideoResetKey] = useState(0);

    const stopWatching = () => {
        if (!watchingVideoRef.current) return;
        watchingVideoRef.current = false;
        setWatchingVideo(false);
        setVideoResetKey((key) => key + 1);
    };

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting && watchingVideoRef.current) {
                    watchingVideoRef.current = false;
                    setWatchingVideo(false);
                    setVideoResetKey((key) => key + 1);
                }
            },
            { threshold: 0.1 },
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    const goToSlide = (index: number) => {
        if (index === currentIndex) return;
        stopWatching();
        galleryRef.current?.slideToIndex(index);
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

    const media = useMemo(() => [
        ...images.slice(0, 3).map((src, index) => ({ type: "image" as const, src, index })),
        ...videos.map((url, index) => ({ type: "video" as const, url, index })),
        ...images.slice(3).map((src, index) => ({ type: "image" as const, src, index: index + 3 })),
    ], [images, videos]);
    const galleryItems = useMemo(() => media.map((item) => ({
        original: item.type === "image" ? `/activity/${item.src}` : item.url,
        originalAlt: item.type === "image" ? `${altPrefix} รูปที่ ${item.index + 1}` : "วิดีโอกิจกรรมการทำงาน",
    })), [media, altPrefix]);

    useEffect(() => {
        if (watchingVideo || media.length < 2) return;
        const timer = window.setTimeout(() => {
            if (watchingVideoRef.current) return;
            galleryRef.current?.slideToIndex(currentIndex + 1);
        }, autoPlayDelay);
        return () => window.clearTimeout(timer);
    }, [currentIndex, watchingVideo, media.length, autoPlayDelay]);

    const thumbnailNext = () => {
        const maxStart = Math.max(
            0,
            media.length - THUMBNAIL_COUNT
        );

        setThumbnailStart((prev) =>
            Math.min(maxStart, prev + 1)
        );
    };

    if (media.length === 0) {
        return null;
    }

    const leftNavClass =
        "absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer disabled:opacity-30";

    const rightNavClass =
        "absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer disabled:opacity-30";

    return (
        <div ref={sectionRef} className="relative w-full overflow-hidden">
            <div className="rounded-[4px] overflow-hidden">
                <ImageGallery
                    ref={galleryRef}
                    items={galleryItems}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    showThumbnails={false}
                    autoPlay={false}
                    onBeforeSlide={(index) => {
                        if (index !== currentIndex) stopWatching();
                        setCurrentIndex(index);
                    }}
                    renderItem={(item) => (
                        <div className="flex h-[350px] w-full items-center justify-center sm:h-[400px] md:h-[450px] lg:h-[500px]">
                            {videos.includes(item.original) ? (
                                <div className="w-full max-w-[500px]">
                                    <VideoEmbed
                                        key={videoResetKey}
                                        url={item.original}
                                        resetOnExit={false}
                                        onInteract={() => {
                                            watchingVideoRef.current = true;
                                            setWatchingVideo(true);
                                        }}
                                    />
                                </div>
                            ) : (
                                <img
                                    src={item.original}
                                    alt={item.originalAlt || altPrefix}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full rounded-[4px] object-cover"
                                />
                            )}
                        </div>
                    )}
                    renderLeftNav={(onClick, disabled) => (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={(event) => {
                                stopWatching();
                                onClick(event);
                            }}
                            className={leftNavClass}
                        >
                            <ChevronLeft color="white"/>
                        </button>
                    )}
                    renderRightNav={(onClick, disabled) => (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={(event) => {
                                stopWatching();
                                onClick(event);
                            }}
                            className={rightNavClass}
                        >
                            <ChevronRight color="white"/>
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
                        {media.map((item, index) => {
                            const isActive =
                                index === currentIndex;

                            return (
                                <button
                                    key={item.type === "image" ? `${item.src}-${index}` : `video-${index}`}
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
                                    {item.type === "image" ? (
                                        <img
                                            src={`/activity/${item.src}`}
                                            alt={`${altPrefix} thumbnail ${item.index + 1}`}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex h-full w-full items-center justify-center gap-1 bg-[#26323b] text-sm font-semibold text-white">
                                            <span aria-hidden="true">▶</span> วิดีโอ
                                        </span>
                                    )}

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
