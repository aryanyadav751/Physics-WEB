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
  history?: Array<{ role: 'user' | 'model'; text?: string; content?: string }>;
}): Promise<{ reply: string; source: 'gemini' | 'fallback' }> {
  const { message, chapter, topic, history = [] } = body;
  const client = getAIClient();

  if (!client) {
    return {
      reply: generateFallbackResponse(message, chapter, topic),
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

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: `${contextPrompt}${message}` }],
      },
    ];

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    const reply = response.text || 'I could not generate an explanation at this moment. Please ask another question related to Class 10 Physics!';
    return { reply, source: 'gemini' };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return {
      reply: generateFallbackResponse(message, chapter, topic),
      source: 'fallback',
    };
  }
}

function generateFallbackResponse(query: string, chapter?: string, topic?: string): string {
  const q = query.toLowerCase().trim();

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

  // 3. Permitted Class 10 Physics Fallbacks
  if (q.includes('sign convention') || q.includes('cartesian')) {
    return `### New Cartesian Sign Convention (CBSE Class 10) ⚡
1. **Pole / Optical Centre as Origin**: The pole ($P$) of a mirror or optical centre ($O$) of a lens is taken as the origin $(0,0)$.
2. **Object Always on the Left**: Incident light travels from left to right.
3. **Distances along $+X$ axis**: Distances measured in the direction of incident light (to the right) are **positive (+)**.
4. **Distances along $-X$ axis**: Distances measured against the direction of incident light (to the left) are **negative (-)**.
   - Therefore, object distance $u$ is **always negative**!
5. **Heights**:
   - Upwards perpendicular to principal axis ($+Y$) are **positive (+)**.
   - Downwards perpendicular to principal axis ($-Y$) are **negative (-)**.

💡 **Quick Takeaway**:
- Concave mirror / concave lens focal length $f$ is **negative (-)**.
- Convex mirror / convex lens focal length $f$ is **positive (+)**.`;
  }

  if (q.includes('ohm') || q.includes('resistance') || q.includes('v=ir') || q.includes('electric current')) {
    return `### Ohm's Law (CBSE Class 10) ⚡
**Statement**: At a constant temperature, the electric current ($I$) flowing through a metallic conductor is directly proportional to the potential difference ($V$) across its ends.

$$V = IR$$

Where:
* $V$ = Potential difference (in Volts, $\\text{V}$)
* $I$ = Electric current (in Amperes, $\\text{A}$)
* $R$ = Resistance of the conductor (in Ohms, $\\Omega$)

**Factors affecting Resistance ($R$):**
1. **Length ($l$)**: $R \\propto l$
2. **Area of cross-section ($A$)**: $R \\propto \\frac{1}{A}$
3. **Resistivity of material ($\\rho$)**: $R = \\rho \\frac{l}{A}$
4. **Temperature**: Increases with temperature in pure metals.`;
  }

  if (q.includes('fleming') || q.includes('left hand') || q.includes('right hand') || q.includes('motor')) {
    return `### Fleming's Left-Hand Rule (Used in Electric Motor) 🧲
Stretch the thumb, forefinger, and centre finger of your left hand mutually perpendicular to each other:
* **Forefinger**: Points in the direction of the **Magnetic Field** ($B$, North to South).
* **Centre finger**: Points in the direction of the **Electric Current** ($I$).
* **Thumb**: Points in the direction of **Force / Motion** ($F$) acting on the conductor.

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
   - Sequence: Refraction & dispersion $\\rightarrow$ Internal reflection $\\rightarrow$ Refraction upon exit.
   - The Sun must always be behind the observer!

2. **Why is the Sky Blue?**:
   - Fine atmospheric molecules scatter shorter wavelengths (blue/violet) much more strongly than longer wavelengths (red) according to Rayleigh's law:
   $$\\text{Scattering} \\propto \\frac{1}{\\lambda^4}$$
   - This scattered blue light enters our eyes from all angles.`;
  }

  return `Hello! I’m **Enjoy Physics AI**, your dedicated CBSE Class 10 Physics tutor! ⚡

You can ask me questions on:
1. **Light – Reflection and Refraction** (Mirrors, Lenses, Sign Conventions, Numericals)
2. **The Human Eye and the Colourful World** (Eye Defects, Dispersion, Scattering, Rainbows)
3. **Electricity** (Ohm's Law, Resistance in Series/Parallel, Joule's Heating, Electric Power)
4. **Magnetic Effects of Electric Current** (Field Lines, Solenoid, Fleming's Rules, Electric Motor)

What would you like to understand or solve today?`;
}
