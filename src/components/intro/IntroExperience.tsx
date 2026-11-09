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
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);
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
      // Per strict requirement: Do not intentionally mute the video
      videoEl.muted = false;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Browser security policy requires user gesture for sound
          console.warn('Audible autoplay blocked by browser policy:', err);
          setAutoplayBlocked(true);
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
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.muted = false;
      videoEl
        .play()
        .then(() => {
          setAutoplayBlocked(false);
        })
        .catch((err) => {
          console.error('Play after user gesture error:', err);
          videoEl.muted = true;
          videoEl.play().catch(() => finishIntro());
          setAutoplayBlocked(false);
        });
    }
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

      {/* Browser Autoplay Sound Block Graceful Interaction Overlay */}
      {autoplayBlocked && (
        <div
          onClick={handleUserInteractPlay}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs cursor-pointer select-none"
        >
          <div className="text-center px-8 py-6 rounded-3xl bg-forest-900/95 border border-emerald-500/40 text-white max-w-md shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 text-emerald-400 mx-auto flex items-center justify-center font-bold text-sm">
              PB
            </div>
            <h3 className="font-serif text-xl font-bold text-white">
              PAISA BADHAO Experience
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your browser requires an initial user interaction to play video with full sound enabled.
            </p>
            <button
              type="button"
              onClick={handleUserInteractPlay}
              className="px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:scale-102 cursor-pointer"
            >
              Play with Sound
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntroExperience;
