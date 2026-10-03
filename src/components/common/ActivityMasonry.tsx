"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { VideoEmbed } from "./VideoEmbedUrl";

type MasonryGalleryProps = {
    images: string[];
    videos?: string[];
    showAll?: boolean;
    previewCountDesktop?: number;
    previewCountMobile?: number;
    gap?: number;
    onImageClick?: (index: number) => void;
    altPrefix?: string;
};

type ImageInfo = {
    type: "image";
    src: string;
    index: number;
    width: number;
    height: number;
};

type VideoInfo = { type: "video"; url: string; index: number };
type ActivityItem = ImageInfo | VideoInfo;
type Column = ActivityItem[];

export default function MasonryGallery({
    images,
    videos = [],
    showAll = true,
    previewCountDesktop = 8,
    previewCountMobile = 4,
    gap = 12,
    onImageClick,
    altPrefix = "รูปภาพ",
}: MasonryGalleryProps) {
    const [columnCount, setColumnCount] = useState(1);
    const [imageInfo, setImageInfo] = useState<ImageInfo[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const getColumnCount = useCallback((width: number) => {
        if (width >= 1024) return 4;
        if (width >= 768) return 3;
        if (width >= 640) return 2;

        return 1;
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setColumnCount(
                getColumnCount(window.innerWidth)
            );
        };

        handleResize();

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, [getColumnCount]);

    useEffect(() => {
        let cancelled = false;

        const loadImages = async () => {
            setIsLoaded(false);

            const result = await Promise.all(
                images.map(
                    (src, index) =>
                        new Promise<ImageInfo>((resolve) => {
                            const img = new Image();

                            img.onload = () => {
                                resolve({
                                    type: "image",
                                    src,
                                    index,
                                    width: img.naturalWidth,
                                    height: img.naturalHeight,
                                });
                            };

                            img.onerror = () => {
                                resolve({
                                    type: "image",
                                    src,
                                    index,
                                    width: 1,
                                    height: 1,
                                });
                            };

                            img.src = `/activity/${src}`;
                        })
                )
            );

            if (!cancelled) {
                setImageInfo(result);
                setIsLoaded(true);
            }
        };

        loadImages();

        return () => {
            cancelled = true;
        };
    }, [images]);

    const visibleItems = useMemo(() => {
        const items: ActivityItem[] = [
            ...imageInfo.slice(0, 3),
            ...videos.map((url, index) => ({ type: "video" as const, url, index })),
            ...imageInfo.slice(3),
        ];

        if (showAll) {
            return items;
        }

        const count =
            columnCount >= 4
                ? previewCountDesktop
                : previewCountMobile;

        return items.slice(0, count);
    }, [
        imageInfo,
        videos,
        showAll,
        columnCount,
        previewCountDesktop,
        previewCountMobile,
    ]);

    const columns = useMemo<Column[]>(() => {
        const result: Column[] = Array.from(
            { length: columnCount },
            () => []
        );

        if (!visibleItems.length) {
            return result;
        }

        const columnHeights = Array(
            columnCount
        ).fill(0);

        for (const item of visibleItems) {
            const ratio = item.type === "image" ? item.height / item.width : 9 / 16;

            let shortestColumn = 0;

            for (
                let i = 1;
                i < columnCount;
                i++
            ) {
                if (
                    columnHeights[i] <
                    columnHeights[shortestColumn]
                ) {
                    shortestColumn = i;
                }
            }

            result[shortestColumn].push(item);

            columnHeights[shortestColumn] +=
                ratio;
        }

        return result;
    }, [visibleItems, columnCount]);

    if (!isLoaded) {
        return (
            <div className="w-full">
                <div className="flex gap-3">
                    {Array.from({
                        length: columnCount,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="flex-1"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex w-full"
            style={{
                gap: `${gap}px`,
            }}
        >
            {columns.map(
                (column, columnIndex) => (
                    <div
                        key={columnIndex}
                        className="flex min-w-0 flex-1 flex-col"
                        style={{
                            gap: `${gap}px`,
                        }}
                    >
                        {column.map((item) => item.type === "video" ? (
                            <div key={`video-${item.index}`} className="overflow-hidden rounded-[8px]">
                                <VideoEmbed url={item.url} />
                            </div>
                        ) : (
                            <img
                                key={`${item.src}-${item.index}`}
                                src={`/activity/${item.src}`}
                                alt={`${altPrefix} รูปที่ ${item.index + 1}`}
                                width={item.width}
                                height={item.height}
                                className="block h-auto w-full cursor-pointer rounded-[8px] transition-opacity hover:opacity-90"
                                loading="lazy"
                                decoding="async"
                                onClick={() => onImageClick?.(item.index)}
                            />
                        ))}
                    </div>
                )
            )}
        </div>
    );
}
