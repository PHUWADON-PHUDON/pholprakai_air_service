"use client";
import Marquee from "react-fast-marquee";

interface MarqueeProps {
    images: string[];
    speed?: number;
}

export default function ImageMarquee({ images, speed = 30 }: MarqueeProps) {
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
                    alt=""
                    className={`
                        h-[40px] mr-[80px]
                        max-[600px]:h-[30px]
                        max-[400px]:h-[20px]
                    `}
                />
            ))}
        </Marquee>
    );
}