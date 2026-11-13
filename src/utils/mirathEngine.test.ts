import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateMirath, 
  calculatePropertyBuyOut, 
  formatPKR, 
  getPakistaniUnit,
  tolasToPKR,
  pkrToTolas,
  GOLD_RATE_PER_TOLA_PKR
} from './mirathEngine.ts';
import type { EstateInputs, FamilyTree } from './mirathEngine.ts';

test('Format PKR output conforms to Pakistani Laakh and Crore standards', () => {
  const result1 = formatPKR(20_000_000);
  assert.match(result1, /2\.00 Crore PKR/);
  assert.match(result1, /Rs\. 2,00,00,000/);

  const result2 = formatPKR(1_500_000);
  assert.match(result2, /15\.00 Laakh PKR/);

  const unit = getPakistaniUnit(10_000_000);
  assert.equal(unit, '1.00 Crore PKR');
});

test('Standard Family Case (2 Crore, Wife 1, Mother, Father, 2 Sons, 1 Daughter)', () => {
  const estate: EstateInputs = {
    cash: 5_000_000,
    property: 15_000_000,
    goldSilver: 0,
    otherAssets: 0,
    funeralExpenses: 0,
    debtsAndMehr: 0,
    wasiyyat: 0
  };

  const family: FamilyTree = {
    deceasedGender: 'male',
    wivesCount: 1,
    husbandPresent: false,
    fatherAlive: true,
    motherAlive: true,
    sonsCount: 2,
    daughtersCount: 1,
    brothersCount: 1, // should be blocked
    sistersCount: 1  // should be blocked
  };

  const res = calculateMirath(estate, family);

  assert.equal(res.grossEstatePKR, 20_000_000);
  assert.equal(res.netDistributableEstatePKR, 20_000_000);
  assert.equal(res.isAwl, false);
  assert.equal(res.isRadd, false);

  // Check blocking of siblings
  assert.equal(res.blockedHeirs.length, 2);
  assert.ok(res.blockedHeirs.some(h => h.id === 'blocked_brothers'));
  assert.ok(res.blockedHeirs.some(h => h.id === 'blocked_sisters'));

  // Heirs presence
  const wife = res.heirs.find(h => h.id === 'wives');
  const mother = res.heirs.find(h => h.id === 'mother');
  const father = res.heirs.find(h => h.id === 'father');
  const sons = res.heirs.find(h => h.id === 'sons');
  const daughters = res.heirs.find(h => h.id === 'daughters');

  assert.ok(wife && mother && father && sons && daughters);

  // Wife gets 1/8
  assert.equal(wife.shareFraction, '1/8');
  assert.equal(wife.totalAmountPKR, 2_500_000);

  // Mother gets 1/6
  assert.equal(mother.shareFraction, '1/6');
  assert.equal(Math.round(mother.totalAmountPKR), 3_333_333);

  // Father gets 1/6
  assert.equal(father.shareFraction, '1/6');
  assert.equal(Math.round(father.totalAmountPKR), 3_333_333);

  // Remainder = 1 - 1/8 - 1/6 - 1/6 = 13/24 = 54.1667%
  // 5 parts: 4 to sons (2 each), 1 to daughter
  // Each son gets: (13/24 * 2/5) = 26/120 = 21.6667% (approx 4,333,333)
  // Total sons = 8,666,667
  // Daughter = 2,166,667
  assert.equal(Math.round(sons.totalAmountPKR), 8_666_667);
  assert.equal(Math.round(daughters.totalAmountPKR), 2_166_667);

  // Verify total sums up to net estate
  const totalAllocated = res.heirs.reduce((sum, h) => sum + h.totalAmountPKR, 0);
  assert.ok(Math.abs(totalAllocated - 20_000_000) <= 2);
});

