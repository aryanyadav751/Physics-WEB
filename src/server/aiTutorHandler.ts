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

const SYSTEM_INSTRUCTION = `You are "Sir Newton", an expert, warm, and highly encouraging CBSE Class 10 Physics teacher and board exam specialist.
Your role:
1. Explain concepts strictly at the CBSE Class 10 Science (Physics) syllabus level (NCERT based).
2. Chapters in scope:
   - Light: Reflection and Refraction (spherical mirrors, lenses, sign convention, mirror/lens formulas, magnification, refractive index, power of lens)
   - The Human Eye and the Colourful World (structure of eye, power of accommodation, myopia/hypermetropia/presbyopia corrections, prism refraction, dispersion, atmospheric refraction, scattering)
   - Electricity (current, potential difference, Ohm's law, resistance, factors affecting R, series & parallel circuits, Joule's heating effect, electric power, commercial unit of energy kWh)
   - Magnetic Effects of Electric Current (field lines, right-hand thumb rule, circular loop, solenoid, electromagnet, Fleming's left-hand rule, electric motor, electromagnetic induction, Fleming's right-hand rule, electric generator, domestic circuits, fuse, earthing)
3. For numericals: Always show:
   - Given data with correct SI units and signs (Cartesian sign convention)
   - Formula to be used with reasoning
   - Step-by-step mathematical substitution
   - Final answer clearly boxed or highlighted with exact SI units!
4. Highlight common board exam pitfalls (e.g. forgetting negative sign in mirror magnification, not putting arrows on ray diagrams, mixing up left-hand and right-hand rules).
5. Tone: Inspiring, patient, scientifically accurate, clear, and student-friendly. Use markdown formatting with bolding, bullet points, and clean math equations.
6. Creator & Attribution Rule:
   If anyone asks who made this, who made this website, who created this, who developed this, or who built this platform, you MUST clearly answer:
   "This website is made by Aryan yadav, a Student of Scale Carrer Institute."`;

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
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I could not generate an explanation at this moment. Please ask another question!';
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
  const q = query.toLowerCase();

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
    q.includes('scale carrer')
  ) {
    return `This website is made by Aryan yadav, a Student of Scale Carrer Institute.`;
  }

  if (q.includes('sign convention') || q.includes('cartesian')) {
    return `### New Cartesian Sign Convention (CBSE Class 10)

Here are the golden rules for ray diagrams in mirrors and lenses:
1. **Pole/Optical Centre as Origin**: The pole ($P$) of a mirror or optical centre ($O$) of a lens is taken as origin $(0,0)$.
2. **Object on Left**: The object is always placed to the left of the mirror/lens.
3. **Direction of Incident Light**:
   - Distances measured in the direction of incident light (along $+X$ axis, to the right) are **positive (+)**.
   - Distances measured against the direction of incident light (along $-X$ axis, to the left) are **negative (-)**.
   - Therefore, object distance $u$ is **always negative**!
4. **Heights**:
   - Heights measured upwards perpendicular to principal axis ($+Y$ axis) are **positive (+)**.
   - Heights measured downwards ($-Y$ axis) are **negative (-)**.

💡 **Board Tip**:
- Concave mirror focal length $f$ is **negative (-)**.
- Convex mirror focal length $f$ is **positive (+)**.
- Convex lens focal length $f$ is **positive (+)**.
- Concave lens focal length $f$ is **negative (-)**.`;
  }

  if (q.includes('ohm') || q.includes('resistance') || q.includes('v=ir')) {
    return `### Ohm's Law (CBSE Class 10)

**Statement**: At a constant temperature, the electric current ($I$) flowing through a metallic conductor is directly proportional to the potential difference ($V$) across its ends.

$$V \\propto I \\implies V = IR$$

Where:
- $V$ = Potential difference (in Volts, V)
- $I$ = Electric current (in Amperes, A)
- $R$ = Resistance of the conductor (in Ohms, $\\Omega$)

**Factors affecting Resistance ($R$):**
1. **Length ($l$)**: $R \\propto l$ (doubling length doubles resistance).
2. **Area of cross-section ($A$)**: $R \\propto \\frac{1}{A}$ (thick wire has less resistance).
3. **Nature of material**: Given by resistivity $\\rho$ ($R = \\rho \\frac{l}{A}$).
4. **Temperature**: Resistance of pure metals increases with increase in temperature.`;
  }

  if (q.includes('fleming') || q.includes('left hand') || q.includes('right hand')) {
    return `### Fleming's Rules Comparison (CBSE Board Special)

#### 1. Fleming's Left-Hand Rule (Used in Electric Motor)
- **Forefinger**: Direction of **Magnetic Field** ($B$, North to South).
- **Centre finger**: Direction of **Current** ($I$, $+ve$ to $-ve$).
- **Thumb**: Direction of **Force / Motion** ($F$) experienced by the conductor.
- *Memory trick*: **FBI** (Force = Thumb, B-Field = Forefinger, I-Current = Centre).

#### 2. Fleming's Right-Hand Rule (Used in Electric Generator)
- **Thumb**: Direction of **Motion** of conductor.
- **Forefinger**: Direction of **Magnetic Field**.
- **Centre finger**: Direction of **Induced Current**.
- *Application*: Electromagnetic induction when moving a conductor in a magnetic field.`;
  }

  if (q.includes('myopia') || q.includes('hypermetropia') || q.includes('eye defect')) {
    return `### Vision Defects and Corrections

#### 1. Myopia (Short-sightedness)
- **Defect**: Person can see nearby objects clearly, but cannot see distant objects distinctly.
- **Far point**: Less than infinity.
- **Causes**:
  1. Excessive curvature of eye lens (focal length too short).
  2. Elongation of eyeball.
- **Image formation**: Formed **in front of the retina**.
- **Correction**: **Concave lens** of suitable focal power.

#### 2. Hypermetropia (Far-sightedness)
- **Defect**: Person can see distant objects clearly, but cannot see nearby objects distinctly.
- **Near point**: Greater than $25\\text{ cm}$.
- **Causes**:
  1. Focal length of eye lens is too long.
  2. Eyeball has become too small.
- **Image formation**: Formed **behind the retina**.
- **Correction**: **Convex lens** of suitable focal power.`;
  }

  if (q.includes('rainbow') || q.includes('dispersion') || q.includes('sky blue')) {
    return `### Rainbow Formation & Light Phenomena

#### Rainbow Formation:
A rainbow is caused by dispersion, refraction, and internal reflection of sunlight by tiny water droplets in the atmosphere.
1. **Refraction & Dispersion**: Sunlight enters raindrop and splits into 7 component colours (VIBGYOR). Red deviates least, violet deviates most.
2. **Total Internal Reflection**: Light reflects off the back surface inside the water droplet.
3. **Refraction on exit**: Light refracts again when coming out of droplet towards the observer's eye.
- **Essential condition**: The Sun must be behind the observer!

#### Why is the Sky Blue?
Fine air molecules have sizes smaller than the wavelength of visible light. According to Rayleigh's law:
$$\\text{Scattering} \\propto \\frac{1}{\\lambda^4}$$
Shorter wavelengths (blue/violet) are scattered much more strongly than longer wavelengths (red). Hence, the scattered blue light reaches our eyes.`;
  }

  return `### Hello from Physics Lab 10 AI Tutor!

I am here to help you master **CBSE Class 10 Physics**! You can ask me:
- **Concept explanations** (e.g., "Explain refraction through a glass slab", "What is Joule's heating effect?")
- **Numerical problems** (e.g., "An object $4\\text{ cm}$ high is placed at $25\\text{ cm}$ from a concave mirror of focal length $15\\text{ cm}$...")
- **Ray diagram guidelines** (e.g., "Rules for drawing convex lens diagrams")
- **Exam tips & common board traps**

What would you like to explore or practice right now?`;
}
