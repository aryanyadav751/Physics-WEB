import { GoogleGenAI } from '@google/genai';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { QUESTION_BANK } from '../data/questionBankData';
import { CORE_PHYSICS_DEFINITIONS } from '../data/flashcardsData';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
    });
  }
  return aiClient;
}

export const ARYAN_YADAV_RESPONSE =
  'Aryan Yadav is the developer of this website and a Student of Scale Carrer Institute';

export const CREATOR_RESPONSE =
  'This website is made by Aryan Yadav, a student of Scale Carrer Institute.';

export const OUT_OF_SCOPE_RESPONSE =
  'I’m Enjoy Physics AI, so I can only help with the four Class 10 Physics chapters covered on this website: Light, The Human Eye and the Colourful World, Electricity, and Magnetic Effects of Electric Current. 😊';

export function isAryanYadavQuery(query: string): boolean {
  const clean = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Specifically asking about Aryan Yadav himself
  if (
    clean === 'who is aryan yadav' ||
    clean === 'who is aryan' ||
    clean === 'who is aryan yadav the developer' ||
    clean === 'who exactly is aryan yadav' ||
    clean === 'tell me about aryan yadav' ||
    clean === 'about aryan yadav' ||
    clean === 'who is the developer aryan yadav' ||
    /^(who|tell me about|what about|about)\b.*aryan yadav/i.test(clean) ||
    /aryan yadav\b.*(who|developer|about)/i.test(clean)
  ) {
    return true;
  }

  return false;
}

export function isWebsiteCreatorQuery(query: string): boolean {
  const clean = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If already identified as Aryan Yadav specific query, don't hijack here
  if (isAryanYadavQuery(query)) {
    return false;
  }

  const exactPhrases = [
    'who made this website',
    'who created this website',
    'who developed enjoy physics',
    'who is the creator',
    'who built this',
    'who made enjoy physics',
    'who developed this website',
    'who is the developer of this website',
    'who is the creator of enjoy physics',
    'who made this',
    'who created this',
    'who built this website',
    'who designed this website',
    'who is the developer',
    'who is creator',
    'who is the author',
    'who made the website',
    'who made this app',
    'who built the website',
    'who created the website',
  ];

  if (exactPhrases.includes(clean)) {
    return true;
  }

  // Creator intent check: must ask who created/made/built/developed the site/app/platform
  const isAskingWho = /\b(who|which person)\b/.test(clean) || /\b(creator|developer|author)\b/.test(clean);
  const isCreationAction = /\b(made|created|built|developed|designed|founded|coded)\b/.test(clean) || /\b(creator|developer|author)\b/.test(clean);
  const isSiteSubject = /\b(website|site|app|platform|project|enjoy physics|enjoyphysics|this)\b/.test(clean);

  // Exclude physics queries
  const isPhysicsContext = /\b(current|voltage|resistance|ohm|mirror|lens|ray|circuit|refraction|reflection|magnetic|field|solenoid|motor|eye|spectrum|prism|joule|power|focal|dioptre)\b/.test(clean);

  if (isAskingWho && isCreationAction && isSiteSubject && !isPhysicsContext) {
    return true;
  }

  return false;
}

