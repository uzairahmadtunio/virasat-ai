import React, { useState } from 'react';
import { 
  Coins, 
  Building2, 
  Gem, 
  Briefcase, 
  TrendingDown,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import type { EstateInputs, MirathCalculationResult } from '../utils/mirathEngine';
import { 
  formatPKR, 
  getPakistaniUnit,
  tolasToPKR,
  pkrToTolas,
  GOLD_RATES,
  GOLD_RATE_PER_TOLA_PKR,
  type GoldPurity,
  type GoldWeightUnit,
  getGoldRate,
  goldWeightToPKR,
  pkrToGoldWeight
} from '../utils/mirathEngine';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';

interface AssetPipelineProps {
  estate: EstateInputs;
  onChangeEstate: (updated: Partial<EstateInputs>) => void;
  calculation: MirathCalculationResult;
  language: Language;
}

export const AssetPipeline: React.FC<AssetPipelineProps> = ({
  estate,
  onChangeEstate,
  calculation,
  language
}) => {
  const t = translations[language];
  const [goldUnit, setGoldUnit] = useState<'pkr' | 'tola' | '10grams' | 'gram'>('pkr');
  const [goldPurity, setGoldPurity] = useState<GoldPurity>('24K');
  const [showGoldRates, setShowGoldRates] = useState<boolean>(false);

  const currentWeight = goldUnit !== 'pkr' ? pkrToGoldWeight(estate.goldSilver, goldUnit, goldPurity) : 0;
  const currentTolasEquivalent = pkrToGoldWeight(estate.goldSilver, 'tola', goldPurity);

  const handleAutoCapWasiyyat = () => {
    onChangeEstate({ wasiyyat: Math.floor(calculation.maxPermissibleWasiyyatPKR) });
  };

  const totalDeductions = estate.funeralExpenses + estate.debtsAndMehr + estate.wasiyyat;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 space-y-7 transition-all">
      
      {/* Step Header */}
      <div className="border-b border-stone-200/60 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F2E] p-2 ring-1 ring-[#D4AF37]/40 shadow-sm flex items-center justify-center shrink-0">
              <img 
                src="/virasat-ai-icon-step1-assets.webp" 
                alt="Step 1: Tirkah & Assets" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-[#022C22] text-[#D4AF37] text-[10px] font-bold tracking-wider shrink-0 font-mono">
                  STEP 01
                </span>
                <h2 className={`text-xl sm:text-2xl font-bold text-[#022C22] ${
                  language === 'ur' ? 'font-urdu' : 'font-serif-title tracking-wide'
                }`}>
                  {t.step1Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal tracking-normal">
                {t.step1Subtitle}
              </p>
            </div>
          </div>

          <div className="text-left rtl:text-right sm:text-right">
            <span className={`text-[11px] font-semibold text-stone-400 block ${
              language === 'ur' ? 'font-urdu' : 'uppercase tracking-widest font-sans'
            }`}>
              {t.grossEstate}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#022C22] font-mono-num" dir="ltr">
              {formatPKR(calculation.grossEstatePKR)}
            </div>
            <span className="text-xs text-[#064E3B] font-semibold font-mono-num block" dir="ltr">
              ({getPakistaniUnit(calculation.grossEstatePKR)})
            </span>
          </div>
        </div>
      </div>

      {/* Part A: Estate Assets Grid styled as Tactile Wealth Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xs font-bold text-[#064E3B] flex items-center gap-2 ${
            language === 'ur' ? 'font-urdu text-sm' : 'uppercase tracking-widest'
          }`}>
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            {t.assetsHeader}
          </h3>
          <span className="text-xs text-stone-400 font-mono-num font-medium">
            PKR Assets & Commodities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Module 1: Cash / Bank Balance */}
          <div className="group p-5 rounded-2xl border border-stone-200/80 bg-white hover:border-[#059669]/50 hover:shadow-md transition-all duration-300">
            {/* Top Row: Squircle Icon + Title + Live Badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#064E3B]/10 text-[#064E3B] flex items-center justify-center shrink-0 ring-1 ring-[#064E3B]/20">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <label htmlFor="cash-input" className="text-xs font-bold text-[#022C22] block">
                    {t.cashLabel}
                  </label>
                  <span className="text-[10px] text-stone-400">Liquid reserves</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold font-serif-title bg-[#064E3B]/5 text-[#064E3B] border border-[#064E3B]/15">
                {getPakistaniUnit(estate.cash)}
              </span>
            </div>

            {/* Giant Borderless Input with Animated Underline */}
            <div className="relative pt-1 pb-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-stone-400 font-mono">PKR</span>
                <input
                  id="cash-input"
                  type="number"
                  dir="ltr"
                  min="0"
                  step="50000"
                  value={estate.cash || ''}
                  onChange={(e) => onChangeEstate({ cash: Number(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-[#022C22] placeholder-stone-300 focus:outline-none"
                />
              </div>
              <div className="w-full h-0.5 bg-stone-100 group-hover:bg-[#059669]/40 transition-colors mt-1" />
            </div>

            {/* Smooth Interactive Range Slider */}
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="50000000"
                step="250000"
                value={Math.min(50000000, estate.cash)}
                onChange={(e) => onChangeEstate({ cash: Number(e.target.value) })}
                className="w-full accent-[#064E3B] cursor-pointer h-1.5 bg-stone-100 rounded-lg appearance-none"
              />
            </div>

            {/* Tactile Quick-Add Chips */}
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onChangeEstate({ cash: estate.cash + 1000000 })}
                className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
              >
                {t.btn10Laakh}
              </button>
              <button
                type="button"
                onClick={() => onChangeEstate({ cash: estate.cash + 5000000 })}
                className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
              >
                {t.btn50Laakh}
              </button>
              <button
                type="button"
                onClick={() => onChangeEstate({ cash: estate.cash + 10000000 })}
                className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
              >
                +1 Crore
              </button>
            </div>
          </div>

          {/* Module 2: Real Estate / Property */}
          <div className="group p-5 rounded-2xl border border-stone-200/80 bg-white hover:border-teal-500/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-900/10 text-teal-800 flex items-center justify-center shrink-0 ring-1 ring-teal-700/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <label htmlFor="property-input" className="text-xs font-bold text-[#022C22] block">
                    {t.propertyLabel}
                  </label>
                  <span className="text-[10px] text-stone-400">Plots, houses & land</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold font-serif-title bg-teal-50 text-teal-900 border border-teal-200">
                {getPakistaniUnit(estate.property)}
              </span>
            </div>

            <div className="relative pt-1 pb-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-stone-400 font-mono">PKR</span>
                <input
                  id="property-input"
                  type="number"
                  dir="ltr"
                  min="0"
                  step="100000"
                  value={estate.property || ''}
                  onChange={(e) => onChangeEstate({ property: Number(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-[#022C22] placeholder-stone-300 focus:outline-none"
                />
              </div>
              <div className="w-full h-0.5 bg-stone-100 group-hover:bg-teal-600/40 transition-colors mt-1" />
            </div>

            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="100000000"
                step="500000"
                value={Math.min(100000000, estate.property)}
                onChange={(e) => onChangeEstate({ property: Number(e.target.value) })}
                className="w-full accent-teal-800 cursor-pointer h-1.5 bg-stone-100 rounded-lg appearance-none"
              />
            </div>

            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onChangeEstate({ property: 10000000 })}
                className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
              >
                {t.btn1Crore}
              </button>
              <button
                type="button"
                onClick={() => onChangeEstate({ property: 20000000 })}
                className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
              >
                {t.btn2Crore}
              </button>
              <button
                type="button"
                onClick={() => onChangeEstate({ property: 30000000 })}
                className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
              >
                {t.btn3Crore}
              </button>
            </div>
          </div>

          {/* Module 3: Gold & Silver Commodity Module (with Official Purity Rates) */}
          <div className="group p-5 rounded-2xl border border-[#D4AF37]/50 bg-gradient-to-b from-white via-amber-50/20 to-amber-100/10 hover:border-[#D4AF37] hover:shadow-md transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shrink-0 shadow-sm ring-1 ring-amber-400/40">
                  <Gem className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <label htmlFor="gold-input" className="text-xs font-bold text-[#022C22] block">
                      {t.goldLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGoldRates(!showGoldRates)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100/80 hover:bg-amber-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer border border-amber-300/60"
                      title="View Official Market Rates by Purity"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                      <span>{showGoldRates ? (language === 'ur' ? 'ریٹس چھپائیں' : 'Hide Rates') : (language === 'ur' ? 'مارکیٹ ریٹ لسٹ' : 'Official Rates')}</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">
                    24K: Rs. 434,000 | 22K: Rs. 397,941 / Tola
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold font-serif-title bg-amber-50 text-amber-950 border border-amber-200">
                  {getPakistaniUnit(estate.goldSilver)}
                </span>
              </div>
            </div>

            {/* Purity & Unit Selection Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-3 mb-2 bg-[#F7F5F0] rounded-xl border border-stone-200/80">
              {/* Purity Selector: 24K vs 22K */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mr-1">
                  {language === 'ur' ? 'قیراط:' : 'Purity:'}
                </span>
                {(['24K', '22K'] as GoldPurity[]).map((purity) => (
                  <button
                    key={purity}
                    type="button"
                    onClick={() => {
                      setGoldPurity(purity);
                      if (goldUnit !== 'pkr') {
                        // Recalculate PKR based on current weight in new purity
                        onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight, goldUnit, purity) });
                      }
                    }}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      goldPurity === purity
                        ? 'bg-[#022C22] text-[#F9F1D8] shadow-xs'
                        : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                    }`}
                  >
                    {purity === '24K' ? t.goldPurity24K : t.goldPurity22K}
                  </button>
                ))}
              </div>

              {/* Measurement Unit Selector: PKR, Tola, 10g, Gram */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mr-1">
                  {language === 'ur' ? 'پیمانہ:' : 'Unit:'}
                </span>
                <div className="flex items-center bg-white p-0.5 rounded-lg border border-stone-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setGoldUnit('pkr')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      goldUnit === 'pkr'
                        ? 'bg-[#022C22] text-[#F9F1D8]'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {t.goldUnitPKR}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoldUnit('tola')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      goldUnit === 'tola'
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {t.goldUnitTola}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoldUnit('10grams')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      goldUnit === '10grams'
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {t.goldUnit10Grams}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGoldUnit('gram')}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                      goldUnit === 'gram'
                        ? 'bg-amber-600 text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {t.goldUnitGram}
                  </button>
                </div>
              </div>
            </div>

            {/* Official Rates Table Breakdown (Expanded or Collapsible) */}
            {showGoldRates && (
              <div className="my-3 p-3.5 bg-gradient-to-br from-[#022C22] to-[#064E3B] rounded-xl text-stone-100 shadow-md ring-1 ring-[#D4AF37]/30 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-800/80">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="font-bold text-[#F9F1D8]">{t.goldRatesTitle}</span>
                  </div>
                  <span className="text-[10px] text-emerald-200/80 font-mono">Sarafa Benchmark (PKR)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left rtl:text-right border-collapse">
                    <thead>
                      <tr className={`text-[10px] text-emerald-300/90 border-b border-emerald-800/60 ${language === 'ur' ? 'font-urdu text-sm' : 'uppercase tracking-wider font-mono'}`}>
                        <th className="py-1 px-2">{language === 'ur' ? 'قیراط' : 'Purity'}</th>
                        <th className="py-1 px-2">{t.goldPerTola}</th>
                        <th className="py-1 px-2">{t.goldPer10Grams}</th>
                        <th className="py-1 px-2">{t.goldPerGram}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-800/40 text-[11px]">
                      <tr className={`${goldPurity === '24K' ? 'bg-emerald-900/50 font-bold text-[#F9F1D8]' : 'text-stone-200'}`}>
                        <td className="py-1.5 px-2 font-bold">
                          <span className="font-mono">24K</span>{' '}
                          <span className={`text-[10px] text-emerald-300 font-normal ${language === 'ur' ? 'font-urdu' : ''}`}>
                            {language === 'ur' ? '(خالص سونا)' : '(Pure Gold)'}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-[#D4AF37] font-mono font-bold">PKR 434,000</td>
                        <td className="py-1.5 px-2 font-mono">PKR 372,090</td>
                        <td className="py-1.5 px-2 font-mono">PKR 37,209</td>
                      </tr>
                      <tr className={`${goldPurity === '22K' ? 'bg-emerald-900/50 font-bold text-[#F9F1D8]' : 'text-stone-200'}`}>
                        <td className="py-1.5 px-2 font-bold">
                          <span className="font-mono">22K</span>{' '}
                          <span className={`text-[10px] text-emerald-300 font-normal ${language === 'ur' ? 'font-urdu' : ''}`}>
                            {language === 'ur' ? '(زیوراتی سونا)' : '(Jewellery Gold)'}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 text-[#D4AF37] font-mono font-bold">PKR 397,941</td>
                        <td className="py-1.5 px-2 font-mono">PKR 341,080</td>
                        <td className="py-1.5 px-2 font-mono">PKR 34,108</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Giant Input for Gold Value or Weight */}
            <div className="relative pt-1 pb-2">
              {goldUnit === 'pkr' ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-semibold text-stone-400 font-mono">PKR</span>
                  <input
                    id="gold-input"
                    type="number"
                    dir="ltr"
                    min="0"
                    step="25000"
                    value={estate.goldSilver || ''}
                    onChange={(e) => onChangeEstate({ goldSilver: Number(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-[#022C22] placeholder-stone-300 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <input
                    id="gold-input"
                    type="number"
                    dir="ltr"
                    min="0"
                    step={goldUnit === 'gram' ? '1' : '0.25'}
                    value={currentWeight || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      onChangeEstate({ goldSilver: goldWeightToPKR(val, goldUnit, goldPurity) });
                    }}
                    placeholder="0.00"
                    className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-amber-900 placeholder-stone-300 focus:outline-none"
                  />
                  <span className="text-base font-bold text-amber-800 font-serif-title">
                    {goldUnit === 'tola' && (language === 'ur' ? 'تولہ' : 'Tolas')}
                    {goldUnit === '10grams' && (language === 'ur' ? '۱۰ گرام یونٹس' : 'x 10 Grams')}
                    {goldUnit === 'gram' && (language === 'ur' ? 'گرام' : 'Grams')}
                    <span className="text-xs text-amber-600 font-mono ml-1.5 font-normal">({goldPurity})</span>
                  </span>
                </div>
              )}
              <div className="w-full h-0.5 bg-stone-100 group-hover:bg-amber-500/50 transition-colors mt-1" />
            </div>

            {/* Live Dual Unit Converted Indicator */}
            <div className="flex flex-wrap items-center justify-between text-xs pt-1">
              {goldUnit !== 'pkr' ? (
                <div className="text-[#064E3B] font-bold flex items-center gap-1.5">
                  <span className={`text-[10px] text-stone-500 ${language === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                    {t.goldConvertedValue}
                  </span>
                  <span className="font-mono text-emerald-900">{formatPKR(estate.goldSilver)}</span>
                  <span className="text-[10px] text-stone-500 font-serif-title">({getPakistaniUnit(estate.goldSilver)})</span>
                </div>
              ) : (
                <div className="text-amber-900 font-medium flex items-center gap-1.5">
                  <span className={`text-[10px] text-stone-500 ${language === 'ur' ? 'font-urdu' : 'font-sans'}`}>
                    {t.goldTolaEquivalent}
                  </span>
                  <span className="font-bold font-mono">{currentTolasEquivalent}</span>
                  <span className={language === 'ur' ? 'font-urdu text-xs' : 'font-sans text-xs'}>
                    {language === 'ur' ? 'تولہ' : 'Tolas'}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">({(currentTolasEquivalent * 11.6638).toFixed(1)}g)</span>
                </div>
              )}
              <span className="text-[10px] text-stone-500 font-mono">
                @ PKR {getGoldRate(goldPurity, goldUnit === 'pkr' ? 'tola' : goldUnit).toLocaleString()} / {goldUnit === 'pkr' || goldUnit === 'tola' ? (language === 'ur' ? 'تولہ' : 'Tola') : goldUnit === '10grams' ? '10g' : (language === 'ur' ? 'گرام' : 'Gram')} ({goldPurity})
              </span>
            </div>

            {/* Quick Increment Chips tailored by unit & purity */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-stone-100">
              {goldUnit === 'pkr' && (
                <>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: estate.goldSilver + 500000 })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
                  >
                    {language === 'ur' ? '+۵ لاکھ' : '+5 Laakh'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: estate.goldSilver + 1000000 })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
                  >
                    {language === 'ur' ? '+۱۰ لاکھ' : '+10 Laakh'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: estate.goldSilver + getGoldRate(goldPurity, 'tola') })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    {language === 'ur' ? `+۱ تولہ (${goldPurity})` : `+1 Tola ${goldPurity} (${Math.round(getGoldRate(goldPurity, 'tola') / 1000)}k)`}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: estate.goldSilver + (getGoldRate(goldPurity, 'tola') * 5) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    {language === 'ur' ? `+۵ تولہ (${goldPurity})` : `+5 Tolas ${goldPurity}`}
                  </button>
                </>
              )}

              {goldUnit === 'tola' && (
                <>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 1, 'tola', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    {t.btn1Tola}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 5, 'tola', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    {t.btn5Tolas}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 10, 'tola', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    {t.btn10Tolas}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 25, 'tola', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    +25 Tolas
                  </button>
                </>
              )}

              {goldUnit === '10grams' && (
                <>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 1, '10grams', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    +1 (10g)
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 5, '10grams', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    +5 (50g)
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 10, '10grams', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    +10 (100g)
                  </button>
                </>
              )}

              {goldUnit === 'gram' && (
                <>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 10, 'gram', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    +10 Grams
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 50, 'gram', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    +50 Grams
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeEstate({ goldSilver: goldWeightToPKR(currentWeight + 100, 'gram', goldPurity) })}
                    className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 border border-amber-200/80 rounded-lg text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    +100 Grams
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Module 4: Other Assets */}
          <div className="group p-5 rounded-2xl border border-stone-200/80 bg-white hover:border-purple-500/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-900/10 text-purple-800 flex items-center justify-center shrink-0 ring-1 ring-purple-700/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <label htmlFor="other-assets-input" className="text-xs font-bold text-[#022C22] block">
                    {t.otherLabel}
                  </label>
                  <span className="text-[10px] text-stone-400">Business, vehicles, shares</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold font-serif-title bg-purple-50 text-purple-900 border border-purple-200">
                {getPakistaniUnit(estate.otherAssets)}
              </span>
            </div>

            <div className="relative pt-1 pb-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-stone-400 font-mono">PKR</span>
                <input
                  id="other-assets-input"
                  type="number"
                  dir="ltr"
                  min="0"
                  step="50000"
                  value={estate.otherAssets || ''}
                  onChange={(e) => onChangeEstate({ otherAssets: Number(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-[#022C22] placeholder-stone-300 focus:outline-none"
                />
              </div>
              <div className="w-full h-0.5 bg-stone-100 group-hover:bg-purple-600/40 transition-colors mt-1" />
            </div>

            <div className="pt-2">
              <input
                type="range"
                min="0"
                max="25000000"
                step="250000"
                value={Math.min(25000000, estate.otherAssets)}
                onChange={(e) => onChangeEstate({ otherAssets: Number(e.target.value) })}
                className="w-full accent-purple-800 cursor-pointer h-1.5 bg-stone-100 rounded-lg appearance-none"
              />
            </div>

            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onChangeEstate({ otherAssets: estate.otherAssets + 500000 })}
                className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
              >
                +5 Laakh
              </button>
              <button
                type="button"
                onClick={() => onChangeEstate({ otherAssets: estate.otherAssets + 2000000 })}
                className="px-2.5 py-1 text-[11px] font-medium bg-[#F7F5F0] hover:bg-[#064E3B] hover:text-white rounded-lg text-stone-700 transition-colors cursor-pointer"
              >
                +20 Laakh
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Part B: Huqooq-ut-Tirkah (Mandatory Pre-distribution Deductions) */}
      <div className="pt-2 border-t border-stone-200/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xs font-bold text-rose-800 flex items-center gap-2 ${
            language === 'ur' ? 'font-urdu text-sm' : 'uppercase tracking-widest'
          }`}>
            <TrendingDown className="w-4 h-4 text-rose-600" />
            {t.deductionsHeader}
          </h3>
          <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            - {getPakistaniUnit(totalDeductions)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Funeral */}
          <div className="p-4 rounded-2xl border border-rose-100 bg-white hover:border-rose-200 shadow-2xs">
            <label htmlFor="funeral-input" className="text-xs font-bold text-stone-800 block mb-1">
              {t.funeralLabel}
            </label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-2 text-xs font-mono font-semibold text-stone-400">Rs.</span>
              <input
                id="funeral-input"
                type="number"
                dir="ltr"
                min="0"
                step="10000"
                value={estate.funeralExpenses || ''}
                onChange={(e) => onChangeEstate({ funeralExpenses: Number(e.target.value) || 0 })}
                placeholder="0"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-400 text-left"
              />
            </div>
            <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
              {t.funeralHelp}
            </p>
          </div>

          {/* Debts & Haq-Mehr */}
          <div className="p-4 rounded-2xl border border-rose-200/80 bg-rose-50/30 hover:border-rose-300 shadow-2xs">
            <label htmlFor="debts-input" className="text-xs font-bold text-rose-950 block mb-1">
              {t.debtLabel}
            </label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-2 text-xs font-mono font-semibold text-stone-400">Rs.</span>
              <input
                id="debts-input"
                type="number"
                dir="ltr"
                min="0"
                step="50000"
                value={estate.debtsAndMehr || ''}
                onChange={(e) => onChangeEstate({ debtsAndMehr: Number(e.target.value) || 0 })}
                placeholder="0"
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-rose-300 text-xs font-mono font-bold text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500 text-left"
              />
            </div>
            <div className="mt-2 flex items-start gap-1.5 text-[10px] text-rose-900 bg-rose-100/70 p-2 rounded-lg">
              <Info className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
              <span>{t.debtTooltip}</span>
            </div>
          </div>

          {/* Wasiyyat (Will) */}
          <div className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 hover:border-amber-300 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="wasiyyat-input" className="text-xs font-bold text-amber-950">
                {t.wasiyyatLabel}
              </label>
              <span className="text-[10px] font-semibold text-amber-800 flex items-center gap-1">
                <span className={language === 'ur' ? 'font-urdu' : 'font-sans'}>{t.capLabel}</span>
                <span className="font-mono-num">{getPakistaniUnit(calculation.maxPermissibleWasiyyatPKR)}</span>
              </span>
            </div>
            <div className="relative mt-2">
              <span className="absolute left-3 top-2 text-xs font-mono font-semibold text-stone-400">Rs.</span>
              <input
                id="wasiyyat-input"
                type="number"
                dir="ltr"
                min="0"
                step="50000"
                value={estate.wasiyyat || ''}
                onChange={(e) => onChangeEstate({ wasiyyat: Number(e.target.value) || 0 })}
                placeholder="0"
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-left"
              />
            </div>
            <p className="text-[10px] text-stone-500 mt-2 leading-relaxed">
              {t.wasiyyatRuleNote}
            </p>
          </div>

        </div>

        {/* Wasiyyat Shariah Guardrail Alert */}
        {calculation.wasiyyatWarning && (
          <div className="mt-4 p-4 bg-amber-50 border border-[#D4AF37] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950 text-sm block">
                  {t.wasiyyatCapWarning}
                </span>
                <span className="text-amber-900 text-xs">
                  {language === 'ur' ? 'درج شدہ وصیت:' : 'Entered:'} {formatPKR(estate.wasiyyat)} | {language === 'ur' ? 'شرعی حد ۱/۳:' : 'Permissible 1/3 Limit:'} {formatPKR(calculation.maxPermissibleWasiyyatPKR)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoCapWasiyyat}
              className="shrink-0 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer"
            >
              {t.autoCapBtn}
            </button>
          </div>
        )}

      </div>

      {/* Part C: Floating Dark Obsidian-Emerald Command Bar */}
      <div className="bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F2E] rounded-2xl p-6 sm:p-7 text-white shadow-xl shadow-emerald-950/20 ring-1 ring-[#D4AF37]/30 relative overflow-hidden">
        {/* Subtle geometric corner accent */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-radial from-[#D4AF37]/10 to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
          
          <div>
            <span className={`text-[11px] font-semibold text-emerald-200/90 block ${
              language === 'ur' ? 'font-urdu' : 'uppercase tracking-widest font-sans'
            }`}>
              {t.grossEstate}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono-num text-white mt-1" dir="ltr">
              {formatPKR(calculation.grossEstatePKR)}
            </div>
            <span className="text-xs text-emerald-300/80 font-mono-num block mt-0.5" dir="ltr">
              ({getPakistaniUnit(calculation.grossEstatePKR)})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex text-[#D4AF37] p-2.5 rounded-xl bg-white/5 ring-1 ring-[#D4AF37]/30 shadow-xs shrink-0">
              <ArrowRight className={`w-5 h-5 ${language === 'ur' ? 'rotate-180' : ''}`} />
            </div>
            <div>
              <span className={`text-[11px] font-semibold text-rose-300/90 block ${
                language === 'ur' ? 'font-urdu' : 'uppercase tracking-widest font-sans'
              }`}>
                {t.totalDeductions}
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono-num text-rose-200 mt-1" dir="ltr">
                - {formatPKR(totalDeductions)}
              </div>
              {totalDeductions > 0 && (
                <span className="text-xs text-rose-300/70 font-mono-num block mt-0.5" dir="ltr">
                  ({getPakistaniUnit(totalDeductions)})
                </span>
              )}
            </div>
          </div>

          <div className="md:text-right border-t md:border-t-0 md:border-l rtl:md:border-l-0 rtl:md:border-r border-emerald-700/60 pt-4 md:pt-0 md:pl-6 rtl:md:pl-0 rtl:md:pr-6">
            <span className={`text-[11px] font-bold text-[#D4AF37] block flex md:justify-end items-center gap-1.5 ${
              language === 'ur' ? 'font-urdu' : 'uppercase tracking-widest font-sans'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              {t.netDistributable}
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono-num text-[#F9F1D8] mt-1" dir="ltr">
              {formatPKR(calculation.netDistributableEstatePKR)}
            </div>
            <div className="text-xs text-amber-300/90 font-semibold flex items-center md:justify-end gap-1.5 mt-1">
              <span className="font-mono-num" dir="ltr">({getPakistaniUnit(calculation.netDistributableEstatePKR)})</span>
              <span className={language === 'ur' ? 'font-urdu' : 'font-sans'}>{language === 'ur' ? 'قابلِ تقسیم ترکہ' : 'Net Tirkah'}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
