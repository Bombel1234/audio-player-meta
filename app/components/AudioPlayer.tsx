'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Play, Pause, SkipForward, SkipBack, Menu, ListMusic
} from 'lucide-react';
import MusicList from './MusicList';


export default function AudioPlayer({ listMusic }: { listMusic: string[] }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackInfo, setTrackInfo] = useState({ title: '', artist: '' });
  const [clickIconListMusic, setClickIconListMusic] = useState(false)
  const [nextTrackInfo, setNextTrackInfo] = useState({ title: '', artist: '' });

  // Wyliczamy indeks następnego utworu
  const nextTrackIndex = (index + 1) % listMusic.length;
  const nextTrackName = listMusic[nextTrackIndex] || "";

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrackName = listMusic[index] || "";
  const trackUrl = `/audio/${currentTrackName}`;
  const coverUrl = `/api/cover?file=${encodeURIComponent(currentTrackName)}`;

  const [isShuffle, setIsShuffle] = useState(false);
  const toggleShuffle = () => setIsShuffle(!isShuffle);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [index, isPlaying, trackUrl]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Zapytanie do Twojego nowego API
        const res = await fetch(`/api/metadata?file=${encodeURIComponent(currentTrackName)}`);
        const data = await res.json();

        setTrackInfo({
          title: data.title || currentTrackName.replace(/\.[^/.]+$/, ""),
          artist: data.artist || "Nieznany wykonawca"
        });
      } catch (error) {
        console.error("Błąd pobierania metadanych:", error);
        setTrackInfo({ title: currentTrackName, artist: "Nieznany wykonawca" });
      }
    };

    if (currentTrackName) {
      fetchMetadata();
    }
  }, [currentTrackName]);

  useEffect(() => {
    const fetchNextMetadata = async () => {
      try {
        const res = await fetch(`/api/metadata?file=${encodeURIComponent(nextTrackName)}`);
        const data = await res.json();
        setNextTrackInfo(data);
      } catch (error) {
        setNextTrackInfo({ title: nextTrackName, artist: "Nieznany" });
      }
    };
    if (nextTrackName) fetchNextMetadata();
  }, [nextTrackName]);


  const togglePlay = () => setIsPlaying(!isPlaying);
  // const nextTrack = () => setIndex((prev) => (prev + 1) % listMusic.length);
  const prevTrack = () => setIndex((prev) => (prev - 1 + listMusic.length) % listMusic.length);
  const nextTrack = () => {
  if (isShuffle) {
    // Losujemy indeks, upewniając się, że nie jest to ten sam, co obecnie
    let randomIndex = Math.floor(Math.random() * listMusic.length);
    
    // Jeśli jest więcej niż 1 piosenka i wylosowano tę samą, weź następną
    if (listMusic.length > 1 && randomIndex === index) {
      randomIndex = (randomIndex + 1) % listMusic.length;
    }
    setIndex(randomIndex);
  } else {
    // Standardowa kolejność
    setIndex((prev) => (prev + 1) % listMusic.length);
  }
};
  
  
  if (!listMusic.length) return <div className="p-10 text-white">Brak utworów...</div>;

  const closeListMusic = ()=>{
    setClickIconListMusic(false)
  }


  return (
    <div className="">

      {/* UKRYTE AUDIO */}
      <audio
        key={trackUrl}
        ref={audioRef}
        src={trackUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={nextTrack}
      />
      <div
        className='flex justify-between'
      >
        <Menu
          size={50}
        />
        <ListMusic
          onClick={() => setClickIconListMusic(true)}
          size={50}
        />
      </div>

      {/* div from cover.jpg */}
      <div className='flex justify-center py-4'>
        <Image
          src={coverUrl} // Dynamiczny adres z Twojego API
          alt={`Cover for ${currentTrackName}`}
          width={380}    // Dopasuj do szerokości kontenera (w-72 to 288px)
          height={380}   // Dopasuj do wysokości
          priority
          className="object-cover w-screen rounded-2xl"
          unoptimized    // Konieczne przy pobieraniu Buffer/Blob z API Route
          onError={(e) => {
            // Opcjonalnie: fallback jeśli API zawiedzie
            (e.target as HTMLImageElement).src = '/images/back.png';
          }}
        />
      </div>

      {/* 2. TYTUŁ I ARTYSTA */}
      <div className="text-center mb-6 w-full">
        <h2 className="text-xl font-bold truncate px-2">
          {currentTrackName.replace(/\.[^/.]+$/, "")}
        </h2>
        <p className="text-zinc-600 text-lg  mt-1">{trackInfo.artist}</p>
        <p className="text-zinc-600 text-lg mt-1">{trackInfo.title}</p>
      </div>

      {/*div progressbar */}
      <div className="w-full mb-8">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => {
            const time = Number(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = time;
            setCurrentTime(time);
          }}
          className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
        />
        <div className="flex justify-between text-[20px] text-zinc-500 mt-2 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 4. PRZYCISKI */}
      <div className="flex justify-center gap-18">
        <button onClick={prevTrack} className="hover:text-zinc-400 transition-colors">
          <SkipBack size={42} />
        </button>

        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause size={42} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
        </button>

        <button onClick={nextTrack} className="hover:text-zinc-400 transition-colors">
          <SkipForward size={42} />
        </button>
      </div>

      {/* ... przyciski Play/Pause ... */}

      <div className="mt-8 text-center opacity-60 hover:opacity-100 transition-opacity">
        <p className="text-[10px] uppercase tracking-[0.2em] mb-1">Nastepny track:</p>
        <p className=" text-sm font-medium">
          {nextTrackInfo.artist} - {nextTrackInfo.title || nextTrackName.replace(/\.[^/.]+$/, "")}
        </p>
      </div>
      {clickIconListMusic && (
        <MusicList
          songs={listMusic}
          currentIndex={index}
          onSelect={(newIndex) => {
            setIndex(newIndex);
            setIsPlaying(true); // Automatycznie puść muzykę po kliknięciu
          }}
          onClose={closeListMusic}
          isShuffle={isShuffle}        // Przekaż stan
          toggleShuffle={toggleShuffle}
        />
      )}

    </div>
  );
}

function formatTime(time: number) {
  if (isNaN(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
