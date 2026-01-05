import React, { useState, useEffect, useRef } from 'react';

interface AudioGuideProps {
    audioSources: Record<string, string>;
    title?: string;
}

const LANGUAGES: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    mr: 'Marathi',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    ja: 'Japanese',
    zh: 'Chinese',
};

export default function AudioGuide({ audioSources, title = "Audio Guide" }: AudioGuideProps) {
    // Get available languages from the sources provided
    const availableLangs = Object.keys(audioSources);

    if (availableLangs.length === 0) return null;

    const [currentLang, setCurrentLang] = useState(availableLangs[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasError, setHasError] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Reset error when language changes
    useEffect(() => {
        setHasError(false);
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [currentLang]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        setHasError(false);

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((err) => {
                console.error("Playback error:", err);
                setHasError(true);
                setIsPlaying(false);
            });
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={`border rounded-xl p-4 mb-8 shadow-sm transition-colors ${hasError ? 'bg-red-50 border-red-200' : 'bg-stone-50 border-stone-200'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Header & Language Select */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className={`p-2 rounded-full ${hasError ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {hasError ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wide">Audio Guide</h3>
                        <p className={`text-xs ${hasError ? 'text-red-500 font-medium' : 'text-stone-500'}`}>
                            {hasError ? 'Playback issue - Check sharing settings' : 'Listen to the story'}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {/* Language Dropdown */}
                    <select
                        value={currentLang}
                        onChange={(e) => setCurrentLang(e.target.value)}
                        className="bg-white border border-stone-300 text-stone-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 outline-none cursor-pointer"
                    >
                        {availableLangs.map(langCode => (
                            <option key={langCode} value={langCode}>
                                {LANGUAGES[langCode] || langCode.toUpperCase()}
                            </option>
                        ))}
                    </select>

                    {/* Audio Element Hidden */}
                    <audio
                        ref={audioRef}
                        src={audioSources[currentLang]}
                        onEnded={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onError={() => setHasError(true)}
                        className="hidden"
                        preload="metadata"
                    />

                    {/* Custom Play Button */}
                    <button
                        onClick={togglePlay}
                        className={`text-white rounded-full p-3 transition-colors shadow-md flex-shrink-0 ${hasError ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pl-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message Fallback */}
            {hasError && (
                <div className="mt-4 p-3 bg-white/50 rounded-lg text-xs text-red-700 leading-relaxed border border-red-100">
                    <p><strong>Note:</strong> Browsers often block Google Drive audio due to strict security.
                        If it doesn't play, please ensure the file is shared as "Anyone with the link" or try using a direct MP3 link from another hosting service like Cloudinary.</p>
                </div>
            )}

            {/* Mini Progress Bar Visual (Optional - simplicity for now) */}
            {isPlaying && (
                <div className="mt-3 w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden animate-pulse">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-full origin-left animate-[progress_2s_ease-in-out_infinite]" />
                </div>
            )}
        </div>
    );
}
