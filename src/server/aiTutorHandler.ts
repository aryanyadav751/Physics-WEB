import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are Enjoy Physics AI, the dedicated Physics tutor for the Enjoy Physics website.

Your job is to help Class 10 CBSE students learn and understand the Physics portion covered by this website.

## ABSOLUTE MANDATORY DIRECTIVE: ZERO LATEX - ALWAYS USE PLAIN TEXT ONLY

CRITICAL RULE: DO NOT USE LATEX UNDER ANY CIRCUMSTANCES.
- NEVER use LaTeX syntax, LaTeX commands, or math delimiters.
- NEVER use dollar signs ($...$ or $$...$$).
- NEVER use commands such as \\frac, \\dfrac, \\times, \\cdot, \\sqrt, \\text, \\mathrm, \\pm, \\approx, \\Omega, \\theta, \\lambda, etc.
- NEVER use math blocks such as \\(...\\), \\[...\\], or \\begin{equation}.
- ALWAYS use clean, human-readable plain text, standard keyboard characters, and simple Unicode for all formulas, equations, units, and math:
  * For fractions: write "1/f = 1/v - 1/u", "P = 1/f", or "1/R_total = 1/R1 + 1/R2".
  * For multiplication: use "*" or "x" (e.g. "V = I * R" or "c = 3 x 10^8 m/s").
  * For exponents/powers: write "10^8", "m/s^2", "cm^2", "I^2 * R * t".
  * For square roots: write "sqrt(3)" or "root(2)".
  * For Greek letters and units: write "ohm" or "Ω" for resistance, "theta" or "θ" for angles, "mu" or "μ", "lambda" or "λ".
  * For degrees: write "°" or "degrees" (e.g., "45°", "30 degrees").
  * For subscripts: write simple plain text like "R1", "R2", "R_total", "n21", "v1", "v2".
- Everything you output MUST be clean, readable, accessible plain text.

## YOUR KNOWLEDGE SCOPE

You may answer questions ONLY related to these four Class 10 CBSE Physics chapters:

1. Light – Reflection and Refraction
2. The Human Eye and the Colourful World
3. Electricity
4. Magnetic Effects of Electric Current

You may explain:
* Concepts
* Definitions
* Laws
* Formulas
* Derivations appropriate to Class 10
* Numerical problems
* Ray diagrams
* Circuit concepts
* Magnetic-field concepts
* Experiments
* Applications
* Important questions
* CBSE-style questions
* Revision questions
* Exam preparation related to these four chapters

When solving numericals:
1. Identify the given values.
2. State the required quantity.
3. Write the relevant formula.
4. Substitute the values.
5. Calculate step-by-step.
6. Give the final answer with the correct unit.

Keep explanations appropriate for a Class 10 CBSE student.

---

# STRICT TOPIC RESTRICTION

You MUST NOT answer questions that are unrelated to the four Physics chapters listed above.

Examples of questions you should NOT answer:
* Mathematics
* Chemistry
* Biology
* History
* Geography
* Politics
* General programming
* Coding
* Current affairs
* Entertainment
* Personal advice
* General knowledge unrelated to these Physics chapters

If the user asks an unrelated question, politely respond:

“I’m Enjoy Physics AI, so I can only help with the four Class 10 Physics chapters covered on this website: Light, The Human Eye and the Colourful World, Electricity, and Magnetic Effects of Electric Current. 😊”

Do not provide an answer to the unrelated question after this message.

---

# HANDLING BORDERLINE QUESTIONS

If a question is slightly outside the syllabus but is directly necessary to understand one of the four Physics chapters, you may give a short explanation of the required prerequisite.
However, do not turn the conversation into a general-purpose chatbot.

For example:
User: “Why does a magnet attract iron?”
This can be answered briefly if it is being asked to understand magnetic effects.

But:
User: “Tell me about the history of magnets.”
Do not answer.

---

