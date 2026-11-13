import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Scale, 
  HelpCircle
} from 'lucide-react';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoadPreset: (presetId: 'standard' | 'daughters' | 'debt_will') => void;
  onOpenPrintModal: () => void;
  onOpenAdvisorModal: () => void;
  activePreset: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onLoadPreset,
  onOpenPrintModal,
  onOpenAdvisorModal,
  activePreset
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5F0]/85 backdrop-blur-md border-b border-black/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <div className="h-10 sm:h-12 flex items-center shrink-0">
              <img 
                src="/virasat-ai-logo.webp" 
                alt="Virasat AI — Islamic FinTech" 
                className="max-h-10 sm:max-h-12 w-auto object-contain cursor-pointer transition-transform hover:scale-102 shrink-0"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden lg:block border-l border-stone-200/80 pl-4 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-2xs">
                <Scale className="w-3 h-3 text-[#059669]" />
                Hanafi Fiqh Engine
              </span>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Fiqh Advisor Button in Header */}
            <button
              onClick={onOpenAdvisorModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-50 to-[#FFFDF9] hover:from-amber-100 hover:to-amber-50 text-amber-950 rounded-xl text-xs font-bold border border-[#D4AF37]/50 shadow-2xs transition-all cursor-pointer hover:shadow-xs hover:-translate-y-0.5"
              title="Pakistani Family Dispute Resolution Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.advisorBtn}</span>
            </button>

            {/* Language Toggle */}
            <div className="flex items-center bg-stone-200/60 p-1 rounded-xl border border-stone-300/60 backdrop-blur-sm">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="English & Roman Urdu"
              >
                EN / Roman
              </button>
              <button
                onClick={() => onLanguageChange('ur')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all font-urdu cursor-pointer ${
                  language === 'ur'
                    ? 'bg-[#022C22] text-[#D4AF37] shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="اردو (Authentic Nastaliq)"
              >
                اردو
              </button>
            </div>

            {/* Signature Luxury CTA: Print Official Taqseem-Nama Button */}
            <button
              onClick={onOpenPrintModal}
              className="relative group overflow-hidden flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#022C22] via-[#064E3B] to-[#042F2E] hover:from-[#064E3B] hover:to-[#059669] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md shadow-emerald-950/20 ring-1 ring-[#D4AF37]/50 hover:ring-[#D4AF37] hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />
              <img 
                src="/virasat-ai-icon-step5-taqseemnama.webp" 
                alt="Taqseem-Nama Icon" 
                className="w-5 h-5 shrink-0 object-contain drop-shadow"
                referrerPolicy="no-referrer"
              />
              <span className="hidden sm:inline font-medium">{t.printBtn}</span>
              <span className="sm:hidden font-medium">{language === 'ur' ? 'تقسیم نامہ' : 'Taqseem-Nama'}</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Case Presets Sub-Bar */}
        <div className="py-2.5 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-stone-600 font-medium shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="font-semibold text-stone-700">{t.presetLabel}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onLoadPreset('standard')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-xs ${
                activePreset === 'standard'
                  ? 'bg-gradient-to-r from-[#022C22] to-[#064E3B] text-amber-200 shadow-sm ring-1 ring-[#D4AF37]/50'
                  : 'bg-white/90 text-stone-700 hover:bg-[#064E3B] hover:text-white border border-stone-200/80 shadow-2xs'
              }`}
            >
              {t.presetStandard}
            </button>

            <button
              onClick={() => onLoadPreset('daughters')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-xs ${
                activePreset === 'daughters'
                  ? 'bg-gradient-to-r from-[#022C22] to-[#064E3B] text-amber-200 shadow-sm ring-1 ring-[#D4AF37]/50'
                  : 'bg-white/90 text-stone-700 hover:bg-[#064E3B] hover:text-white border border-stone-200/80 shadow-2xs'
              }`}
            >
              {t.presetDaughters}
            </button>

            <button
              onClick={() => onLoadPreset('debt_will')}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-xs ${
                activePreset === 'debt_will'
                  ? 'bg-gradient-to-r from-amber-900 to-amber-950 text-amber-200 shadow-sm ring-1 ring-[#D4AF37]/60'
                  : 'bg-white/90 text-amber-900 hover:bg-amber-900 hover:text-white border border-amber-200/80 shadow-2xs'
              }`}
            >
              {t.presetDebtWill}
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
