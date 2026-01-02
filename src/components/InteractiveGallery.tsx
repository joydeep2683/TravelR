import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
    src: string;
    caption?: string;
    alt?: string;
}

interface InteractiveGalleryProps {
    images: GalleryImage[];
}

export default function InteractiveGallery({ images }: InteractiveGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    if (!images || images.length === 0) return null;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (selectedImage === null) return;

        if (e.key === 'Escape') setSelectedImage(null);
        if (e.key === 'ArrowRight') setSelectedImage((selectedImage + 1) % images.length);
        if (e.key === 'ArrowLeft') setSelectedImage((selectedImage - 1 + images.length) % images.length);
    };

    React.useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

    return (
        <>
            {/* Grid Layout */}
            <div className="columns-1 md:columns-2 gap-4 space-y-4">
                {images.map((img, index) => (
                    <motion.div
                        key={index}
                        layoutId={`image-${index}`}
                        className="break-inside-avoid rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer relative group"
                        onClick={() => setSelectedImage(index)}
                    >
                        <img
                            src={img.src}
                            alt={img.alt || img.caption || 'Gallery Image'}
                            className="w-full h-auto block"
                            loading="lazy"
                        />
                        {img.caption && (
                            <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-sm font-medium truncate">{img.caption}</p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-50"
                                onClick={() => setSelectedImage(null)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Main Image */}
                            <motion.img
                                layoutId={`image-${selectedImage}`}
                                src={images[selectedImage].src}
                                alt={images[selectedImage].alt || images[selectedImage].caption}
                                className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
                            />

                            {/* Caption Bar */}
                            {images[selectedImage].caption && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-6 text-center"
                                >
                                    <p className="text-white text-lg font-medium">{images[selectedImage].caption}</p>
                                </motion.div>
                            )}

                            {/* Navigation Arrows (Optional visual enhancement) */}
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 hidden md:block"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage((selectedImage - 1 + images.length) % images.length);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-2 hidden md:block"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage((selectedImage + 1) % images.length);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
