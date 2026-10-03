"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTikTokEmbed } from "@/features/video/service";

type Platform = "youtube" | "facebook" | "tiktok" | "unknown";

function detectPlatform(url: string): Platform {
    if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
    if (/facebook\.com|fb\.watch/.test(url)) return "facebook";
    if (/tiktok\.com/.test(url)) return "tiktok";
    return "unknown";
}

function getYoutubeId(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
}

interface VideoMasonryGridProps {
    urls: string[];
}

export default function VideoEmbedUrl({ urls }: VideoMasonryGridProps) {
    return (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-3">
            {urls.map((url, i) => (
                <div key={i} className="mb-3 break-inside-avoid">
                    <VideoEmbed url={url} />
                </div>
            ))}
        </div>
    );
}

export function VideoEmbed({
    url,
    onInteract,
    resetOnExit = true,
}: {
    url: string;
    onInteract?: () => void;
    resetOnExit?: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const interactedRef = useRef(false);
    const [resetKey, setResetKey] = useState(0);
    const platform = detectPlatform(url);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !resetOnExit) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting && interactedRef.current) {
                    interactedRef.current = false;
                    setResetKey((key) => key + 1);
                }
            },
            { threshold: 0.1 },
        );
        observer.observe(container);
        return () => observer.disconnect();
    }, [resetOnExit]);

    const handleInteract = () => {
        interactedRef.current = true;
        onInteract?.();
    };

    useEffect(() => {
        const handleWindowBlur = () => {
            if (containerRef.current?.contains(document.activeElement)) handleInteract();
        };
        window.addEventListener("blur", handleWindowBlur);
        return () => window.removeEventListener("blur", handleWindowBlur);
    }, [onInteract]);

    let content = null;
    if (platform === "youtube") content = <YoutubeEmbed key={resetKey} url={url} />;
    else if (platform === "facebook") content = <FacebookEmbed key={resetKey} url={url} />;
    else if (platform === "tiktok") content = <TikTokEmbed key={resetKey} url={url} />;
    else content = <div className="flex aspect-video items-center justify-center bg-white/5 text-sm">ไม่รองรับลิงก์นี้</div>;

    return <div ref={containerRef} className="w-full">{content}</div>;
}

function YoutubeEmbed({ url }: { url: string }) {
    const id = getYoutubeId(url);

    if (!id) {
        return (
            <div className="w-full aspect-video flex items-center justify-center bg-white/5 rounded-[12px]">
                <p className="text-white/50 text-sm">ลิงก์ YouTube ไม่ถูกต้อง</p>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video">
            <iframe
                src={`https://www.youtube.com/embed/${id}`}
                className="absolute inset-0 w-full h-full rounded-[12px]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title="YouTube video"
            />
        </div>
    );
}

function FacebookEmbed({ url }: { url: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const measure = () => {
            const width = Math.round(container.clientWidth);
            const height = Math.round(container.clientHeight);
            if (!width || !height) return;
            setSize((previous) => previous?.width === width && previous.height === height
                ? previous
                : { width, height });
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full aspect-video">
            {/* Facebook needs the player dimensions, not just the iframe's CSS size. */}
            {size && <iframe
                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=${size.width}&height=${size.height}`}
                width={size.width}
                height={size.height}
                className="absolute inset-0 w-full h-full rounded-[12px]"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                loading="eager"
                title="Facebook video"
            />}
        </div>
    );
}

function TikTokEmbed({ url }: { url: string }) {
    const { data: html, isError } = useQuery({
        queryKey: ["tiktok-oembed", url],
        queryFn: () => getTikTokEmbed(url),
        staleTime: Infinity,
        retry: false,
    });

    useEffect(() => {
        if (!html) return;

        const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');

        if (existingScript) {
            const win = window as any;
            if (win.tiktokEmbed?.lib?.render) {
                win.tiktokEmbed.lib.render();
            }
            return;
        }

        const script = document.createElement("script");
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
    }, [html]);

    if (isError) {
        return (
            <div className="w-full aspect-[9/16] flex items-center justify-center bg-white/5 rounded-[12px]">
                <p className="text-white/50 text-sm">โหลดวิดีโอ TikTok ไม่สำเร็จ</p>
            </div>
        );
    }

    if (!html) {
        return (
            <div className="w-full aspect-[9/16] flex items-center justify-center bg-white/5 rounded-[12px]">
                <p className="text-white/50 text-sm">กำลังโหลด...</p>
            </div>
        );
    }

    return <div className="w-full" dangerouslySetInnerHTML={{ __html: html }} />;
}