# WEBSITE CREATOR QUESTION

If the user asks any question such as:
* “Who made this website?”
* “Who created this website?”
* “Who developed Enjoy Physics?”
* “Who is the creator?”
* “Who built this?”
* “Who made Enjoy Physics?”
* “Who is Aryan Yadav?”

Answer exactly:
“This website is made by Aryan Yadav, a student of Scale Carrer Institute.”

Do not replace this answer with a generic statement such as “I don't know.”

If appropriate, you may add:
“He created Enjoy Physics as a learning platform for Class 10 Physics students.”

Do not invent any additional personal information about Aryan Yadav.

---

# PERSONALITY

Act like a friendly and knowledgeable Class 10 Physics teacher.
Your personality should be:
* Friendly
* Helpful
* Clear
* Encouraging
* Patient
* Student-friendly

You can occasionally use simple emojis such as ⚡ 🔬 💡 🧲 🔭, but don't overuse them.
Do not talk like a robotic textbook.

---

# ANSWER STYLE

Prefer:
Simple explanation → Example → Formula/Diagram if relevant → Quick takeaway

For difficult concepts, explain them in simple language first and then give the scientific explanation.
For formulas, always explain what each symbol represents.
Example:
V = IR
Where:
* V = Potential difference
* I = Current
* R = Resistance
Use proper SI units.

---

# DO NOT HALLUCINATE

Never invent:
* NCERT facts
* CBSE rules
* Formulas
* Experiments
* Definitions
* Question-paper claims
* Personal information about the website creator

If you are unsure whether something belongs to the four permitted chapters, say that it is outside the supported Physics scope instead of guessing.

---

# WEBSITE CONTEXT

You are the AI tutor integrated into:
Enjoy Physics

Your purpose is to help students understand the Physics content available on the website.
The main website is:
https://enjoy-physics.vercel.app

Do not repeatedly mention the website URL unless the user asks for it.

---

# CONVERSATION EXAMPLES

User:
“Explain Ohm's law.”

Assistant:
Explain Ohm's law at Class 10 level with formula, variables, units, and an example.

User:
“Solve this electricity numerical.”

Assistant:
Solve it step-by-step and explain why the selected formula is appropriate.

User:
“What is myopia?”

Assistant:
Explain myopia according to the Class 10 chapter “The Human Eye and the Colourful World.”

User:
“Who made this website?”

Assistant:
“This website is made by Aryan Yadav, a student of Scale Carrer Institute.”

User:
“Who is the Prime Minister of India?”

Assistant:
“I’m Enjoy Physics AI, so I can only help with the four Class 10 Physics chapters covered on this website: Light, The Human Eye and the Colourful World, Electricity, and Magnetic Effects of Electric Current. 😊”

---

# FINAL RULE

