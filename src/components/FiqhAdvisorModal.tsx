import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Scale, 
  HelpCircle, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  HeartHandshake, 
  Search,
  ChevronRight
} from 'lucide-react';
import type { FamilyTree, EstateInputs, HeirResult } from '../utils/mirathEngine';
import type { Language } from '../utils/translations';

interface FiqhAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  family: FamilyTree;
  estate: EstateInputs;
  heirs: HeirResult[];
  language: Language;
}

interface Scenario {
  id: string;
  category: 'deprivation' | 'property' | 'debts' | 'step_relatives' | 'orphaned_grandchild' | 'business';
  titleEn: string;
  titleUrdu: string;
  subtitleEn: string;
  subtitleUrdu: string;
  verdictEn: string;
  verdictUrdu: string;
  quranicBasis: string;
  jurisprudenceEn: string;
  jurisprudenceUrdu: string;
  pakistanLawReference: string;
  actionableStepEn: string;
  actionableStepUrdu: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'forced-deprivation',
    category: 'deprivation',
    titleEn: 'Can daughters be coerced to sign away their inheritance during their father’s lifetime?',
    titleUrdu: 'کیا والد کی زندگی میں بیٹی سے کاغذی دستخط لے کر وراثت معاف کروائی جا سکتی ہے؟',
    subtitleEn: 'Pre-mortem waiver of inheritance (Isqat-e-Haqq / Dastbardari)',
    subtitleUrdu: 'زندگی میں حق ساقط کرنا (دستبرداری کی شرعی و قانونی حیثیت)',
    verdictEn: 'COMPLETELY VOID & HARAM (Baatil under Hanafi Fiqh & Void under Pakistani Succession Law)',
    verdictUrdu: 'شرعاً باطل اور حرام، اور پاکستانی عدالتوں میں قطعی غیر قانونی',
    quranicBasis: 'Surah An-Nisa (4:7): "لِّلرِّجَالِ نَصِيبٌ مِّمَّا تَرَكَ الْوَالِدَانِ وَالْأَقْرَبُونَ وَلِلنِّسَاءِ نَصِيبٌ" — Men and women each have a mandatory ordained portion.',
    jurisprudenceEn: 'In Hanafi jurisprudence (Al-Hidayah, Fatawa Hindiyyah), inheritance rights do NOT exist before death. One cannot renounce a right that does not yet exist (Isquat-ul-haqq qabla wujubihi baatil). Any signed stamp paper during the father’s life is null and void.',
    jurisprudenceUrdu: 'فقہ حنفی کا متفقہ قاعدہ ہے: "اسقاط الحق قبل وجوبہ باطل" (حق پیدا ہونے سے پہلے اسے معاف یا ساقط نہیں کیا جا سکتا)۔ والد کی زندگی میں بیٹی وارث ہی نہیں بنی، اس لیے زندگی میں زبردستی یا دباؤ سے لکھوایا گیا کوئی بھی دستخطی بیان شرعاً اور قانوناً ردی کا ٹکڑا ہے۔',
    pakistanLawReference: 'Section 498-A Pakistan Penal Code (PPC): Deceitful or coercive deprivation of a female heir from inheritance is a non-bailable criminal offense punishable by 5 to 10 years imprisonment and a PKR 1,000,000 fine.',
    actionableStepEn: 'The daughters are entitled to their full Shariah shares. Any previous signatures obtained during the father’s lifetime must be disregarded.',
    actionableStepUrdu: 'بیٹیوں کو ان کا پورا شرعی حصہ ادا کیا جائے گا۔ والد کی زندگی میں حاصل کردہ کسی بھی جعلی معافی نامے کو کالعدم سمجھا جائے۔'
  },
  {
    id: 'rent-distribution',
    category: 'property',
    titleEn: 'If the family house or plaza is rented out, how must the rental income be distributed?',
    titleUrdu: 'اگر مشترکہ مکان یا پلازہ کرائے پر ہو تو ماہانہ کرایہ کیسے تقسیم ہوگا؟',
    subtitleEn: 'Interim income of undistributed estate (Nama-ul-Tirkah)',
    subtitleUrdu: 'غیر تقسیم شدہ جائیداد کی آمدنی اور منافع کا شرعی تناسب',
    verdictEn: 'Rental income MUST strictly mirror the exact Shariah inheritance fractions of the estate',
    verdictUrdu: 'ماہانہ کرایہ ہو بہو وراثت کے شرعی حصص (فیصدی تناسب) کے مطابق تقسیم ہوگا',
    quranicBasis: 'Surah An-Nisa (4:12): "مِنْ بَعْدِ وَصِيَّةٍ يُوصَىٰ بِهَا أَوْ دَيْنٍ غَيْرَ مُضَارٍّ" — Distribution must never cause harm or unjust enrichment.',
    jurisprudenceEn: 'All accrued rent belongs proportionally to all legal heirs from the exact moment of the deceased’s demise. One brother living in the house rent-free while collecting rent from portions without distributing to sisters/mother is guilty of consuming unlawful wealth (Suht).',
    jurisprudenceUrdu: 'میت کے انتقال کے فوری بعد جائیداد کا ہر ایک اینٹ اور اس کا ہر ایک روپیہ کرایہ تمام ورثاء کا مشترکہ حق بن جاتا ہے۔ بڑا بھائی یا کوئی ایک وارث تنہا کرایہ وصول نہیں کر سکتا۔ تمام اخراجات (ٹیکس، مرمت) منہا کرنے کے بعد ہر بہن اور ماں کو ان کے مقررہ فیصد کے مطابق کرایہ دیا جائے گا۔',
    pakistanLawReference: 'Partition Act 1893 & Section 90 of Trusts Act 1882: The heir collecting rent acts as a constructive trustee for all co-heirs and is liable to render full financial accounts.',
    actionableStepEn: 'Deduct proven maintenance/property tax, then disperse the net monthly rent via bank transfer according to each heir’s cap-table percentage.',
    actionableStepUrdu: 'ضروری ٹیکس اور مرمت کے جائز بل وضع کر کے، بقیہ رقم ایپ میں دیے گئے تناسب سے ہر ماہ تمام ورثاء کے اکاؤنٹ میں ٹرانسفر کی جائے۔'
  },
  {
    id: 'unpaid-mehr-debt',
    category: 'debts',
    titleEn: 'What happens if the deceased husband never paid his wife’s Haq-Mehr during his life?',
    titleUrdu: 'اگر شوہر نے زندگی میں بیوی کا حقِ مہر ادا نہ کیا ہو تو ترکہ سے کیسے ادا ہوگا؟',
    subtitleEn: 'Preferential debt settlement (Dayn-e-Mu’ajjal & Mu’ajjal)',
    subtitleUrdu: 'حقِ مہر بطور مقدم ترین قرض اور بیوہ کا دوہرا حق',
    verdictEn: 'Wife’s unpaid Mehr is a PRIOR DEBT — it is paid 100% in cash BEFORE any inheritance distribution',
    verdictUrdu: 'غیر ادا شدہ حق مہر تمام ورثاء سے پہلے ترکہ سے ۱۰۰٪ ادا ہوگا، اس کے بعد بیوہ کو الگ سے ۱/۸ حصہ بھی ملے گا',
    quranicBasis: 'Surah An-Nisa (4:4): "وَآتُوا النِّسَاءَ صَدُقَاتِهِنَّ نِحْلَةً" — Give women their bridal-due graciously.',
    jurisprudenceEn: 'Under Hanafi law, the wife’s Mehr is a binding contractual debt on the husband’s estate. It ranks equally with external debts and takes precedence over all heirs (including sons) and wills. AFTER receiving her full Mehr debt, the widow STILL inherits her 1/8 (12.5%) Shariah share!',
    jurisprudenceUrdu: 'حق مہر بیوی کا شرعی قرض ہے جو شوہر کے ذمہ واجب تھا۔ وراثت کی تقسیم سے پہلے بیوہ کو اس کا پورا مہر نقد یا جائیداد کی صورت میں دیا جائے گا۔ مہر وصول کرنے کے بعد بیوہ کو ترکہ میں سے بطور بیوی اس کا ۱/۸ (۱۲.۵٪) حصہ بھی الگ سے ملے گا۔',
    pakistanLawReference: 'Dissolution of Muslim Marriages Act 1939 & Judicial Precedents of Supreme Court of Pakistan: Unpaid dower remains a first charge upon the deceased husband’s estate.',
    actionableStepEn: 'Enter the unpaid Mehr amount into the "Debts & Unpaid Haq-Mehr" input box in Step 1 so it is deducted before the net estate is calculated.',
    actionableStepUrdu: 'اسٹیپ ۱ میں "واجب الادا قرضہ جات و غیر ادا شدہ حق مہر" کے خانے میں مہر کی رقم درج کریں تاکہ خالص ترکہ کی درست تقسیم ہو۔'
  },
  {
    id: 'orphaned-grandchild',
    category: 'orphaned_grandchild',
    titleEn: 'Wasiyyat-e-Wajiba: What are the rights of an Orphaned Grandchild (Yateem Pota/Poti)?',
    titleUrdu: 'یتیم پوتے / پوتی کا وراثت میں کیا حق ہے؟ (وصیتِ واجبہ اور پاکستانی قانون)',
    subtitleEn: 'Pre-deceased son’s children inheritance rights',
    subtitleUrdu: 'دادا کی زندگی میں وفات پا جانے والے بیٹے کی اولاد کا حصہ',
    verdictEn: 'Protected under Section 4 of Pakistan Muslim Family Laws Ordinance (MFLO) 1961',
    verdictUrdu: 'پاکستانی مسلم عائلی قوانین دفعہ ۴ کے تحت یتیم پوتے کو باپ کا حصہ دیا جاتا ہے',
    quranicBasis: 'Surah Al-Baqarah (2:180) & Principles of Wasiyyat-e-Wajiba (Obligatory Bequest to vulnerable kin).',
    jurisprudenceEn: 'Classical Hanafi Fiqh places living sons as closer agnates who block grandchildren (Al-Aqrab yahjub al-Ab’ad). To prevent tragedy, Egyptian, Syrian, and Pakistani laws enacted "Wasiyyat-e-Wajiba", granting the orphaned grandchild the share their father would have received had he lived, capped at 1/3 of the estate.',
    jurisprudenceUrdu: 'کلاسک فقہ حنفی میں بیٹے کی موجودگی میں پوتا محجوب ہوتا ہے، لیکن اسلامی ممالک (بشمول مصر، شام اور پاکستان) نے یتیم پوتے کو بے سہارا ہونے سے بچانے کے لیے "وصیت واجبہ" کا قانون نافذ کیا۔ پاکستان عائلی قوانین آرڈیننس ۱۹۶۱ کی دفعہ ۴ کے مطابق یتیم پوتا اپنے مرحوم باپ کا حصہ حاصل کرتا ہے۔',
    pakistanLawReference: 'Section 4, Muslim Family Laws Ordinance 1961: The issue of any child of the deceased who died before the succession opens receives per stirpes the share that child would have received.',
    actionableStepEn: 'In Pakistani court settlements, allocate the pre-deceased child’s share directly to the orphaned grandchildren to comply with current civil law.',
    actionableStepUrdu: 'پاکستانی عدالتوں میں قانونی تصفیہ کے لیے مرحوم بیٹے کا حصہ یتیم پوتے کے نام الاٹ کیا جاتا ہے۔'
  },
  {
    id: 'step-relatives',
    category: 'step_relatives',
    titleEn: 'Do step-brothers and step-sisters inherit? (Haqiqi vs Allati vs Akhyafi siblings)',
    titleUrdu: 'کیا سوتیلے بہن بھائی وراثت میں حصہ پائیں گے؟ (حقیقی، علاتی اور اخیافی بھائی)',
    subtitleEn: 'Differentiation between full siblings and half siblings',
    subtitleUrdu: 'سگے بہن بھائی بمقابلہ باپ شریک اور ماں شریک بہن بھائی کے احکام',
    verdictEn: 'Step-children of spouse DO NOT inherit; Consanguine & Uterine half-siblings follow strict Hanafi ranks',
    verdictUrdu: 'سوتیلی اولاد کا کوئی حق نہیں؛ جبکہ باپ شریک یا ماں شریک بھائیوں کے الگ فقہی احکام ہیں',
    quranicBasis: 'Surah An-Nisa (4:12 & 4:176): Precise rules governing siblings of a Kalalah (deceased leaving neither parents nor children).',
    jurisprudenceEn: 'Step-children (children of a spouse from a previous marriage with zero blood link to the deceased) have NO right in inheritance whatsoever. Half-siblings through the same father (Allati) or same mother (Akhyafi) have specific Qur’anic shares ONLY when not blocked by sons or father.',
    jurisprudenceUrdu: 'اگر بیوی کے سابقہ شوہر سے بچے ہوں تو ان کا سوتیلے باپ کے ترکہ میں قطعاً کوئی حق نہیں۔ البتہ اگر میت کے اپنے باپ شریک (علاتی) یا ماں شریک (اخیافی) بھائی ہوں تو وہ کلالہ ہونے کی صورت میں مخصوص قرآنی حصص پاتے ہیں۔',
    pakistanLawReference: 'Succession Act 1925 & Mulla’s Principles of Mahomedan Law (Sections 63–78).',
    actionableStepEn: 'Only input legal blood relatives into the Family Tree Selector. Step-children cannot be added as heirs.',
    actionableStepUrdu: 'صرف خونی رشتہ داروں کو اسٹیپ ۲ میں شامل کریں۔ سوتیلے بچوں کو قانونی ورثاء میں شامل نہ کیا جائے۔'
  },
  {
    id: 'business-assets',
    category: 'business',
    titleEn: 'How should a running family business, shop inventory, or factory be divided?',
    titleUrdu: 'مرحوم کی چلتی ہوئی دکان، فیکٹری، یا خاندانی کاروبار کی تقسیم کیسے ہوگی؟',
    subtitleEn: 'Commercial inventory, goodwill, receivables and enterprise valuation',
    subtitleUrdu: 'تجارتی مال، گڈول، مارکیٹ ویلیو اور منافع میں بہنوں اور ماں کا حصہ',
    verdictEn: 'Independent Professional Audit & Market Valuation required; female heirs cannot be frozen out',
    verdictUrdu: 'کاروبار کی مارکیٹ ویلیو، سامان اور گڈول کا آزادانہ آڈٹ کروا کر نقد یا شیئرز کی تقسیم لازمی ہے',
    quranicBasis: 'Surah Al-Baqarah (2:188): "وَلَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ" — Do not consume each other’s wealth through fraudulent means.',
    jurisprudenceEn: 'Often sons who worked with the father claim "this shop is mine because I worked in it". Shariah dictates that the capital, goodwill, stock, and premises belonged to the father and form 100% part of the Tirkah. The working son is entitled to a fair market salary (Ujrat-ul-Misl) for his labor, but NOT the entire business equity.',
    jurisprudenceUrdu: 'عام طور پر کاروبار سنبھالنے والے بھائی کہتے ہیں کہ "دکان پر میں بیٹھتا تھا اس لیے یہ میری ہے"۔ یہ سخت حرام ہے۔ دکان کا سرمایہ، نام (گڈول) اور مال میت کی ملکیت تھا۔ محنت کرنے والے بھائی کو اس کی محنت کی جائز مارکیٹ تنخواہ دی جا سکتی ہے، لیکن اصل کاروبار اور اس کے منافع میں تمام بہنوں اور ماں کا شرعی حصہ ہے۔',
    pakistanLawReference: 'Partnership Act 1932 & Companies Act 2017: Death of a sole proprietor requires full inventory probate and distribution to all legal heirs.',
    actionableStepEn: 'Use our Makan & Business Buy-Out Simulator: The brother running the business can buy out the shares of his mother and sisters through certified cash compensation.',
    actionableStepUrdu: 'ہمارے "تخارج سمیلیٹر" کا استعمال کریں: کاروبار سنبھالنے والا بھائی دیگر ورثاء کے حصص کی قیمت لگا کر انہیں نقد ادائیگی کر کے باضابطہ تخارج معاہدہ کر لے۔'
  }
];

