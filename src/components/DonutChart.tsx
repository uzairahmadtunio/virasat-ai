import React, { useState } from 'react';
import type { HeirResult } from '../utils/mirathEngine';
import { formatPKR, getPakistaniUnit } from '../utils/mirathEngine';

interface DonutChartProps {
  heirs: HeirResult[];
  netEstatePKR: number;
  language: 'en' | 'ur';
}

// Luxury Islamic Heritage Jewel-Tone Palette
const LUXURY_PALETTE = [
  '#059669', // Deep Emerald
  '#D97706', // Antique Gold
  '#0D9488', // Royal Teal
  '#B45309', // Burnished Bronze
  '#1E3A2F', // Deep Sage
  '#047857', // Forest Emerald
  '#78350F', // Rich Ochre
  '#0F766E', // Persian Pine
  '#92400E', // Amber Bronze
  '#134E4A'  // Deep Sea Glass
];

export const DonutChart: React.FC<DonutChartProps> = ({ heirs, netEstatePKR, language }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!heirs || heirs.length === 0 || netEstatePKR <= 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-stone-50 border border-dashed border-stone-200 rounded-2xl text-stone-500 text-sm">
        <p>{language === 'ur' ? 'تقسیم کے لیے کوئی قابلِ تقسیم رقم یا وارث موجود نہیں۔' : 'No distributable estate or eligible heirs present.'}</p>
      </div>
    );
  }

  // Pre-calculate angles for SVG paths
  const cx = 150;
  const cy = 150;
  const outerR = 120;
  const innerR = 76;

  let currentAngle = -90; // Start at 12 o'clock

  const slices = heirs.map((heir, idx) => {
    const fraction = heir.shareDecimal;
    const sliceAngle = Math.max(0.8, fraction * 360);
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle += sliceAngle;

    const rad = (deg: number) => (deg * Math.PI) / 180;
    
    const isHovered = hoveredIndex === idx;
    const hoverOffset = isHovered ? 7 : 0;
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = rad(midAngle);
    
    const offsetX = Math.cos(midRad) * hoverOffset;
    const offsetY = Math.sin(midRad) * hoverOffset;

    const x1 = cx + (outerR + (isHovered ? 4 : 0)) * Math.cos(rad(startAngle)) + offsetX;
    const y1 = cy + (outerR + (isHovered ? 4 : 0)) * Math.sin(rad(startAngle)) + offsetY;
    const x2 = cx + (outerR + (isHovered ? 4 : 0)) * Math.cos(rad(endAngle)) + offsetX;
    const y2 = cy + (outerR + (isHovered ? 4 : 0)) * Math.sin(rad(endAngle)) + offsetY;

    const x3 = cx + (innerR - (isHovered ? 2 : 0)) * Math.cos(rad(endAngle)) + offsetX;
    const y3 = cy + (innerR - (isHovered ? 2 : 0)) * Math.sin(rad(endAngle)) + offsetY;
    const x4 = cx + (innerR - (isHovered ? 2 : 0)) * Math.cos(rad(startAngle)) + offsetX;
    const y4 = cy + (innerR - (isHovered ? 2 : 0)) * Math.sin(rad(startAngle)) + offsetY;

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${outerR + (isHovered ? 4 : 0)} ${outerR + (isHovered ? 4 : 0)} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR - (isHovered ? 2 : 0)} ${innerR - (isHovered ? 2 : 0)} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');

    const color = LUXURY_PALETTE[idx % LUXURY_PALETTE.length];

    return {
      heir,
      idx,
      color,
      pathData,
      isHovered
    };
  });

  const activeHeir = hoveredIndex !== null ? heirs[hoveredIndex] : null;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Interactive Donut Graphic with Smooth Filter Drop-Shadow */}
      <div className="relative w-[270px] h-[270px] shrink-0 mx-auto">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-md select-none"
          role="img"
          aria-label="Inheritance distribution chart"
        >
          <defs>
            <filter id="jewel-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
            </filter>
          </defs>
          {slices.map((slice) => (
            <path
              key={slice.heir.id}
              d={slice.pathData}
              fill={slice.color}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="cursor-pointer transition-all duration-300 hover:brightness-110 filter hover:drop-shadow-lg"
              onMouseEnter={() => setHoveredIndex(slice.idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setHoveredIndex(slice.idx)}
            />
          ))}
        </svg>

        {/* Center Cutout Text: Serif & Monospace Royalty */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {activeHeir ? (
            <div className="animate-fade-in transition-all">
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block truncate max-w-[140px] font-sans">
                {language === 'ur' ? activeHeir.titleUrdu : activeHeir.titleEn}
              </span>
              <span className="text-2xl font-bold font-serif-title text-[#022C22] block leading-tight">
                {activeHeir.sharePercentage.toFixed(1)}%
              </span>
              <span className="text-xs font-bold text-[#059669] block font-mono-num">
                {activeHeir.shareFraction}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-stone-400 block font-sans">
                {language === 'ur' ? 'قابلِ تقسیم ترکہ' : 'NET ESTATE'}
              </span>
              <span className="text-lg font-bold font-serif-title text-[#022C22] block mt-0.5">
                {getPakistaniUnit(netEstatePKR)}
              </span>
              <span className="text-[10px] text-stone-400 block font-mono">
                {heirs.length} {language === 'ur' ? 'ورثاء فریق' : 'Heir Groups'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Legend & Breakdown List with Micro Progress Bars */}
      <div className="w-full space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {heirs.map((heir, idx) => {
          const color = LUXURY_PALETTE[idx % LUXURY_PALETTE.length];
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={heir.id}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                isHovered
                  ? 'border-[#059669] bg-gradient-to-r from-emerald-50/80 to-white shadow-xs -translate-y-0.5'
                  : 'border-stone-100 bg-white hover:border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs ring-1 ring-black/5"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-900 truncate">
                      {language === 'ur' ? heir.titleUrdu : heir.titleEn}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
                      <span className="font-bold text-[#059669]">{heir.shareFraction}</span>
                      <span>·</span>
                      <span>{heir.sharePercentage.toFixed(2)}%</span>
                      {heir.count > 1 && (
                        <>
                          <span>·</span>
                          <span className="text-stone-400">({heir.count} pers.)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold font-serif-title text-[#022C22]">
                    {getPakistaniUnit(heir.totalAmountPKR)}
                  </div>
                  {heir.count > 1 && (
                    <div className="text-[10px] text-stone-400 font-mono">
                      {getPakistaniUnit(heir.perPersonAmountPKR)} / ea
                    </div>
                  )}
                </div>
              </div>

              {/* Share Progress Bar */}
              <div className="mt-2 w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, Math.max(2, heir.sharePercentage))}%`,
                    backgroundColor: color 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
