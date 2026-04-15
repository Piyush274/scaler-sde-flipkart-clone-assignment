import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ images, title }: { images: string[]; title: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {/* Thumbnails */}
      <div className="order-2 flex gap-2 md:order-1 md:flex-col">
        {images.map((img, i) => (
          <button
            key={i}
            onMouseEnter={() => setActiveIndex(i)}
            onClick={() => setActiveIndex(i)}
            className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded border-2 p-1 ${
              activeIndex === i ? 'border-primary' : 'border-border'
            }`}
          >
            <img src={img} alt={`${title} ${i + 1}`} className="h-full w-full object-contain" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative order-1 flex flex-1 items-center justify-center rounded border border-border bg-card p-4 md:order-2">
        <img
          src={images[activeIndex]}
          alt={title}
          className="max-h-[350px] w-auto object-contain md:max-h-[450px]"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
              className="absolute left-1 rounded-full bg-card p-1 shadow"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              className="absolute right-1 rounded-full bg-card p-1 shadow"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