const SYSTEM_INSTRUCTION = `You are Enjoy Physics AI, the dedicated, expert CBSE Class 10 Physics tutor for the Enjoy Physics website.

## ABSOLUTE MANDATORY IDENTITY RULE
- Your name is Enjoy Physics AI.
- NEVER say "I am Gemini", "I am Google Gemini", "Google AI", "Gemini AI", or "Google's AI".
- Do not reveal the underlying AI model/provider unless explicitly asked about technical architecture.
- You may say: "Hi! I'm Enjoy Physics AI, your Class 10 Physics tutor."

## STRICT PRIORITY ORDER
1. Check whether the question is specifically about Aryan Yadav.
   → If asked "Who is Aryan Yadav?" or "Tell me about Aryan Yadav":
   Answer EXACTLY:
   "${ARYAN_YADAV_RESPONSE}"
   Do not add invented personal details.

2. Check whether it is a website creator/developer question.
   → If asked "Who made this website?", "Who created this website?", "Who developed Enjoy Physics?", "Who is the creator?", "Who built this?", etc.:
   Answer EXACTLY:
   "${CREATOR_RESPONSE}"

3. Determine whether the question is related to one of the four supported Class 10 CBSE Physics chapters:
   1. Light – Reflection and Refraction
   2. The Human Eye and the Colourful World
   3. Electricity
   4. Magnetic Effects of Electric Current
   → If YES: Thoroughly solve, explain, or check the student's question.

4. If it is a Physics prerequisite directly necessary to understand one of the four chapters (e.g. electric charge basics, sine rule in Snell's law, SI unit prefixes):
   → Provide a clear, short relevant explanation.

5. If completely unrelated to the four Class 10 Physics chapters (e.g. politics, coding, general chemistry, biology, foreign capitals, movies, sports, history):
   → Return EXACTLY:
   "${OUT_OF_SCOPE_RESPONSE}"
   Do NOT answer the unrelated query.

## MANDATORY NUMERICAL SOLVING STRUCTURE
When solving ANY numerical question, NEVER just provide a bare number or brief answer.
You MUST follow this exact structure:

Given:
[List each given quantity with symbol, numerical value, and proper SI unit]

Required:
[State the exact quantity to find with its symbol and target unit]

Formula:
[Write the standard Class 10 CBSE formula]

Substitution:
[Show the formula with the given numbers substituted]

Calculation:
[Show step-by-step arithmetic without skipping steps]

Final Answer:
[Clear statement of the final value with correct unit and sign]

### Key Guidelines for Numericals:
- For Light (Spherical Mirrors & Lenses): Strictly follow the New Cartesian Sign Convention!
  * Object distance u is ALWAYS negative (-).
  * Concave mirror: focal length f is negative (-).
  * Convex mirror: focal length f is positive (+).
  * Concave lens: focal length f is negative (-).
  * Convex lens: focal length f is positive (+).
  * Mirror formula: 1/f = 1/v + 1/u; Magnification: m = -v/u = h'/h.
  * Lens formula: 1/f = 1/v - 1/u; Magnification: m = +v/u = h'/h.
  * Power of a lens: P = 1/f (f MUST be converted to meters! 1 D = 1 m^-1).
- For Electricity:
  * V = I * R
  * R = rho * l / A
  * Resistors in series: R_total = R1 + R2 + ...
  * Resistors in parallel: 1/R_total = 1/R1 + 1/R2 + ...
  * Power: P = V * I = I^2 * R = V^2 / R
  * Joule's law of heating: H = I^2 * R * t
  * Commercial electrical energy: E = P * t (1 kWh = 3.6 x 10^6 J)

## SOLUTION CHECKING
If a student asks "Is my answer correct?" or provides a calculation:
- Analyze the problem and perform the calculation.
- If incorrect: clearly state that the answer needs correction, show the full correct calculation using the standard structure, and pinpoint where the mistake occurred (e.g., sign error, inverted fraction in parallel combination, forgetting to convert cm to m).
- If correct: confirm it enthusiastically and briefly explain why.

## CONCEPT QUESTIONS STRUCTURE
For conceptual or theoretical questions, use this pedagogical structure:
Simple Explanation → Scientific Explanation → Real-life Example → Formula / Rule if applicable → Quick Takeaway.

## IMAGE / PHOTO QUESTION SOLVING
When an image of a diagram, circuit, ray trace, or question paper is provided:
1. What the question / diagram gives
2. What is required
3. Relevant concept / formula
4. Step-by-step solution
5. Final answer
If any part of the image is illegible or missing key values, state clearly what cannot be read instead of guessing.

## ABSOLUTE MANDATORY DIRECTIVE: ZERO LATEX
- NEVER output LaTeX syntax ($...$, $$...$$, \\(...\\), \\frac, \\times, \\Omega, etc.).
- ALWAYS output clean plain text with standard symbols:
  * V = I * R
  * 1/f = 1/v - 1/u
  * P = V * I
  * 10^8
  * sqrt(3)
  * ohm or Ω
  * degree or °
`;

