/**
 * Virasat AI - Deterministic Islamic Inheritance (Mirath) Engine
 * Based on Sunni Hanafi Jurisprudence & Pakistan Succession Laws
 */

export type DeceasedGender = 'male' | 'female';

export const GOLD_RATES = {
  '24K': {
    purity: '24K' as const,
    labelEn: '24K (Pure Gold)',
    labelUrdu: '۲۴ قیراط (خالص سونا)',
    perTola: 434000,
    per10Grams: 372090,
    perGram: 37209,
  },
  '22K': {
    purity: '22K' as const,
    labelEn: '22K (Jewellery Gold)',
    labelUrdu: '۲۲ قیراط (زیوراتی سونا)',
    perTola: 397941,
    per10Grams: 341080,
    perGram: 34108,
  },
} as const;

export type GoldPurity = '24K' | '22K';
export type GoldWeightUnit = 'tola' | '10grams' | 'gram';

export const GOLD_RATE_PER_TOLA_PKR = 434000; // Benchmark rate: Rs. 434,000 / Tola (24K Gold in Pakistan)

export function getGoldRate(purity: GoldPurity, unit: GoldWeightUnit): number {
  const rates = GOLD_RATES[purity];
  if (unit === 'tola') return rates.perTola;
  if (unit === '10grams') return rates.per10Grams;
  return rates.perGram;
}

export function goldWeightToPKR(weight: number, unit: GoldWeightUnit = 'tola', purity: GoldPurity = '24K'): number {
  if (isNaN(weight) || weight <= 0) return 0;
  return Math.round(weight * getGoldRate(purity, unit));
}

export function pkrToGoldWeight(pkr: number, unit: GoldWeightUnit = 'tola', purity: GoldPurity = '24K'): number {
  if (isNaN(pkr) || pkr <= 0) return 0;
  const rate = getGoldRate(purity, unit);
  return Number((pkr / rate).toFixed(2));
}

export function tolasToPKR(tolas: number, rate = GOLD_RATE_PER_TOLA_PKR): number {
  if (isNaN(tolas) || tolas <= 0) return 0;
  return Math.round(tolas * rate);
}

export function pkrToTolas(pkr: number, rate = GOLD_RATE_PER_TOLA_PKR): number {
  if (isNaN(pkr) || pkr <= 0) return 0;
  return Number((pkr / rate).toFixed(2));
}

export interface EstateInputs {
  cash: number;
  property: number;
  goldSilver: number;
  otherAssets: number;
  funeralExpenses: number;
  debtsAndMehr: number;
  wasiyyat: number;
}

export interface FamilyTree {
  deceasedGender: DeceasedGender;
  deceasedName?: string;
  wivesCount: number;
  husbandPresent: boolean;
  fatherAlive: boolean;
  motherAlive: boolean;
  sonsCount: number;
  daughtersCount: number;
  brothersCount: number;
  sistersCount: number;
}

export type HeirCategory = 
  | 'Zawil-Furooz' // Fixed Sharer (Quranic heir)
  | 'Asabah' // Residuary heir
  | 'Zawil-Furooz + Asabah' // Mixed (e.g., Father when only daughters exist)
  | 'Blocked'; // Mahjoob

export interface HeirResult {
  id: string;
  titleEn: string;
  titleUrdu: string;
  count: number;
  category: HeirCategory;
  shareFraction: string; // e.g., "1/8", "7/24", "16/27"
  shareDecimal: number; // total for this heir group (0 to 1)
  sharePercentage: number; // e.g., 12.5%
  perPersonPercentage: number;
  totalAmountPKR: number;
  perPersonAmountPKR: number;
  quranicReference: string;
  surahVerse: string;
  hikmatExplanationEn: string;
  hikmatExplanationUrdu: string;
  isBlocked?: boolean;
  blockReasonEn?: string;
  blockReasonUrdu?: string;
}

export interface MirathCalculationResult {
  grossEstatePKR: number;
  funeralExpensesPKR: number;
  debtsAndMehrPKR: number;
  estateAfterDebtsPKR: number;
  maxPermissibleWasiyyatPKR: number;
  wasiyyatPKR: number;
  isWasiyyatCapped: boolean;
  wasiyyatWarning: boolean;
  netDistributableEstatePKR: number;
  isEstateDepleted: boolean;
  
  heirs: HeirResult[];
  blockedHeirs: HeirResult[];
  
  isAwl: boolean;
  awlDetails?: {
    originalSum: string;
    scaledSum: string;
    explanationEn: string;
    explanationUrdu: string;
  };
  
  isRadd: boolean;
  raddDetails?: {
    surplusPercentage: number;
    explanationEn: string;
    explanationUrdu: string;
  };

  isUmariyyatayn: boolean;
}

/**
 * Format number into Pakistani standard representation (PKR)
 * with readable units: Laakh (100,000) and Crore (10,000,000)
 */
export function formatPKR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rs. 0 (0 Lakh PKR)';
  const absAmount = Math.round(Math.abs(amount));
  
  // Format with commas according to South Asian grouping (1,23,45,678)
  const numStr = absAmount.toString();
  let formatted = '';
  if (numStr.length <= 3) {
    formatted = numStr;
  } else {
    const lastThree = numStr.substring(numStr.length - 3);
    const remaining = numStr.substring(0, numStr.length - 3);
    const groups: string[] = [];
    let cur = remaining;
    while (cur.length > 2) {
      groups.unshift(cur.substring(cur.length - 2));
      cur = cur.substring(0, cur.length - 2);
    }
    if (cur.length > 0) {
      groups.unshift(cur);
    }
    formatted = `${groups.join(',')},${lastThree}`;
  }

  // Calculate readable Pakistani denomination
  let denomination = '';
  if (absAmount >= 10_000_000) {
    const crores = absAmount / 10_000_000;
    denomination = `${crores >= 100 ? crores.toFixed(1) : crores.toFixed(2)} Crore PKR`;
  } else if (absAmount >= 100_000) {
    const lakhs = absAmount / 100_000;
    denomination = `${lakhs.toFixed(2)} Laakh PKR`;
  } else if (absAmount >= 1_000) {
    const thousands = absAmount / 1_000;
    denomination = `${thousands.toFixed(1)} Hazaar PKR`;
  } else {
    denomination = `${absAmount} PKR`;
  }

  return `Rs. ${formatted} (${denomination})`;
}

