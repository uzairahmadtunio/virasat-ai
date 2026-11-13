/**
 * Localization strings for Virasat AI
 * Supports: 'en' (Roman Urdu + English) and 'ur' (اردو - Simple Urdu)
 */

export type Language = 'en' | 'ur';

export const translations = {
  en: {
    appTitle: 'Virasat AI',
    appSubtitle: "Pakistan's First AI-Explained Islamic Inheritance & Family Settlement Platform",
    fiqhBadge: '100% Deterministic Hanafi Fiqh Engine',
    presetLabel: 'Load Real Family Scenarios:',
    presetStandard: 'Standard Family (2 Crore)',
    presetDaughters: 'Daughters Only (Radd Case)',
    presetDebtWill: 'High Debt + Will Guardrail',
    printBtn: 'Generate Taqseem-Nama (Print / PDF)',
    advisorBtn: 'Fiqh Scenario Advisor',
    
    // Tabs
    tabCalculator: 'Inheritance Calculator (Tirkah & Wariseen)',
    tabBuyOut: 'Makan Buy-Out Simulator (Takhruj)',
    
    // Step 1: Assets & Deductions
    step1Title: 'Step 1: Tirkah & Huqooq-ut-Tirkah',
    step1Subtitle: 'Input gross assets and pre-distribution mandatory debts in Shariah sequence',
    assetsHeader: 'Total Estate Assets (Kul Jaidad)',
    cashLabel: 'Cash / Bank Balance',
    propertyLabel: 'Real Estate / Property Value (Makan / Zameen)',
    goldLabel: 'Gold & Silver Value (Sonay Chandi)',
    goldUnitPKR: 'PKR (Rs.)',
    goldUnitTola: 'Tolas',
    goldUnit10Grams: '10 Grams (10g)',
    goldUnitGram: 'Grams (g)',
    goldPurity24K: '24K Pure',
    goldPurity22K: '22K Jewellery',
    goldRateNotice: 'Live Benchmark: 24K @ Rs. 434,000 / Tola | 22K @ Rs. 397,941 / Tola',
    goldConvertedValue: 'Converted Value:',
    goldTolaEquivalent: 'Equivalent in Tolas:',
    goldRatesTitle: 'Gold Rates by Purity',
    goldPerTola: 'Per Tola',
    goldPer10Grams: 'Per 10 Grams',
    goldPerGram: 'Per Gram',
    otherLabel: 'Other Assets (Vehicles, Business, etc.)',
    
    deductionsHeader: 'Pre-Distribution Deductions (Huqooq-ut-Tirkah)',
    funeralLabel: '1. Tajheez-o-Takfeen (Funeral & Burial)',
    funeralHelp: 'Expenses for shroud, grave, and burial of the deceased.',
    debtLabel: '2. Qarz & Unpaid Haq-Mehr (Debts to Creditors & Wife)',
    debtTooltip: 'Important: Biwi ka baaqi Haq-Mehr marhoom par qarz hai aur taqseem se pehle ada hoga.',
    wasiyyatLabel: '3. Wasiyyat (Bequest / Will to Non-Heirs)',
    wasiyyatRuleNote: 'Max 1/3 (33.33%) of net estate post-debts',
    wasiyyatCapWarning: 'Shariah Guardrail Alert: Wasiyyat cannot exceed 1/3 (33.33%) of net estate without all heirs’ consent.',
    autoCapBtn: 'Auto-Cap at 1/3 (33.33%)',
    capLabel: 'Cap:',
    
    // Quick asset buttons
    btn10Laakh: '+10 Laakh',
    btn50Laakh: '+50 Laakh',
    btn1Crore: '1 Crore',
    btn2Crore: '2 Crore',
    btn3Crore: '3 Crore',
    btn1Tola: '+1 Tola',
    btn5Tolas: '+5 Tolas',
    btn10Tolas: '+10 Tolas',

    // Pipeline Summary
    grossEstate: 'Total Gross Estate',
    totalDeductions: 'Mandatory Deductions',
    netDistributable: 'Net Distributable Tirkah (Qabil-e-Taqseem)',
    
    // Step 2: Family Tree
    step2Title: 'Step 2: Family Tree & Wariseen (With Auto-Hajb)',
    step2Subtitle: 'Select surviving relatives of the deceased. Shariah blocking rules apply automatically.',
    deceasedGender: 'Deceased (Marhoom / Marhooma):',
    male: 'Male (Mard)',
    female: 'Female (Aurat)',
    deceasedNameLabel: 'Name of Deceased (Marhoom ka Naam)',
    
    // Family Categories & Labels
    spousesHeader: 'Spouse (Biwi / Shohar)',
    wivesLabel: 'Wives (Biwiyan)',
    wivesCountLabel: 'Number of Surviving Wives (0 - 4)',
    husbandLabel: 'Husband (Shohar)',
    husbandSurvivedLabel: 'Husband Survived:',
    
    parentsHeader: 'Parents (Walidain)',
    fatherLabel: 'Father (Walid)',
    motherLabel: 'Mother (Walida)',
    
    childrenHeader: 'Children (Aulad)',
    sonsLabel: 'Sons (Betay)',
    sonPortionLabel: '2 portions per son',
    daughtersLabel: 'Daughters (Betiyan)',
    daughterPortionLabel: '1 portion per daughter',
    
    siblingsHeader: 'Siblings (Bhai / Behnein)',
    brothersLabel: 'Full Brothers (Bhai)',
    sistersLabel: 'Full Sisters (Behnein)',
    
    // Shariah Categories
    catZawilFurooz: 'Zawil-Furooz (Fixed Quranic Share)',
    catAsabah: 'Asabah (Residuary Heirs)',
    catZawilFuroozAsabah: 'Zawil-Furooz / Asabah',
    catAsabah2to1: 'Asabah (2:1)',
    catMahjoob: 'Mahjoob (Blocked)',
    catKalalah: 'Kalalah (Eligible)',

    alive: 'Alive',
    deceased: 'Deceased',
    yes: 'Present',
    no: 'None',
    
    // Blocking notice
    blockedNoticeTitle: 'Mahjoob (Blocked Heirs):',
    blockedNoticeText: 'Walid ya Betay ki mojoodgi mein Bhai/Behan ko hissa nahi milta (Surah An-Nisa 4:176).',
    
    // Step 3: Results
    resultsTitle: 'Step 3: Mirath Distribution & Cap-Table',
    resultsSubtitle: 'Deterministic shares calculated under Hanafi Fiqh jurisprudence',
    heirName: 'Heir (Waris)',
    category: 'Shariah Category',
    shareFraction: 'Quranic Fraction',
    percentage: 'Percentage',
    amount: 'Share in PKR',
    perPerson: 'Per Person',
    
    // Hikmat Section
    hikmatTitle: 'AI Hikmat & Quranic Daleel (The Divine Wisdom)',
    hikmatSubtitle: 'Direct Quranic ayat, jurisprudential rationale, and compassionate context',
    sonDaughterWisdomTitle: 'Hikmat: Why 2:1 for Son vs Daughter? (Beti aur Betay ke hissay ki hikmat)',
    sonDaughterWisdomText: 'Islam mein Beti ka hissa 100% uski zaati milkiyat aur Mehfooz Sarmaya hai—us par ghar ka ek rupya kharch karna farz nahi. Jabke Betay par Biwi ka Haq-Mehr, ghar ka Nafaqah (kharcha), aur Maan-Baap/Behnon ki kafalat qanoonan farz hai.',
    
    // Buy-out Simulator
    buyoutTitle: 'Makan / Zameen Buy-Out Simulator (Takhruj Calculator)',
    buyoutSubtitle: 'Resolve family property disputes amicably: Calculate exact cash compensation if one heir retains the family home.',
    propertyValueToSettle: 'Property Value to Retain / Settle (PKR)',
    selectBuyer: 'Select which heir wants to keep the house:',
    buyerKeepsTitle: 'Retained by Buyer',
    totalCashToPay: 'Total Cash Compensation Needed',
    owedToOtherHeirs: 'Individual Cash Owed to Co-Heirs',
    
    // Disclaimer
    disclaimer: 'Fiqh & Legal Disclaimer: Ye hisaab Fiqh-e-Hanafi ke mutabiq automatic math engine se nikala gaya hai. Qanooni dastavezat ya court transfer se pehle kisi mustanad Dar-ul-Ifta (Mufti) se tasdeeq zaroor karwa lein.'
  },
  ur: {
    appTitle: 'وراثت اے آئی',
    appSubtitle: 'پاکستان کا پہلا فہمِ شریعت پر مبنی وراثت (میراث) کیلکولیٹر اور خاندانی تصفیہ پلیٹ فارم',
    fiqhBadge: '۱۰۰٪ حتمی فقہ حنفی انجن',
    presetLabel: 'عملی خاندانی مثالیں لوڈ کریں:',
    presetStandard: 'عام خاندانی کیس (۲ کروڑ)',
    presetDaughters: 'صرف بیٹیاں (مسئلہ رد)',
    presetDebtWill: 'قرض اور وصیت کا شرعی تحفظ',
    printBtn: 'سرکاری تقسیم نامہ (پرنٹ / پی ڈی ایف)',
    advisorBtn: 'فقہی تنازعات مشیر',
    
    // Tabs
    tabCalculator: 'میراث کیلکولیٹر (ترکہ اور ورثاء)',
    tabBuyOut: 'مکان خریداری تخارج کیلکولیٹر',
    
    // Step 1: Assets & Deductions
    step1Title: 'مرحلہ ۱: ترکہ اور حقوق التَرکہ',
    step1Subtitle: 'کل جائیداد اور تقسیم سے قبل لازمی شرعی واجبات کا اندراج',
    assetsHeader: 'کل جائیداد و اثاثہ جات',
    cashLabel: 'نقدی اور بینک بیلنس',
    propertyLabel: 'مکان / زمین / جائیداد کی مالیت',
    goldLabel: 'سونے چاندی کی مالیت',
    goldUnitPKR: 'روپے (PKR)',
    goldUnitTola: 'تولہ',
    goldUnit10Grams: '۱۰ گرام',
    goldUnitGram: 'گرام',
    goldPurity24K: '۲۴ قیراط خالص',
    goldPurity22K: '۲۲ قیراط زیورات',
    goldRateNotice: 'مروجہ مارکیٹ ریٹ: ۲۴ قیراط: ۴,۳۴,۰۰۰ روپے / تولہ | ۲۲ قیراط: ۳,۹۷,۹۴۱ روپے / تولہ',
    goldConvertedValue: 'روپوں میں مالیت:',
    goldTolaEquivalent: 'مساوی بتولہ:',
    goldRatesTitle: 'سونے کے مروجہ مارکیٹ ریٹس',
    goldPerTola: 'فی تولہ',
    goldPer10Grams: 'فی ۱۰ گرام',
    goldPerGram: 'فی گرام',
    otherLabel: 'دیگر اثاثہ جات (گاڑیاں، کاروبار وغیرہ)',
    
    deductionsHeader: 'تقسیم سے قبل لازمی واجبات (حقوق التَرکہ)',
    funeralLabel: '۱. تجہیز و تکفین (کفن دفن کے اخراجات)',
    funeralHelp: 'میت کے کفن، قبر اور جنازے کے معقول اخراجات۔',
    debtLabel: '۲. قرضہ جات اور غیر ادا شدہ حق مہر',
    debtTooltip: 'اہم: بیوی کا باقی حق مہر میت پر قرض ہے اور وراثت کی تقسیم سے پہلے ادا کرنا فرض ہے۔',
    wasiyyatLabel: '۳. جائز وصیت (غیر وارث کے لیے)',
    wasiyyatRuleNote: 'قرض نکالنے کے بعد بقیہ ترکہ کے زیادہ سے زیادہ تہائی (1/3) حصے تک وصیت جائز ہے',
    wasiyyatCapWarning: 'شرعی تنبیہ: وصیت تمام ورثاء کی رضامندی کے بغیر بقیہ ترکہ کے ایک تہائی (۳۳.۳۳٪) سے زائد نہیں ہو سکتی۔',
    autoCapBtn: '۱/۳ (۳۳.۳۳٪) پر خودکار حد لگائیں',
    capLabel: 'حد:',
    
    // Quick asset buttons
    btn10Laakh: '+۱۰ لاکھ',
    btn50Laakh: '+۵۰ لاکھ',
    btn1Crore: '۱ کروڑ',
    btn2Crore: '۲ کروڑ',
    btn3Crore: '۳ کروڑ',
    btn1Tola: '+۱ تولہ',
    btn5Tolas: '+۵ تولہ',
    btn10Tolas: '+۱۰ تولہ',

    // Pipeline Summary
    grossEstate: 'کل مجموعی ترکہ',
    totalDeductions: 'لازمی منہائیات',
    netDistributable: 'قابلِ تقسیم ترکہ',
    
    // Step 2: Family Tree
    step2Title: 'مرحلہ ۲: شجرۂ ورثاء (خودکار حجب و محرومی کے ساتھ)',
    step2Subtitle: 'زندہ ورثاء کا انتخاب کریں۔ فقہی اصولِ حجب خودکار نافذ ہوتے ہیں۔',
    deceasedGender: 'میت کی جنس:',
    male: 'مرد (مرحوم)',
    female: 'عورت (مرحومہ)',
    deceasedNameLabel: 'مرحوم / مرحومہ کا نام',
    
    // Family Categories & Labels
    spousesHeader: 'زوجین (بیوی یا شوہر)',
    wivesLabel: 'بیویاں',
    wivesCountLabel: 'حیات بیویوں کی تعداد (0 تا 4)',
    husbandLabel: 'شوہر',
    husbandSurvivedLabel: 'شوہر حیات ہے:',
    
    parentsHeader: 'والدین (ماں اور باپ)',
    fatherLabel: 'والد',
    motherLabel: 'والدہ',
    
    childrenHeader: 'اولاد (بیٹے اور بیٹیاں)',
    sonsLabel: 'بیٹے',
    sonPortionLabel: 'فی بیٹا دوگنا حصہ (2:1)',
    daughtersLabel: 'بیٹیاں',
    daughterPortionLabel: 'فی بیٹی ایک حصہ',
    
    siblingsHeader: 'بہن بھائی (حقیقی)',
    brothersLabel: 'سگے بھائی',
    sistersLabel: 'سگی بہنیں',
    
    // Shariah Categories
    catZawilFurooz: 'ذوالفروض (مقررہ حصہ)',
    catAsabah: 'عصبہ (بقیہ حصہ دار)',
    catZawilFuroozAsabah: 'ذوالفروض / عصبہ',
    catAsabah2to1: 'عصبہ (۲:۱ حصہ)',
    catMahjoob: 'محجوب (محروم)',
    catKalalah: 'کلالہ (حقدار)',

    alive: 'حیات',
    deceased: 'وفات پا چکے',
    yes: 'موجود',
    no: 'نہیں',
    
    // Blocking notice
    blockedNoticeTitle: 'محجوب ورثاء (محروم):',
    blockedNoticeText: 'والد یا بیٹے کی موجودگی میں بھائی اور بہنوں کو وراثت میں حصہ نہیں ملتا (سورۃ النساء آیت ۱۷۶)۔',
    
    // Step 3: Results
    resultsTitle: 'مرحلہ ۳: تقسیمِ ترکہ اور کیپ ٹیبل',
    resultsSubtitle: 'فقہ حنفی اور پاکستان مسلم عائلی قوانین کے مطابق حتمی حصص',
    heirName: 'وارث',
    category: 'شرعی حیثیت',
    shareFraction: 'قرآنی حصہ',
    percentage: 'فیصد',
    amount: 'رقم (روپے)',
    perPerson: 'فی فرد رقم',
    
    // Hikmat Section
    hikmatTitle: 'حکمتِ الٰہی و قرآنی دلائل',
    hikmatSubtitle: 'قرآنی آیات، فقہی استدلال اور پرسکون خاندانی تناظر',
    sonDaughterWisdomTitle: 'حکمت: بیٹے اور بیٹی کے حصے میں ۲:۱ کا فرق کیوں؟',
    sonDaughterWisdomText: 'اسلام میں بیٹی کا حصہ ۱۰۰٪ اس کی ذاتی ملکیت اور محفوظ سرمایہ ہے—اس پر گھر کا ایک روپیہ خرچ کرنا بھی فرض نہیں۔ جبکہ بیٹے پر بیوی کا مہر، گھر کا نفقہ، اور والدین و بہنوں کی کفالت شرعاً و قانوناً فرض ہے۔',
    
    // Buy-out Simulator
    buyoutTitle: 'مکان خریداری و تصفیہ تخارج کیلکولیٹر',
    buyoutSubtitle: 'خاندانی مکان نیلامی یا جھگڑے سے بچائیں: جانیں کہ مکان رکھنے والا وارث باقی تمام ورثاء کو کتنا نقد معاوضہ ادا کرے گا۔',
    propertyValueToSettle: 'مکان / زمین کی قابلِ تصفیہ مالیت (روپے)',
    selectBuyer: 'منتخب کریں کہ کون سا وارث مکان رکھنا چاہتا ہے:',
    buyerKeepsTitle: 'خریدار کا اپنا حصہ',
    totalCashToPay: 'باقی ورثاء کو ادا کی جانے والی کل رقم',
    owedToOtherHeirs: 'ہر وارث کا نقد معاوضہ',
    
    // Disclaimer
    disclaimer: 'شرعی و قانونی تنبیہ: یہ حساب فقہ حنفی کے مطابق خودکار میتھ انجن سے اخذ کیا گیا ہے۔ عدالت یا سرکاری دستاویزات میں اندراج سے قبل کسی مستند دارالافتاء سے تصدیق ضرور کروائیں۔'
  }
};