Your highest priority is to remain a Class 10 CBSE Physics-only tutor.
Do not become a general-purpose AI assistant.
Only answer questions that fall within the four supported Physics chapters, except for the specific website-creator question described above.`;

export async function handleAITutorRequest(body: {
  message: string;
  chapter?: string;
  topic?: string;
  image?: { data: string; mimeType: string };
  history?: Array<{ role: 'user' | 'model'; text?: string; content?: string }>;
}): Promise<{ reply: string; source: 'gemini' | 'fallback' }> {
  const { message, chapter, topic, image, history = [] } = body;
  const client = getAIClient();

  if (!client) {
    return {
      reply: generateFallbackResponse(message, chapter, topic, !!image),
      source: 'fallback',
    };
  }

  try {
    const contextPrompt = chapter || topic
      ? `[Student is currently studying Chapter: "${chapter || 'General Class 10'}", Topic: "${topic || 'General'}"]\n\n`
      : '';

    const formattedHistory = history.map((h) => ({
      role: h.role,
      parts: [{ text: h.text || h.content || '' }],
    }));

    const userParts: any[] = [];
    const textPrompt = `${contextPrompt}${message || ''}`.trim();
    if (textPrompt) {
      userParts.push({ text: textPrompt });
    } else if (image) {
      userParts.push({
        text: `${contextPrompt}Please analyze this Physics diagram or question according to Class 10 CBSE syllabus.`,
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

    // Candidate models in order of preference.
    // If gemini-3.8-flash experiences high demand spikes (503 UNAVAILABLE),
    // automatically fallback to gemini-flash-latest or gemini-3.1-flash-lite.
    const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let replyText: string | null = null;
    let lastError: any = null;

    for (let i = 0; i < CANDIDATE_MODELS.length; i++) {
      const modelName = CANDIDATE_MODELS[i];
      try {
        const response = await client.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.5,
          },
        });

        if (response && response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || err?.error?.code || err?.error?.status;
        const msg = err?.message || String(err);
        console.warn(`[Enjoy Physics AI] Model ${modelName} returned status ${status}: ${msg}. Attempting next option...`);

        // If the error indicates high demand / 503 or 429, pause briefly before next candidate
        if (status === 503 || status === 429 || msg.includes('503') || msg.includes('high demand') || msg.includes('UNAVAILABLE')) {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    }

    if (replyText) {
      return { reply: sanitizePlainText(replyText), source: 'gemini' };
    }

    console.warn('[Enjoy Physics AI] All Gemini candidate models unavailable. Serving textbook CBSE fallback response.', lastError?.message || lastError);
    return {
      reply: sanitizePlainText(generateFallbackResponse(message, chapter, topic, !!image)),
      source: 'fallback',
    };
  } catch (error: any) {
    console.warn('[Enjoy Physics AI] Request handling error, using fallback:', error?.message || error);
    return {
      reply: sanitizePlainText(generateFallbackResponse(message, chapter, topic, !!image)),
      source: 'fallback',
    };
  }
}

function sanitizePlainText(input: string): string {
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

function generateFallbackResponse(
  query: string = '',
  chapter?: string,
  topic?: string,
  hasImage: boolean = false
): string {
  const q = (query || '').toLowerCase().trim();

  // 1. Check for Website Creator Question
  if (
    q.includes('who made') ||
    q.includes('who created') ||
    q.includes('who built') ||
    q.includes('who designed') ||
    q.includes('who developed') ||
    q.includes('made this') ||
    q.includes('created this') ||
    q.includes('built this') ||
    q.includes('who is the creator') ||
    q.includes('who is the developer') ||
    q.includes('who is the author') ||
    q.includes('made by') ||
    q.includes('aryan yadav') ||
    q.includes('scale carrer') ||
    q.includes('enjoy physics')
  ) {
    return `This website is made by Aryan Yadav, a student of Scale Carrer Institute.`;
  }

  // 2. Check for Clearly Unrelated Out-of-Scope Questions
  const unrelatedKeywords = [
    'prime minister',
    'president',
    'history of',
    'capital of',
    'politics',
    'chemistry',
    'biology',
    'photosynthesis',
    'periodic table',
    'acid base',
    'chemical reaction',
    'algebra',
    'calculus',
    'trigonometry',
    'python',
    'javascript',
    'coding',
    'programming',
    'movie',
    'song',
    'celebrity',
    'cricket score',
    'weather forecast',
    'geography',
  ];

  if (unrelatedKeywords.some((keyword) => q.includes(keyword))) {
    return `I’m Enjoy Physics AI, so I can only help with the four Class 10 Physics chapters covered on this website: Light, The Human Eye and the Colourful World, Electricity, and Magnetic Effects of Electric Current. 😊`;
  }

  // 3. Permitted Class 10 Physics Fallbacks (All Plain-Text)
  if (q.includes('sign convention') || q.includes('cartesian')) {
    return `### New Cartesian Sign Convention (CBSE Class 10) ⚡
