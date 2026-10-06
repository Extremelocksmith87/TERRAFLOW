/**
 * Exponential slider conversion utilities.
 * Allows sliders to grow exponentially: fine increments in low ranges (0.1m, 0.2m, 0.4m, 0.8m, 1m, 1.3m, 1.6m, 2m...)
 * while scaling smoothly to large maximum values (e.g., 1,052m, 100%, 170M population).
 */

export const EXP_SLIDER_STEPS = 1000;

/**
 * Maps a real-world value to a slider position in [0, EXP_SLIDER_STEPS].
 */
export function valueToExponentialSlider(
  val: number,
  maxVal: number,
  k: number = 7.8
): number {
  if (val <= 0 || maxVal <= 0) return 0;
  if (val >= maxVal) return EXP_SLIDER_STEPS;
  const ratio = Math.max(0, Math.min(1, val / maxVal));
  const inside = ratio * (Math.exp(k) - 1) + 1;
  const t = Math.log(inside) / k;
  return Math.max(0, Math.min(EXP_SLIDER_STEPS, Math.round(t * EXP_SLIDER_STEPS)));
}

/**
 * Maps a slider position in [0, EXP_SLIDER_STEPS] to a real-world value on the exponential curve.
 */
export function exponentialSliderToValue(
  sliderPos: number,
  maxVal: number,
  k: number = 7.8,
  type: 'seaLevel' | 'iceMelt' | 'population' = 'seaLevel'
): number {
  if (sliderPos <= 0 || maxVal <= 0) return 0;
  if (sliderPos >= EXP_SLIDER_STEPS) return maxVal;
  const t = sliderPos / EXP_SLIDER_STEPS;
  const raw = maxVal * (Math.exp(k * t) - 1) / (Math.exp(k) - 1);

  if (type === 'seaLevel') {
    if (raw < 2.0) {
      // 0.1m, 0.2m, 0.4m, 0.8m, 1m, 1.3m, 1.6m, 2m etc.
      const rounded1 = Math.round(raw * 10) / 10;
      return rounded1 > 0 ? rounded1 : Math.round(raw * 100) / 100;
    } else if (raw < 10.0) {
      return Math.round(raw * 10) / 10;
    } else {
      return Math.round(raw);
    }
  } else if (type === 'iceMelt') {
    if (raw < 5.0) {
      const rounded1 = Math.round(raw * 10) / 10;
      return rounded1 > 0 ? rounded1 : Math.round(raw * 100) / 100;
    } else {
      return Math.round(raw);
    }
  } else {
    // population
    if (raw < 100000) {
      return Math.round(raw / 5000) * 5000;
    } else if (raw < 1000000) {
      return Math.round(raw / 10000) * 10000;
    } else if (raw < 10000000) {
      return Math.round(raw / 100000) * 100000;
    } else {
      return Math.round(raw / 500000) * 500000;
    }
  }
}

/**
 * Parses user typed input for population (supports '500k', '1.5M', '25m', '1500000', or numbers).
 */
export function parsePopulationInput(valStr: string, maxPop: number): number {
  const clean = valStr.trim().toLowerCase();
  if (!clean) return 0;
  try {
    if (clean.endsWith('m')) {
      const num = parseFloat(clean.slice(0, -1));
      return isNaN(num) ? 0 : Math.max(0, Math.min(maxPop, Math.round(num * 1000000)));
    }
    if (clean.endsWith('k')) {
      const num = parseFloat(clean.slice(0, -1));
      return isNaN(num) ? 0 : Math.max(0, Math.min(maxPop, Math.round(num * 1000)));
    }
    const num = parseFloat(clean.replace(/,/g, ''));
    if (isNaN(num)) return 0;
    // If user typed shorthand like '2.5' or '25', assume millions if <= 300
    if (num > 0 && num <= 300) {
      return Math.max(0, Math.min(maxPop, Math.round(num * 1000000)));
    }
    return Math.max(0, Math.min(maxPop, Math.round(num)));
  } catch {
    return 0;
  }
}
