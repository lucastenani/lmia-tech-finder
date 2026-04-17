/**
 * Deterministic FNV-1a 32-bit hash. Used to build stable ids for records.
 */
export function hash(input: string): string {
  let h = 2_166_136_261
  for (let i = 0; i < input.length; i++) {
    // biome-ignore lint/suspicious/noBitwiseOperators: FNV-1a algorithm requires XOR
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16_777_619)
  }
  // biome-ignore lint/suspicious/noBitwiseOperators: unsigned right shift converts to uint32
  return (h >>> 0).toString(36)
}
