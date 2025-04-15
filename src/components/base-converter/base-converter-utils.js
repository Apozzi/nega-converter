export const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const options = [];
for (let i = -32; i <= 32; i++) {
    if (i !== 0 && i !== 1 && i !== -1) {
        options.push(i);
    }
}
export const BASE_OPTIONS = options;


export function getBaseDisplayName(baseNum, hasParentheses = false) {
    const baseNames = {
      32: "Duotrigesimal",
      16: "Hexadecimal",
      10: "Decimal",
      8: "Octal",
      3: "Ternary",
      2: "Binary",
      "-2": "Negabinary",
      "-3": "Negaternary",
      "-8": "Negaoctal",
      "-10": "Negadecimal",
      "-16": "Negahexadecimal",
      "-32": "Negaduotrigesimal"
    };
    if (hasParentheses && baseNames[baseNum] ) {
      return `(${baseNames[baseNum]})` || "";
    }
    return baseNames[baseNum] || "";
  }
  