import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'white';
  showTagline?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  showTagline = false,
  className = '',
  size = 'md',
}) => {
  const isWhite = variant === 'white';

  const logoDimension = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;

  return (
    <Link href="/" className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official PAISA BADHAO Brand Mark */}
      <div className="relative rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center">
        <Image
          src="/logo/paisa-badhao-logo.jpg"
          alt="PAISA BADHAO Logo"
          width={logoDimension}
          height={logoDimension}
          className="rounded-xl object-contain"
          priority
        />
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center leading-none">
          <span
            className={`font-serif text-lg sm:text-xl font-black tracking-wider ${
              isWhite ? 'text-white' : 'text-forest-900'
            }`}
          >
            PAISA
          </span>
          <span className="font-serif text-lg sm:text-xl font-black ml-1.5 text-emerald-600 tracking-wider">
            BADHAO
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] font-medium tracking-tight mt-1 ${
              isWhite ? 'text-emerald-300' : 'text-emerald-800'
            }`}
          >
            Apna Paisa Barhao, Samajhdari Se Lagao
          </span>
        )}
      </div>
    </Link>
  );
};

export default BrandLogo;
