'use client';

import React, { useState, useEffect, useRef } from 'react';

interface IntroExperienceProps {
  onComplete?: () => void;
  videoSrc?: string;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({
  onComplete,
  videoSrc = '/videos/intro.mp4',
}) => {
  const [isEnded, setIsEnded] = useState<boolean>(false);
  const [isFading, setIsFading] = useState<boolean>(false);
  const [needsSoundTap, setNeedsSoundTap] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if intro has already completed during this browser session
    const alreadyPlayed = sessionStorage.getItem('pb_intro_played');
    if (alreadyPlayed === 'true') {
      setIsEnded(true);
      document.documentElement.classList.add('intro-completed');
      document.documentElement.classList.remove('intro-pending');
      if (onComplete) onComplete();
      return;
    }

    // Mark intro pending to ensure underlying content stays completely hidden
    document.documentElement.classList.add('intro-pending');
    document.documentElement.classList.remove('intro-completed');
    document.body.style.overflow = 'hidden';

    const videoEl = videoRef.current;
    if (videoEl) {
      // Try audible autoplay first; fall back to immediate muted playback if blocked.
      videoEl.muted = false;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          videoEl.muted = true;
          videoEl.play().then(() => setNeedsSoundTap(true)).catch(() => finishIntro());
        });
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  const finishIntro = () => {
    setIsFading(true);
    sessionStorage.setItem('pb_intro_played', 'true');
    document.body.style.overflow = '';

    setTimeout(() => {
      setIsEnded(true);
      document.documentElement.classList.remove('intro-pending');
      document.documentElement.classList.add('intro-completed');
      if (onComplete) onComplete();
    }, 600);
  };

  const handleVideoEnded = () => {
    finishIntro();
  };

  const handleVideoError = () => {
    console.error('Intro video failed to load from:', videoSrc);
    finishIntro();
  };

  const handleEnableSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().then(() => setNeedsSoundTap(false)).catch(() => {
      video.muted = true;
    });
  };

  if (isEnded) {
    return null;
  }

  return (
    <div
      id="intro-screen-overlay"
      className={`fixed inset-0 z-[9999] w-full h-screen min-h-[100svh] bg-black overflow-hidden select-none m-0 p-0 border-0 transition-opacity duration-500 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Preserve the whole video on narrow screens and account for mobile browser bars. */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        preload="metadata"
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        className="absolute inset-0 w-full h-full object-contain block m-0 p-0 [height:100dvh]"
      />

      {needsSoundTap && (
        <button
          type="button"
          onClick={handleEnableSound}
          className="absolute bottom-5 right-5 z-10 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm"
          aria-label="Enable intro video sound"
        >
          Tap for sound
        </button>
      )}

    </div>
  );
};

export default IntroExperience;
