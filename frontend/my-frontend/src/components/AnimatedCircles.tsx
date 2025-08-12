import React from 'react';

interface AnimatedCirclesProps {
  text?: string;
  className?: string;
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

const AnimatedCircles: React.FC<AnimatedCirclesProps> = ({
  text = "Loading",
  className = "",
  size = 300,
  primaryColor = "#fff",
  secondaryColor = "#fff",
  accentColor = "#fff"
}) => {
  return (
    <div className={`flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-600 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin-slow"
      >
        {/* Outer circle */}
        <circle 
          cx="150" 
          cy="150" 
          r="120" 
          stroke={primaryColor} 
          strokeWidth="12" 
          opacity="0.2" 
        />
        
        {/* Middle circle */}
        <circle 
          cx="150" 
          cy="150" 
          r="80" 
          stroke={secondaryColor} 
          strokeWidth="8" 
          opacity="0.4" 
        />
        
        {/* Inner circle */}
        <circle 
          cx="150" 
          cy="150" 
          r="40" 
          stroke={accentColor} 
          strokeWidth="4" 
          opacity="0.6" 
        />
        
        {/* Text in center */}
        <text 
          x="50%" 
          y="50%" 
          textAnchor="middle" 
          dy=".3em" 
          fontSize="32" 
          fill={primaryColor}
          className="font-bold"
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

export default AnimatedCircles; 