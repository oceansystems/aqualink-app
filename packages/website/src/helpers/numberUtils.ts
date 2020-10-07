import { isNumber } from "lodash";

export function formatNumber(n?: number | null, decimal = 0) {
  return isNumber(n) ? n.toFixed(decimal) : "- -";
}