1. **Pole / Optical Centre as Origin**: The pole (P) of a mirror or optical centre (O) of a lens is taken as the origin (0, 0).
2. **Object Always on the Left**: Incident light travels from left to right.
3. **Distances along +X axis**: Distances measured in the direction of incident light (to the right) are **positive (+)**.
4. **Distances along -X axis**: Distances measured against the direction of incident light (to the left) are **negative (-)**.
   - Therefore, object distance u is **always negative**!
5. **Heights**:
   - Upwards perpendicular to principal axis (+Y) are **positive (+)**.
   - Downwards perpendicular to principal axis (-Y) are **negative (-)**.

💡 **Quick Takeaway**:
- Concave mirror / concave lens focal length f is **negative (-)**.
- Convex mirror / convex lens focal length f is **positive (+)**.`;
  }

  if (q.includes('ohm') || q.includes('resistance') || q.includes('v=ir') || q.includes('electric current')) {
    return `### Ohm's Law (CBSE Class 10) ⚡
**Statement**: At a constant temperature, the electric current (I) flowing through a metallic conductor is directly proportional to the potential difference (V) across its ends.

Formula:
V = I * R

Where:
* V = Potential difference (in Volts, V)
* I = Electric current (in Amperes, A)
* R = Resistance of the conductor (in Ohms, Ω)

**Factors affecting Resistance (R):**
1. **Length (l)**: R is directly proportional to length (l).
2. **Area of cross-section (A)**: R is inversely proportional to cross-sectional area (A), i.e., R is proportional to 1/A.
3. **Resistivity of material (ρ)**: R = ρ * (l / A)
4. **Temperature**: Resistance increases with temperature in metallic conductors.`;
  }

  if (q.includes('fleming') || q.includes('left hand') || q.includes('right hand') || q.includes('motor')) {
    return `### Fleming's Left-Hand Rule (Used in Electric Motor) 🧲
Stretch the thumb, forefinger, and centre finger of your left hand mutually perpendicular to each other:
* **Forefinger**: Points in the direction of the **Magnetic Field** (B, North to South).
* **Centre finger**: Points in the direction of the **Electric Current** (I).
* **Thumb**: Points in the direction of **Force / Motion** (F) acting on the conductor.

💡 **Quick Takeaway**: Remember the acronym **FBI** (Force = Thumb, B-Field = Forefinger, I-Current = Centre finger).`;
  }

  if (q.includes('myopia') || q.includes('hypermetropia') || q.includes('eye defect') || q.includes('presbyopia')) {
    return `### Myopia vs Hypermetropia (CBSE Class 10) 👁️
1. **Myopia (Near-sightedness)**:
   - Defect: Can see near objects clearly, but cannot see distant objects distinctly.
   - Cause: Excessive curvature of the eye lens or elongation of the eyeball.
   - Image formed: In front of the retina.
   - **Correction**: **Concave lens** of suitable focal length.

2. **Hypermetropia (Far-sightedness)**:
   - Defect: Can see distant objects clearly, but cannot see near objects distinctly.
   - Cause: Focal length of the eye lens is too long or eyeball has become too small.
   - Image formed: Behind the retina.
   - **Correction**: **Convex lens** of suitable focal length.`;
  }

  if (q.includes('rainbow') || q.includes('dispersion') || q.includes('sky blue') || q.includes('scattering')) {
    return `### Atmospheric Optics: Dispersion & Scattering 🔬
1. **Rainbow Formation**:
   - Caused by dispersion, refraction, and internal reflection of sunlight by tiny spherical raindrops.
   - Sequence: Refraction & dispersion -> Internal reflection -> Refraction upon exit.
   - The Sun must always be behind the observer!

2. **Why is the Sky Blue?**:
   - Fine atmospheric molecules scatter shorter wavelengths (blue/violet) much more strongly than longer wavelengths (red) according to Rayleigh's law:
   Scattering is proportional to 1 / (λ^4)
   - This scattered blue light enters our eyes from all angles.`;
  }

  if (q.includes('mirror formula') || q.includes('lens formula') || q.includes('magnification') || q.includes('power of lens')) {
    return `### Formulas & Magnification in Optics (CBSE Class 10) 📐
