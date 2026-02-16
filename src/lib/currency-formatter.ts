export function formatCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(numValue)) return '';
  return numValue.toLocaleString('ja-JP');
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0;
}