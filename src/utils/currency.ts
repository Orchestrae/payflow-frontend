/**
 * Format kobo amount to NGN display string
 * 30000000 → "NGN 300,000.00"
 */
export function formatNGN(kobo: number): string {
  const naira = kobo / 100;
  return `NGN ${naira.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format transfer amount string (already in main unit) to NGN display
 * "50000" → "NGN 50,000.00"
 */
export function formatTransferAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return 'NGN 0.00';
  return `NGN ${num.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Parse NGN input (user types naira) to kobo for API
 * "300000" → 30000000
 */
export function parseNGNToKobo(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const naira = parseFloat(cleaned);
  if (isNaN(naira)) return 0;
  return Math.round(naira * 100);
}

/**
 * Format kobo to naira number for form inputs
 * 30000000 → "300000"
 */
export function koboToNaira(kobo: number): string {
  return (kobo / 100).toString();
}
