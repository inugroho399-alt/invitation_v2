'use client';

import React, { useEffect, useRef } from 'react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: (play: boolean) => void;
}

export default function MusicPlayer({ isPlaying, onToggle }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.satumomen.com/musics/y2metaapp-java-instrument-128-kbps.mp3');
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.log('Autoplay blocked by browser. User must interact first.', err);
        onToggle(false);
      });
    } else {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isPlaying, onToggle]);

  return (
    <div className="floating-action d-flex align-items-end flex-column">
      <button 
        id="btnMusic" 
        onClick={() => onToggle(!isPlaying)} 
        className={`btn btn-float ${!isPlaying ? 'pause' : ''}`}
      >
        <svg className="play" style={{ display: isPlaying ? 'block' : 'none' }} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256"><path d="M184,152V104a8,8,0,0,1,16,0v48a8,8,0,0,1-16,0Zm40-72a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,224,80ZM53.92,34.62A8,8,0,1,0,42.08,45.38L73.55,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.25l69.84,54.31A8,8,0,0,0,160,224V175.09l42.08,46.29a8,8,0,1,0,11.84-10.76Zm92.16,77.59A8,8,0,0,0,160,106.83V32a8,8,0,0,0-12.91-6.31l-39.85,31a8,8,0,0,0-1,11.7Z"></path></svg>
        <svg className="pause" style={{ display: !isPlaying ? 'block' : 'none' }} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 256 256"><path d="M160,32V224a8,8,0,0,1-12.91,6.31L77.25,176H32a16,16,0,0,1-16-16V96A16,16,0,0,1,32,80H77.25l69.84-54.31A8,8,0,0,1,160,32Zm32,64a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V104A8,8,0,0,0,192,96Zm32-16a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,224,80Z"></path></svg>
      </button>
    </div>
  );
}
