import { i18n } from "../../i18n/i18n";

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
    return {
        real: Math.round(z.real + z.imag/2),
        imag: Math.round(z.imag - z.real/2)
    };
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
                return { error: i18n.t('baseOutOfRange', intBase) };
            }
        } else {
            return { error: i18n.t('invalidBaseValue', intBase) };
        }
    }

    const complexBase = parseComplex(baseStr);
    if (complexBase) {
        if ((Math.abs(complexBase.real) < EPSILON && Math.abs(complexBase.imag) < EPSILON) ||
            (Math.abs(complexBase.real - 1) < EPSILON && Math.abs(complexBase.imag) < EPSILON) ||
            (Math.abs(complexBase.real + 1) < EPSILON && Math.abs(complexBase.imag) < EPSILON)) {
            return { error: i18n.t('invalidBase', formatComplex(complexBase)) };
        }

        if (complexBase.real < -32 || complexBase.real > 32 || complexBase.imag < -32 || complexBase.imag > 32) {
            return { error: i18n.t('baseComponentsOutOfRange', formatComplex(complexBase)) };
        }

        const norm = cNorm(complexBase);
        if (norm < 2 - EPSILON) {
            return { error: i18n.t('tooSmallBaseNorm', formatComplex(complexBase)) };
        }

        return { ...complexBase, norm };
    }

    return { error: i18n.t('invalidBaseFormat', baseStr) };
}

export const BASE_SUGGESTIONS = [
    {value: "-2", name: "Negabinary"},
    {value: "-3", name: "Negaternary"},
    {value: "-8", name: "Negaoctal"},
    {value: "-10", name: "Negadecimal"},
    {value: "-16", name: "Negahexadecimal"},
    {value: "-32", name: "Negaduotrigesimal"},
    {value: "2", name: "Binary"},
    {value: "3", name: "Ternary"},
    {value: "8", name: "Octal"},
    {value: "10", name: "Decimal"},
    {value: "16", name: "Hexadecimal"},
    {value: "32", name: "Duotrigesimal"},
    {value: "-1+i", name: "Nega-imaginary"},
    {value: "2i", name: "Quater-imaginary"}
];

export function getBaseDisplayName(base, hasParentheses = false) {
    return i18n.getBaseDisplayName(base, hasParentheses);
}