/**
 * Short Pakistani Unit Label (e.g. "2.00 Crore PKR" or "15.00 Laakh PKR")
 */
export function getPakistaniUnit(amount: number): string {
  if (isNaN(amount) || amount === 0) return '0 PKR';
  const absAmount = Math.abs(amount);
  if (absAmount >= 10_000_000) {
    return `${(absAmount / 10_000_000).toFixed(2)} Crore PKR`;
  }
  if (absAmount >= 100_000) {
    return `${(absAmount / 100_000).toFixed(2)} Laakh PKR`;
  }
  if (absAmount >= 1_000) {
    return `${(absAmount / 1_000).toFixed(1)} Hazaar PKR`;
  }
  return `${Math.round(absAmount)} PKR`;
}

/**
 * Helper to compute greatest common divisor for fraction formatting
 */
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

/**
 * Convert a decimal share to a clean fraction string
 */
export function decimalToFraction(val: number): string {
  if (val <= 0.00001) return '0';
  if (Math.abs(val - 1) < 0.0001) return '1/1';
  
  // Standard Islamic common denominators: 2, 3, 4, 6, 8, 12, 16, 24, 27, 36
  const commonDenoms = [2, 3, 4, 6, 8, 12, 13, 15, 17, 24, 27, 36, 48, 72, 96, 120, 144, 216];
  for (const d of commonDenoms) {
    const num = Math.round(val * d);
    if (Math.abs(val - num / d) < 0.0008) {
      const divisor = gcd(num, d);
      return `${num / divisor}/${d / divisor}`;
    }
  }

  // Fallback to general precision
  const precision = 1000;
  const num = Math.round(val * precision);
  const div = gcd(num, precision);
  return `${num / div}/${precision / div}`;
}

/**
 * Main Deterministic Hanafi Fiqh Mirath Calculation Function
 */
