
/*
export const EPSILON = 1e-10;

export function isComplexZero(z) {
    return Math.abs(z.real) < EPSILON && Math.abs(z.imag) < EPSILON;
}

export function cAdd(z1, z2) {
    return { real: z1.real + z2.real, imag: z1.imag + z2.imag };
}

export function cSub(z1, z2) {
    return { real: z1.real - z2.real, imag: z1.imag - z2.imag };
}

export function cMul(z1, z2) {
    return {
        real: z1.real * z2.real - z1.imag * z2.imag,
        imag: z1.real * z2.imag + z1.imag * z2.real
    };
}

export function cDiv(z1, z2) {
    const normSqZ2 = z2.real * z2.real + z2.imag * z2.imag;
    if (Math.abs(normSqZ2) < EPSILON) {
        console.error("Complex division by zero or near-zero.");
        return { real: NaN, imag: NaN };
    }
    const real = (z1.real * z2.real + z1.imag * z2.imag) / normSqZ2;
    const imag = (z1.imag * z2.real - z1.real * z2.imag) / normSqZ2;
    return { real, imag };
}

export function cPow(z, n) {
    if (n === 0) return { real: 1, imag: 0 };
    if (n < 0) return cDiv({ real: 1, imag: 0 }, cPow(z, -n));
    let result = { real: 1, imag: 0 };
    let base = { ...z };
    let exp = n;
    while (exp > 0) {
        if (exp % 2 === 1) result = cMul(result, base);
        base = cMul(base, base);
        exp = Math.floor(exp / 2);
    }
    return result;
}

export function cNorm(z) {
    return z.real * z.real + z.imag * z.imag;
}

export function cAbs(z) {
    return Math.sqrt(cNorm(z));
}

export function cRound(z) {
    return { real: Math.round(z.real), imag: Math.round(z.imag) };
}

export function formatComplex(z) {
    if (isComplexZero(z)) return "0";

    const r = z.real;
    const i = z.imag;
    let parts = [];

    if (Math.abs(r) > EPSILON || Math.abs(i) < EPSILON) {
        parts.push(Number(r.toFixed(10)).toString());
    }
    if (Math.abs(i) > EPSILON) {
        if (parts.length > 0 && i > 0) {
            parts.push("+");
        }
        if (Math.abs(Math.abs(i) - 1) < EPSILON) {
            parts.push(i > 0 ? "i" : "-i");
        } else {
            parts.push(Number(i.toFixed(10)).toString() + "i");
        }
    }
    return parts.join("");
}

export function parseComplex(str) {
    str = str.trim().replace(/\s+/g, '');
    if (str === 'i') return { real: 0, imag: 1 };
    if (str === '-i') return { real: 0, imag: -1 };

    const match = str.match(/^([+-]?(?:\d*\.\d+|\d+))?([+-](?:(?:\d*\.\d+|\d+)?)i)?$/i);
    const matchIOnly = str.match(/^([+-]?)i$/i);
    const matchRealOnly = str.match(/^([+-]?(?:\d*\.\d+|\d+))$/i);
    const matchImagOnly = str.match(/^([+-]?(?:\d*\.\d+|\d+)?)i$/i);


    let real = 0;
    let imag = 0;

    if (match) {
        if (match[1]) {
            real = parseFloat(match[1]);
        }
        if (match[2]) {
            let imagPart = match[2].replace('i', '');
            if (imagPart === '+' || imagPart === '') imag = 1;
            else if (imagPart === '-') imag = -1;
            else imag = parseFloat(imagPart);
        }
         if (!isNaN(real) && !isNaN(imag)) return { real, imag };

    } else if (matchIOnly) {
         imag = (matchIOnly[1] === '-') ? -1 : 1;
         if (!isNaN(real) && !isNaN(imag)) return { real, imag };
    } else if (matchRealOnly) {
        real = parseFloat(matchRealOnly[1]);
         if (!isNaN(real) && !isNaN(imag)) return { real, imag };
    } else if (matchImagOnly) {
        let imagPart = matchImagOnly[1];
         if (imagPart === '+' || imagPart === '') imag = 1;
         else if (imagPart === '-') imag = -1;
         else imag = parseFloat(imagPart);
         if (!isNaN(real) && !isNaN(imag)) return { real, imag };
    }


    console.warn(`Could not parse complex number: "${str}"`);
    return null;
}


export const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const MAX_NORM_FOR_DIGITS = DIGITS.length;

export function parseBase(baseStr) {
    baseStr = baseStr.trim();
    const intBase = parseInt(baseStr, 10);

    if (baseStr === intBase.toString()) {
        if (intBase !== 0 && intBase !== 1 && intBase !== -1) {
             if (intBase >= -32 && intBase <= 32) {
                return intBase;
             } else {
                 return { error: `Base inteira ${intBase} fora do limite [-32, 32]` };
             }
        } else {
            return { error: `Base ${intBase} inválida (não pode ser 0, 1, -1)` };
        }
    }

    const complexBase = parseComplex(baseStr);
    if (complexBase) {
        if ((Math.abs(complexBase.real) < EPSILON && Math.abs(complexBase.imag) < EPSILON) ||
            (Math.abs(complexBase.real - 1) < EPSILON && Math.abs(complexBase.imag) < EPSILON) ||
            (Math.abs(complexBase.real + 1) < EPSILON && Math.abs(complexBase.imag) < EPSILON)) {
             return { error: `Base ${formatComplex(complexBase)} inválida` };
        }

        if (complexBase.real < -32 || complexBase.real > 32 || complexBase.imag < -32 || complexBase.imag > 32) {
            return { error: `Componentes da base ${formatComplex(complexBase)} fora do limite [-32, 32]` };
        }

        const norm = cNorm(complexBase);
         if (norm < 2 - EPSILON) {
             return { error: `Base ${formatComplex(complexBase)} tem norma muito pequena (${norm.toFixed(4)})` };
         }

        return { ...complexBase, norm };
    }

    return { error: `Formato de base inválido: "${baseStr}"` };
}

export function getBaseDisplayName(base, hasParentheses = false) {
     const baseNames = {
         32: "Duotrigesimal", 16: "Hexadecimal", 10: "Decimal", 8: "Octal", 3: "Ternary", 2: "Binary",
         "-2": "Negabinary", "-3": "Negaternary", "-8": "Negaoctal", "-10": "Negadecimal", "-16": "Negahexadecimal", "-32": "Negaduotrigesimal",
         "-1+i": "Base Nega-imaginária",
         "2i": "Base Quater-imaginária"
     };

     let name = "";
     if (typeof base === 'number') {
         name = baseNames[base.toString()] || `Base ${base}`;
     } else if (typeof base === 'object' && base !== null && 'real' in base) {
         const baseStr = formatComplex(base);
         name = baseNames[baseStr] || `Base ${baseStr}`;
     } else {
         name = `Base ${base}`;
     }

     if (hasParentheses && name) {
         return `(${name})`;
     }
     return name;
 }

export const BASE_SUGGESTIONS = [
    "10", "2", "16", "8", "-10", "-2", "-16",
    "32", "-32", "3", "-3",
    "-1+i",
    "2i",
    "1+i",
    "2+i"
];
*/
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
  
