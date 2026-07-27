"use client";

interface MarqueeProps {
    images: string[];
    speed?: number; // วินาที ยิ่งน้อยยิ่งเร็ว
}

export default function ImageMarquee({ images, speed = 30 }: MarqueeProps) {
    return (
        <div className="relative w-full overflow-hidden">
            <div
                className="flex gap-20 w-max animate-marquee"
                style={{ animationDuration: `${speed}s` }}
            >
                {/* set แรก */}
                {images.map((src, i) => (
                    <img
                        key={`a-${i}`}
                        src={`./logo/${src}`}
                        alt=""
                        className="h-[40px] object-cover rounded-[12px] flex-shrink-0"
                    />
                ))}
                {/* set ที่สอง (clone) — ต่อท้ายให้เลื่อนวนต่อเนื่องไม่มีรอยต่อ */}
                {images.map((src, i) => (
                    <img
                        key={`b-${i}`}
                        src={`./logo/${src}`}
                        alt=""
                        className="h-[40px] object-cover rounded-[12px] flex-shrink-0"
                    />
                ))}
            </div>
        </div>
    );
}