1. **Mirror Formula**:
   1/f = 1/v + 1/u
   - Linear Magnification (m): m = h' / h = -v / u

2. **Lens Formula**:
   1/f = 1/v - 1/u
   - Linear Magnification (m): m = h' / h = +v / u

3. **Power of a Lens (P)**:
   P = 1 / f (where focal length f must be in meters!)
   - SI Unit: Dioptre (D)
   - Convex lens: focal length is positive (+), so Power is positive (+).
   - Concave lens: focal length is negative (-), so Power is negative (-).

💡 **Key CBSE Tip**:
- If |m| > 1: Image is magnified.
- If |m| < 1: Image is diminished.
- If m is negative (-): Image is Real and Inverted.
- If m is positive (+): Image is Virtual and Erect.`;
  }

  if (q.includes('snell') || q.includes('refractive index') || q.includes('refraction')) {
    return `### Laws of Refraction & Snell's Law (CBSE Class 10) 🌟
1. **First Law**: The incident ray, refracted ray, and the normal to the interface at the point of incidence all lie in the same plane.
2. **Snell's Law**: The ratio of the sine of the angle of incidence to the sine of the angle of refraction is constant for a given pair of media:
   sin(i) / sin(r) = constant = n21 (Refractive index of medium 2 with respect to medium 1).

3. **Absolute Refractive Index (n)**:
   n = Speed of light in vacuum (c) / Speed of light in the medium (v)
   n = c / v (where c = 3 * 10^8 m/s)
   - Since c is always greater than or equal to v, the absolute refractive index n is always >= 1.
   - Optically denser medium has a higher refractive index and bends light towards the normal.`;
  }

  if (q.includes('series') || q.includes('parallel') || q.includes('equivalent resistance')) {
    return `### Resistors in Series vs Parallel (CBSE Class 10) 🔌
1. **Series Combination**:
   - Current (I) remains the same through all resistors.
   - Total potential difference (V) divides: V = V1 + V2 + V3.
   - Equivalent Resistance:
     R_total = R1 + R2 + R3
   - Equivalent resistance is greater than the highest individual resistance.

2. **Parallel Combination**:
   - Potential difference (V) across each resistor is the same.
   - Total current (I) divides: I = I1 + I2 + I3.
   - Equivalent Resistance:
     1 / R_total = 1 / R1 + 1 / R2 + 1 / R3
   - Equivalent resistance is smaller than the lowest individual resistance.

💡 **Why parallel is preferred in home circuits**:
- Each appliance gets the full 220V supply voltage.
- Each appliance can be switched on/off independently.
- If one appliance fails, the other appliances continue working.`;
  }

  if (q.includes('joule') || q.includes('heating') || q.includes('electric power') || q.includes('kwh')) {
    return `### Joule's Law of Heating & Electric Power (CBSE Class 10) ⚡
1. **Joule's Law of Heating**:
   Heat produced in a resistor is directly proportional to:
   - Square of current (I^2)
   - Resistance (R)
   - Time (t) for which current flows
   Formula:
   H = I^2 * R * t = V * I * t = (V^2 / R) * t (in Joules, J)

2. **Electric Power (P)**:
   Rate at which electrical energy is consumed:
   P = V * I = I^2 * R = V^2 / R
   - SI Unit: Watt (W). 1 kW = 1000 W.

3. **Commercial Unit of Energy (Board Exam Favorite)**:
   1 Kilowatt-hour (1 kWh) or 1 "Unit":
   1 kWh = 1000 W * 3600 s = 3.6 * 10^6 Joules (3.6 x 10^6 J).`;
  }

  if (q.includes('solenoid') || q.includes('right hand thumb') || q.includes('field lines') || q.includes('magnetic field')) {
    return `### Magnetic Field Lines & Solenoid (CBSE Class 10) 🧲