export function calculateMirath(
  estate: EstateInputs,
  family: FamilyTree
): MirathCalculationResult {
  // 1. Gross assets
  const grossEstatePKR = Math.max(0, 
    estate.cash + estate.property + estate.goldSilver + estate.otherAssets
  );

  // 2. Huqooq-ut-Tirkah (Pre-distribution deductions in strict sequence)
  const funeralExpensesPKR = Math.max(0, estate.funeralExpenses);
  const debtsAndMehrPKR = Math.max(0, estate.debtsAndMehr);
  
  // Deduct funeral & debts first
  const estateAfterDebtsPKR = Math.max(0, grossEstatePKR - funeralExpensesPKR - debtsAndMehrPKR);

  // 3. Wasiyyat (Will) Shariah Guardrail:
  // Wasiyyat cannot exceed 1/3 (33.333%) of the estate remaining after funeral & debts
  const maxPermissibleWasiyyatPKR = estateAfterDebtsPKR / 3;
  const wasiyyatWarning = estate.wasiyyat > maxPermissibleWasiyyatPKR + 1; // minor rounding cushion
  const wasiyyatPKR = Math.min(estate.wasiyyat, estateAfterDebtsPKR);
  const isWasiyyatCapped = wasiyyatWarning;

  // 4. Net Distributable Estate
  const netDistributableEstatePKR = Math.max(0, estateAfterDebtsPKR - wasiyyatPKR);
  const isEstateDepleted = netDistributableEstatePKR <= 0;

  if (isEstateDepleted) {
    return {
      grossEstatePKR,
      funeralExpensesPKR,
      debtsAndMehrPKR,
      estateAfterDebtsPKR,
      maxPermissibleWasiyyatPKR,
      wasiyyatPKR,
      isWasiyyatCapped,
      wasiyyatWarning,
      netDistributableEstatePKR: 0,
      isEstateDepleted: true,
      heirs: [],
      blockedHeirs: [],
      isAwl: false,
      isRadd: false,
      isUmariyyatayn: false
    };
  }

  // 5. Family State Analysis
  const hasSons = family.sonsCount > 0;
  const hasDaughters = family.daughtersCount > 0;
  const hasChildren = hasSons || hasDaughters;
  
  const wivesCount = family.deceasedGender === 'male' ? Math.max(0, Math.min(4, family.wivesCount)) : 0;
  const husbandPresent = family.deceasedGender === 'female' ? family.husbandPresent : false;
  
  const totalSiblingsRaw = family.brothersCount + family.sistersCount;

  // Hajb Rules (Blocking):
  // Siblings are blocked if Father is alive OR if Sons exist
  const siblingsBlocked = family.fatherAlive || hasSons;

  const blockedHeirs: HeirResult[] = [];
  if (siblingsBlocked) {
    if (family.brothersCount > 0) {
      blockedHeirs.push({
        id: 'blocked_brothers',
        titleEn: `${family.brothersCount} Brother${family.brothersCount > 1 ? 's' : ''}`,
        titleUrdu: `${family.brothersCount} بھائی`,
        count: family.brothersCount,
        category: 'Blocked',
        shareFraction: '0',
        shareDecimal: 0,
        sharePercentage: 0,
        perPersonPercentage: 0,
        totalAmountPKR: 0,
        perPersonAmountPKR: 0,
        quranicReference: 'Surah An-Nisa (4:176)',
        surahVerse: 'سُورَةُ النِّسَاءِ',
        hikmatExplanationEn: 'Brothers are Mahjoob (blocked) from inheritance due to the presence of the Father or Son(s).',
        hikmatExplanationUrdu: 'والد یا بیٹے کی موجودگی میں بھائی شرعی طور پر محجوب (محروم) ہو جاتے ہیں۔',
        isBlocked: true,
        blockReasonEn: family.fatherAlive ? 'Blocked by Father (Walid)' : 'Blocked by Son(s) (Aulad-e-Narina)',
        blockReasonUrdu: family.fatherAlive ? 'والد کی حیات ہونے کی وجہ سے محجوب' : 'بیٹے کی موجودگی کی وجہ سے محجوب'
      });
    }
    if (family.sistersCount > 0) {
      blockedHeirs.push({
        id: 'blocked_sisters',
        titleEn: `${family.sistersCount} Sister${family.sistersCount > 1 ? 's' : ''}`,
        titleUrdu: `${family.sistersCount} بہنیں`,
        count: family.sistersCount,
        category: 'Blocked',
        shareFraction: '0',
        shareDecimal: 0,
        sharePercentage: 0,
        perPersonPercentage: 0,
        totalAmountPKR: 0,
        perPersonAmountPKR: 0,
        quranicReference: 'Surah An-Nisa (4:176)',
        surahVerse: 'سُورَةُ النِّسَاءِ',
        hikmatExplanationEn: 'Sisters are Mahjoob (blocked) from inheritance due to the presence of the Father or Son(s).',
        hikmatExplanationUrdu: 'والد یا بیٹے کی موجودگی میں بہنیں شرعی طور پر محجوب ہو جاتی ہیں۔',
        isBlocked: true,
        blockReasonEn: family.fatherAlive ? 'Blocked by Father (Walid)' : 'Blocked by Son(s) (Aulad-e-Narina)',
        blockReasonUrdu: family.fatherAlive ? 'والد کی حیات ہونے کی وجہ سے محجوب' : 'بیٹے کی موجودگی کی وجہ سے محجوب'
      });
    }
  }

  // 6. Fixed Shares (Zawil-Furooz) Allocation
  let spouseShare = 0;
  let spouseHeir: HeirResult | null = null;

  if (husbandPresent) {
    spouseShare = hasChildren ? 1 / 4 : 1 / 2;
    spouseHeir = {
      id: 'husband',
      titleEn: 'Husband (Shohar)',
      titleUrdu: 'شوہر کا حصہ',
      count: 1,
      category: 'Zawil-Furooz',
      shareFraction: hasChildren ? '1/4' : '1/2',
      shareDecimal: spouseShare,
      sharePercentage: spouseShare * 100,
      perPersonPercentage: spouseShare * 100,
      totalAmountPKR: 0,
      perPersonAmountPKR: 0,
      quranicReference: 'Surah An-Nisa (4:12)',
      surahVerse: 'وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ',
      hikmatExplanationEn: hasChildren 
        ? 'Husband receives 1/4 because the deceased wife leaves children.' 
        : 'Husband receives 1/2 because the deceased wife leaves no children.',
      hikmatExplanationUrdu: hasChildren 
        ? 'اولاد کی موجودگی میں شوہر کا قرآنی حصہ 1/4 (چوتھائی) ہے۔'
        : 'اولاد نہ ہونے کی صورت میں شوہر کا قرآنی حصہ 1/2 (نصف) ہے۔'
    };
  } else if (wivesCount > 0) {
    spouseShare = hasChildren ? 1 / 8 : 1 / 4;
    const perWifeShare = spouseShare / wivesCount;
    spouseHeir = {
      id: 'wives',
      titleEn: wivesCount === 1 ? 'Wife (Biwi)' : `${wivesCount} Wives (Biwiyan - Shared)`,
      titleUrdu: wivesCount === 1 ? 'بیوی کا حصہ' : `${wivesCount} بیویاں (برابر تقسیم)`,
      count: wivesCount,
      category: 'Zawil-Furooz',
      shareFraction: hasChildren ? '1/8' : '1/4',
      shareDecimal: spouseShare,
      sharePercentage: spouseShare * 100,
      perPersonPercentage: perWifeShare * 100,
      totalAmountPKR: 0,
      perPersonAmountPKR: 0,
      quranicReference: 'Surah An-Nisa (4:12)',
      surahVerse: 'فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُّمُنُ مِمَّا تَرَكْتُم',
      hikmatExplanationEn: hasChildren
        ? `Wife/Wives jointly receive 1/8 (${(perWifeShare * 100).toFixed(2)}% each) due to presence of children.`
        : `Wife/Wives jointly receive 1/4 (${(perWifeShare * 100).toFixed(2)}% each) as there are no children.`,
      hikmatExplanationUrdu: hasChildren
        ? `اولاد کی موجودگی میں بیوی کا حصہ 1/8 (آٹھواں حصہ) ہے۔ ایک سے زائد بیویاں آپس میں برابر تقسیم کریں گی۔`
        : `اولاد نہ ہونے پر بیوی کا حصہ 1/4 (چوتھائی) ہے۔`
    };
  }

  // 7. Check for Umariyyatayn (Gharrawayn) Special Case
  // Condition: Only (Spouse + Mother + Father) exist, NO children, and < 2 siblings
  const isUmariyyatayn = (
    (husbandPresent || wivesCount > 0) &&
    family.motherAlive &&
    family.fatherAlive &&
    !hasChildren &&
    totalSiblingsRaw < 2
  );

  let motherShare = 0;
  let motherHeir: HeirResult | null = null;
  let fatherFixedShare = 0;
  let fatherHeir: HeirResult | null = null;
  let daughtersFixedShare = 0;
  let daughtersHeir: HeirResult | null = null;
  let sistersFixedShare = 0;
  let sistersHeir: HeirResult | null = null;

  if (family.motherAlive) {
    if (hasChildren || totalSiblingsRaw >= 2) {
      // Reduced to 1/6 by children or 2+ siblings (Hajb Nuqsan)
      motherShare = 1 / 6;
    } else if (isUmariyyatayn) {
      // 1/3 of Remainder after spouse
      motherShare = (1 - spouseShare) / 3;
    } else {
      // Normal 1/3
      motherShare = 1 / 3;
    }

    motherHeir = {
      id: 'mother',
      titleEn: 'Mother (Walida)',
      titleUrdu: 'والدہ کا حصہ',
      count: 1,
      category: 'Zawil-Furooz',
      shareFraction: isUmariyyatayn ? (husbandPresent ? '1/6' : '1/4') : (motherShare === 1/6 ? '1/6' : '1/3'),
      shareDecimal: motherShare,
      sharePercentage: motherShare * 100,
      perPersonPercentage: motherShare * 100,
      totalAmountPKR: 0,
      perPersonAmountPKR: 0,
      quranicReference: 'Surah An-Nisa (4:11)',
      surahVerse: 'وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ',
      hikmatExplanationEn: isUmariyyatayn
        ? 'Umariyyatayn Case: Mother receives 1/3 of the remainder so Father receives twice her share.'
        : (hasChildren ? 'Mother receives 1/6 due to presence of children.' : (totalSiblingsRaw >= 2 ? 'Mother receives 1/6 because deceased leaves 2 or more siblings.' : 'Mother receives 1/3 as deceased leaves neither children nor multiple siblings.')),
      hikmatExplanationUrdu: isUmariyyatayn
        ? 'مسئلہ عمریتین: والدہ کو شوہر/بیوی کے حصے کے بعد باقی کا 1/3 ملتا ہے تاکہ والد کو والدہ کا دوگنا مل سکے۔'
        : (hasChildren ? 'اولاد کی موجودگی کی وجہ سے والدہ کا حصہ 1/6 (چھٹا حصہ) ہے۔' : (totalSiblingsRaw >= 2 ? 'دو یا دو سے زائد بہن بھائیوں کی وجہ سے والدہ کا حصہ 1/3 سے گھٹ کر 1/6 ہو گیا۔' : 'اولاد اور بہن بھائی نہ ہونے پر والدہ کا حصہ 1/3 (تہائی) ہے۔'))
    };
  }

  // Father's Fixed Portion (if any)
  if (family.fatherAlive) {
    if (hasSons) {
      // Fixed 1/6, sons take all residuary
      fatherFixedShare = 1 / 6;
      fatherHeir = {
        id: 'father',
        titleEn: 'Father (Walid)',
        titleUrdu: 'والد کا حصہ',
        count: 1,
        category: 'Zawil-Furooz',
        shareFraction: '1/6',
        shareDecimal: 1 / 6,
        sharePercentage: (1 / 6) * 100,
        perPersonPercentage: (1 / 6) * 100,
        totalAmountPKR: 0,
        perPersonAmountPKR: 0,
        quranicReference: 'Surah An-Nisa (4:11)',
        surahVerse: 'وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ',
        hikmatExplanationEn: 'Father receives 1/6 fixed share as male descendants (sons) inherit as Asabah.',
        hikmatExplanationUrdu: 'بیٹے کی موجودگی میں والد کا مقررہ حصہ 1/6 (چھٹا حصہ) ہے۔ بقیہ بیٹوں کو بطور عصبہ ملے گا۔'
      };
    } else if (hasDaughters) {
      // 1/6 fixed + Asabah (residuary if any left)
      fatherFixedShare = 1 / 6;
      fatherHeir = {
        id: 'father',
        titleEn: 'Father (Walid)',
        titleUrdu: 'والد کا حصہ',
        count: 1,
        category: 'Zawil-Furooz + Asabah',
        shareFraction: '1/6 + Asabah',
        shareDecimal: 1 / 6, // updated later if residuary remains
        sharePercentage: (1 / 6) * 100,
        perPersonPercentage: (1 / 6) * 100,
        totalAmountPKR: 0,
        perPersonAmountPKR: 0,
        quranicReference: 'Surah An-Nisa (4:11)',
        surahVerse: 'وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ',
        hikmatExplanationEn: 'Father receives 1/6 fixed share plus any remaining residuary (Asabah) after daughters and spouse.',
        hikmatExplanationUrdu: 'صرف بیٹیوں کی موجودگی میں والد 1/6 کا حقدار بھی ہے اور تمام ذوی الفروض کے بعد بقیہ ترکہ کا بھی (بطور عصبہ)۔'
      };
    } else {
      // Pure Asabah (takes remainder after spouse and mother)
      fatherFixedShare = 0;
      fatherHeir = {
        id: 'father',
        titleEn: 'Father (Walid)',
        titleUrdu: 'والد کا حصہ',
        count: 1,
        category: 'Asabah',
        shareFraction: 'Remainder (Asabah)',
        shareDecimal: 0,
        sharePercentage: 0,
        perPersonPercentage: 0,
        totalAmountPKR: 0,
        perPersonAmountPKR: 0,
        quranicReference: 'Surah An-Nisa (4:11)',
        surahVerse: 'فَإِن لَّمْ يَكُن لَّهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ',
        hikmatExplanationEn: 'Father inherits as prime residuary (Asabah) taking all remaining estate after spouse and mother.',
        hikmatExplanationUrdu: 'اولاد نہ ہونے پر والد سب سے قوی عصبہ بن کر تمام بقیہ ترکہ کا اکیلا وارث ہوتا ہے۔'
      };
    }
  }

  // Daughters fixed share (only when NO sons exist)
  if (!hasSons && hasDaughters) {
    daughtersFixedShare = family.daughtersCount === 1 ? 1 / 2 : 2 / 3;
    const perDaughter = daughtersFixedShare / family.daughtersCount;
    daughtersHeir = {
      id: 'daughters',
      titleEn: family.daughtersCount === 1 ? '1 Daughter (Beti)' : `${family.daughtersCount} Daughters (Betiyan - Shared)`,
      titleUrdu: family.daughtersCount === 1 ? 'ایک بیٹی کا حصہ' : `${family.daughtersCount} بیٹیاں (برابر تقسیم)`,
      count: family.daughtersCount,
      category: 'Zawil-Furooz',
      shareFraction: family.daughtersCount === 1 ? '1/2' : '2/3',
      shareDecimal: daughtersFixedShare,
      sharePercentage: daughtersFixedShare * 100,
      perPersonPercentage: perDaughter * 100,
      totalAmountPKR: 0,
      perPersonAmountPKR: 0,
      quranicReference: 'Surah An-Nisa (4:11)',
      surahVerse: 'فَإِن كَانَتَا اثْنَتَيْنِ فَلَهُمَا الثُّلُثَانِ مِمَّا تَرَكَ ۖ وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ',
      hikmatExplanationEn: family.daughtersCount === 1
        ? 'A single daughter inherits 1/2 of the estate as a Quranic fixed sharer.'
        : `Two or more daughters inherit 2/3 shared equally (${(perDaughter * 100).toFixed(2)}% each).`,
      hikmatExplanationUrdu: family.daughtersCount === 1
        ? 'اکیلی بیٹی کا قرآنی مقررہ حصہ نصف (1/2) ہے۔'
        : `دو یا دو سے زائد بیٹیوں کا مجموعی حصہ دو تہائی (2/3) ہے جو سب میں برابر تقسیم ہوگا۔`
    };
  }

  // Sisters fixed share (only when Kalalah: no children, no father, no brothers)
  if (!siblingsBlocked && !hasChildren && family.brothersCount === 0 && family.sistersCount > 0) {
    sistersFixedShare = family.sistersCount === 1 ? 1 / 2 : 2 / 3;
    const perSister = sistersFixedShare / family.sistersCount;
    sistersHeir = {
      id: 'sisters',
      titleEn: family.sistersCount === 1 ? '1 Sister (Behan)' : `${family.sistersCount} Sisters (Behnein - Shared)`,
      titleUrdu: family.sistersCount === 1 ? 'ایک بہن کا حصہ' : `${family.sistersCount} بہنیں (برابر تقسیم)`,
      count: family.sistersCount,
      category: 'Zawil-Furooz',
      shareFraction: family.sistersCount === 1 ? '1/2' : '2/3',
      shareDecimal: sistersFixedShare,
      sharePercentage: sistersFixedShare * 100,
      perPersonPercentage: perSister * 100,
      totalAmountPKR: 0,
      perPersonAmountPKR: 0,
      quranicReference: 'Surah An-Nisa (4:176)',
      surahVerse: 'إِنِ امْرُؤٌ هَلَكَ لَيْسَ لَهُ وَلَدٌ وَلَهُ أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ',
      hikmatExplanationEn: family.sistersCount === 1
        ? 'Kalalah: Single sister inherits 1/2 fixed share in the absence of children, father, and brothers.'
        : `Kalalah: Sisters inherit 2/3 shared equally (${(perSister * 100).toFixed(2)}% each).`,
      hikmatExplanationUrdu: family.sistersCount === 1
        ? 'کلالہ (والد اور اولاد کی غیر موجودگی): اکیلی بہن کا حصہ نصف (1/2) ہے۔'
        : `کلالہ: دو یا زائد بہنوں کا مجموعی حصہ 2/3 ہے جو برابر تقسیم ہوگا۔`
    };
  }

  // 8. Awl & Sum of Zawil-Furooz Check
  const totalFixedShares = spouseShare + motherShare + fatherFixedShare + daughtersFixedShare + sistersFixedShare;
  let isAwl = false;
  let isRadd = false;
  let awlDetails: MirathCalculationResult['awlDetails'];
  let raddDetails: MirathCalculationResult['raddDetails'];

  const heirsList: HeirResult[] = [];

  // Check if Awl condition is met (sum of fixed shares > 1.0)
  if (totalFixedShares > 1.0001) {
    isAwl = true;
    const scale = 1 / totalFixedShares;
    
    awlDetails = {
      originalSum: `${(totalFixedShares * 100).toFixed(2)}%`,
      scaledSum: '100.00%',
      explanationEn: `Masla-e-Awl (عول) triggered: Total Quranic fixed shares (${(totalFixedShares * 100).toFixed(2)}%) exceed 100%. All heirs' shares are scaled down proportionally to preserve relative equity.`,
      explanationUrdu: `مسئلہ عول لاگو ہوا: تمام مقررہ حصص کا مجموعہ 100% سے بڑھ گیا۔ شریعت کے مطابق تمام ورثاء کے حصص میں یکساں تناسب سے کمی کر دی گئی۔`
    };

    if (spouseHeir) {
      spouseHeir.shareDecimal = spouseShare * scale;
      spouseHeir.sharePercentage = spouseHeir.shareDecimal * 100;
      spouseHeir.perPersonPercentage = spouseHeir.sharePercentage / spouseHeir.count;
      spouseHeir.shareFraction = decimalToFraction(spouseHeir.shareDecimal);
      heirsList.push(spouseHeir);
    }
    if (motherHeir) {
      motherHeir.shareDecimal = motherShare * scale;
      motherHeir.sharePercentage = motherHeir.shareDecimal * 100;
      motherHeir.perPersonPercentage = motherHeir.sharePercentage / motherHeir.count;
      motherHeir.shareFraction = decimalToFraction(motherHeir.shareDecimal);
      heirsList.push(motherHeir);
    }
    if (fatherHeir && fatherFixedShare > 0) {
      fatherHeir.shareDecimal = fatherFixedShare * scale;
      fatherHeir.sharePercentage = fatherHeir.shareDecimal * 100;
      fatherHeir.perPersonPercentage = fatherHeir.sharePercentage / fatherHeir.count;
      fatherHeir.shareFraction = decimalToFraction(fatherHeir.shareDecimal);
      heirsList.push(fatherHeir);
    }
    if (daughtersHeir) {
      daughtersHeir.shareDecimal = daughtersFixedShare * scale;
      daughtersHeir.sharePercentage = daughtersHeir.shareDecimal * 100;
      daughtersHeir.perPersonPercentage = daughtersHeir.sharePercentage / daughtersHeir.count;
      daughtersHeir.shareFraction = decimalToFraction(daughtersHeir.shareDecimal);
      heirsList.push(daughtersHeir);
    }
    if (sistersHeir) {
      sistersHeir.shareDecimal = sistersFixedShare * scale;
      sistersHeir.sharePercentage = sistersHeir.shareDecimal * 100;
      sistersHeir.perPersonPercentage = sistersHeir.sharePercentage / sistersHeir.count;
      sistersHeir.shareFraction = decimalToFraction(sistersHeir.shareDecimal);
      heirsList.push(sistersHeir);
    }
  } else {
    // Normal or Residuary (Asabah) or Radd case
    let remainder = Math.max(0, 1 - totalFixedShares);

    // First, push initial fixed shares
    if (spouseHeir) heirsList.push(spouseHeir);
    if (motherHeir) heirsList.push(motherHeir);

    // Handle Children as Asabah bil-Ghayr (Sons exist)
    if (hasSons) {
      if (fatherHeir) heirsList.push(fatherHeir); // Father gets his fixed 1/6

      // Sons and Daughters divide remainder in 2:1 ratio
      const sonWeight = 2;
      const daughterWeight = 1;
      const totalParts = (family.sonsCount * sonWeight) + (family.daughtersCount * daughterWeight);
      
      const totalSonsShare = remainder * ((family.sonsCount * sonWeight) / totalParts);
      const perSonShare = totalSonsShare / family.sonsCount;

      const sonsHeir: HeirResult = {
        id: 'sons',
        titleEn: family.sonsCount === 1 ? '1 Son (Beta)' : `${family.sonsCount} Sons (Betay - Shared)`,
        titleUrdu: family.sonsCount === 1 ? 'ایک بیٹے کا حصہ' : `${family.sonsCount} بیٹے (برابر تقسیم)`,
        count: family.sonsCount,
        category: 'Asabah',
        shareFraction: decimalToFraction(totalSonsShare),
        shareDecimal: totalSonsShare,
        sharePercentage: totalSonsShare * 100,
        perPersonPercentage: perSonShare * 100,
        totalAmountPKR: 0,
        perPersonAmountPKR: 0,
        quranicReference: 'Surah An-Nisa (4:11)',
        surahVerse: 'يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
        hikmatExplanationEn: 'Sons inherit as prime residuaries (Asabah bil-Ghayr) taking 2 parts for every 1 part given to a daughter.',
        hikmatExplanationUrdu: 'بیٹے عصبہ بالغیر کے تحت بیٹی کے مقابلے میں دوگنا (2:1) حصہ پاتے ہیں۔'
      };
      heirsList.push(sonsHeir);

      if (family.daughtersCount > 0) {
        const totalDaughtersShare = remainder * ((family.daughtersCount * daughterWeight) / totalParts);
        const perDaughterShare = totalDaughtersShare / family.daughtersCount;

        const daughtersAsabahHeir: HeirResult = {
          id: 'daughters',
          titleEn: family.daughtersCount === 1 ? '1 Daughter (Beti)' : `${family.daughtersCount} Daughters (Betiyan - Shared)`,
          titleUrdu: family.daughtersCount === 1 ? 'ایک بیٹی کا حصہ' : `${family.daughtersCount} بیٹیاں (برابر تقسیم)`,
          count: family.daughtersCount,
          category: 'Asabah',
          shareFraction: decimalToFraction(totalDaughtersShare),
          shareDecimal: totalDaughtersShare,
          sharePercentage: totalDaughtersShare * 100,
          perPersonPercentage: perDaughterShare * 100,
          totalAmountPKR: 0,
          perPersonAmountPKR: 0,
          quranicReference: 'Surah An-Nisa (4:11)',
          surahVerse: 'يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
          hikmatExplanationEn: 'Daughters inherit alongside brothers as Asabah bil-Ghayr, receiving 1 part for every 2 parts given to a brother.',
          hikmatExplanationUrdu: 'بھائیوں کی معیت میں بیٹیاں عصبہ بن کر 1:2 کے تناسب سے شریک ہوتی ہیں۔'
        };
        heirsList.push(daughtersAsabahHeir);
      }
      remainder = 0;
    } else if (family.fatherAlive) {
      // Father is alive, but NO sons
      if (hasDaughters) {
        if (daughtersHeir) heirsList.push(daughtersHeir);
        // Father gets his 1/6 PLUS whatever is left of the remainder!
        const fatherTotalShare = fatherFixedShare + remainder;
        fatherHeir!.shareDecimal = fatherTotalShare;
        fatherHeir!.sharePercentage = fatherTotalShare * 100;
        fatherHeir!.perPersonPercentage = fatherTotalShare * 100;
        fatherHeir!.shareFraction = decimalToFraction(fatherTotalShare);
        heirsList.push(fatherHeir!);
        remainder = 0;
      } else {
        // No children at all, Father gets pure Asabah remainder!
        const fatherTotalShare = remainder;
        fatherHeir!.shareDecimal = fatherTotalShare;
        fatherHeir!.sharePercentage = fatherTotalShare * 100;
        fatherHeir!.perPersonPercentage = fatherTotalShare * 100;
        fatherHeir!.shareFraction = decimalToFraction(fatherTotalShare);
        heirsList.push(fatherHeir!);
        remainder = 0;
      }
    } else {
      // Father is deceased, NO sons
      if (hasDaughters) {
        if (daughtersHeir) heirsList.push(daughtersHeir);

        // Check if Sisters exist: Sisters alongside daughters become Asabah ma'al-Ghayr!
        if (family.sistersCount > 0 && remainder > 0.0001) {
          const totalSistersShare = remainder;
          const perSisterShare = totalSistersShare / family.sistersCount;
          const sistersAsabahHeir: HeirResult = {
            id: 'sisters',
            titleEn: family.sistersCount === 1 ? '1 Sister (Behan)' : `${family.sistersCount} Sisters (Behnein - Shared)`,
            titleUrdu: family.sistersCount === 1 ? 'ایک بہن کا حصہ' : `${family.sistersCount} بہنیں (برابر تقسیم)`,
            count: family.sistersCount,
            category: 'Asabah',
            shareFraction: decimalToFraction(totalSistersShare),
            shareDecimal: totalSistersShare,
            sharePercentage: totalSistersShare * 100,
            perPersonPercentage: perSisterShare * 100,
            totalAmountPKR: 0,
            perPersonAmountPKR: 0,
            quranicReference: 'Hadith: Sahih Bukhari (6742)',
            surahVerse: 'اجْعَلُوا الأَخَوَاتِ مَعَ البَنَاتِ عَصَبَةً',
            hikmatExplanationEn: 'Prophetic Ruling: Sisters alongside daughters inherit as residuaries (Asabah ma\'al-Ghayr) taking the remaining balance.',
            hikmatExplanationUrdu: 'فرمانِ نبوی: بیٹیوں کے ساتھ بہنیں عصبہ (عصبہ مع الغیر) بن کر بچا ہوا سارا ترکہ لے لیتی ہیں۔'
          };
          heirsList.push(sistersAsabahHeir);
          remainder = 0;
        }
      } else {
        // No children, No father
        if (family.brothersCount > 0) {
          // Brothers & Sisters as Asabah bil-Ghayr (2:1)
          const bWeight = 2;
          const sWeight = 1;
          const parts = (family.brothersCount * bWeight) + (family.sistersCount * sWeight);
          const totalBrothersShare = remainder * ((family.brothersCount * bWeight) / parts);
          const perBrotherShare = totalBrothersShare / family.brothersCount;

          const brothersHeir: HeirResult = {
            id: 'brothers',
            titleEn: family.brothersCount === 1 ? '1 Brother (Bhai)' : `${family.brothersCount} Brothers (Bhai - Shared)`,
            titleUrdu: family.brothersCount === 1 ? 'ایک بھائی کا حصہ' : `${family.brothersCount} بھائی (برابر تقسیم)`,
            count: family.brothersCount,
            category: 'Asabah',
            shareFraction: decimalToFraction(totalBrothersShare),
            shareDecimal: totalBrothersShare,
            sharePercentage: totalBrothersShare * 100,
            perPersonPercentage: perBrotherShare * 100,
            totalAmountPKR: 0,
            perPersonAmountPKR: 0,
            quranicReference: 'Surah An-Nisa (4:176)',
            surahVerse: 'وَإِن كَانُوا إِخْوَةً رِّجَالًا وَنِسَاءً فَلِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
            hikmatExplanationEn: 'Kalalah: Brothers and sisters inherit as Asabah in a 2:1 ratio.',
            hikmatExplanationUrdu: 'کلالہ: بھائی اور بہنیں مل کر 2:1 کے قرآنی تناسب سے وارث بنتے ہیں۔'
          };
          heirsList.push(brothersHeir);

          if (family.sistersCount > 0) {
            const totalSistersShare = remainder * ((family.sistersCount * sWeight) / parts);
            const perSisterShare = totalSistersShare / family.sistersCount;
            const sistersAsabahHeir: HeirResult = {
              id: 'sisters',
              titleEn: family.sistersCount === 1 ? '1 Sister (Behan)' : `${family.sistersCount} Sisters (Behnein - Shared)`,
              titleUrdu: family.sistersCount === 1 ? 'ایک بہن کا حصہ' : `${family.sistersCount} بہنیں (برابر تقسیم)`,
              count: family.sistersCount,
              category: 'Asabah',
              shareFraction: decimalToFraction(totalSistersShare),
              shareDecimal: totalSistersShare,
              sharePercentage: totalSistersShare * 100,
              perPersonPercentage: perSisterShare * 100,
              totalAmountPKR: 0,
              perPersonAmountPKR: 0,
              quranicReference: 'Surah An-Nisa (4:176)',
              surahVerse: 'لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ',
              hikmatExplanationEn: 'Kalalah: Sisters inherit alongside brothers in a 2:1 ratio.',
              hikmatExplanationUrdu: 'کلالہ: بہنیں بھائیوں کے ہمراہ 1:2 کے تناسب سے حصہ پاتی ہیں۔'
            };
            heirsList.push(sistersAsabahHeir);
          }
          remainder = 0;
        } else if (family.sistersCount > 0) {
          // Sisters only as Zawil-Furooz
          if (sistersHeir) heirsList.push(sistersHeir);
        }
      }

      // Check for Ar-Radd (رد - Proportional Return)
      // When sum of fixed shares < 1.0 and NO Asabah exists
      if (remainder > 0.0001) {
        isRadd = true;
        // In Hanafi Fiqh, spouse does not participate in Radd if other blood heirs exist.
        // The surplus (remainder) is returned to non-spouse Zawil-Furooz in proportion to their fixed shares.
        const nonSpouseHeirs = heirsList.filter(h => h.id !== 'husband' && h.id !== 'wives');
        
        if (nonSpouseHeirs.length > 0) {
          const sumNonSpouseInitialShares = nonSpouseHeirs.reduce((sum, h) => sum + h.shareDecimal, 0);
          
          for (const heir of nonSpouseHeirs) {
            const extraShare = (heir.shareDecimal / sumNonSpouseInitialShares) * remainder;
            heir.shareDecimal += extraShare;
            heir.sharePercentage = heir.shareDecimal * 100;
            heir.perPersonPercentage = heir.sharePercentage / heir.count;
            heir.shareFraction = decimalToFraction(heir.shareDecimal);
          }
          
          raddDetails = {
            surplusPercentage: remainder * 100,
            explanationEn: `Masla-e-Radd (رد) applied: After fixed shares, a surplus of ${(remainder * 100).toFixed(2)}% remained with no residuary (Asabah). According to Hanafi Fiqh, this surplus was proportionally returned to the blood heirs (excluding spouse).`,
            explanationUrdu: `مسئلہ رد نافذ ہوا: کوئی عصبہ نہ ہونے کی وجہ سے بقیہ ${(remainder * 100).toFixed(2)}% زائد ترکہ تمام خونی ذوی الفروض ورثاء (سوائے زوجین) کو ان کے حصص کے تناسب سے لوٹا دیا گیا۔`
          };
          remainder = 0;
        } else if (spouseHeir) {
          // If ONLY spouse exists and no blood heirs at all, contemporary legal practice in Pakistan returns remainder to spouse
          spouseHeir.shareDecimal = 1.0;
          spouseHeir.sharePercentage = 100;
          spouseHeir.perPersonPercentage = 100 / spouseHeir.count;
          spouseHeir.shareFraction = '1/1';
          
          raddDetails = {
            surplusPercentage: remainder * 100,
            explanationEn: 'Only spouse survived with no blood heirs; entire estate devolves to the spouse.',
            explanationUrdu: 'کوئی خونی وارث نہ ہونے پر مکمل ترکہ زوج کے حق میں منتقل ہوتا ہے۔'
          };
          remainder = 0;
        }
      }
    }
  }

  // 9. Compute PKR amounts for each heir
  for (const heir of heirsList) {
    heir.totalAmountPKR = Math.round(netDistributableEstatePKR * heir.shareDecimal);
    heir.perPersonAmountPKR = Math.round(heir.totalAmountPKR / heir.count);
  }

  return {
    grossEstatePKR,
    funeralExpensesPKR,
    debtsAndMehrPKR,
    estateAfterDebtsPKR,
    maxPermissibleWasiyyatPKR,
    wasiyyatPKR,
    isWasiyyatCapped,
    wasiyyatWarning,
    netDistributableEstatePKR,
    isEstateDepleted: false,
    heirs: heirsList,
    blockedHeirs,
    isAwl,
    awlDetails,
    isRadd,
    raddDetails,
    isUmariyyatayn
  };
}