test('Daughters Only Case with Radd (1.5 Crore, Wife 1, 2 Daughters, No Sons, Parents Deceased)', () => {
  const estate: EstateInputs = {
    cash: 15_000_000,
    property: 0,
    goldSilver: 0,
    otherAssets: 0,
    funeralExpenses: 0,
    debtsAndMehr: 0,
    wasiyyat: 0
  };

  const family: FamilyTree = {
    deceasedGender: 'male',
    wivesCount: 1,
    husbandPresent: false,
    fatherAlive: false,
    motherAlive: false,
    sonsCount: 0,
    daughtersCount: 2,
    brothersCount: 0,
    sistersCount: 0
  };

  const res = calculateMirath(estate, family);

  assert.equal(res.isRadd, true);
  const wife = res.heirs.find(h => h.id === 'wives');
  const daughters = res.heirs.find(h => h.id === 'daughters');

  assert.ok(wife && daughters);
  // Wife remains 1/8 (12.5% = 1,875,000)
  assert.equal(wife.shareFraction, '1/8');
  assert.equal(wife.totalAmountPKR, 1_875_000);

  // Daughters get initial 2/3 + surplus 5/24 = 21/24 = 7/8 (87.5% = 13,125,000)
  assert.equal(daughters.shareFraction, '7/8');
  assert.equal(daughters.totalAmountPKR, 13_125_000);

  const totalAllocated = res.heirs.reduce((sum, h) => sum + h.totalAmountPKR, 0);
  assert.equal(totalAllocated, 15_000_000);
});

test('High Debt + Will Guardrail Trigger & Auto-cap (1 Crore Estate, 15 Lakh Mehr, 1 Lakh Funeral, 40 Lakh Will)', () => {
  const estate: EstateInputs = {
    cash: 10_000_000,
    property: 0,
    goldSilver: 0,
    otherAssets: 0,
    funeralExpenses: 100_000,
    debtsAndMehr: 1_500_000,
    wasiyyat: 4_000_000
  };

  const family: FamilyTree = {
    deceasedGender: 'male',
    wivesCount: 1,
    husbandPresent: false,
    fatherAlive: false,
    motherAlive: false,
    sonsCount: 1,
    daughtersCount: 0,
    brothersCount: 0,
    sistersCount: 0
  };

  const res = calculateMirath(estate, family);

  // Estate after debts = 10,000,000 - 100,000 - 1,500,000 = 8,400,000
  assert.equal(res.estateAfterDebtsPKR, 8_400_000);
  // Max permissible 1/3 = 2,800,000
  assert.equal(res.maxPermissibleWasiyyatPKR, 2_800_000);
  // User entered 4,000,000 > 2,800,000 -> warning should be true
  assert.equal(res.wasiyyatWarning, true);
});

test('Takhruj Property Buy-out Simulator computes exact cash compensations', () => {
  const estate: EstateInputs = {
    cash: 0,
    property: 10_000_000, // 1 Crore House
    goldSilver: 0,
    otherAssets: 0,
    funeralExpenses: 0,
    debtsAndMehr: 0,
    wasiyyat: 0
  };

  const family: FamilyTree = {
    deceasedGender: 'male',
    wivesCount: 1,
    husbandPresent: false,
    fatherAlive: false,
    motherAlive: true,
    sonsCount: 1,
    daughtersCount: 1,
    brothersCount: 0,
    sistersCount: 0
  };

  const mirath = calculateMirath(estate, family);
  // Son wants to keep the house
  const buyOut = calculatePropertyBuyOut(10_000_000, 'sons', mirath.heirs);

  assert.ok(buyOut);
  assert.equal(buyOut.propertyValuePKR, 10_000_000);
  // Son keeps his share, pays the rest to Wife, Mother, Daughter
  const totalCompensations = buyOut.compensations.reduce((sum, c) => sum + c.cashOwedPKR, 0);
  assert.equal(totalCompensations, buyOut.totalCashNeededToBuyOutPKR);
  assert.equal(buyOut.buyerRetainedSharePKR + buyOut.totalCashNeededToBuyOutPKR, 10_000_000);
});

