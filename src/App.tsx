/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Home, 
  Sparkles, 
  Scale,
  HelpCircle
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AssetPipeline } from './components/AssetPipeline';
import { FamilyTreeSelector } from './components/FamilyTreeSelector';
import { ResultsDashboard } from './components/ResultsDashboard';
import { HikmatCard } from './components/HikmatCard';
import { BuyOutSimulator } from './components/BuyOutSimulator';
import { PrintTaqseemNamaModal } from './components/PrintTaqseemNamaModal';
import { FiqhAdvisorModal } from './components/FiqhAdvisorModal';
import { 
  calculateMirath, 
  formatPKR
} from './utils/mirathEngine';
import type { 
  EstateInputs, 
  FamilyTree 
} from './utils/mirathEngine';
import type { Language } from './utils/translations';
import { translations } from './utils/translations';

// Default initial state: Preset 1 - "Standard Family Case (2 Crore PKR)"
const INITIAL_ESTATE: EstateInputs = {
  cash: 5000000,
  property: 15000000,
  goldSilver: 0,
  otherAssets: 0,
  funeralExpenses: 0,
  debtsAndMehr: 0,
  wasiyyat: 0
};

const INITIAL_FAMILY: FamilyTree = {
  deceasedGender: 'male',
  deceasedName: 'Muhammad Aslam',
  wivesCount: 1,
  husbandPresent: false,
  fatherAlive: true,
  motherAlive: true,
  sonsCount: 2,
  daughtersCount: 1,
  brothersCount: 0,
  sistersCount: 0
};

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'calculator' | 'buyout'>('calculator');
  const [activePreset, setActivePreset] = useState<string | null>('standard');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);

  const [estate, setEstate] = useState<EstateInputs>(INITIAL_ESTATE);
  const [family, setFamily] = useState<FamilyTree>(INITIAL_FAMILY);

  const t = translations[language];

  // Sync document direction and language attribute with active state
  useEffect(() => {
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'ur' ? 'ur' : 'en';
  }, [language]);

  // Recalculate inheritance on any change deterministically
  const calculation = useMemo(() => {
    return calculateMirath(estate, family);
  }, [estate, family]);

  // Handle estate input changes
  const handleEstateChange = (updated: Partial<EstateInputs>) => {
    setActivePreset(null);
    setEstate(prev => ({ ...prev, ...updated }));
  };

  // Handle family input changes
  const handleFamilyChange = (updated: Partial<FamilyTree>) => {
    setActivePreset(null);
    setFamily(prev => ({ ...prev, ...updated }));
  };

  // Preset Loaders
  const handleLoadPreset = (presetId: 'standard' | 'daughters' | 'debt_will') => {
    setActivePreset(presetId);
    if (presetId === 'standard') {
      setEstate({
        cash: 5000000,
        property: 15000000,
        goldSilver: 0,
        otherAssets: 0,
        funeralExpenses: 0,
        debtsAndMehr: 0,
        wasiyyat: 0
      });
      setFamily({
        deceasedGender: 'male',
        deceasedName: 'Muhammad Aslam',
        wivesCount: 1,
        husbandPresent: false,
        fatherAlive: true,
        motherAlive: true,
        sonsCount: 2,
        daughtersCount: 1,
        brothersCount: 0,
        sistersCount: 0
      });
    } else if (presetId === 'daughters') {
      setEstate({
        cash: 15000000,
        property: 0,
        goldSilver: 0,
        otherAssets: 0,
        funeralExpenses: 0,
        debtsAndMehr: 0,
        wasiyyat: 0
      });
      setFamily({
        deceasedGender: 'male',
        deceasedName: 'Tariq Mahmood',
        wivesCount: 1,
        husbandPresent: false,
        fatherAlive: false,
        motherAlive: false,
        sonsCount: 0,
        daughtersCount: 2,
        brothersCount: 0,
        sistersCount: 0
      });
    } else if (presetId === 'debt_will') {
      setEstate({
        cash: 10000000,
        property: 0,
        goldSilver: 0,
        otherAssets: 0,
        funeralExpenses: 100000, // 1 Lakh funeral
        debtsAndMehr: 1500000,   // 15 Lakh unpaid Haq-Mehr
        wasiyyat: 4000000       // 40 Lakh will (triggers 1/3 cap alert)
      });
      setFamily({
        deceasedGender: 'male',
        deceasedName: 'Haji Abdul Rehman',
        wivesCount: 1,
        husbandPresent: false,
        fatherAlive: false,
        motherAlive: false,
        sonsCount: 1,
        daughtersCount: 0,
        brothersCount: 0,
        sistersCount: 0
      });
    }
  };

  return (
    <div 
      dir={language === 'ur' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#F7F5F0] text-stone-900 transition-colors selection:bg-[#D4AF37]/30 selection:text-[#022C22] relative ${
        language === 'ur' ? 'font-urdu leading-[2.2] text-right' : 'font-sans text-left'
      }`}
    >
      {/* Top Ambient Glow */}
      <div 
        className="absolute top-0 inset-x-0 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.08), transparent 70%)'
        }}
      />
      
      {/* Sticky Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        onLoadPreset={handleLoadPreset}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenAdvisorModal={() => setIsAdvisorModalOpen(true)}
        activePreset={activePreset}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Hero Banner with Royal Obsidian-Emerald Mesh Gradient & Islamic Lattice */}
        <section className="bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F2E] rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-emerald-950/20 ring-1 ring-[#D4AF37]/30 relative overflow-hidden">
          {/* Subtle Islamic Lattice Background */}
          <div className="absolute inset-0 islamic-pattern pointer-events-none" />

          {/* Right Geometric Watermark Emblem */}
          <div className="absolute right-0 rtl:right-auto rtl:left-0 top-0 bottom-0 opacity-20 pointer-events-none flex items-center pr-6 rtl:pr-0 rtl:pl-6">
            <img 
              src="/virasat-ai-favicon.webp" 
              alt="Virasat AI Emblem" 
              className="w-48 h-48 sm:w-64 sm:h-64 object-contain filter drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-stone-950 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-stone-950" />
              <span>{t.fiqhBadge}</span>
            </div>

            <h1 className={`text-3xl sm:text-5xl leading-tight text-[#F9F1D8] ${
              language === 'ur' ? 'font-urdu font-normal leading-[2.2]' : 'font-serif-title tracking-wide'
            }`}>
              {language === 'ur' ? 'وراثت اے آئی — شرعی تقسیمِ ترکہ' : 'Virasat AI — Sacred Inheritance & Settlement'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 font-normal leading-relaxed max-w-xl tracking-normal">
              {language === 'ur'
                ? 'قرآن و سنت، فقہ حنفی اور پاکستان مسلم عائلی قوانین کے مطابق ترکہ کی ۱۰۰٪ مصدقہ حسابی تقسیم، خاندانی مکان تخارج سمیلیٹر، اور باضابطہ قانونی تقسیم نامہ۔'
                : '100% Deterministic Sunni Hanafi Islamic Inheritance calculation, Quranic wisdom empathy layer, practical house buy-out simulator, and printable family settlement deeds.'}
            </p>

            {/* Quick Stats Command Badges */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5 text-xs">
              <div className="bg-[#022C22]/80 backdrop-blur-md px-4 py-2.5 rounded-xl ring-1 ring-[#D4AF37]/40 flex items-center shadow-sm gap-2">
                <span className="text-emerald-300 text-xs font-medium">{t.netDistributable}:</span>
                <span className="font-bold text-[#F9F1D8] font-mono-num text-sm">{formatPKR(calculation.netDistributableEstatePKR)}</span>
              </div>
              <div className="bg-[#022C22]/80 backdrop-blur-md px-4 py-2.5 rounded-xl ring-1 ring-[#D4AF37]/40 flex items-center shadow-sm gap-2">
                <span className="text-emerald-300 text-xs font-medium">{language === 'ur' ? 'حقدار فریق:' : 'Active Heirs:'}</span>
                <span className="font-bold text-white font-mono-num">{calculation.heirs.length}</span>
                <span className="font-medium text-emerald-100">{language === 'ur' ? 'گروپس' : 'Groups'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAdvisorModalOpen(true)}
                className="bg-gradient-to-r from-[#D4AF37] to-[#AA771C] hover:brightness-105 active:scale-95 text-stone-950 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{language === 'ur' ? 'فقہی تنازعات کا حل' : 'Family Dispute Advisor'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Tab Navigation: Calculator vs Buy-Out Simulator with Luxury Indicators */}
        <div className="flex items-center gap-4 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-3 py-3.5 px-6 font-semibold tracking-wide text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'border-[#064E3B] text-[#022C22] bg-white/70 rounded-t-xl shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-[#022C22]/10 flex items-center justify-center shrink-0">
              <img 
                src="/virasat-ai-icon-step1-assets.webp" 
                alt="Calculator" 
                className="w-4 h-4 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span>{t.tabCalculator}</span>
          </button>

          <button
            onClick={() => setActiveTab('buyout')}
            className={`flex items-center gap-3 py-3.5 px-6 font-semibold tracking-wide text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'buyout'
                ? 'border-[#064E3B] text-[#022C22] bg-white/70 rounded-t-xl shadow-2xs'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-[#022C22]/10 flex items-center justify-center shrink-0">
              <img 
                src="/virasat-ai-icon-step4-buyout.webp" 
                alt="Makan Buy-Out" 
                className="w-4 h-4 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span>{t.tabBuyOut}</span>
          </button>
        </div>

        {/* Tab 1: Calculator & Cap Table */}
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            
            {/* Step 1: Wise-Style Assets & Deductions Pipeline */}
            <AssetPipeline
              estate={estate}
              onChangeEstate={handleEstateChange}
              calculation={calculation}
              language={language}
            />

            {/* Step 2: Interactive Family Tree with Hajb Rules */}
            <FamilyTreeSelector
              family={family}
              onChangeFamily={handleFamilyChange}
              language={language}
            />

            {/* Step 3: Results Bento Grid Dashboard (Donut + Cap Table) */}
            <ResultsDashboard
              calculation={calculation}
              language={language}
            />

            {/* AI Hikmat & Quranic Daleel Section */}
            <HikmatCard
              heirs={calculation.heirs}
              language={language}
            />

          </div>
        )}

        {/* Tab 2: Practical Makan Buy-Out Simulator (Takhruj) */}
        {activeTab === 'buyout' && (
          <div className="space-y-8">
            <BuyOutSimulator
              initialPropertyValue={estate.property > 0 ? estate.property : 15000000}
              heirs={calculation.heirs}
              language={language}
            />
          </div>
        )}

        {/* Footer & Shariah Disclaimer */}
        <footer className="pt-10 pb-20 border-t border-stone-200 text-center text-xs text-stone-500 space-y-2.5">
          <div className="flex items-center justify-center gap-2 text-[#022C22] font-semibold">
            <img 
              src="/virasat-ai-favicon.webp" 
              alt="Virasat AI Emblem" 
              className="w-5 h-5 object-contain inline-block shrink-0 shadow-xs" 
              referrerPolicy="no-referrer"
            />
            <span className="font-serif-title text-sm">Virasat AI — 100% Deterministic Islamic Inheritance Engine</span>
          </div>
          <p className="max-w-2xl mx-auto text-[11px] leading-relaxed text-stone-400">
            {t.disclaimer}
          </p>
          <div className="pt-2 text-[10px] text-stone-400 font-mono">
            Designed with Royal Heritage Aesthetics • Built for Pakistan Succession & Muslim Family Laws
          </div>
        </footer>

      </main>

      {/* Floating Emerald "Virasat AI — Fiqh Scenario Advisor" Button */}
      <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40">
        <button
          type="button"
          onClick={() => setIsAdvisorModalOpen(true)}
          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#022C22] via-[#064E3B] to-[#042F2E] hover:from-[#064E3B] hover:to-[#059669] text-white font-bold rounded-2xl shadow-2xl shadow-emerald-950/30 ring-1 ring-[#D4AF37]/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
          title="Open Pakistani Family Dispute Resolution Advisor"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA771C] text-stone-950 flex items-center justify-center shrink-0 shadow-xs group-hover:rotate-12 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left rtl:text-right">
            <div className={`text-xs font-bold flex items-center gap-1.5 ${language === 'ur' ? 'font-urdu' : 'font-sans'}`}>
              <span>{t.advisorBtn}</span>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping inline-block" />
            </div>
            <div className={`text-[10px] text-emerald-200 font-normal ${language === 'ur' ? 'font-urdu leading-normal' : ''}`}>
              {language === 'ur' ? '۶ عام خاندانی تنازعات کا شرعی حل' : '6 Complex Pakistani Cases'}
            </div>
          </div>
        </button>
      </div>

      {/* Official Printable Taqseem-Nama Modal */}
      <PrintTaqseemNamaModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        estate={estate}
        family={family}
        calculation={calculation}
        language={language}
      />

      {/* Fiqh Scenario Advisor Modal */}
      <FiqhAdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        family={family}
        estate={estate}
        heirs={calculation.heirs}
        language={language}
      />

    </div>
  );
}
