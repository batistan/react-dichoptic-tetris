export const HEX_COLOR_REGEX = /^#?[A-F0-9]{6}$/i;

/**
 * Validates if a string is a valid hex color (with or without #)
 */
export function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}