export async function handleAITutorRequest(body: {
  message: string;
  chapter?: string;
  topic?: string;
  image?: { data: string; mimeType: string };
  history?: Array<{ role: 'user' | 'model'; text?: string; content?: string }>;
}): Promise<{ reply: string; source: 'gemini' | 'fallback' }> {
  const { message, chapter, topic, image, history = [] } = body;
  const rawMessage = (message || '').trim();

  // Priority 1: Check specifically for "Who is Aryan Yadav?"
  if (isAryanYadavQuery(rawMessage)) {
    return {
      reply: ARYAN_YADAV_RESPONSE,
      source: 'fallback',
    };
  }

  // Priority 2: Check for website creator / developer questions
  if (isWebsiteCreatorQuery(rawMessage)) {
    return {
      reply: CREATOR_RESPONSE,
      source: 'fallback',
    };
  }

  // Priority 3: Gemini API Call
  const client = getAIClient();
  if (client) {
    try {
      const contextPrompt =
        chapter || topic
          ? `[Current CBSE Chapter Context: "${chapter || 'Class 10 Physics'}", Topic: "${topic || 'General'}"]\n\n`
          : '';

      const formattedHistory = history.map((h) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text || h.content || '' }],
      }));

      const userParts: any[] = [];
      const textPrompt = `${contextPrompt}${rawMessage}`.trim();
      if (textPrompt) {
        userParts.push({ text: textPrompt });
      } else if (image) {
        userParts.push({
          text: `${contextPrompt}Please analyze and solve this CBSE Class 10 Physics question/diagram step-by-step.`,
        });
      }

      if (image && image.data) {
        let base64Clean = image.data;
        if (base64Clean.includes('base64,')) {
          base64Clean = base64Clean.split('base64,')[1];
        }
        userParts.push({
          inlineData: {
            data: base64Clean,
            mimeType: image.mimeType || 'image/jpeg',
          },
        });
      }

      if (userParts.length === 0) {
        userParts.push({ text: 'Hello Enjoy Physics AI!' });
      }

      const contents = [
        ...formattedHistory,
        {
          role: 'user',
          parts: userParts,
        },
      ];

      // Ordered candidates: gemini-3.1-flash-lite is fastest & most reliable, backed by gemini-3.6-flash & gemini-3.8-flash
      const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-3.8-flash'];
      let replyText: string | null = null;
      let lastError: any = null;

      for (const modelName of CANDIDATE_MODELS) {
        // Attempt with timeout protection per model
        try {
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Model generation timed out')), 8000);
          });

          const generationPromise = client.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.4,
            },
          });

          const response = await Promise.race([generationPromise, timeoutPromise]);
          if (response && response.text) {
            replyText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const status = err?.status || err?.code || err?.error?.code || err?.error?.status;
          console.warn(`[Enjoy Physics AI] Model ${modelName} attempt failed (${status}): ${err?.message}. Trying next candidate...`);
        }
      }

      if (replyText) {
        return {
          reply: sanitizePlainText(replyText),
          source: 'gemini',
        };
      }

      console.warn('[Enjoy Physics AI] All Gemini candidate models were unavailable. Falling back to local CBSE solver.', lastError?.message);
    } catch (err: any) {
      console.warn('[Enjoy Physics AI] Gemini request encountered error, invoking fallback:', err?.message || err);
    }
  }

  // Priority 4: Enhanced local CBSE Physics solver fallback
  const fallbackReply = generateFallbackResponse(rawMessage, chapter, topic, !!image);
  return {
    reply: sanitizePlainText(fallbackReply),
    source: 'fallback',
  };
}

