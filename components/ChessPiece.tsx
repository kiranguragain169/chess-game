import React from 'react';
import { PieceType, PieceColor } from '../types';

interface ChessPieceProps {
  type: PieceType;
  color: PieceColor;
  className?: string;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ type, color, className }) => {
  const isWhite = color === 'w';

  // 3D Color Palette
  // Main: The top/front face (Light source top-left)
  // Side: The side/shadow face (Darker)
  const mainColor = isWhite ? '#e2e8f0' : '#475569'; // slate-200 : slate-600
  const sideColor = isWhite ? '#94a3b8' : '#0f172a'; // slate-400 : slate-900
  const accentColor = isWhite ? '#f8fafc' : '#64748b'; // Highlight

  const render3DPiece = () => {
    switch (type) {
      case 'p': // Pawn
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base Shadow/Side */}
            <path d="M25,75 Q25,90 50,90 Q75,90 75,75 L75,65 Q75,80 50,80 Q25,80 25,65 Z" fill={sideColor} />
            {/* Base Top */}
            <ellipse cx="50" cy="70" rx="25" ry="10" fill={mainColor} />
            
            {/* Stem Side */}
            <path d="M35,65 L40,35 L60,35 L65,65 Q65,75 50,75 Q35,75 35,65" fill={sideColor} />
            {/* Stem Front (Overlay to create roundness) */}
            <path d="M35,65 L40,35 L60,35 L65,65 Q65,60 50,60 Q35,60 35,65" fill={mainColor} />

            {/* Head Side (Sphere bottom) */}
            <circle cx="50" cy="30" r="16" fill={sideColor} />
            {/* Head Main (Sphere top-left offset) */}
            <circle cx="48" cy="28" r="16" fill={mainColor} />
          </svg>
        );
      case 'r': // Rook
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base Side */}
            <path d="M20,75 Q20,90 50,90 Q80,90 80,75 L80,65 Q80,80 50,80 Q20,80 20,65 Z" fill={sideColor} />
            {/* Base Top */}
            <ellipse cx="50" cy="70" rx="30" ry="10" fill={mainColor} />
            
            {/* Body Side */}
            <rect x="25" y="35" width="50" height="40" fill={sideColor} rx="2" />
            {/* Body Front Highlight (Left half) */}
            <path d="M25,35 L50,35 L50,75 L25,75 Z" fill={mainColor} opacity="0.8" />
            <path d="M25,35 L75,35 L75,75 L25,75 Z" fill={mainColor} />

            {/* Top Turret Side */}
            <path d="M20,35 L20,20 L30,20 L30,25 L40,25 L40,20 L60,20 L60,25 L70,25 L70,20 L80,20 L80,35 Q50,45 20,35" fill={sideColor} />
             {/* Top Turret Top Faces */}
            <rect x="20" y="15" width="10" height="15" fill={mainColor} />
            <rect x="45" y="15" width="10" height="15" fill={mainColor} />
            <rect x="70" y="15" width="10" height="15" fill={mainColor} />
            <rect x="20" y="28" width="60" height="7" fill={mainColor} />
          </svg>
        );
      case 'n': // Knight
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base */}
            <path d="M25,75 Q25,90 50,90 Q75,90 75,75 L75,65 Q75,80 50,80 Q25,80 25,65 Z" fill={sideColor} />
            <ellipse cx="50" cy="70" rx="25" ry="10" fill={mainColor} />

            {/* Neck/Head Side (Shadow) */}
            <path d="M30,70 L35,40 L25,35 L40,10 L65,15 L75,35 L65,70 Z" fill={sideColor} />
            
            {/* Neck/Head Main */}
            <path d="M28,68 L33,38 L23,33 L38,8 L63,13 L73,33 L63,68 Z" fill={mainColor} />
            
            {/* Detail (Mane/Ear) */}
            <path d="M38,8 L45,25" stroke={sideColor} strokeWidth="3" />
          </svg>
        );
      case 'b': // Bishop
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
             {/* Base */}
            <path d="M25,75 Q25,90 50,90 Q75,90 75,75 L75,65 Q75,80 50,80 Q25,80 25,65 Z" fill={sideColor} />
            <ellipse cx="50" cy="70" rx="25" ry="10" fill={mainColor} />
            
            {/* Body Side */}
            <path d="M35,68 L42,30 L58,30 L65,68 Z" fill={sideColor} />
            <path d="M35,68 L40,30 L50,30 L52,68 Z" fill={mainColor} /> 

            {/* Head Side */}
            <path d="M40,30 Q35,10 50,5 Q65,10 60,30 Z" fill={sideColor} />
            {/* Head Main */}
            <path d="M38,28 Q33,8 48,3 Q63,8 58,28 Z" fill={mainColor} />
            
            {/* Cross/Slit */}
            <path d="M45,10 L50,20" stroke={sideColor} strokeWidth="3" />
            <circle cx="48" cy="8" r="2" fill={accentColor} />
          </svg>
        );
      case 'q': // Queen
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base */}
            <path d="M20,75 Q20,90 50,90 Q80,90 80,75 L80,65 Q80,80 50,80 Q20,80 20,65 Z" fill={sideColor} />
            <ellipse cx="50" cy="70" rx="30" ry="10" fill={mainColor} />
            
            {/* Stem */}
            <path d="M35,70 L40,40 L60,40 L65,70 Z" fill={sideColor} />
            <path d="M35,70 L40,40 L50,40 L50,70 Z" fill={mainColor} />

            {/* Crown Side */}
            <path d="M30,40 L25,15 L40,30 L50,10 L60,30 L75,15 L70,40 Z" fill={sideColor} />
            {/* Crown Main */}
            <path d="M28,38 L23,13 L38,28 L48,8 L58,28 L73,13 L68,38 Z" fill={mainColor} />
            
            {/* Crown Jewels */}
            <circle cx="23" cy="13" r="3" fill={accentColor} />
            <circle cx="48" cy="8" r="3" fill={accentColor} />
            <circle cx="73" cy="13" r="3" fill={accentColor} />
          </svg>
        );
      case 'k': // King
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base */}
            <path d="M20,75 Q20,90 50,90 Q80,90 80,75 L80,65 Q80,80 50,80 Q20,80 20,65 Z" fill={sideColor} />
            <ellipse cx="50" cy="70" rx="30" ry="10" fill={mainColor} />
            
            {/* Stem */}
            <path d="M30,70 L30,30 L70,30 L70,70 Z" fill={sideColor} />
            <path d="M30,70 L30,30 L50,30 L50,70 Z" fill={mainColor} />

            {/* Top Cross Side */}
            <rect x="45" y="10" width="10" height="20" fill={sideColor} />
            <rect x="35" y="15" width="30" height="10" fill={sideColor} />
            
            {/* Top Cross Main */}
            <rect x="43" y="8" width="10" height="20" fill={mainColor} />
            <rect x="33" y="13" width="30" height="10" fill={mainColor} />
          </svg>
        );
    }
  };

  return (
    <div className={`${className} transition-transform hover:scale-105 duration-200`}>
      {render3DPiece()}
    </div>
  );
};

export default ChessPiece;
