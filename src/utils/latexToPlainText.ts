/**
 * Utility to convert any LaTeX formulas or mathematical markup into clean,
 * readable plain-text for CBSE Class 10 Physics students.
 */
export function cleanLatexToPlainText(input: string): string {
  if (!input) return '';
  let text = input;

  // 1. Fractions: \frac{a}{b} -> a/b or (a / b)
  text = text.replace(/\\(?:dfrac|frac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, (_match, num, den) => {
    const trimmedNum = num.trim();
    const trimmedDen = den.trim();
    // If simple single term like 1 or R, e.g. 1/f or 1/R1
    const simpleTerm = /^[a-zA-Z0-9_]+$/;
    const n = simpleTerm.test(trimmedNum) ? trimmedNum : `(${trimmedNum})`;
    const d = simpleTerm.test(trimmedDen) ? trimmedDen : `(${trimmedDen})`;
    return `${n} / ${d}`;
  });

  // Handle nested fractions once more if any
  text = text.replace(/\\(?:dfrac|frac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, (_match, num, den) => {
    return `(${num.trim()} / ${den.trim()})`;
  });

  // 2. Square roots: \sqrt{...} or \sqrt[n]{...} -> sqrt(...)
  text = text.replace(/\\sqrt\s*(?:\[[^\]]*\])?\s*\{([^{}]+)\}/g, 'sqrt($1)');
  text = text.replace(/\\sqrt\s*([0-9a-zA-Z]+)/g, 'sqrt($1)');

  // 3. Text wrappers in math: \text{...}, \mathrm{...}, \mathbf{...}, \mathit{...}
  text = text.replace(/\\(?:text|mathrm|mathbf|mathit|textbf|textit)\s*\{([^{}]+)\}/g, '$1');

  // 4. Greek and scientific symbols
  text = text.replace(/\\(?:Omega|ohm)\b/gi, 'Ω');
  text = text.replace(/\\mu\b/g, 'μ');
  text = text.replace(/\\theta\b/g, 'θ');
  text = text.replace(/\\lambda\b/g, 'λ');
  text = text.replace(/\\alpha\b/g, 'α');
  text = text.replace(/\\beta\b/g, 'β');
  text = text.replace(/\\gamma\b/g, 'γ');
  text = text.replace(/\\Delta\b/g, 'Δ');
  text = text.replace(/\\delta\b/g, 'δ');
  text = text.replace(/\\rho\b/g, 'ρ');
  text = text.replace(/\\pi\b/g, 'π');
  text = text.replace(/\\phi\b/g, 'φ');
  text = text.replace(/\\eta\b/g, 'η');
  text = text.replace(/\\sigma\b/g, 'σ');

  // 5. Operators and relations
  text = text.replace(/\\times\b/g, 'x');
  text = text.replace(/\\cdot\b/g, '*');
  text = text.replace(/\\div\b/g, '/');
  text = text.replace(/\\pm\b/g, '±');
  text = text.replace(/\\mp\b/g, '∓');
  text = text.replace(/\\approx\b/g, '≈');
  text = text.replace(/\\equiv\b/g, '=');
  text = text.replace(/\\propto\b/g, 'is proportional to');
  text = text.replace(/\\(?:le|leq)\b/g, '<=');
  text = text.replace(/\\(?:ge|geq)\b/g, '>=');
  text = text.replace(/\\neq\b/g, '!=');
  text = text.replace(/\\infty\b/g, 'infinity');
  text = text.replace(/\\(?:rightarrow|to)\b/g, '->');
  text = text.replace(/\\leftarrow\b/g, '<-');

  // 6. Degree symbols
  text = text.replace(/\^\{\\circ\}|\^\{\\degree\}|\^\\circ|\^\\degree|\\degree|\\circ/g, '°');

  // 7. Superscripts and subscripts
  // e.g. 10^{-4} -> 10^-4, x^{2} -> x^2
  text = text.replace(/\^\{([^{}]+)\}/g, '^$1');
  // e.g. R_{total} -> R_total, R_{1} -> R1
  text = text.replace(/_\{([^{}]+)\}/g, (_m, sub) => {
    return sub.length === 1 || /^[0-9]+$/.test(sub) ? `${sub}` : `_${sub}`;
  });

  // 8. Math delimiters: $$ ... $$ -> ... and $ ... $ -> ...
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  text = text.replace(/\$([^\$\n]+)\$/g, '$1');

  // 9. LaTeX brackets: \( ... \) and \[ ... \]
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, '$1');
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, '$1');

  // 10. Clean up structural tags like \left, \right, \displaystyle, \limits
  text = text.replace(/\\(?:left|right|displaystyle|textstyle|limits|nolimits)\b/g, '');

  // 11. Remove any trailing backslashes before regular letters (e.g. \u -> u, \v -> v)
  text = text.replace(/\\([a-zA-Z])/g, '$1');

  // 12. Normalize multiple spaces or tabs created by removals
  text = text.replace(/[ \t]{2,}/g, ' ');

  return text;
}
