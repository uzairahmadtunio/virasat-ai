import React, { useState } from 'react';
import { 
  Building2, 
  Coins, 
  ArrowRight, 
  CheckCircle, 
  Home, 
  Users, 
  Info,
  Scale
} from 'lucide-react';
import type { HeirResult } from '../utils/mirathEngine';
import { calculatePropertyBuyOut, formatPKR, getPakistaniUnit } from '../utils/mirathEngine';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';

interface BuyOutSimulatorProps {
  initialPropertyValue: number;
  heirs: HeirResult[];
  language: Language;
}

export const BuyOutSimulator: React.FC<BuyOutSimulatorProps> = ({
  initialPropertyValue,
  heirs,
  language
}) => {
  const t = translations[language];
  const [propertyValue, setPropertyValue] = useState<number>(
    initialPropertyValue > 0 ? initialPropertyValue : 15000000
  );
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>(
    heirs.length > 0 ? heirs[0].id : ''
  );

  const buyOut = calculatePropertyBuyOut(propertyValue, selectedBuyerId, heirs);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 space-y-7 transition-all">
      
      {/* Header */}
      <div className="border-b border-stone-200/60 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F2E] p-2 ring-1 ring-[#D4AF37]/40 shadow-sm flex items-center justify-center shrink-0">
            <img 
              src="/virasat-ai-icon-step4-buyout.webp" 
              alt="Step 4: Makan Buy-Out" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-md bg-[#022C22] text-[#D4AF37] text-[10px] font-bold tracking-wider shrink-0 font-mono">
                STEP 04
              </span>
              <h2 className={`text-xl sm:text-2xl font-bold text-[#022C22] ${
                language === 'ur' ? 'font-urdu' : 'font-serif-title tracking-wide'
              }`}>
                {t.buyoutTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal tracking-normal">
              {t.buyoutSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Inputs: Property Value & Buyer Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Property Value Input */}
        <div className="p-6 rounded-2xl border border-stone-200/80 bg-white shadow-2xs space-y-3">
          <label htmlFor="house-val-input" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-sky-600" />
            {t.propertyValueToSettle}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-400">Rs.</span>
            <input
              id="house-val-input"
              type="number"
              min="100000"
              step="500000"
              value={propertyValue || ''}
              onChange={(e) => setPropertyValue(Number(e.target.value) || 0)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-200 text-sm font-mono-num text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono-num">
            <span>{getPakistaniUnit(propertyValue)}</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setPropertyValue(10000000)}
                className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded hover:bg-slate-100"
              >
                1 Crore
              </button>
              <button
                type="button"
                onClick={() => setPropertyValue(20000000)}
                className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded hover:bg-slate-100"
              >
                2 Crore
              </button>
            </div>
          </div>
        </div>

        {/* Buyer Heir Selection */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
          <label htmlFor="buyer-select" className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-700" />
            {t.selectBuyer}
          </label>
          <select
            id="buyer-select"
            value={selectedBuyerId}
            onChange={(e) => setSelectedBuyerId(e.target.value)}
            className="w-full p-2.5 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {heirs.map((heir) => (
              <option key={heir.id} value={heir.id}>
                {language === 'ur' ? heir.titleUrdu : heir.titleEn} ({heir.shareFraction} - {heir.sharePercentage.toFixed(1)}%)
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            {language === 'ur'
              ? 'یہ وارث مکان اپنے پاس رکھے گا اور دیگر تمام ورثاء کو ان کے شرعی حصص کے مطابق نقد رقم ادا کرے گا۔'
              : 'This heir keeps 100% of the house title and compensates all other heirs in cash.'}
          </p>
        </div>

      </div>

      {/* Live Buy-Out Settlement Calculations */}
      {buyOut ? (
        <div className="space-y-4">
          
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-800 block">
                {t.buyerKeepsTitle} ({buyOut.buyerHeirTitleEn})
              </span>
              <div className="text-lg sm:text-xl font-extrabold font-mono-num text-emerald-950 mt-1">
                {formatPKR(buyOut.buyerRetainedSharePKR)}
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {language === 'ur' ? 'اس وارث کی اپنی ذاتی ملکیت جو نقد ادا نہیں کرنی پڑے گی۔' : 'The buyer already owns this equity; no cash payment needed for this portion.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-semibold text-amber-900 block">
                {t.totalCashToPay}
              </span>
              <div className="text-lg sm:text-xl font-extrabold font-mono-num text-amber-950 mt-1">
                {formatPKR(buyOut.totalCashNeededToBuyOutPKR)}
              </div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {language === 'ur' ? 'یہ نقد رقم باقی تمام ورثاء میں تقسیم کی جائے گی۔' : 'Total liquid cash the buyer must pay to co-heirs to achieve 100% ownership.'}
              </p>
            </div>

          </div>

          {/* Detailed Itemized Payout Table to Co-Heirs */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t.owedToOtherHeirs}
              </span>
              <span className="text-[11px] font-mono-num text-slate-500 font-semibold">
                Total Outflow: {getPakistaniUnit(buyOut.totalCashNeededToBuyOutPKR)}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {buyOut.compensations.map((comp) => (
                <div key={comp.heirId} className="p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                        {language === 'ur' ? comp.heirTitleUrdu : comp.heirTitleEn}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono-num">
                        Share: {comp.sharePercentage.toFixed(2)}% of Property
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono-num">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                      {formatPKR(comp.cashOwedPKR)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Payable in Cash (Takhruj)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fiqh Takhruj Note */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">
                {language === 'ur' ? 'فقہی تخارج (تصفیہ بالرضا):' : 'Fiqh of Takhruj (Mutual Settlement):'}
              </span>
              <p className="text-[11px] mt-0.5">
                {language === 'ur'
                  ? 'اسلامی شریعت میں ایک وارث کا نقد رقم لے کر جائیداد سے دستبردار ہونا "تخارج" کہلاتا ہے۔ یہ مکمل طور پر جائز اور خاندانی اتفاق و محبت برقرار رکھنے کا بہترین شرعی طریقہ ہے۔'
                  : 'In Islamic law, when an heir relinquishes their share in real estate in exchange for an agreed cash settlement, it is termed "Takhruj". It is widely encouraged in Islamic jurisprudence to prevent family discord and forced auction of family homes.'}
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-6 text-center text-slate-400 text-xs">
          Please input a valid property value and select an eligible heir.
        </div>
      )}

    </div>
  );
};
