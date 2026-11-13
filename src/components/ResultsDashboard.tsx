import React, { useState } from 'react';
import { 
  PieChart, 
  Table, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import type { MirathCalculationResult } from '../utils/mirathEngine';
import { formatPKR, getPakistaniUnit } from '../utils/mirathEngine';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';
import { DonutChart } from './DonutChart';

interface ResultsDashboardProps {
  calculation: MirathCalculationResult;
  language: Language;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  calculation,
  language
}) => {
  const t = translations[language];
  const [highlightedHeirId, setHighlightedHeirId] = useState<string | null>(null);

  if (calculation.isEstateDepleted) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center text-rose-900 shadow-sm">
        <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-3" />
        <h3 className="font-bold text-lg font-serif-title">
          {language === 'ur' ? 'ترکہ ختم ہو چکا ہے' : 'Estate Depleted by Debts & Deductions'}
        </h3>
        <p className="text-xs sm:text-sm text-rose-700 mt-1.5 max-w-md mx-auto leading-relaxed">
          {language === 'ur'
            ? 'میت پر واجب الادا قرضہ جات اور تجہیز و تکفین کے اخراجات کل ترکہ کے برابر یا اس سے زائد ہیں۔ ورثاء میں تقسیم کے لیے کوئی رقم باقی نہیں بچی۔'
            : 'Pre-distribution obligations (debts, Mehr, funeral) equal or exceed gross assets. No distributable estate remains for heirs.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F2E] p-2 ring-1 ring-[#D4AF37]/40 shadow-sm flex items-center justify-center shrink-0">
            <img 
              src="/virasat-ai-icon-step3-cap-table.webp" 
              alt="Step 3: Shariah Cap Table" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-md bg-[#022C22] text-[#D4AF37] text-[10px] font-bold tracking-wider shrink-0 font-mono">
                STEP 03
              </span>
              <h2 className={`text-xl sm:text-2xl font-bold text-[#022C22] ${
                language === 'ur' ? 'font-urdu' : 'font-serif-title tracking-wide'
              }`}>
                {t.resultsTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal tracking-normal">
              {t.resultsSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-[#064E3B] border border-emerald-200/80 rounded-full text-xs font-bold shadow-2xs font-mono">
            Total Distributed: 100%
          </span>
        </div>
      </div>

      {/* Special Fiqh Case Callouts (Awl / Radd / Umariyyatayn) with Gold-accented Cards */}
      {calculation.isAwl && calculation.awlDetails && (
        <div className="p-4 bg-amber-50/80 border border-[#D4AF37] rounded-2xl flex items-start gap-3 shadow-2xs">
          <Scale className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950">
            <div className="font-bold text-sm font-serif-title">
              {language === 'ur' ? 'مسئلہ عول (Al-Awl Applied)' : 'Masla-e-Awl (Proportional Reduction Applied)'}
            </div>
            <p className="mt-1 leading-relaxed">
              {language === 'ur' ? calculation.awlDetails.explanationUrdu : calculation.awlDetails.explanationEn}
            </p>
          </div>
        </div>
      )}

      {calculation.isRadd && calculation.raddDetails && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl flex items-start gap-3 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <div className="font-bold text-sm font-serif-title">
              {language === 'ur' ? 'مسئلہ رد (Ar-Radd Applied)' : 'Masla-e-Radd (Proportional Return of Surplus Applied)'}
            </div>
            <p className="mt-1 leading-relaxed">
              {language === 'ur' ? calculation.raddDetails.explanationUrdu : calculation.raddDetails.explanationEn}
            </p>
          </div>
        </div>
      )}

      {calculation.isUmariyyatayn && (
        <div className="p-4 bg-teal-50/80 border border-teal-300 rounded-2xl flex items-start gap-3 shadow-2xs">
          <Scale className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
          <div className="text-xs text-teal-950">
            <div className="font-bold text-sm font-serif-title">
              {language === 'ur' ? 'مسئلہ عمریتین (غراوین)' : 'Masla Umariyyatayn (Gharrawayn Rule)'}
            </div>
            <p className="mt-1 leading-relaxed">
              {language === 'ur'
                ? 'حضرت عمر فاروقؓ کا تاریخی فیصلہ: صرف زوجین اور والدین کی موجودگی میں والدہ کو بقیہ کا 1/3 دیا جاتا ہے تاکہ والد کو والدہ سے دوگنا مل سکے۔'
                : 'Judicial precedent established by Caliph Umar ibn al-Khattab: Mother takes 1/3 of remainder after spouse so Father retains 2:1 parity over mother.'}
            </p>
          </div>
        </div>
      )}

      {/* Bento Grid: Left = Jewel-Tone Donut Chart; Right = Executive Cap-Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Donut Chart Glassmorphic Card */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center ring-1 ring-emerald-200">
                  <PieChart className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#022C22]">
                  {language === 'ur' ? 'تقسیم کا گراف' : 'Visual Allocation'}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#064E3B]">
                {getPakistaniUnit(calculation.netDistributableEstatePKR)}
              </span>
            </div>

            <DonutChart
              heirs={calculation.heirs}
              netEstatePKR={calculation.netDistributableEstatePKR}
              language={language}
            />
          </div>
        </div>

        {/* Right: Executive Cap-Table with Share Progress Bars */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#064E3B] flex items-center justify-center ring-1 ring-emerald-200">
                  <Table className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#022C22]">
                  {language === 'ur' ? 'تفصیلی کیپ ٹیبل (حصص وارثین)' : 'Executive Cap-Table'}
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-medium">
                {calculation.heirs.length} {language === 'ur' ? 'حقدار فریق' : 'Beneficiaries'}
              </span>
            </div>

            {/* Table of Heirs */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-widest font-sans">
                    <th className="py-3 pr-2 font-semibold">{t.heirName}</th>
                    <th className="py-3 px-2 font-semibold text-center">{t.category}</th>
                    <th className="py-3 px-2 font-semibold text-center">{t.shareFraction}</th>
                    <th className="py-3 px-2 font-semibold text-right">{t.percentage}</th>
                    <th className="py-3 pl-2 font-semibold text-right">{t.amount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {calculation.heirs.map((heir) => (
                    <tr 
                      key={heir.id} 
                      onMouseEnter={() => setHighlightedHeirId(heir.id)}
                      onMouseLeave={() => setHighlightedHeirId(null)}
                      className={`transition-colors duration-150 ${
                        highlightedHeirId === heir.id ? 'bg-emerald-50/70' : 'hover:bg-stone-50/60'
                      }`}
                    >
                      
                      {/* Heir Name with Mini Share Progress Bar */}
                      <td className="py-3.5 pr-2">
                        <div className="font-bold text-[#022C22] text-xs sm:text-sm">
                          {language === 'ur' ? heir.titleUrdu : heir.titleEn}
                        </div>
                        {heir.count > 1 && (
                          <div className="text-[10px] text-stone-400 font-mono">
                            {heir.count} {language === 'ur' ? 'افراد میں مساوی' : 'individuals shared'}
                          </div>
                        )}
                        {/* Progress bar inside row */}
                        <div className="mt-1.5 w-24 sm:w-32 h-1 bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#059669] to-teal-600 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(3, heir.sharePercentage))}%` }}
                          />
                        </div>
                      </td>

                      {/* Shariah Category */}
                      <td className="py-3.5 px-2 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          heir.category === 'Zawil-Furooz'
                            ? 'bg-emerald-50 text-[#064E3B] border border-emerald-200/80'
                            : heir.category === 'Asabah'
                            ? 'bg-blue-50 text-blue-900 border border-blue-200/80'
                            : 'bg-purple-50 text-purple-900 border border-purple-200/80'
                        }`}>
                          {heir.category}
                        </span>
                      </td>

                      {/* Fraction Badge */}
                      <td className="py-3.5 px-2 text-center">
                        <span className="font-mono font-bold text-[#022C22] bg-stone-100 px-2 py-0.5 rounded text-xs">
                          {heir.shareFraction}
                        </span>
                      </td>

                      {/* Percentage */}
                      <td className="py-3.5 px-2 text-right font-mono text-stone-700">
                        <div className="font-bold text-xs sm:text-sm">
                          {heir.sharePercentage.toFixed(2)}%
                        </div>
                        {heir.count > 1 && (
                          <div className="text-[10px] text-stone-400">
                            {heir.perPersonPercentage.toFixed(2)}% ea
                          </div>
                        )}
                      </td>

                      {/* Amount in PKR */}
                      <td className="py-3.5 pl-2 text-right">
                        <div className="font-extrabold text-[#022C22] font-serif-title text-sm sm:text-base">
                          {formatPKR(heir.totalAmountPKR)}
                        </div>
                        {heir.count > 1 && (
                          <div className="text-[10px] text-[#059669] font-mono font-semibold">
                            {formatPKR(heir.perPersonAmountPKR)} {language === 'ur' ? 'فی فرد' : '/ person'}
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer Totals */}
          <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-semibold">
            <span className="text-stone-600 font-sans">
              {language === 'ur' ? 'مجموعی قابلِ تقسیم ترکہ:' : 'Total Net Distributable Estate:'}
            </span>
            <span className="text-base sm:text-lg font-bold font-serif-title text-[#022C22]">
              {formatPKR(calculation.netDistributableEstatePKR)}
            </span>
          </div>
        </div>

      </div>

      {/* Blocked Relatives Section */}
      {calculation.blockedHeirs.length > 0 && (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-stone-500" />
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-widest font-sans">
              {language === 'ur' ? 'محجوب اقارب (حجبِ حرمان)' : 'Mahjoob Relatives (Excluded by Rule of Hajb)'}
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {calculation.blockedHeirs.map((bh) => (
              <div key={bh.id} className="p-3 bg-white rounded-xl border border-stone-200/80 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="font-bold text-stone-800 text-xs sm:text-sm">
                    {language === 'ur' ? bh.titleUrdu : bh.titleEn}
                  </span>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    {language === 'ur' ? bh.blockReasonUrdu : bh.blockReasonEn}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded font-mono">
                  0% Share
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
