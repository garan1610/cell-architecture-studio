const subscriptDigits: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
};

const elementSymbols = new Set([
  "H",
  "He",
  "Li",
  "Be",
  "B",
  "C",
  "N",
  "O",
  "F",
  "Ne",
  "Na",
  "Mg",
  "Al",
  "Si",
  "P",
  "S",
  "Cl",
  "Ar",
  "K",
  "Ca",
  "Sc",
  "Ti",
  "V",
  "Cr",
  "Mn",
  "Fe",
  "Co",
  "Ni",
  "Cu",
  "Zn",
  "Ga",
  "Ge",
  "As",
  "Se",
  "Br",
  "Kr",
  "Rb",
  "Sr",
  "Y",
  "Zr",
  "Nb",
  "Mo",
  "Tc",
  "Ru",
  "Rh",
  "Pd",
  "Ag",
  "Cd",
  "In",
  "Sn",
  "Sb",
  "Te",
  "I",
  "Xe",
]);

function formatFormulaToken(token: string) {
  let index = 0;
  let hasDigit = false;

  while (index < token.length) {
    const twoCharacterSymbol = token.slice(index, index + 2);
    const oneCharacterSymbol = token[index];
    const symbol = elementSymbols.has(twoCharacterSymbol) ? twoCharacterSymbol : oneCharacterSymbol;

    if (!elementSymbols.has(symbol)) {
      return token;
    }

    index += symbol.length;
    while (index < token.length && /\d/.test(token[index])) {
      hasDigit = true;
      index += 1;
    }
  }

  if (!hasDigit) {
    return token;
  }

  return token.replace(/\d/g, (digit) => subscriptDigits[digit] ?? digit);
}

export function formatChemicalText(text: string) {
  return text.replace(/\b(?:[A-Z][a-z]?\d*)+\b/g, formatFormulaToken);
}
