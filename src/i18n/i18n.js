export const i18n = {
    defaultLocale: 'en',
    currentLocale: null,
    translations: {
      en: {
        // Application strings
        title: "Numeric Base Converter",
        convertFrom: "Convert from:",
        to: "to:",
        basePlaceholderFrom: "Base (ex: 10, -2, 1+i)",
        basePlaceholderTo: "Base (ex: 2, -16, -1+i)",
        swapButtonLabel: "Swap bases and values",
        fromValuePlaceholder: (baseName) => `Value in ${baseName}`,
        toValuePlaceholder: (baseName) => `Value in ${baseName}`,
        invalidSourceBase: "Invalid Source Base",
        invalidTargetBase: "Invalid Target Base",
        resultLabel: "Result",
        error: "Error",
        
        // Base names
        baseNames: {
          "32": "Duotrigesimal",
          "16": "Hexadecimal",
          "10": "Decimal",
          "8": "Octal",
          "3": "Ternary",
          "2": "Binary",
          "-2": "Negabinary",
          "-3": "Negaternary",
          "-8": "Negaoctal",
          "-10": "Negadecimal",
          "-16": "Negahexadecimal",
          "-32": "Negaduotrigesimal",
          "-1+i": "Nega-imaginary Base",
          "2i": "Quater-imaginary Base"
        },
        invalidBase: (base) => `Invalid base ${base}`,
        baseOutOfRange: (base) => `Integer base ${base} outside range [-32, 32]`,
        invalidBaseFormat: (baseStr) => `Invalid base format: "${baseStr}"`,
        baseComponentsOutOfRange: (baseStr) => `Base components ${baseStr} outside range [-32, 32]`,
        tooSmallBaseNorm: (baseStr) => `Base ${baseStr} has norm too small`,
        digitInvalidForBase: (digit, base) => `Digit '${digit}' invalid for base ${base}`,
        digitInvalidForComplexBase: (digit, base, norm) => `Digit '${digit}' invalid for base ${base} (norm ${norm.toFixed(4)}, max digit ${Math.floor(norm - 1e-10)})`,
        conversionToComplexBaseFailed: (base) => `Failed to convert to base ${base}`,
        baseNormTooLarge: (norm) => `Base norm (${norm.toFixed(2)}) > 36. Cannot represent with A-Z digits.`,
        negativeSignInvalid: "'-' sign invalid for this base",
        invalidResult: "Invalid result (overflow?)",
        internalError: (remainder) => `Internal negabase error: remainder ${remainder}`,
        negabaseNotTerminated: "Negabase conversion did not terminate (possible error or number too large).",
        cannotConvertToBase: (z, base) => `Cannot convert ${z} to base ${base} (requires integer)`,
        invalidBaseValue: (base) => `Invalid base ${base} (cannot be 0, 1, -1)`
      },
      pt: {
        title: "Conversor de Bases Numéricas",
        convertFrom: "Converter de:",
        to: "para:",
        basePlaceholderFrom: "Base (ex: 10, -2, 1+i)",
        basePlaceholderTo: "Base (ex: 2, -16, -1+i)",
        swapButtonLabel: "Inverter bases e valores",
        fromValuePlaceholder: (baseName) => `Valor na ${baseName}`,
        toValuePlaceholder: (baseName) => `Valor na ${baseName}`,
        invalidSourceBase: "Base Origem Inválida",
        invalidTargetBase: "Base Destino Inválida",
        resultLabel: "Resultado",
        error: "Erro",
        
        baseNames: {
          "32": "Duotrigesimal",
          "16": "Hexadecimal",
          "10": "Decimal",
          "8": "Octal",
          "3": "Ternário",
          "2": "Binário",
          "-2": "Negabinário",
          "-3": "Negaternário",
          "-8": "Negaoctal",
          "-10": "Negadecimal",
          "-16": "Negahexadecimal",
          "-32": "Negaduotrigesimal",
          "-1+i": "Base Nega-imaginária",
          "2i": "Base Quater-imaginária"
        },
        
        invalidBase: (base) => `Base ${base} inválida`,
        baseOutOfRange: (base) => `Base inteira ${base} fora do limite [-32, 32]`,
        invalidBaseFormat: (baseStr) => `Formato de base inválido: "${baseStr}"`,
        baseComponentsOutOfRange: (baseStr) => `Componentes da base ${baseStr} fora do limite [-32, 32]`,
        tooSmallBaseNorm: (baseStr) => `Base ${baseStr} tem norma muito pequena`,
        digitInvalidForBase: (digit, base) => `Dígito '${digit}' inválido para base ${base}`,
        digitInvalidForComplexBase: (digit, base, norm) => `Dígito '${digit}' inválido para base ${base} (norma ${norm.toFixed(4)}, máx dígito ${Math.floor(norm - 1e-10)})`,
        conversionToComplexBaseFailed: (base) => `Falha na conversão para base ${base}`,
        baseNormTooLarge: (norm) => `Norma da base (${norm.toFixed(2)}) > 36. Não é possível representar com dígitos A-Z.`,
        negativeSignInvalid: "Sinal '-' inválido para esta base",
        invalidResult: "Resultado inválido (overflow?)",
        internalError: (remainder) => `Erro interno negabase: remainder ${remainder} inválido`,
        negabaseNotTerminated: "Conversão negabase não terminou (possível erro ou número muito grande).",
        cannotConvertToBase: (z, base) => `Não é possível converter ${z} para base ${base} (requer inteiro)`,
        invalidBaseValue: (base) => `Base ${base} inválida (não pode ser 0, 1, -1)`
      }
    },
    
    init() {
        let browserLang = this.defaultLocale;
        if (typeof navigator !== 'undefined') {
          browserLang = (navigator.language || navigator.userLanguage || this.defaultLocale)
            .slice(0, 2)
            .toLowerCase();
        }
        this.currentLocale = this.translations[browserLang] ? browserLang : this.defaultLocale;
      },
    
    t(key, ...args) {
      const translations = this.translations[this.currentLocale] || this.translations[this.defaultLocale];
      const translation = translations[key];
      
      if (typeof translation === 'function') {
        return translation(...args);
      }
      
      return translation || key;
    },
    
    getBaseDisplayName(base, hasParentheses = false) {
      const translations = this.translations[this.currentLocale] || this.translations[this.defaultLocale];
      let baseStr;
      
      if (typeof base === 'number') {
        baseStr = base.toString();
      } else if (typeof base === 'object' && base !== null && 'real' in base) {
        baseStr = formatComplex(base);
      } else {
        baseStr = `${base}`;
      }
      const name = translations.baseNames[baseStr] || `${this.t(baseStr.includes('i') ? 'base' : 'base')} ${baseStr}`;
      
      if (hasParentheses && name) {
        return `(${name})`;
      }
      return name;
    }
  };