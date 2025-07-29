// src/utils/questionUtils.ts

/**
 * Chuyển mảng options sang dạng { A: ..., B: ..., C: ..., ... }
 */
export function mapOptions(options: string[]): Record<string, string> {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const mapped: Record<string, string> = {};

  options.forEach((opt, idx) => {
    if (letters[idx]) {
      mapped[letters[idx]] = opt;
    }
  });

  return mapped;
}

// Chuyển mảng options sang dạng { A: ..., B: ..., C: ..., ... }
export function convertOptionsArrayToObject(options: string[]): Record<string, string> {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const result: Record<string, string> = {};
  options
    .filter((option) => option.trim() !== "")
    .forEach((option, index) => {
      result[letters[index]] = option;
    });
  return result;
}
