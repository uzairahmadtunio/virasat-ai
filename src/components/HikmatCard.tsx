import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Sparkles
} from 'lucide-react';
import type { HeirResult } from '../utils/mirathEngine';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';

interface HikmatCardProps {
  heirs: HeirResult[];
  language: Language;
}

export const HikmatCard: React.FC<HikmatCardProps> = ({ heirs, language }) => {
  const t = translations[language];
  const [expandedId, setExpandedId] = useState<string | null>(heirs[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 space-y-7 transition-all">
      
      {/* Header */}
      <div className="border-b border-stone-200/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-amber-100 text-[#AA771C] flex items-center justify-center ring-1 ring-[#D4AF37]/40">
            <BookOpen className="w-5 h-5 text-[#85580E]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#022C22] font-serif-title">
              {t.hikmatTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {t.hikmatSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Highlighted Card: "Why 2:1 for Son vs Daughter?" Styled as Luxury Manuscript Excerpt */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F2E] text-white shadow-xl shadow-emerald-950/20 ring-1 ring-[#D4AF37]/35 relative overflow-hidden">
        {/* Ornamental Golden Corner Accents */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/60 pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]/60 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]/60 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/60 pointer-events-none" />

        {/* Subtle Islamic Lattice Background */}
        <div className="absolute inset-0 islamic-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-stone-950 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'ur' ? 'حکمتِ تقسیم' : 'Divine Wisdom'}
            </span>
            <span className="text-xs text-amber-200/90 font-mono tracking-wider">
              Surah An-Nisa (4:11)
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F9F1D8] font-serif-title">
            {t.sonDaughterWisdomTitle}
          </h3>

          <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-xs sm:text-sm leading-relaxed text-emerald-100 font-light">
            {t.sonDaughterWisdomText}
          </div>

          {/* Side-by-Side Glassmorphic Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            {/* Daughter's Protected Wealth */}
            <div className="p-4 rounded-2xl bg-[#064E3B]/60 backdrop-blur-md border border-[#D4AF37]/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F9F1D8] text-xs sm:text-sm block font-serif-title">
                  {language === 'ur' ? 'بیٹی کی مالی حیثیت (محفوظ سرمایہ):' : "Daughter's Financial Status (Protected Wealth):"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                  100% Net Asset
                </span>
              </div>
              <p className="text-emerald-100/90 text-xs leading-relaxed">
                {language === 'ur'
                  ? 'بیٹی کو ملنے والی وراثت اس کی خالص ذاتی ملکیت ہے۔ نہ شوہر، نہ سسرال، اور نہ ہی بھائی اس میں سے ایک روپیہ زبردستی لے سکتے ہیں۔ اس پر گھر یا اولاد کا خرچ چلانا واجب نہیں۔'
                  : "Her inheritance is 100% net personal asset. Under Shariah, she has ZERO legal liability to spend on household, spouse, or siblings. Everything she receives is pure savings."}
              </p>
            </div>

            {/* Son's Mandatory Legal Liabilities */}
            <div className="p-4 rounded-2xl bg-[#064E3B]/60 backdrop-blur-md border border-amber-500/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F9F1D8] text-xs sm:text-sm block font-serif-title">
                  {language === 'ur' ? 'بیٹے پر مالی ذمہ داریاں (بھاری بوجھ):' : "Son's Financial Burden (Mandatory Outflows):"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  Nafaqah & Mehr
                </span>
              </div>
              <p className="text-emerald-100/90 text-xs leading-relaxed">
                {language === 'ur'
                  ? 'بیٹے پر اپنی بیوی کا مہر، بیوی اور بچوں کا نفقہ، بوڑھے والدین کا تمام خرچ، اور ضرورت کے وقت غیر شادی شدہ بہنوں کی کفالت شرعاً و قانوناً لازم ہے۔'
                  : "The son carries heavy legal liabilities: paying his wife's Haq-Mehr, full household maintenance (Nafaqah), taking care of elderly parents, and supporting sisters if needed."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion of Every Heir's Quranic Reference Styled as Illuminated Manuscript Callouts */}
      <div className="space-y-3.5">
        <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest font-sans">
          {language === 'ur' ? 'تمام حصص کے قرآنی دلائل:' : 'Illuminated Manuscript References:'}
        </h4>

        {heirs.map((heir) => {
          const isExpanded = expandedId === heir.id;

          return (
            <div
              key={heir.id}
              className={`rounded-2xl transition-all duration-200 overflow-hidden ${
                isExpanded 
                  ? 'border-2 border-[#D4AF37]/60 shadow-md bg-[#FFFDF9]' 
                  : 'border border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleExpand(heir.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-mono font-bold text-[#022C22] text-xs bg-stone-100 px-3 py-1 rounded-lg border border-stone-200/80">
                    {heir.shareFraction}
                  </span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#022C22] block font-sans">
                      {language === 'ur' ? heir.titleUrdu : heir.titleEn}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {heir.quranicReference}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-stone-700 font-mono hidden sm:inline">
                    {heir.sharePercentage.toFixed(2)}%
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 bg-[#FFFDF9] border-t border-[#D4AF37]/30 space-y-4">
                  {/* Arabic Quranic Ayah with Illuminated Gold Border & Amiri Font */}
                  <div className="p-4 bg-white rounded-xl border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#D4AF37] shadow-2xs text-right">
                    <p className="font-arabic text-xl sm:text-2xl text-[#022C22] leading-loose tracking-wide" dir="rtl">
                      {heir.surahVerse}
                    </p>
                    <span className="text-xs text-[#85580E] font-semibold block mt-2 font-mono">
                      — {heir.quranicReference}
                    </span>
                  </div>

                  {/* Fiqh Explanation */}
                  <div className="text-xs text-stone-700 leading-relaxed space-y-1">
                    <span className="font-bold text-[#022C22] block text-xs font-sans">
                      {language === 'ur' ? 'فقہی تشریح و اطلاق:' : 'Jurisprudence Commentary & Context:'}
                    </span>
                    <p className="leading-relaxed">
                      {language === 'ur' ? heir.hikmatExplanationUrdu : heir.hikmatExplanationEn}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
