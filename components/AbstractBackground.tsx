import { ImageWithFallback } from './figma/ImageWithFallback';

interface AbstractBackgroundProps {
  imageUrl: string;
  opacity?: number;
  children: React.ReactNode;
  className?: string;
}

export function AbstractBackground({ 
  imageUrl, 
  opacity = 0.03, 
  children, 
  className = "" 
}: AbstractBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt="Abstract background"
          className="w-full h-full object-cover object-center"
          style={{
            opacity: opacity,
            filter: 'blur(1px) brightness(1.2)',
          }}
        />
        {/* Additional overlay for better text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/40 to-background/80"
          style={{ backdropFilter: 'blur(0.5px)' }}
        />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}