import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  FileText, 
  Scale, 
  CheckCircle,
  Building,
  UserCheck
} from 'lucide-react';
import type { EstateInputs, FamilyTree, MirathCalculationResult } from '../utils/mirathEngine';
import { formatPKR, getPakistaniUnit } from '../utils/mirathEngine';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';

interface PrintTaqseemNamaModalProps {
  isOpen: boolean;
  onClose: () => void;
  estate: EstateInputs;
  family: FamilyTree;
  calculation: MirathCalculationResult;
  language: Language;
}

export const PrintTaqseemNamaModal: React.FC<PrintTaqseemNamaModalProps> = ({
  isOpen,
  onClose,
  estate,
  family,
  calculation,
  language
}) => {
  const modalScrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      modalScrollRef.current?.scrollTo(0, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const t = translations[language];
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const refCode = 'VRST-PK-2026-' + Math.abs(Math.round(calculation.netDistributableEstatePKR % 9999 + 1000));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      ref={modalScrollRef}
      className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto"
    >
      {/* Modal Container */}
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 print:shadow-none print:border-none print:rounded-none print:m-0 print:max-w-none">
        
        {/* Modal Action Bar (Sticky & Hidden in Print) */}
        <div className="sticky top-0 z-20 p-4 bg-slate-900 text-white flex items-center justify-between no-print shadow-md">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm sm:text-base font-arabic">
              {language === 'ur' ? 'سرکاری خاندانی تقسیم نامہ ترکہ' : 'Official Family Settlement Deed (Taqseem-Nama)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer font-arabic"
            >
              <div className="w-6 h-6 rounded-md bg-emerald-900/40 p-0.5 flex items-center justify-center shrink-0">
                <img 
                  src="/virasat-ai-icon-step5-taqseemnama.webp" 
                  alt="Print Deed" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span>{language === 'ur' ? 'پرنٹ / پی ڈی ایف محفوظ کریں' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legal Printable Document Content */}
        <div className="p-6 sm:p-10 font-sans text-slate-900 space-y-6 print:p-6 print:space-y-4 print-container">
          
          {/* Header Official Seal & Bismillah Calligraphy */}
          <div className="text-center space-y-3 pb-5 border-b-2 border-slate-900">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F2E] p-2 ring-1 ring-[#D4AF37]/50 shadow-md flex items-center justify-center">
              <img 
                src="/virasat-ai-icon-step5-taqseemnama.webp" 
                alt="Official Shariah Seal" 
                className="w-full h-full object-contain drop-shadow"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="font-arabic text-xl sm:text-2xl font-bold text-slate-900" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900 font-arabic">
              خاندانی تقسیم نامہ ترکہ بمطابق شریعتِ اسلامیہ
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-widest">
              OFFICIAL SHARIAH INHERITANCE DISTRIBUTION & SETTLEMENT DEED (HANAFI FIQH)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono-num text-slate-500 pt-1">
              <span><strong>Doc Ref:</strong> {refCode}</span>
              <span>•</span>
              <span><strong>Execution Date:</strong> {currentDate}</span>
              <span>•</span>
              <span><strong>Jurisdiction:</strong> Pakistan Succession & Muslim Family Laws</span>
            </div>
          </div>

          {/* Section 1: Parties & Deceased Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-slate-700 text-[11px] border-b border-slate-200 pb-1 font-arabic">
              1. میت و خاندان کی تفصیلات (Details of Deceased & Family)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 block">Deceased:</span>
                <span className="font-bold text-slate-900">
                  {family.deceasedGender === 'male' ? 'Marhoom (Male)' : 'Marhooma (Female)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Surviving Spouse:</span>
                <span className="font-bold text-slate-900">
                  {family.deceasedGender === 'male' 
                    ? (family.wivesCount > 0 ? `${family.wivesCount} Wife/Wives` : 'None') 
                    : (family.husbandPresent ? 'Husband Survived' : 'None')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Surviving Parents:</span>
                <span className="font-bold text-slate-900">
                  {family.fatherAlive ? 'Father (Alive)' : 'Father (Deceased)'} / {family.motherAlive ? 'Mother (Alive)' : 'Mother (Deceased)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Surviving Children:</span>
                <span className="font-bold text-slate-900">
                  {family.sonsCount} Son(s), {family.daughtersCount} Daughter(s)
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Statement of Estate & Mandatory Deductions */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 p-2.5 font-bold text-slate-800 text-[11px] uppercase tracking-wider font-arabic">
              2. ترکہ اور حقوق التَرکہ کا مکمل گوشوارہ (Financial Statement of Estate & Deductions)
            </div>
            <div className="p-3 divide-y divide-slate-100 space-y-2">
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-600">Total Gross Assets (Cash, Property, Gold, Others):</span>
                <span className="font-mono-num font-bold text-slate-900">{formatPKR(calculation.grossEstatePKR)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-rose-700">
                <span>(-) Tajheez-o-Takfeen (Funeral & Burial Expenses):</span>
                <span className="font-mono-num font-bold">- {formatPKR(calculation.funeralExpensesPKR)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-rose-700">
                <span>(-) Qarz-e-Shara'i & Unpaid Haq-Mehr (Debts to Creditors & Wife):</span>
                <span className="font-mono-num font-bold">- {formatPKR(calculation.debtsAndMehrPKR)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-amber-800">
                <span>(-) Permissible Wasiyyat / Bequest (Within 1/3 limit):</span>
                <span className="font-mono-num font-bold">- {formatPKR(calculation.wasiyyatPKR)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-emerald-950 text-sm bg-emerald-50/60 p-2 rounded">
                <span>(=) Net Distributable Estate (Qabil-e-Taqseem Tirkah):</span>
                <span className="font-mono-num">{formatPKR(calculation.netDistributableEstatePKR)}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Certified Schedule of Heir Distribution */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-800 text-xs mb-2 font-arabic">
              3. جدولِ تقسیمِ حصص شرعیہ (Certified Schedule of Distribution)
            </h3>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700 text-center font-arabic">
                  <th className="p-2 border-r border-slate-300 text-left">وارث (Heir Title)</th>
                  <th className="p-2 border-r border-slate-300">شرعی حیثیت (Category)</th>
                  <th className="p-2 border-r border-slate-300">قرآنی حصہ (Fraction)</th>
                  <th className="p-2 border-r border-slate-300">فیصد (Share %)</th>
                  <th className="p-2 text-right">کل رقم (Total Amount PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono-num">
                {calculation.heirs.map((heir) => (
                  <tr key={heir.id} className="text-center">
                    <td className="p-2 border-r border-slate-300 text-left font-arabic font-bold text-slate-900">
                      {heir.titleUrdu} ({heir.titleEn})
                    </td>
                    <td className="p-2 border-r border-slate-300 text-[11px] font-sans">
                      {heir.category}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-bold text-emerald-900">
                      {heir.shareFraction}
                    </td>
                    <td className="p-2 border-r border-slate-300">
                      {heir.sharePercentage.toFixed(2)}%
                    </td>
                    <td className="p-2 text-right font-bold text-slate-900">
                      {formatPKR(heir.totalAmountPKR)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
                  <td colSpan={3} className="p-2 text-left font-arabic">
                    TOTAL ALLOCATED (کل میزان):
                  </td>
                  <td className="p-2 text-center font-mono-num">100.00%</td>
                  <td className="p-2 text-right font-mono-num">
                    {formatPKR(calculation.netDistributableEstatePKR)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Section 4: Signature Blocks for All Heirs */}
          <div className="pt-2 space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-slate-800 text-xs font-arabic">
              4. دستخط و نشان انگوٹھا جملہ ورثاء (Signatures & Thumbprints of All Heirs)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {calculation.heirs.map((heir) => (
                <div key={heir.id} className="border border-slate-300 rounded-lg p-3 space-y-4">
                  <span className="text-[11px] font-bold text-slate-800 block">
                    {heir.titleEn}:
                  </span>
                  <div className="border-b border-dashed border-slate-400 h-8" />
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Signature</span>
                    <span>Thumbprint</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Two Male Witnesses (Gawah) & Mufti Stamp */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            
            {/* Witness 1 */}
            <div className="border border-slate-300 rounded-lg p-3 space-y-2">
              <span className="font-bold text-slate-900 block text-[11px] font-arabic">
                گواہ اوّل (Witness #1 - Male):
              </span>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div>Name: _______________________</div>
                <div>S/O: ________________________</div>
                <div>CNIC: _______________________</div>
                <div className="pt-4 border-b border-dashed border-slate-400" />
                <div className="text-[10px] text-slate-400 text-right">Signature</div>
              </div>
            </div>

            {/* Witness 2 */}
            <div className="border border-slate-300 rounded-lg p-3 space-y-2">
              <span className="font-bold text-slate-900 block text-[11px] font-arabic">
                گواہ دوم (Witness #2 - Male):
              </span>
              <div className="text-[11px] text-slate-600 space-y-1">
                <div>Name: _______________________</div>
                <div>S/O: ________________________</div>
                <div>CNIC: _______________________</div>
                <div className="pt-4 border-b border-dashed border-slate-400" />
                <div className="text-[10px] text-slate-400 text-right">Signature</div>
              </div>
            </div>

            {/* Dar-ul-Ifta / Mufti Stamp Box */}
            <div className="border-2 border-dashed border-slate-400 rounded-lg p-3 flex flex-col items-center justify-center text-center bg-slate-50/50">
              <Scale className="w-6 h-6 text-slate-400 mb-1" />
              <span className="font-bold text-[11px] text-slate-700 block font-arabic">
                مہر و تصدیق دارالافتاء / مفتی صاحب
              </span>
              <span className="text-[9px] text-slate-400 mt-1">
                Official Dar-ul-Ifta Verification Seal
              </span>
            </div>

          </div>

          {/* Legal & Fiqh Disclaimer Footer */}
          <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 leading-normal text-center">
            <p>
              {t.disclaimer}
            </p>
            <p className="mt-1 font-mono-num text-[9px] text-slate-400">
              Document generated via Virasat AI Engine • Shariah Deterministic Engine • Code: {refCode}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
