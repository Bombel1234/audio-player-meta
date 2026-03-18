'use client';

import { Music, Play, Shuffle } from 'lucide-react';

interface ListMusicProps {
    songs: string[];
    currentIndex: number;
    onSelect: (index: number) => void;
    onClose: () => void
    isShuffle: boolean; // dodane
    toggleShuffle: () => void; // dodane
}

export default function MusicList({ songs, currentIndex, onSelect, onClose, isShuffle, toggleShuffle }: ListMusicProps) {
    return (
        // 1. Dodajemy stopPropagation, aby kliknięcie w tło nie scrollowało spodu
        <div className="fixed inset-0 z-100 flex justify-center items-center px-2 py-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">

            <div className='relative w-full max-w-md h-full max-h-[85vh] bg-black flex flex-col rounded-3xl overflow-hidden border border-white/10 shadow-2xl'>
                <button
                    className='absolute top-4 right-4 text-white'
                    onClick={onClose}
                >
                    X
                </button>
                {/* 3. Nagłówek - shrink-0 sprawia, że nie znika przy scrollowaniu */}
                <h3 className="text-zinc-500 text-xs uppercase tracking-[0.2em] p-6 shrink-0 border-b border-white/5">
                    Kolejka odtwarzania ({songs.length})
                </h3>
                <div className="px-6 py-3 shrink-0 flex items-center justify-between bg-white/5">
                    <span className="text-zinc-400 text-sm font-medium">Tryb odtwarzania</span>
                    <button
                        onClick={toggleShuffle}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${isShuffle
                                ? 'bg-green-500/20 text-green-500 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                : 'bg-zinc-800 text-zinc-400 border border-transparent hover:bg-zinc-700'
                            }`}
                    >
                        <Shuffle size={14} className={isShuffle ? "animate-pulse" : ""} />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {isShuffle ? 'Losowo' : 'Kolejno'}
                        </span>
                    </button>
                </div>


                {/* 4. To jest jedyny element, który ma prawo się scrollować */}
                <div className='flex-1 overflow-y-auto p-2 scrollbar-hide'>
                    <div className="flex flex-col gap-1 pb-10">
                        {songs.map((song, i) => {
                            const isActive = i === currentIndex;

                            return (
                                <button
                                    key={song + i}
                                    onClick={() => onSelect(i)}
                                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-white/10 border border-white/5 shadow-lg'
                                        : 'hover:bg-zinc-900 border border-transparent'
                                        }`}
                                >
                                    <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-green-500/10 border border-green-500/20' : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'
                                        }`}>
                                        {isActive ? (
                                            <Play size={20} className="text-green-500" fill="#22c55e" />
                                        ) : (
                                            <Music size={16} />
                                        )}
                                    </div>

                                    <div className="flex flex-col items-start overflow-hidden">
                                        <span className={`text-sm truncate w-full ${isActive ? 'text-white font-bold' : 'text-zinc-300'}`}>
                                            {song.replace(/\.[^/.]+$/, "")}
                                        </span>
                                        <span className="text-xs text-zinc-500">Audio file</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
