import React from 'react';
import { 
  Users, 
  UserCheck, 
  Heart, 
  Minus, 
  Plus, 
  Lock, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import type { FamilyTree } from '../utils/mirathEngine';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';

interface FamilyTreeSelectorProps {
  family: FamilyTree;
  onChangeFamily: (updated: Partial<FamilyTree>) => void;
  language: Language;
}

export const FamilyTreeSelector: React.FC<FamilyTreeSelectorProps> = ({
  family,
  onChangeFamily,
  language
}) => {
  const t = translations[language];

  // Hajb rule: Siblings are blocked if Father is alive OR Sons exist
  const siblingsBlocked = family.fatherAlive || family.sonsCount > 0;

  const handleDeceasedGenderChange = (gender: 'male' | 'female') => {
    if (gender === 'female') {
      onChangeFamily({
        deceasedGender: 'female',
        wivesCount: 0,
        husbandPresent: true
      });
    } else {
      onChangeFamily({
        deceasedGender: 'male',
        wivesCount: 1,
        husbandPresent: false
      });
    }
  };

  const isWivesActive = family.deceasedGender === 'male' ? family.wivesCount > 0 : family.husbandPresent;
  const isParentsActive = family.fatherAlive || family.motherAlive;
  const isChildrenActive = family.sonsCount > 0 || family.daughtersCount > 0;
  const isSiblingsActive = (family.brothersCount > 0 || family.sistersCount > 0) && !siblingsBlocked;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 space-y-7 transition-all">
      
      {/* Step Header */}
      <div className="border-b border-stone-200/60 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F2E] p-2 ring-1 ring-[#D4AF37]/40 shadow-sm flex items-center justify-center shrink-0">
              <img 
                src="/virasat-ai-icon-step2-family-tree.webp" 
                alt="Step 2: Family Tree & Hajb" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-[#022C22] text-[#D4AF37] text-[10px] font-bold tracking-wider shrink-0 font-mono">
                  STEP 02
                </span>
                <h2 className={`text-xl sm:text-2xl font-bold text-[#022C22] ${
                  language === 'ur' ? 'font-urdu' : 'font-serif-title tracking-wide'
                }`}>
                  {t.step2Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal tracking-normal">
                {t.step2Subtitle}
              </p>
            </div>
          </div>

          {/* Deceased Gender Configurator Control */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-semibold text-stone-600 hidden md:inline">
              {t.deceasedGender}:
            </span>
            <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => handleDeceasedGenderChange('male')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  family.deceasedGender === 'male'
                    ? 'bg-gradient-to-r from-[#022C22] to-[#064E3B] text-amber-200 shadow-sm ring-1 ring-[#D4AF37]/40'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.male}
              </button>
              <button
                type="button"
                onClick={() => handleDeceasedGenderChange('female')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  family.deceasedGender === 'female'
                    ? 'bg-gradient-to-r from-[#022C22] to-[#064E3B] text-amber-200 shadow-sm ring-1 ring-[#D4AF37]/40'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.female}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Heirs: Apple Configurator Style Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Spouse (Biwi or Shohar) */}
        <div className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 space-y-4 ${
          isWivesActive 
            ? 'border-[#059669]/40 bg-gradient-to-b from-white to-[#F0FDF4]/40 shadow-sm' 
            : 'border-stone-200/80 bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 ring-1 ring-rose-200">
                <Heart className="w-5 h-5 fill-rose-500/20" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#022C22]">
                  {family.deceasedGender === 'male' ? t.wivesLabel : t.husbandLabel}
                </h3>
                <span className="text-[10px] text-stone-400">Prescribed Quranic share</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#064E3B] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 font-sans">
              {t.catZawilFurooz}
            </span>
          </div>

          {family.deceasedGender === 'male' ? (
            /* Wives Counter (0 - 4) with Circular Tactile Buttons */
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-stone-700">
                {t.wivesCountLabel}:
              </span>
              <div className="flex items-center gap-2.5" dir="ltr">
                <button
                  type="button"
                  onClick={() => onChangeFamily({ wivesCount: Math.max(0, family.wivesCount - 1) })}
                  disabled={family.wivesCount <= 0}
                  aria-label="Decrease wives count"
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200/80 flex items-center justify-center text-stone-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold font-mono text-base text-[#022C22]">
                  {family.wivesCount}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeFamily({ wivesCount: Math.min(4, family.wivesCount + 1) })}
                  disabled={family.wivesCount >= 4}
                  aria-label="Increase wives count"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#022C22] to-[#064E3B] hover:from-[#064E3B] hover:to-[#059669] active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm ring-1 ring-[#D4AF37]/30"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          ) : (
            /* Husband Toggle (0 or 1) with Sliding Indicator */
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-medium text-stone-700">
                {t.husbandSurvivedLabel}
              </span>
              <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => onChangeFamily({ husbandPresent: true })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    family.husbandPresent
                      ? 'bg-[#022C22] text-amber-200 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.yes}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFamily({ husbandPresent: false })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !family.husbandPresent
                      ? 'bg-stone-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.no}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Parents (Walidain) */}
        <div className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 space-y-4 ${
          isParentsActive 
            ? 'border-[#059669]/40 bg-gradient-to-b from-white to-[#F0FDF4]/40 shadow-sm' 
            : 'border-stone-200/80 bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 ring-1 ring-emerald-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#022C22]">
                  {t.parentsHeader}
                </h3>
                <span className="text-[10px] text-stone-400">Mother & Father status</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#064E3B] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 font-sans">
              {t.catZawilFuroozAsabah}
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {/* Father Segmented Pill Control */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">
                {t.fatherLabel}:
              </span>
              <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => onChangeFamily({ fatherAlive: true })}
                  className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    family.fatherAlive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.alive}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFamily({ fatherAlive: false })}
                  className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !family.fatherAlive
                      ? 'bg-stone-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.deceased}
                </button>
              </div>
            </div>

            {/* Mother Segmented Pill Control */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-700">
                {t.motherLabel}:
              </span>
              <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => onChangeFamily({ motherAlive: true })}
                  className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    family.motherAlive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.alive}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFamily({ motherAlive: false })}
                  className={`px-3.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    !family.motherAlive
                      ? 'bg-stone-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.deceased}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Children (Aulad - Sons & Daughters) */}
        <div className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 space-y-4 ${
          isChildrenActive 
            ? 'border-[#059669]/40 bg-gradient-to-b from-white to-[#F0FDF4]/40 shadow-sm' 
            : 'border-stone-200/80 bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 ring-1 ring-blue-200">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#022C22]">
                  {t.childrenHeader}
                </h3>
                <span className="text-[10px] text-stone-400">Residuary distribution</span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/70 font-sans">
              {family.sonsCount > 0 ? (language === 'ur' ? 'عصبہ (۲:۱ حصہ)' : t.catAsabah2to1) : t.catZawilFurooz}
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Sons Counter */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  {t.sonsLabel}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">{t.sonPortionLabel}</span>
              </div>
              <div className="flex items-center gap-2.5" dir="ltr">
                <button
                  type="button"
                  onClick={() => onChangeFamily({ sonsCount: Math.max(0, family.sonsCount - 1) })}
                  disabled={family.sonsCount <= 0}
                  aria-label="Decrease sons count"
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200/80 flex items-center justify-center text-stone-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold font-mono text-base text-[#022C22]">
                  {family.sonsCount}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeFamily({ sonsCount: Math.min(10, family.sonsCount + 1) })}
                  disabled={family.sonsCount >= 10}
                  aria-label="Increase sons count"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#022C22] to-[#064E3B] hover:from-[#064E3B] hover:to-[#059669] active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm ring-1 ring-[#D4AF37]/30"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>

            {/* Daughters Counter */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-800 block">
                  {t.daughtersLabel}
                </span>
                <span className="text-[10px] text-stone-500 font-medium">{t.daughterPortionLabel}</span>
              </div>
              <div className="flex items-center gap-2.5" dir="ltr">
                <button
                  type="button"
                  onClick={() => onChangeFamily({ daughtersCount: Math.max(0, family.daughtersCount - 1) })}
                  disabled={family.daughtersCount <= 0}
                  aria-label="Decrease daughters count"
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200/80 flex items-center justify-center text-stone-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold font-mono text-base text-[#022C22]">
                  {family.daughtersCount}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeFamily({ daughtersCount: Math.min(10, family.daughtersCount + 1) })}
                  disabled={family.daughtersCount >= 10}
                  aria-label="Increase daughters count"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#022C22] to-[#064E3B] hover:from-[#064E3B] hover:to-[#059669] active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm ring-1 ring-[#D4AF37]/30"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Siblings (Behan / Bhai) with Frosted Amber Legal Seal look */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 space-y-4 ${
          siblingsBlocked 
            ? 'border-amber-300/80 bg-gradient-to-b from-amber-50/40 to-amber-100/30' 
            : isSiblingsActive
            ? 'border-[#059669]/40 bg-gradient-to-b from-white to-[#F0FDF4]/40 shadow-sm'
            : 'border-stone-200/80 bg-white'
        }`}>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 ring-1 ring-purple-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#022C22]">
                  {t.siblingsHeader}
                </h3>
                <span className="text-[10px] text-stone-400">Kalalah collateral line</span>
              </div>
            </div>
            {siblingsBlocked ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-950 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                {t.catMahjoob}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/70 font-sans">
                {t.catKalalah}
              </span>
            )}
          </div>

          {/* Blocking Banner Styled as Frosted Legal Seal Callout */}
          {siblingsBlocked && (
            <div className="p-3 bg-amber-100/80 border border-amber-300/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-xs">
                  {t.blockedNoticeTitle}
                </span>
                <span className="text-[11px] text-amber-900 leading-relaxed block mt-0.5">
                  {t.blockedNoticeText}
                </span>
              </div>
            </div>
          )}

          <div className={`space-y-3.5 pt-1 ${siblingsBlocked ? 'opacity-35 pointer-events-none select-none' : ''}`}>
            {/* Brothers Counter */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">
                {t.brothersLabel}
              </span>
              <div className="flex items-center gap-2.5" dir="ltr">
                <button
                  type="button"
                  onClick={() => onChangeFamily({ brothersCount: Math.max(0, family.brothersCount - 1) })}
                  disabled={family.brothersCount <= 0 || siblingsBlocked}
                  aria-label="Decrease brothers count"
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200/80 flex items-center justify-center text-stone-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold font-mono text-base text-[#022C22]">
                  {family.brothersCount}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeFamily({ brothersCount: Math.min(10, family.brothersCount + 1) })}
                  disabled={family.brothersCount >= 10 || siblingsBlocked}
                  aria-label="Increase brothers count"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#022C22] to-[#064E3B] hover:from-[#064E3B] hover:to-[#059669] active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm ring-1 ring-[#D4AF37]/30"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>

            {/* Sisters Counter */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">
                {t.sistersLabel}
              </span>
              <div className="flex items-center gap-2.5" dir="ltr">
                <button
                  type="button"
                  onClick={() => onChangeFamily({ sistersCount: Math.max(0, family.sistersCount - 1) })}
                  disabled={family.sistersCount <= 0 || siblingsBlocked}
                  aria-label="Decrease sisters count"
                  className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 border border-stone-200/80 flex items-center justify-center text-stone-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold font-mono text-base text-[#022C22]">
                  {family.sistersCount}
                </span>
                <button
                  type="button"
                  onClick={() => onChangeFamily({ sistersCount: Math.min(10, family.sistersCount + 1) })}
                  disabled={family.sistersCount >= 10 || siblingsBlocked}
                  aria-label="Increase sisters count"
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#022C22] to-[#064E3B] hover:from-[#064E3B] hover:to-[#059669] active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm ring-1 ring-[#D4AF37]/30"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