1. **Properties of Magnetic Field Lines**:
   - Emerge from the North pole and enter into the South pole outside the magnet (inside: South to North).
   - Form closed continuous curves.
   - Degree of closeness represents field strength (strongest near poles).
   - **Crucial CBSE Rule**: Two magnetic field lines NEVER intersect! (If they did, a compass needle would point in two directions at the intersection, which is impossible).

2. **Right-Hand Thumb Rule**:
   - Grasp a straight wire with your right hand such that the thumb points in current direction.
   - Your curled fingers give the direction of concentric magnetic field lines.

3. **Magnetic Field of a Solenoid**:
   - A long coil of many circular turns of insulated copper wire.
   - Field pattern is identical to a bar magnet.
   - Inside the solenoid, field lines are parallel straight lines, indicating a **uniform magnetic field**.
   - An iron core placed inside produces a strong **Electromagnet**.`;
  }

  if (q.includes('fuse') || q.includes('domestic') || q.includes('earth') || q.includes('short circuit') || q.includes('overloading')) {
    return `### Domestic Electric Circuits & Safety (CBSE Class 10) 🏠
1. **Wire Types**:
   - Live wire (Positive): Red / Brown insulation (220 V in India).
   - Neutral wire (Negative): Black / Blue insulation (0 V).
   - Earth wire: Green / Yellow insulation (safety wire).

2. **Safety Devices**:
   - **Electric Fuse**: A thin safety wire made of an alloy with high resistance and low melting point. Connected in SERIES with the live wire. Melts when excessive current flows, breaking the circuit.
   - **Earthing Wire**: Connected to metallic appliance bodies. Provides a low-resistance path to the ground, protecting users from lethal electric shocks if leakage occurs.

3. **Overloading vs Short Circuit**:
   - **Overloading**: Connecting too many high-power appliances to a single socket simultaneously, exceeding the safe current capacity.
   - **Short Circuit**: When live wire touches neutral wire directly (due to damaged insulation or fault), circuit resistance drops near zero and extremely large current surges, risking fire.`;
  }

  if (q.includes('accommodation') || q.includes('presbyopia') || q.includes('twinkling')) {
    return `### Accommodation & Atmospheric Optical Phenomena (CBSE Class 10) 👁️
1. **Power of Accommodation**:
   The ability of the eye lens to adjust its focal length using ciliary muscles.
   - Near point for normal eye = 25 cm.
   - Far point for normal eye = Infinity.

2. **Presbyopia (Old-age defect)**:
   - Gradual weakening of ciliary muscles and diminishing flexibility of eye lens with age.
   - Person cannot read comfortably at 25 cm. Corrected using **bifocal lenses** (upper part concave for distant vision, lower part convex for reading).

3. **Twinkling of Stars**:
   - Caused by atmospheric refraction through layers of constantly shifting temperature and density.
   - Apparent position fluctuates slightly, and light rays continuously bend, causing the star to twinkle.
   - **Why Planets Don't Twinkle**: Planets are much closer to Earth and act as extended sources of light (a collection of point sources), averaging out fluctuations.`;
  }

  return `Hello! I’m **Enjoy Physics AI**, your dedicated CBSE Class 10 Physics tutor! ⚡

You can ask me questions on:
1. **Light – Reflection and Refraction** (Mirrors, Lenses, Sign Conventions, Numericals)
2. **The Human Eye and the Colourful World** (Eye Defects, Dispersion, Scattering, Rainbows)
3. **Electricity** (Ohm's Law, Resistance in Series/Parallel, Joule's Heating, Electric Power)
4. **Magnetic Effects of Electric Current** (Field Lines, Solenoid, Fleming's Rules, Electric Motor)

What would you like to understand or solve today?`;
}
