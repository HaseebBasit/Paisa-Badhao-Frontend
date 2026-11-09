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
      // Start immediately; browsers that block audible autoplay still allow muted playback.
      videoEl.muted = true;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          videoEl.muted = true;
          videoEl.play().catch(() => finishIntro());
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

  const handleUserInteractPlay = () => {
    videoRef.current?.play().catch(() => finishIntro());
  };

  if (isEnded) {
    return null;
  }

  return (
    <div
      id="intro-screen-overlay"
      className={`fixed inset-0 z-[9999] w-screen h-screen bg-black overflow-hidden select-none m-0 p-0 border-0 transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Full-screen video covering 100vw x 100vh without borders or margins */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        className="w-full h-full object-cover block m-0 p-0"
      />

    </div>
  );
};

export default IntroExperience;
