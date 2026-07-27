"use client";
import { useEffect, useState } from "react";

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

function VideoEmbed({ url }: { url: string }) {
    const platform = detectPlatform(url);

    if (platform === "youtube") return <YoutubeEmbed url={url} />;
    if (platform === "facebook") return <FacebookEmbed url={url} />;
    if (platform === "tiktok") return <TikTokEmbed url={url} />;

    return (
        <div className="w-full aspect-video flex items-center justify-center bg-white/5 rounded-[12px]">
            <p className="text-white/50 text-sm">ไม่รองรับลิงก์นี้</p>
        </div>
    );
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
                title="YouTube video"
            />
        </div>
    );
}

function FacebookEmbed({ url }: { url: string }) {
    return (
        <div className="relative w-full aspect-video">
            <iframe
                src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=false`}
                className="absolute inset-0 w-full h-full rounded-[12px]"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                title="Facebook video"
            />
        </div>
    );
}

function TikTokEmbed({ url }: { url: string }) {
    const [html, setHtml] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setHtml(null);
        setError(false);

        fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`)
            .then((res) => {
                if (!res.ok) throw new Error("oEmbed fetch failed");
                return res.json();
            })
            .then((data) => {
                if (!cancelled) setHtml(data.html);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

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

    if (error) {
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