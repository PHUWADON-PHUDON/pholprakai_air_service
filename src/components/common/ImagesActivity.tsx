"use client";
import { useState, useEffect, useRef } from "react";
import ImageGallery from "react-image-gallery";
import MasonryGallery from "./ActivityMasonry";
import "react-image-gallery/styles/image-gallery.css";

interface ImageSliderProps {
    images: string[];
    autoPlayDelay?: number;
    altPrefix?: string;
}

const PREVIEW_COUNT_DESKTOP = 8;
const PREVIEW_COUNT_MOBILE = 6;

export default function ImagesActivity({
    images,
    autoPlayDelay = 3000,
    altPrefix = "ผลงานบริการแอร์ พลประกาย แอร์ เซอร์วิส ชลบุรี",
}: ImageSliderProps) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectIndex, setSelectIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const galleryRef = useRef<any>(null);

    const handleImageClick = (index: number) => {
        setSelectIndex(index);
        setIsOpenModal(true);
    };

    useEffect(() => {
        const handleResize = () => {
            const screen = window.innerWidth

            if (screen >= 640) {
                setIsOpenModal(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (isOpenModal) {
            if (galleryRef.current) {
                galleryRef.current.slideToIndex(selectIndex);
            }
        }
    },[isOpenModal, selectIndex]);

    return (
        <>
            {isOpenModal && 
                <div className="fixed left-0 top-0 z-200 bg-black/50 w-full h-full p-[20px] flex justify-center items-center">
                    <button
                        type="button"
                        onClick={() => setIsOpenModal(false)}
                        className="absolute top-[20px] right-[20px] z-10 text-text bg-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer"
                    >
                        ×
                    </button>
                    <div className="relative h-full flex flex-col justify-center items-center rounded-[4px] overflow-hidden">
                        <ImageGallery
                            ref={galleryRef}
                            items={images.map((src, index) => ({
                                original: `/activity/${src}`,
                                originalAlt: `${altPrefix} รูปที่ ${index + 1}`,
                            }))}
                            showPlayButton={false}
                            showFullscreenButton={false}
                            //onBeforeSlide={(index) => setCurrentIndex(index)}
                            slideInterval={autoPlayDelay}
                            startIndex={selectIndex}
                            renderItem={(item) => (
                                <div className="h-full flex items-center justify-center">
                                    <img
                                        src={item.original}
                                        alt={item.originalAlt || altPrefix}
                                        width={602}
                                        height={268}
                                        loading="lazy"
                                        decoding="async"
                                        className="object-cover rounded-[4px]"
                                    />
                                </div>
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
                    </div>
                </div>
            }
            <div className={`
                hidden
                max-[640]:block
            `}>
                <div>
                    <img onClick={() => handleImageClick(0)} src={`/activity/${images[0]}`} loading="lazy" decoding="async" alt={`${altPrefix} รูปที่ ${1}`} className="rounded-[4px]" />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-[8px]">
                    <img 
                        onClick={() => handleImageClick(1)}
                        src={`/activity/${images[1]}`} 
                        alt={`${altPrefix} รูปที่ ${2}`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-4/3 rounded-[4px] object-cover" 
                    />
                    <img 
                        onClick={() => handleImageClick(2)}
                        src={`/activity/${images[2]}`}
                        alt={`${altPrefix} รูปที่ ${3}`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-4/3 rounded-[4px] object-cover" 
                    />
                    <img 
                        onClick={() => handleImageClick(3)}
                        src={`/activity/${images[3]}`} 
                        alt={`${altPrefix} รูปที่ ${4}`}
                        loading="lazy"
                        decoding="async"
                        className="aspect-4/3 rounded-[4px] object-cover" 
                    />
                    <div onClick={() => handleImageClick(4)} className="border-2 flex justify-center items-center border-text/20 text-text/50 rounded-[4px] cursor-pointer">เพิ่มเติม</div>
                </div>
            </div>

            <div className={`
                max-[640px]:hidden
            `}>
                {/* <div className={`
                    columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3
                `}>
                    {images.map((src, i) => (
                        <img
                            key={i}
                            src={`/activity/${src}`}
                            alt={`ภาพผลงานล้างแอร์และติดตั้งแอร์ในชลบุรี รูปที่ ${i + 1}`}
                            width={600}
                            height={800}
                            className={`
                                w-full rounded-[8px] mb-3 block hover:opacity-90 transition-opacity cursor-pointer
                                ${!showAll && i >= PREVIEW_COUNT_DESKTOP ? "hidden" : ""}
                                ${!showAll && i >= PREVIEW_COUNT_MOBILE && i < PREVIEW_COUNT_DESKTOP ? "max-[1024px]:hidden" : ""}
                            `}
                            loading="lazy"
                            decoding="async"
                        />
                    ))}
                </div> */}
                <MasonryGallery
                    images={images}
                    showAll={showAll}
                    previewCountDesktop={PREVIEW_COUNT_DESKTOP}
                    previewCountMobile={PREVIEW_COUNT_MOBILE}
                    altPrefix="ภาพผลงานล้างแอร์และติดตั้งแอร์ในชลบุรี"
                />
                <button 
                    type="button" 
                    onClick={() => setShowAll(!showAll)}
                    className="text-center w-full mt-[30px] text-blue-1 cursor-pointer"
                >
                    {showAll ? "แสดงน้อยลง":"แสดงรูปทั้งหมด"}
                </button>
            </div>
        </>
    );
}