test('Umariyyatayn (Gharrawayn) Special Case: Husband + Mother + Father', () => {
  const estate: EstateInputs = {
    cash: 6_000_000,
    property: 0,
    goldSilver: 0,
    otherAssets: 0,
    funeralExpenses: 0,
    debtsAndMehr: 0,
    wasiyyat: 0
  };

  const family: FamilyTree = {
    deceasedGender: 'female',
    wivesCount: 0,
    husbandPresent: true,
    fatherAlive: true,
    motherAlive: true,
    sonsCount: 0,
    daughtersCount: 0,
    brothersCount: 0,
    sistersCount: 0
  };

  const res = calculateMirath(estate, family);
  assert.equal(res.isUmariyyatayn, true);

  const husband = res.heirs.find(h => h.id === 'husband');
  const mother = res.heirs.find(h => h.id === 'mother');
  const father = res.heirs.find(h => h.id === 'father');

  assert.ok(husband && mother && father);
  // Husband gets 1/2 (50% = 3,000,000)
  assert.equal(husband.shareFraction, '1/2');
  assert.equal(husband.totalAmountPKR, 3_000_000);

  // Mother gets 1/3 of remainder (1/6 = 16.67% = 1,000,000)
  assert.equal(mother.shareFraction, '1/6');
  assert.equal(mother.totalAmountPKR, 1_000_000);

  // Father gets remainder (2/6 = 1/3 = 33.33% = 2,000,000 - twice the mother's share!)
  assert.equal(father.shareFraction, '1/3');
  assert.equal(father.totalAmountPKR, 2_000_000);

  const total = res.heirs.reduce((s, h) => s + h.totalAmountPKR, 0);
  assert.equal(total, 6_000_000);
});

test('Masla-e-Awl (Proportional Reduction) when fixed shares exceed 1.0', () => {
  // Female deceased: Husband (1/4 with children), 2 Daughters (2/3), Mother (1/6), Father (1/6)
  // Sum = 3/12 + 8/12 + 2/12 + 2/12 = 15/12 (125%)
  const estate: EstateInputs = {
    cash: 15_000_000,
    property: 0,
    goldSilver: 0,
    otherAssets: 0,
    funeralExpenses: 0,
    debtsAndMehr: 0,
    wasiyyat: 0
  };

  const family: FamilyTree = {
    deceasedGender: 'female',
    wivesCount: 0,
    husbandPresent: true,
    fatherAlive: true,
    motherAlive: true,
    sonsCount: 0,
    daughtersCount: 2,
    brothersCount: 0,
    sistersCount: 0
  };

  const res = calculateMirath(estate, family);
  assert.equal(res.isAwl, true);

  const husband = res.heirs.find(h => h.id === 'husband');
  const daughters = res.heirs.find(h => h.id === 'daughters');
  const mother = res.heirs.find(h => h.id === 'mother');
  const father = res.heirs.find(h => h.id === 'father');

  assert.ok(husband && daughters && mother && father);
  // In Awl to 15:
  // Husband: 3/15 = 1/5 (20% = 3,000,000)
  assert.equal(husband.shareFraction, '1/5');
  assert.equal(husband.totalAmountPKR, 3_000_000);

  // Daughters: 8/15 = 53.33% = 8,000,000
  assert.equal(daughters.shareFraction, '8/15');
  assert.equal(daughters.totalAmountPKR, 8_000_000);

  // Mother: 2/15 = 13.33% = 2,000,000
  assert.equal(mother.shareFraction, '2/15');
  assert.equal(mother.totalAmountPKR, 2_000_000);

  // Father: 2/15 = 13.33% = 2,000,000
  assert.equal(father.shareFraction, '2/15');
  assert.equal(father.totalAmountPKR, 2_000_000);

  const total = res.heirs.reduce((s, h) => s + h.totalAmountPKR, 0);
  assert.equal(total, 15_000_000);
});

test('Gold/Silver Tola currency toggle auto-converts accurately to PKR', () => {
  // Benchmark rate: Rs. 434,000 / tola (24K)
  assert.equal(GOLD_RATE_PER_TOLA_PKR, 434_000);

  // 1 tola = 434,000 PKR
  assert.equal(tolasToPKR(1), 434_000);

  // 10 tolas = 4,340,000 PKR (43.4 Laakh)
  assert.equal(tolasToPKR(10), 4_340_000);

  // 2.5 tolas = 1,085,000 PKR
  assert.equal(tolasToPKR(2.5), 1_085_000);

  // Reverse conversion: 4,340,000 PKR -> 10 tolas
  assert.equal(pkrToTolas(4_340_000), 10);

  // Zero / negative edge cases
  assert.equal(tolasToPKR(0), 0);
  assert.equal(pkrToTolas(0), 0);
});


