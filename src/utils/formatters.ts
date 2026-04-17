/**
 * Compact number suffix helper (K / M / B).
 */
function compactNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000)     return `${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)         return `${(value / 1_000).toFixed(2)}K`;
  return value.toFixed(2);
}

/**
 * Full-precision currency (for tooltips). Always returns the exact number.
 */
export function formatCurrencyFull(value: number): string {
  if (!isFinite(value) || value === 0) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Full-precision holding amount (for tooltips). Up to 8 significant digits.
 */
export function formatHoldingFull(value: number): string {
  if (!isFinite(value) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs < 0.000001) return value.toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
  if (abs < 1) return value.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  }).format(value);
}


/**
 * Format a number as Indian Rupee currency string.
 * Never uses scientific notation. Dust amounts (< ₹0.01) show as ₹0.00.
 */
export function formatCurrency(value: number): string {
  if (!isFinite(value) || value === 0) return '₹0.00';

  const abs = Math.abs(value);

  // Dust — not worth displaying
  if (abs < 0.005) return '₹0.00';

  // Large values — compact suffix
  if (abs >= 1_000) {
    const sign = value < 0 ? '-' : '';
    return `${sign}₹${compactNumber(abs)}`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a token holding amount (no scientific notation).
 * Very small (dust) balances that would show as 0.000000 are shown as "0".
 */
export function formatHolding(value: number): string {
  if (!isFinite(value) || value === 0) return '0';

  const abs = Math.abs(value);

  // Effectively zero at human scale (< 0.000001)
  if (abs < 0.000001) return '0';

  // Large token holdings — compact
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(4)}M`;
  if (abs >= 1_000)     return `${(value / 1_000).toFixed(4)}K`;

  // Normal range — up to 6 decimal places, trim trailing zeros
  if (abs < 0.0001) return value.toFixed(6);
  if (abs < 0.01)   return value.toFixed(4);

  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 4,
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Format price with adaptive precision. No scientific notation.
 */
export function formatPrice(value: number): string {
  if (!isFinite(value) || value === 0) return '₹0';

  const abs = Math.abs(value);

  // Very small prices (e.g. meme coins < ₹0.001)
  if (abs < 0.000001) return '₹0.000001';
  if (abs < 0.001)    return `₹${abs.toFixed(8).replace(/0+$/, '')}`;
  if (abs < 1)        return `₹${abs.toFixed(6).replace(/0+$/, '')}`;

  // Large prices — compact
  if (abs >= 1_000) {
    const sign = value < 0 ? '-' : '';
    return `${sign}₹${compactNumber(abs)}`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Compute net capital gain = profits - losses.
 */
export function netGain(profits: number, losses: number): number {
  return profits - losses;
}

/**
 * Compute realised capital gain = sum of stcg net + ltcg net.
 */
export function realisedGain(
  stcgProfits: number,
  stcgLosses: number,
  ltcgProfits: number,
  ltcgLosses: number
): number {
  return netGain(stcgProfits, stcgLosses) + netGain(ltcgProfits, ltcgLosses);
}
