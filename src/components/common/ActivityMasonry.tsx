"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

type MasonryGalleryProps = {
    images: string[];
    showAll?: boolean;
    previewCountDesktop?: number;
    previewCountMobile?: number;
    gap?: number;
    onImageClick?: (index: number) => void;
    altPrefix?: string;
};

type ImageInfo = {
    src: string;
    index: number;
    width: number;
    height: number;
};

type Column = ImageInfo[];

export default function MasonryGallery({
    images,
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
                                    src,
                                    index,
                                    width: img.naturalWidth,
                                    height: img.naturalHeight,
                                });
                            };

                            img.onerror = () => {
                                resolve({
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

    const visibleImages = useMemo(() => {
        if (showAll) {
            return imageInfo;
        }

        const count =
            columnCount >= 4
                ? previewCountDesktop
                : previewCountMobile;

        return imageInfo.slice(0, count);
    }, [
        imageInfo,
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

        if (!visibleImages.length) {
            return result;
        }

        const columnHeights = Array(
            columnCount
        ).fill(0);

        for (const image of visibleImages) {
            const ratio =
                image.height / image.width;

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

            result[shortestColumn].push(image);

            columnHeights[shortestColumn] +=
                ratio;
        }

        return result;
    }, [visibleImages, columnCount]);

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
                        {column.map((image) => (
                            <img
                                key={`${image.src}-${image.index}`}
                                src={`/activity/${image.src}`}
                                alt={`${altPrefix} รูปที่ ${
                                    image.index + 1
                                }`}
                                width={image.width}
                                height={image.height}
                                className="
                                    block
                                    w-full
                                    h-auto
                                    rounded-[8px]
                                    cursor-pointer
                                    hover:opacity-90
                                    transition-opacity
                                "
                                loading="lazy"
                                decoding="async"
                                onClick={() =>
                                    onImageClick?.(
                                        image.index
                                    )
                                }
                            />
                        ))}
                    </div>
                )
            )}
        </div>
    );
}