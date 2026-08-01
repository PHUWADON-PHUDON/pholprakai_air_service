export default function ImagesActivity({ images }: { images: string[] }) {
    return (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3">
            {images.map((src, i) => (
                <img
                    key={i}
                    src={`./activity/${src}`}
                    alt={`ภาพผลงานล้างแอร์และติดตั้งแอร์ในชลบุรี รูปที่ ${i + 1}`}
                    width={600}
                    height={800}
                    className="w-full rounded-[8px] mb-3 block hover:opacity-90 transition-opacity cursor-pointer"
                    loading="lazy"
                    decoding="async"
                />
            ))}
        </div>
    );
}