export const FiqhAdvisorModal: React.FC<FiqhAdvisorModalProps> = ({
  isOpen,
  onClose,
  family,
  estate,
  heirs,
  language
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredScenarios = SCENARIOS.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.titleEn.toLowerCase().includes(q) ||
      s.titleUrdu.includes(q) ||
      s.verdictEn.toLowerCase().includes(q) ||
      s.verdictUrdu.includes(q)
    );
  });

  const activeScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        dir={language === 'ur' ? 'rtl' : 'ltr'}
        className="bg-white rounded-3xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#022C22] via-[#064E3B] to-[#042F2E] p-5 sm:p-6 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
            <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 5.3 5.6.8-4.1 4 1 5.7L12 15l-4.9 2.8 1-5.7-4.1-4 5.6-.8L12 2z" />
            </svg>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA771C] text-stone-950 flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif-title text-[#F9F1D8]">
                {language === 'ur' ? 'وراثت اے آئی — فقہی تنازعات کا حل' : 'Virasat AI — Fiqh Dispute & Scenario Advisor'}
              </h3>
              <p className="text-xs text-emerald-200">
                {language === 'ur' 
                  ? 'پاکستانی خاندانی تنازعات کا شرعی وفقہی حل، عدالتی نظائر اور مصدقہ راہنمائی'
                  : 'Hanafi Jurisprudence & Pakistani Succession Law Guidance for Complex Family Scenarios'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden min-h-0">
          
          {/* Left Column: Scenario List */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-r rtl:md:border-r-0 rtl:md:border-l border-stone-200 p-4 space-y-3 overflow-y-auto bg-stone-50/50">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder={language === 'ur' ? 'تنازع تلاش کریں...' : 'Search dispute or scenario...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Scenarios Buttons */}
            <div className="space-y-2">
              {filteredScenarios.map((sc) => {
                const isSelected = sc.id === activeScenario.id;

                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenarioId(sc.id)}
                    className={`w-full p-3.5 rounded-2xl text-left rtl:text-right transition-all cursor-pointer block border ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#022C22] to-[#064E3B] text-white border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/50'
                        : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected 
                          ? 'bg-[#D4AF37] text-stone-950' 
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                      }`}>
                        {sc.category}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D4AF37]' : 'text-stone-400'} rtl:rotate-180`} />
                    </div>
                    <div className="text-xs font-bold leading-snug line-clamp-2">
                      {language === 'ur' ? sc.titleUrdu : sc.titleEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Full Fiqh Detail View */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 bg-white">
            
            {/* Active Scenario Title */}
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest block font-sans">
                {language === 'ur' ? activeScenario.subtitleUrdu : activeScenario.subtitleEn}
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-[#022C22] mt-1 font-serif-title leading-snug">
                {language === 'ur' ? activeScenario.titleUrdu : activeScenario.titleEn}
              </h4>
            </div>

            {/* Official Shariah Verdict Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-[#D4AF37] text-amber-950 space-y-1 shadow-2xs">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {language === 'ur' ? 'شرعی و قانونی فیصلہ (حکم):' : 'Legal & Shariah Verdict:'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#022C22] leading-relaxed">
                {language === 'ur' ? activeScenario.verdictUrdu : activeScenario.verdictEn}
              </p>
            </div>

            {/* Quranic Basis */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#064E3B] border-y border-r rtl:border-r-0 rtl:border-l border-stone-200/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#064E3B]" />
                <span className="text-xs font-bold text-[#022C22]">
                  {language === 'ur' ? 'قرآنی اصل اور دلیل:' : 'Sacred Scriptural Grounding:'}
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed font-arabic text-right rtl:text-right">
                {activeScenario.quranicBasis}
              </p>
            </div>

            {/* Hanafi Jurisprudence Analysis */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider font-sans">
                  {language === 'ur' ? 'فقہ حنفی کی روشنی میں تفصیل:' : 'Hanafi Jurisprudence Context:'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {language === 'ur' ? activeScenario.jurisprudenceUrdu : activeScenario.jurisprudenceEn}
              </p>
            </div>

            {/* Pakistani Civil Law Provision */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
              <span className="text-[11px] font-bold text-stone-700 block">
                {language === 'ur' ? 'پاکستانی عائلی و فوجداری قانون کا حوالہ:' : 'Pakistan Statutory Law & Judicial Precedent:'}
              </span>
              <p className="text-xs text-stone-600 leading-relaxed font-mono">
                {activeScenario.pakistanLawReference}
              </p>
            </div>

            {/* Actionable Step for Current Family */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-[#022C22] space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider">
                  {language === 'ur' ? 'اس کیس میں آپ کے لیے عملی حل:' : 'Actionable Resolution Step:'}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                {language === 'ur' ? activeScenario.actionableStepUrdu : activeScenario.actionableStepEn}
              </p>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between shrink-0 text-xs">
          <span className="text-stone-500 font-medium hidden sm:inline">
            Virasat AI Fiqh Advisor • Verified Hanafi Principles
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#022C22] hover:bg-[#064E3B] text-white font-bold rounded-xl transition-all cursor-pointer ml-auto"
          >
            {language === 'ur' ? 'بند کریں' : 'Close Advisor'}
          </button>
        </div>

      </div>
    </div>
  );
};
