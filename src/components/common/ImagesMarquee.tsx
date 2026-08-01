"use client";
import Marquee from "react-fast-marquee";

interface MarqueeProps {
    images: string[];
    speed?: number;
    altPrefix?: string;
}

export default function ImageMarquee({
    images,
    speed = 30,
    altPrefix = "โลโก้แบรนด์แอร์ที่ให้บริการ",
}: MarqueeProps) {
    return (
        <Marquee
            speed={speed}
            gradient={false}
            className="gap-20"
        >
            {images.map((src, i) => (
                <img
                    key={i}
                    src={`./logo/${src}`}
                    alt={`${altPrefix} ${i + 1}`}
                    width={160}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className={`
                        h-[40px] w-auto mr-[80px]
                        max-[600px]:h-[30px]
                        max-[400px]:h-[20px]
                    `}
                />
            ))}
        </Marquee>
    );
}