export function sanitizePlainText(input: string): string {
  if (!input) return '';
  let text = input;

  // 1. Fractions: \frac{a}{b} -> a / b
  text = text.replace(/\\(?:dfrac|frac)\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g, (_m, num, den) => {
    const n = num.trim();
    const d = den.trim();
    const simple = /^[a-zA-Z0-9_]+$/;
    return `${simple.test(n) ? n : `(${n})`} / ${simple.test(d) ? d : `(${d})`}`;
  });

  // 2. Square roots: \sqrt{x} -> sqrt(x)
  text = text.replace(/\\sqrt\s*(?:\[[^\]]*\])?\s*\{([^{}]+)\}/g, 'sqrt($1)');
  text = text.replace(/\\sqrt\s*([0-9a-zA-Z]+)/g, 'sqrt($1)');

  // 3. Text wrappers in math: \text{...} -> ...
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
  text = text.replace(/\\rho\b/g, 'ρ');
  text = text.replace(/\\pi\b/g, 'π');
  text = text.replace(/\\phi\b/g, 'φ');

  // 5. Operators and relations
  text = text.replace(/\\times\b/g, 'x');
  text = text.replace(/\\cdot\b/g, '*');
  text = text.replace(/\\div\b/g, '/');
  text = text.replace(/\\pm\b/g, '±');
  text = text.replace(/\\approx\b/g, '≈');
  text = text.replace(/\\(?:le|leq)\b/g, '<=');
  text = text.replace(/\\(?:ge|geq)\b/g, '>=');
  text = text.replace(/\\neq\b/g, '!=');
  text = text.replace(/\\infty\b/g, 'infinity');
  text = text.replace(/\\(?:rightarrow|to)\b/g, '->');
  text = text.replace(/\^\{\\circ\}|\^\{\\degree\}|\^\\circ|\^\\degree|\\degree|\\circ/g, '°');

  // 6. Subscripts & superscripts
  text = text.replace(/\^\{([^{}]+)\}/g, '^$1');
  text = text.replace(/_\{([^{}]+)\}/g, '$1');

  // 7. Math delimiters
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, '$1');
  text = text.replace(/\$([^\$\n]+)\$/g, '$1');
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, '$1');
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, '$1');

  // 8. Cleanup leftover backslash commands
  text = text.replace(/\\(?:left|right|displaystyle|limits)\b/g, '');
  text = text.replace(/\\([a-zA-Z])/g, '$1');

  return text;
}

