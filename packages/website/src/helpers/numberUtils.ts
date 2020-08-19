export function formatNumber(n?: number | null, decimal = 0) {
  return n && n.toFixed(decimal);
}