/**
 * Makan / Zameen Buy-Out Simulator (Takhruj)
 * Calculates the exact cash compensation an heir who wants to keep a specific property
 * must pay to every other heir to buy out their shares.
 */
export interface BuyOutCompensation {
  heirId: string;
  heirTitleEn: string;
  heirTitleUrdu: string;
  sharePercentage: number;
  cashOwedPKR: number;
}

export interface BuyOutResult {
  buyerHeirTitleEn: string;
  buyerHeirTitleUrdu: string;
  propertyValuePKR: number;
  buyerRetainedSharePKR: number;
  totalCashNeededToBuyOutPKR: number;
  compensations: BuyOutCompensation[];
}

export function calculatePropertyBuyOut(
  propertyValuePKR: number,
  buyerHeirId: string,
  heirs: HeirResult[]
): BuyOutResult | null {
  const buyer = heirs.find(h => h.id === buyerHeirId);
  if (!buyer || propertyValuePKR <= 0) return null;

  // Buyer's individual fraction
  const buyerSingleDecimal = buyer.shareDecimal / buyer.count;
  const buyerRetainedSharePKR = Math.round(propertyValuePKR * buyerSingleDecimal);
  const totalCashNeededToBuyOutPKR = propertyValuePKR - buyerRetainedSharePKR;

  const compensations: BuyOutCompensation[] = [];

  for (const heir of heirs) {
    if (heir.id === buyerHeirId) {
      // If there are other co-heirs in the same group (e.g. buyer is 1 son among 2 sons)
      if (heir.count > 1) {
        const otherInGroupCount = heir.count - 1;
        const otherInGroupDecimal = (heir.shareDecimal / heir.count) * otherInGroupCount;
        const owedToCoHeirs = Math.round(propertyValuePKR * otherInGroupDecimal);
        compensations.push({
          heirId: `${heir.id}_coheirs`,
          heirTitleEn: `Other ${heir.titleEn}`,
          heirTitleUrdu: `باقی ${heir.titleUrdu}`,
          sharePercentage: (otherInGroupDecimal) * 100,
          cashOwedPKR: owedToCoHeirs
        });
      }
      continue;
    }

    const owed = Math.round(propertyValuePKR * heir.shareDecimal);
    compensations.push({
      heirId: heir.id,
      heirTitleEn: heir.titleEn,
      heirTitleUrdu: heir.titleUrdu,
      sharePercentage: heir.sharePercentage,
      cashOwedPKR: owed
    });
  }

  return {
    buyerHeirTitleEn: buyer.count > 1 ? `1 of ${buyer.titleEn}` : buyer.titleEn,
    buyerHeirTitleUrdu: buyer.count > 1 ? `ایک ${buyer.titleUrdu}` : buyer.titleUrdu,
    propertyValuePKR,
    buyerRetainedSharePKR,
    totalCashNeededToBuyOutPKR,
    compensations
  };
}