export function generateFallbackResponse(
  query: string = '',
  chapter?: string,
  topic?: string,
  hasImage: boolean = false
): string {
  const q = (query || '').toLowerCase().trim();

  // 1. Creator and Aryan Yadav questions
  if (isAryanYadavQuery(query)) {
    return ARYAN_YADAV_RESPONSE;
  }
  if (isWebsiteCreatorQuery(query)) {
    return CREATOR_RESPONSE;
  }

  // 2. Truly Out-of-Scope Detection
  const strictlyUnrelatedPatterns = [
    /\b(prime minister|president|parliament|election|political party)\b/,
    /\b(capital of|largest country|geography of|river nile|mount everest)\b/,
    /\b(python code|javascript code|write a function|c\+\+|html css|react native)\b/,
    /\b(movie|bollywood|hollywood|actor|actress|pop song|cricket match|ipl score|football match)\b/,
    /\b(recipe|how to cook|bake a cake)\b/,
    /\b(history of mughal|world war|french revolution)\b/,
    /\b(organic chemistry|photosynthesis|digestive system|human heart anatomy|periodic table group)\b/,
  ];

  const isStrictlyUnrelated = strictlyUnrelatedPatterns.some((pattern) => pattern.test(q));
  const hasPhysicsTerm = /\b(current|volt|ohm|resistance|resistor|mirror|lens|ray|light|refraction|reflection|magnetic|field|solenoid|motor|focal|power|dioptre|spectrum|dispersion|scattering|rainbow|myopia|hypermetropia|joule|heat|watt|ampere|snell|circuit)\b/.test(q);

  if (isStrictlyUnrelated && !hasPhysicsTerm && !hasImage) {
    return OUT_OF_SCOPE_RESPONSE;
  }

  // 3. Dynamic Numerical Solver for common Class 10 problems
  // Numerical Pattern A: Ohm's law: Current (I) and Resistance (R) -> find Voltage (V)
  const ohmIRMatch = q.match(/(?:resistance|r)[^\d]*(\d+(?:\.\d+)?)\s*(?:ohm|Ω)[^\d]*(?:current|i)[^\d]*(\d+(?:\.\d+)?)\s*(?:a|amp|ampere)/i) ||
                     q.match(/(?:current|i)[^\d]*(\d+(?:\.\d+)?)\s*(?:a|amp|ampere)[^\d]*(?:resistance|r)[^\d]*(\d+(?:\.\d+)?)\s*(?:ohm|Ω)/i);
  if (ohmIRMatch) {
    const isCurrentFirst = /current|amp/i.test(ohmIRMatch[0].split(/\d+/)[0]);
    const iVal = parseFloat(isCurrentFirst ? ohmIRMatch[1] : ohmIRMatch[2]);
    const rVal = parseFloat(isCurrentFirst ? ohmIRMatch[2] : ohmIRMatch[1]);
    const vVal = iVal * rVal;
    return `Given:
Resistance R = ${rVal} ohm
Electric Current I = ${iVal} A

Required:
Potential difference V across the conductor

Formula:
V = I * R (Ohm's Law)

Substitution:
V = ${iVal} * ${rVal}

Calculation:
V = ${vVal} V

Final Answer:
The potential difference across the conductor is ${vVal} V.`;
  }

  // Numerical Pattern B: Ohm's law: Voltage (V) and Resistance (R) -> find Current (I)
  const ohmVRMatch = q.match(/(?:voltage|potential difference|v)[^\d]*(\d+(?:\.\d+)?)\s*(?:v|volt)[^\d]*(?:resistance|r)[^\d]*(\d+(?:\.\d+)?)\s*(?:ohm|Ω)/i) ||
                     q.match(/(?:resistance|r)[^\d]*(\d+(?:\.\d+)?)\s*(?:ohm|Ω)[^\d]*(?:voltage|potential difference|v)[^\d]*(\d+(?:\.\d+)?)\s*(?:v|volt)/i);
  if (ohmVRMatch) {
    const isVoltFirst = /volt/i.test(ohmVRMatch[0].split(/\d+/)[0]);
    const vVal = parseFloat(isVoltFirst ? ohmVRMatch[1] : ohmVRMatch[2]);
    const rVal = parseFloat(isVoltFirst ? ohmVRMatch[2] : ohmVRMatch[1]);
    const iVal = +(vVal / rVal).toFixed(2);
    return `Given:
Potential difference V = ${vVal} V
Resistance R = ${rVal} ohm

Required:
Electric current I

Formula:
I = V / R (From Ohm's Law V = I * R)

Substitution:
I = ${vVal} / ${rVal}

Calculation:
I = ${iVal} A

Final Answer:
The current flowing through the circuit is ${iVal} A.`;
  }

  // Numerical Pattern C: Series Resistors
  const seriesMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:ohm|Ω)\s*(?:and|,|\+)\s*(\d+(?:\.\d+)?)\s*(?:ohm|Ω).*(?:series|equivalent)/i);
  if (seriesMatch) {
    const r1 = parseFloat(seriesMatch[1]);
    const r2 = parseFloat(seriesMatch[2]);
    const rTotal = r1 + r2;
    return `Given:
Resistor R1 = ${r1} ohm
Resistor R2 = ${r2} ohm
Connection: Series

Required:
Equivalent Resistance R_total

Formula:
R_total = R1 + R2

Substitution:
R_total = ${r1} + ${r2}

Calculation:
R_total = ${rTotal} ohm

Final Answer:
The equivalent resistance of the series combination is ${rTotal} ohm.`;
  }

  // Numerical Pattern D: Parallel Resistors
  const parallelMatch = q.match(/(\d+(?:\.\d+)?)\s*(?:ohm|Ω)\s*(?:and|,|\+)\s*(\d+(?:\.\d+)?)\s*(?:ohm|Ω).*(?:parallel)/i);
  if (parallelMatch) {
    const r1 = parseFloat(parallelMatch[1]);
    const r2 = parseFloat(parallelMatch[2]);
    const rTotal = +((r1 * r2) / (r1 + r2)).toFixed(2);
    return `Given:
Resistor R1 = ${r1} ohm
Resistor R2 = ${r2} ohm
Connection: Parallel

Required:
Equivalent Resistance R_total

Formula:
1 / R_total = (1 / R1) + (1 / R2) = (R1 + R2) / (R1 * R2)
R_total = (R1 * R2) / (R1 + R2)

Substitution:
R_total = (${r1} * ${r2}) / (${r1} + ${r2})

Calculation:
R_total = ${r1 * r2} / ${r1 + r2} = ${rTotal} ohm

Final Answer:
The equivalent resistance of the parallel combination is ${rTotal} ohm.`;
  }

  // Numerical Pattern E: Lens Power (P = 1/f)
  const powerMatch = q.match(/(?:focal length|f)[^\d]*(\d+(?:\.\d+)?)\s*(cm|m).*(?:power)/i) ||
                     q.match(/(?:power)[^\d]*(\d+(?:\.\d+)?)\s*(?:d|dioptre).*(?:focal length)/i);
  if (powerMatch && q.includes('focal length')) {
    const fVal = parseFloat(powerMatch[1]);
    const unit = powerMatch[2].toLowerCase();
    const fInMeters = unit === 'cm' ? fVal / 100 : fVal;
    const isConcave = q.includes('concave');
    const fSigned = isConcave ? -fInMeters : fInMeters;
    const pVal = +(1 / fSigned).toFixed(2);
    return `Given:
Focal length f = ${isConcave ? '-' : '+'}${fVal} ${unit} = ${fSigned} m (${isConcave ? 'Concave lens has negative focal length' : 'Convex lens has positive focal length'})

Required:
Power of the lens P

Formula:
P = 1 / f (where focal length f must be in meters)

Substitution:
P = 1 / (${fSigned})

Calculation:
P = ${pVal} D

Final Answer:
The power of the lens is ${pVal} D (Dioptres).`;
  }

  // Numerical Pattern F: Electric Power (P = V * I)
  const powerVIMatch = q.match(/(?:voltage|v)[^\d]*(\d+(?:\.\d+)?)\s*(?:v|volt)[^\d]*(?:current|i)[^\d]*(\d+(?:\.\d+)?)\s*(?:a|amp)/i);
  if (powerVIMatch && (q.includes('power') || q.includes('watt'))) {
    const vVal = parseFloat(powerVIMatch[1]);
    const iVal = parseFloat(powerVIMatch[2]);
    const pVal = vVal * iVal;
    return `Given:
Potential difference V = ${vVal} V
Current I = ${iVal} A

Required:
Electric Power P

Formula:
P = V * I

Substitution:
P = ${vVal} * ${iVal}

Calculation:
P = ${pVal} W

Final Answer:
The electric power consumed is ${pVal} W.`;
  }

  // 4. Conceptual CBSE Explanations
  if (q.includes('sign convention') || q.includes('cartesian')) {
    return `### New Cartesian Sign Convention (CBSE Class 10) ⚡
1. **Origin**: The pole (P) of a spherical mirror or optical centre (O) of a spherical lens is taken as the origin (0, 0).
2. **Object Position**: The object is always placed to the left of the mirror/lens. Incident light travels from left to right.
3. **Distances to the Right (+X axis)**: Measured in the direction of incident light are **positive (+)**.
4. **Distances to the Left (-X axis)**: Measured opposite to the direction of incident light are **negative (-)**.
   - Therefore, object distance u is **always negative (-)**!
5. **Heights**:
   - Upwards perpendicular to principal axis (+Y axis) are **positive (+)**.
   - Downwards perpendicular to principal axis (-Y axis) are **negative (-)**.

💡 **Class 10 Focal Length Rules**:
- Concave mirror / Concave lens: focal length f is **negative (-)**.
- Convex mirror / Convex lens: focal length f is **positive (+)**.`;
  }

  if (q.includes('ohm') || q.includes('v=ir')) {
    return `### Ohm's Law (CBSE Class 10) ⚡
**Simple Explanation**:
Ohm's law shows that if you increase electrical push (voltage), the electric current increases in exact proportion, as long as the temperature stays the same.

**Scientific Statement**:
At constant temperature, the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) across its ends:
V is proportional to I, or V = I * R

**Variables & Units**:
* V = Potential difference across the conductor (in Volts, V)
* I = Electric current flowing through the conductor (in Amperes, A)
* R = Constant of proportionality called Resistance (in Ohms, Ω)

**Factors Affecting Resistance (R)**:
1. **Length of conductor (l)**: R is directly proportional to length (R ∝ l).
2. **Area of cross-section (A)**: R is inversely proportional to area (R ∝ 1/A).
3. **Nature of material (ρ)**: R = ρ * (l / A), where ρ is electrical resistivity in Ω·m.
4. **Temperature**: Resistance of metals increases with temperature.

💡 **Quick Takeaway**: V = I * R. To double the current at a fixed voltage, halve the resistance!`;
  }

  if (q.includes('fleming') || q.includes('left hand') || q.includes('motor')) {
    return `### Fleming's Left-Hand Rule & Electric Motor 🧲
**Simple Explanation**:
When a current-carrying wire is kept inside a magnetic field, it experiences a magnetic force that pushes it. Fleming's Left-Hand Rule tells you exactly which way it will move.

**Scientific Rule**:
Stretch the thumb, forefinger, and centre finger of your left hand mutually perpendicular to each other:
* **Forefinger**: Points in the direction of the **Magnetic Field** (B, North to South).
* **Centre finger**: Points in the direction of the **Electric Current** (I).
* **Thumb**: Points in the direction of **Force / Motion** (F) acting on the conductor.

💡 **Easy Acronym**: Remember **FBI**
* F = Thumb (Force / Motion)
* B = Forefinger (Magnetic Field)
* I = Centre finger (Electric Current)

**Electric Motor Application**:
In an electric motor, opposite forces act on the two arms of a rectangular coil (one pushed down, one pushed up), creating rotation. The split-ring commutator reverses the current every half turn to keep rotation continuous in one direction.`;
  }

  if (q.includes('myopia') || q.includes('hypermetropia') || q.includes('eye defect') || q.includes('presbyopia')) {
    return `### Defects of Vision and Their Correction (CBSE Class 10) 👁️
1. **Myopia (Near-sightedness)**:
   - **Condition**: Person can see nearby objects clearly, but cannot see distant objects distinctly. Far point comes closer than infinity.
   - **Causes**: (i) Excessive curvature of the eye lens, or (ii) Elongation of the eyeball.
   - **Image position**: Image of a distant object forms **in front of the retina**.
   - **Correction**: **Concave lens** of suitable power (which diverges rays before entering the eye so the image forms right on the retina).

2. **Hypermetropia (Far-sightedness)**:
   - **Condition**: Person can see distant objects clearly, but cannot see nearby objects distinctly. Near point moves farther than 25 cm.
   - **Causes**: (i) Focal length of the eye lens is too long, or (ii) Eyeball has become too small.
   - **Image position**: Image of a nearby object forms **behind the retina**.
   - **Correction**: **Convex lens** of suitable power (converges incoming rays to assist the eye lens).

3. **Presbyopia (Old-age defect)**:
   - Weakening of ciliary muscles and diminishing flexibility of crystalline lens with age. Corrected by **bifocal lenses** (upper concave, lower convex).`;
  }

  if (q.includes('rainbow') || q.includes('dispersion') || q.includes('sky blue') || q.includes('scattering')) {
    return `### Atmospheric Optical Phenomena (CBSE Class 10) 🌈
1. **Dispersion through a Prism**:
   - Splitting of white light into its component seven colors (VIBGYOR) when passing through a prism.
   - Violet bends the most (shortest wavelength, lowest speed in glass); Red bends the least (longest wavelength, highest speed in glass).

2. **Rainbow Formation**:
   - Sunlight entering spherical raindrops undergoes **Refraction and Dispersion** at the front surface, **Internal Reflection** at the back surface, and **Refraction** again upon emerging into the air.
   - The Sun must be directly behind the observer.

3. **Why the Sky is Blue**:
   - Fine atmospheric molecules (N2, O2) have sizes smaller than the wavelength of visible light.
   - Rayleigh scattering: Scattering intensity is proportional to 1 / (λ^4). Shorter wavelengths (blue/violet) scatter nearly 10 times more effectively than red light, filling the sky with blue light.`;
  }

  if (q.includes('mirror formula') || q.includes('lens formula') || q.includes('magnification')) {
    return `### Mirror & Lens Formulas with Magnification (CBSE Class 10) 📐
1. **Spherical Mirror Formula**:
   1/f = 1/v + 1/u
   - Linear Magnification: m = h' / h = -v / u

2. **Spherical Lens Formula**:
   1/f = 1/v - 1/u
   - Linear Magnification: m = h' / h = +v / u

3. **Power of a Lens (P)**:
   P = 1 / f (focal length f MUST be converted into meters!)
   - SI Unit: Dioptre (D). 1 D = 1 m^-1.
   - Convex lens: f is (+), so P is (+).
   - Concave lens: f is (-), so P is (-).

💡 **Magnification Interpretation**:
- |m| > 1: Image is magnified.
- |m| < 1: Image is diminished.
- m is negative (-): Image is Real and Inverted.
- m is positive (+): Image is Virtual and Erect.`;
  }

  if (q.includes('snell') || q.includes('refractive index') || q.includes('refraction')) {
    return `### Laws of Refraction & Snell's Law (CBSE Class 10) 🔬
1. **First Law**: The incident ray, the refracted ray, and the normal to the interface at the point of incidence all lie in the same plane.
2. **Snell's Law (Second Law)**:
   The ratio of the sine of angle of incidence (i) to the sine of angle of refraction (r) is constant for a given pair of media:
   sin(i) / sin(r) = constant = n21
   (where n21 is the refractive index of medium 2 with respect to medium 1).

3. **Absolute Refractive Index (n)**:
   n = Speed of light in vacuum (c) / Speed of light in the medium (v)
   n = c / v (where c = 3 x 10^8 m/s)
   - Refractive index has no units.
   - Higher refractive index = optically denser medium = light slows down and bends **towards the normal**.`;
  }

  if (q.includes('series') || q.includes('parallel')) {
    return `### Resistors in Series vs Parallel (CBSE Class 10) ⚡
1. **Series Combination**:
   - Current (I) is identical through each resistor.
   - Voltage divides: V = V1 + V2 + V3
   - Equivalent Resistance: R_total = R1 + R2 + R3
   - Equivalent resistance is greater than the largest individual resistance.

2. **Parallel Combination**:
   - Voltage (V) is identical across each resistor.
   - Current divides: I = I1 + I2 + I3
   - Equivalent Resistance: 1 / R_total = 1 / R1 + 1 / R2 + 1 / R3
   - Equivalent resistance is smaller than the smallest individual resistance.

💡 **Why domestic household wiring uses Parallel**:
- Every appliance gets the full 220 V supply voltage.
- Appliances can be turned ON/OFF independently without breaking the entire circuit.
- If one appliance blows or fails, other appliances continue running normally.`;
  }

  if (q.includes('joule') || q.includes('heating') || q.includes('power') || q.includes('kwh')) {
    return `### Joule's Law of Heating & Electrical Energy (CBSE Class 10) ⚡
1. **Joule's Law of Heating**:
   Heat produced (H) in a resistor is directly proportional to:
   - Square of current (I^2)
   - Resistance (R)
   - Time (t) for which current flows
   Formula: H = I^2 * R * t = V * I * t = (V^2 / R) * t (in Joules, J)

2. **Electric Power (P)**:
   Rate of electrical energy dissipation:
   P = V * I = I^2 * R = V^2 / R (in Watts, W)

3. **Commercial Unit of Energy (1 kWh / Board Favorite)**:
   1 Kilowatt-hour (1 Unit) = 1 kW * 1 hour = 1000 W * 3600 s = 3.6 x 10^6 Joules.`;
  }

  if (q.includes('solenoid') || q.includes('magnetic field') || q.includes('field lines')) {
    return `### Magnetic Field Lines & Solenoid (CBSE Class 10) 🧲
1. **Properties of Magnetic Field Lines**:
   - Emerge from North pole and merge at South pole outside the magnet (inside: South to North).
   - Form continuous closed loops.
   - Crowded lines indicate a stronger magnetic field.
   - **Crucial Rule**: Field lines NEVER intersect (otherwise a compass needle at the intersection would point in two directions, which is physically impossible).

2. **Right-Hand Thumb Rule**:
   - Imagine holding a current-carrying straight wire in your right hand with the thumb pointing in current direction.
   - Your fingers curling around the conductor point in the direction of magnetic field lines.

3. **Solenoid**:
   - A coil of many circular turns of insulated copper wire wrapped closely in the shape of a cylinder.
   - Magnetic field pattern is identical to a bar magnet.
   - Inside the solenoid, field lines are parallel straight lines, indicating a **uniform magnetic field**.
   - Placing a soft iron rod inside creates a strong **Electromagnet**.`;
  }

  // 5. General syllabus guidance
  return `Hello! I am **Enjoy Physics AI**, your dedicated tutor for CBSE Class 10 Physics! ⚡

I am ready to help you with:
1. 🔦 **Light – Reflection and Refraction** (Mirrors, Lenses, Sign Conventions, Ray Optics, Numericals)
2. 👁️ **The Human Eye and the Colourful World** (Vision Defects, Dispersion, Scattering, Rainbows)
3. ⚡ **Electricity** (Ohm's Law, Series/Parallel Resistors, Joule's Heating, Electric Power)
4. 🧲 **Magnetic Effects of Electric Current** (Field Lines, Solenoids, Fleming's Rules, Electric Motor)

Please send your question or numerical problem, and I will solve and explain it step-by-step!`;
}
