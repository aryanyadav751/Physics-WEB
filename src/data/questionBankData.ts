import { QuestionItem } from '../types/physics';

export const QUESTION_BANK: QuestionItem[] = [
  // LIGHT CHAPTER QUESTIONS
  {
    id: 'qb-light-1',
    chapterId: 'light',
    topicId: 'light-spherical-mirrors',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Easy',
    question: 'A concave mirror of focal length 20 cm forms an image of the same size as the object. The object distance from the mirror is:',
    options: ['10 cm', '20 cm', '40 cm', '80 cm'],
    correctOptionIndex: 2,
    answer: 'Option (C): 40 cm',
    explanation: 'A concave mirror produces an image of the same size as the object only when the object is placed at the Centre of Curvature (C). Since R = 2f = 2 × 20 = 40 cm, the object distance u = 40 cm.',
    concept: 'Concave mirror image formation at C',
    formulaUsed: 'R = 2f',
    boardYear: 'CBSE 2022',
  },
  {
    id: 'qb-light-2',
    chapterId: 'light',
    topicId: 'light-refraction-snell',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Medium',
    question: 'The refractive indices of water, glass, and diamond are 1.33, 1.50, and 2.42 respectively. In which medium does light travel the fastest?',
    options: ['Diamond', 'Glass', 'Water', 'Same in all'],
    correctOptionIndex: 2,
    answer: 'Option (C): Water',
    explanation: 'Refractive index n = c / v => v = c / n. Speed of light v is inversely proportional to refractive index. Since water has the lowest refractive index (1.33), light travels fastest in water (v ≈ 2.25 × 10^8 m/s).',
    concept: 'Absolute Refractive Index',
    formulaUsed: 'v = c / n',
    boardYear: 'CBSE 2023',
  },
  {
    id: 'qb-light-3',
    chapterId: 'light',
    topicId: 'light-lenses-power',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Easy',
    question: 'A student uses a lens of focal length -50 cm to read a book. The nature and power of this lens is:',
    options: ['Convex, +2 D', 'Concave, -2 D', 'Convex, +0.5 D', 'Concave, -0.5 D'],
    correctOptionIndex: 1,
    answer: 'Option (B): Concave, -2 D',
    explanation: 'A negative focal length indicates a Concave lens. Power P = 1 / f(in m) = 1 / (-0.50 m) = -2.0 D.',
    concept: 'Power of a Lens',
    formulaUsed: 'P = 100 / f(in cm)',
    boardYear: 'CBSE 2024',
  },
  {
    id: 'qb-light-4',
    chapterId: 'light',
    topicId: 'light-sign-convention-mirror-formula',
    type: 'Assertion-Reason',
    marks: 1,
    difficulty: 'Medium',
    question: 'Assertion (A): A ray of light passing through the centre of curvature of a concave mirror retraces its path after reflection.\nReason (R): The ray strikes the mirror surface normally along the radius, making the angle of incidence equal to 0°.',
    options: [
      'Both A and R are true and R is the correct explanation of A.',
      'Both A and R are true but R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is false but R is true.',
    ],
    correctOptionIndex: 0,
    answer: 'Option (A): Both A and R are true and R is the correct explanation of A.',
    explanation: 'Any line passing through the centre of curvature C of a spherical mirror lies along the radius, which is perpendicular to the tangent at the spherical surface. Hence ∠i = 0°, and by the law of reflection, ∠r = 0°, meaning the ray reflects directly back along its incoming path.',
    concept: 'Reflection at spherical surface',
    boardYear: 'CBSE 2023',
  },
  {
    id: 'qb-light-5',
    chapterId: 'light',
    topicId: 'light-concave-mirror-images',
    type: 'Short Answer',
    marks: 2,
    difficulty: 'Medium',
    question: 'A dentist uses a small mirror to inspect cavities in teeth. (i) What type of mirror is used? (ii) What must be the position of the tooth relative to the mirror for effective inspection?',
    answer: '(i) A concave mirror is used.\n(ii) The tooth must be held between the Pole (P) and the Principal Focus (F) of the concave mirror. At this close distance, the concave mirror produces an erect, virtual, and highly magnified image of the cavity, allowing the dentist to examine details clearly.',
    explanation: 'Points to highlight: Concave mirror, object between P and F, forms virtual, erect, and magnified image.',
    concept: 'Applications of concave mirror',
    boardYear: 'CBSE 2020',
  },
  {
    id: 'qb-light-6',
    chapterId: 'light',
    topicId: 'light-sign-convention-mirror-formula',
    type: 'Numerical',
    marks: 3,
    difficulty: 'Board-Level',
    question: 'An object 5 cm in length is placed at a distance of 20 cm in front of a convex mirror of radius of curvature 30 cm. Find the position of the image, its nature, and its size.',
    answer: 'Image position v = +8.57 cm behind mirror; Nature: Virtual and Erect; Size h_i = +2.14 cm (diminished).',
    explanation: `Given:
h_o = +5 cm, u = -20 cm, R = +30 cm (convex mirror)
Focal length f = R/2 = +15 cm

Using mirror formula:
1/f = 1/v + 1/u
=> 1/v = 1/f - 1/u = 1/15 - 1/(-20) = 1/15 + 1/20
LCM(15, 20) = 60
=> 1/v = (4 + 3) / 60 = 7 / 60
=> v = +60 / 7 ≈ +8.57 cm

Magnification:
m = -v / u = -(60/7) / (-20) = 3 / 7 ≈ +0.43
h_i = m * h_o = (3/7) * 5 = 15 / 7 ≈ +2.14 cm.
Since v is positive, the image is formed behind the mirror.
Since m is positive, the image is Virtual and Erect.`,
    concept: 'Convex mirror numerical',
    formulaUsed: '1/f = 1/v + 1/u  and  m = -v/u',
    boardYear: 'CBSE 2019, 2022',
  },
  {
    id: 'qb-light-7',
    chapterId: 'light',
    topicId: 'light-lenses-power',
    type: 'Long Answer',
    marks: 5,
    difficulty: 'Hard',
    question: '(a) Define 1 Dioptre of power of a lens.\n(b) A convex lens forms a real and inverted image of a needle at a distance of 50 cm from it. Where is the needle placed in front of the convex lens if the image is equal to the size of the object? Also, find the power of the lens.',
    answer: `(a) One Dioptre (1 D) is the power of a lens whose focal length is 1 metre (1 m). 1 D = 1 m^-1.

(b) For a convex lens, when the image formed is real, inverted, and of the same size as the object (m = -1), the image and object are both at a distance of 2f from the lens:
Image distance v = +50 cm
Therefore, 2f = 50 cm => f = 25 cm = 0.25 m.
Object distance u = -2f = -50 cm (50 cm in front of the lens).

Power of the lens:
P = 1 / f(in m) = 1 / 0.25 m = +4.0 D.`,
    explanation: 'Step 1 definition (1m), Step 2 object position u = -50 cm with reasoning (2f) (2m), Step 3 calculation of focal length and power P = +4 D with unit (2m).',
    concept: 'Convex lens same-size image & Power',
    formulaUsed: 'P = 1/f',
    boardYear: 'CBSE 2020',
  },

  // HUMAN EYE & COLOURFUL WORLD
  {
    id: 'qb-eye-1',
    chapterId: 'human-eye',
    topicId: 'eye-accommodation',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Easy',
    question: 'The change in focal length of an eye lens is caused by the action of the:',
    options: ['Pupil', 'Retina', 'Ciliary muscles', 'Iris'],
    correctOptionIndex: 2,
    answer: 'Option (C): Ciliary muscles',
    explanation: 'Ciliary muscles modify the curvature of the crystalline eye lens. When they contract, the lens becomes thicker (f decreases) to focus nearby objects; when they relax, the lens becomes thinner (f increases) to focus distant objects.',
    concept: 'Power of accommodation',
    boardYear: 'CBSE 2021',
  },
  {
    id: 'qb-eye-2',
    chapterId: 'human-eye',
    topicId: 'prism-refraction-dispersion',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Medium',
    question: 'When a beam of white light passes through a glass prism, the colour of light that undergoes maximum deviation is:',
    options: ['Red', 'Yellow', 'Green', 'Violet'],
    correctOptionIndex: 3,
    answer: 'Option (D): Violet',
    explanation: 'Violet light has the shortest wavelength in the visible spectrum. According to Cauchy\'s dispersion principle, glass exhibits the highest refractive index for violet light, causing it to slow down the most and deviate by the greatest angle.',
    concept: 'Dispersion of white light',
    boardYear: 'CBSE 2023',
  },
  {
    id: 'qb-eye-3',
    chapterId: 'human-eye',
    topicId: 'scattering-tyndall',
    type: 'Short Answer',
    marks: 2,
    difficulty: 'Medium',
    question: 'Why does the Sun appear reddish early in the morning and at sunset, but white at noon?',
    answer: `1. At sunrise and sunset: Sunlight travels through a much thicker layer of the atmosphere. The shorter blue and violet wavelengths are almost completely scattered away by air particles along the long path. Only the longer, least-scattered red wavelengths reach our eyes, making the Sun appear reddish.
2. At noon: The Sun is directly overhead and sunlight travels a much shorter distance through the atmosphere. Only a tiny fraction of blue light is scattered, so light reaches us almost undiminished with all colours intact, appearing white.`,
    explanation: 'Award 1 mark for sunrise/sunset path length & Rayleigh scattering (1/λ^4), and 1 mark for noon overhead explanation.',
    concept: 'Scattering of light',
    boardYear: 'CBSE 2022',
  },
  {
    id: 'qb-eye-4',
    chapterId: 'human-eye',
    topicId: 'eye-defects-correction',
    type: 'Case-Based',
    marks: 4,
    difficulty: 'Board-Level',
    question: `A 14-year-old student sitting in the back row of a classroom cannot clearly read the letters written on the blackboard, but can read her notebook without difficulty.
(a) Name the defect of vision she is suffering from. (1 mark)
(b) List two possible causes of this defect. (1 mark)
(c) With the help of a ray diagram, show how this defect is corrected using a spectacle lens. (2 marks)`,
    answer: `(a) The student is suffering from Myopia (Short-sightedness).
(b) Two causes:
    1. Excessive curvature of the eye lens (focal length too short).
    2. Elongation of the eyeball.
(c) Correction: A concave lens of suitable focal length is used. Parallel rays from the distant blackboard are diverged by the concave lens such that they appear to come from the student's defective far point, focusing precisely on the retina.`,
    explanation: 'Classic CBSE 4-mark case study question.',
    concept: 'Myopia defect and correction',
    boardYear: 'CBSE 2023 Sample Paper',
  },

  // ELECTRICITY QUESTIONS
  {
    id: 'qb-elec-1',
    chapterId: 'electricity',
    topicId: 'electric-charge-current',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Easy',
    question: 'A current of 1 A is drawn by a filament of an electric bulb. The number of electrons passing through a cross section of the filament in 16 seconds is:',
    options: ['10^20', '10^19', '10^18', '1.6 × 10^19'],
    correctOptionIndex: 0,
    answer: 'Option (A): 10^20 electrons',
    explanation: `Q = I * t = 1 A * 16 s = 16 Coulombs.
Since Q = n * e => n = Q / e = 16 / (1.6 × 10^-19) = 10 × 10^19 = 10^20 electrons.`,
    concept: 'Quantization of charge and current',
    formulaUsed: 'Q = I*t = n*e',
    boardYear: 'CBSE 2020',
  },
  {
    id: 'qb-elec-2',
    chapterId: 'electricity',
    topicId: 'ohms-law-resistance',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Medium',
    question: 'A cylindrical conductor of length l and uniform area of cross-section A has resistance R. Another conductor of length 2l and resistance R of the same material has area of cross-section:',
    options: ['A/2', '3A/2', '2A', '3A'],
    correctOptionIndex: 2,
    answer: 'Option (C): 2A',
    explanation: `R = ρ * (l / A).
For the new conductor of length 2l and same material (same ρ) to have the same resistance R:
R = ρ * (2l / A\') = R
=> ρ * (2l / A\') = ρ * (l / A)
=> 2 / A\' = 1 / A => A\' = 2A.`,
    concept: 'Factors affecting resistance',
    formulaUsed: 'R = ρ * l / A',
    boardYear: 'CBSE 2020',
  },
  {
    id: 'qb-elec-3',
    chapterId: 'electricity',
    topicId: 'electric-power-energy',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Medium',
    question: 'An electric kettle consumes 1 kW of electric power when operated at 220 V. A fuse-wire of what rating must be used for it?',
    options: ['1 A', '2 A', '4 A', '5 A'],
    correctOptionIndex: 3,
    answer: 'Option (D): 5 A',
    explanation: `Current I = P / V = 1000 W / 220 V ≈ 4.54 A.
Since the operating current is 4.55 A, a fuse wire rated slightly above this operating current, i.e., 5 A, must be chosen.`,
    concept: 'Fuse rating and electrical power',
    formulaUsed: 'I = P / V',
    boardYear: 'CBSE 2021',
  },
  {
    id: 'qb-elec-4',
    chapterId: 'electricity',
    topicId: 'parallel-resistors',
    type: 'Assertion-Reason',
    marks: 1,
    difficulty: 'Medium',
    question: 'Assertion (A): In a parallel circuit, if one bulb blows out, the other bulbs continue to glow with the same brightness.\nReason (R): In a parallel connection, the potential difference across each branch remains constant and equal to the supply voltage.',
    options: [
      'Both A and R are true and R is the correct explanation of A.',
      'Both A and R are true but R is not the correct explanation of A.',
      'A is true but R is false.',
      'A is false but R is true.',
    ],
    correctOptionIndex: 0,
    answer: 'Option (A): Both A and R are true and R is the correct explanation of A.',
    explanation: 'Each branch in parallel receives independent current I = V / R. When one branch breaks, current in that branch becomes zero, but V across the remaining branches remains unchanged, so they continue to dissipate P = V²/R without change.',
    concept: 'Parallel circuits characteristics',
    boardYear: 'CBSE 2023',
  },
  {
    id: 'qb-elec-5',
    chapterId: 'electricity',
    topicId: 'series-resistors',
    type: 'Numerical',
    marks: 3,
    difficulty: 'Medium',
    question: 'An electric lamp of resistance 20 Ω and a conductor of 4 Ω resistance are connected in series to a 6 V battery. Calculate: (a) the total resistance of the circuit, (b) the current through the circuit, and (c) the potential difference across the electric lamp and conductor.',
    answer: '(a) Total R = 24 Ω; (b) Current I = 0.25 A; (c) V_lamp = 5.0 V, V_conductor = 1.0 V.',
    explanation: `(a) R_total = R_1 + R_2 = 20 Ω + 4 Ω = 24 Ω.
(b) Current I = V / R_total = 6 V / 24 Ω = 0.25 A.
(c) Potential difference:
    Across lamp: V_lamp = I * R_lamp = 0.25 A * 20 Ω = 5.0 V.
    Across conductor: V_conductor = I * R_conductor = 0.25 A * 4 Ω = 1.0 V.
Verification: 5.0 V + 1.0 V = 6.0 V.`,
    concept: 'Series circuit analysis',
    formulaUsed: 'V = I*R and R_s = R_1 + R_2',
    boardYear: 'CBSE 2019',
  },
  {
    id: 'qb-elec-6',
    chapterId: 'electricity',
    topicId: 'heating-effect-joules-law',
    type: 'Long Answer',
    marks: 5,
    difficulty: 'Hard',
    question: `(a) State Joule’s law of heating and write its mathematical expression. (2 marks)
(b) Two electric bulbs rated 220 V, 60 W and 220 V, 100 W are connected in parallel to a 220 V supply.
    (i) Which bulb draws more current?
    (ii) Which bulb has higher resistance?
    (iii) Find the total current drawn from the line. (3 marks)`,
    answer: `(a) Joule’s Law of Heating states that the heat (H) produced in a resistor is directly proportional to:
    1. The square of current (I²) flowing through it,
    2. The resistance (R) of the conductor, and
    3. The time (t) for which the current flows.
    Expression: H = I² * R * t  (in Joules).

(b)
    (i) I = P / V. For 100 W bulb: I_100 = 100/220 ≈ 0.45 A. For 60 W bulb: I_60 = 60/220 ≈ 0.27 A. The 100 W bulb draws more current.
    (ii) R = V² / P. Resistance is inversely proportional to rated power. Hence, the 60 W bulb has higher resistance (R_60 = 220²/60 = 806.7 Ω vs R_100 = 220²/100 = 484 Ω).
    (iii) Total current I_total = I_60 + I_100 = (60/220) + (100/220) = 160/220 = 8/11 ≈ 0.73 A.`,
    explanation: 'Award 2 marks for law and formula, 1 mark each for part (i), (ii), and (iii).',
    concept: 'Joule heating and bulb ratings',
    formulaUsed: 'H = I^2*R*t and P = V*I = V^2/R',
    boardYear: 'CBSE 2021',
  },

  // MAGNETISM QUESTIONS
  {
    id: 'qb-mag-1',
    chapterId: 'magnetism',
    topicId: 'magnetic-field-lines',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Easy',
    question: 'The magnetic field lines inside a current-carrying long straight solenoid are:',
    options: ['Circular', 'Parabolic', 'Zero', 'Parallel straight lines'],
    correctOptionIndex: 3,
    answer: 'Option (D): Parallel straight lines',
    explanation: 'Inside a solenoid, the magnetic field lines are in the form of parallel straight lines. This indicates that the magnetic field is uniform at all points inside the solenoid.',
    concept: 'Solenoid magnetic field',
    boardYear: 'CBSE 2022',
  },
  {
    id: 'qb-mag-2',
    chapterId: 'magnetism',
    topicId: 'force-fleming-left-hand-rule',
    type: 'MCQ',
    marks: 1,
    difficulty: 'Medium',
    question: 'According to Fleming\'s Left-Hand Rule, the forefinger, middle finger, and thumb represent respectively:',
    options: [
      'Field, Current, Force',
      'Current, Field, Force',
      'Force, Field, Current',
      'Motion, Induced Current, Field',
    ],
    correctOptionIndex: 0,
    answer: 'Option (A): Field, Current, Force',
    explanation: 'In Fleming\'s Left-Hand Rule: Forefinger = magnetic Field, Middle finger = Current, Thumb = Force/Motion. (Memory tip: FBI).',
    concept: 'Fleming\'s Left-Hand Rule',
    boardYear: 'CBSE 2023',
  },
  {
    id: 'qb-mag-3',
    chapterId: 'magnetism',
    topicId: 'domestic-electric-circuits',
    type: 'Short Answer',
    marks: 2,
    difficulty: 'Easy',
    question: 'What is the function of an earth wire? Why is it necessary to earth metallic appliances like electric irons and refrigerators?',
    answer: `The earth wire provides a low-resistance path for leakage electric current directly into the earth.
Necessity: If the insulation of the live wire gets damaged and touches the metallic body of the appliance, its potential rises to 220 V. Without earthing, any person touching the metal body would receive a fatal electric shock. With earthing, the leakage current immediately rushes through the low-resistance earth wire to the ground, causing the fuse to blow and safely isolating the circuit.`,
    explanation: 'Mention: low resistance path to ground and prevention of electric shock to user.',
    concept: 'Earthing safety mechanism',
    boardYear: 'CBSE 2020',
  },
  {
    id: 'qb-mag-4',
    chapterId: 'magnetism',
    topicId: 'electric-motor',
    type: 'Long Answer',
    marks: 5,
    difficulty: 'Hard',
    question: `(a) State the principle of an electric motor.
(b) Explain the construction and working of an electric motor with the help of a neat labeled diagram.
(c) What is the function of split rings (commutator) and carbon brushes in an electric motor?`,
    answer: `(a) Principle: An electric motor works on the principle that when a rectangular coil carrying electric current is placed in a magnetic field, it experiences a mechanical force (couple of forces) acting on opposite arms, which causes the coil to rotate continuously according to Fleming's Left-Hand Rule.

(b) Construction:
    - Armature coil ABCD: Insulated copper wire.
    - Strong Horseshoe Magnet: Provides magnetic field from N to S.
    - Split-ring Commutator (P & Q): Two halves of a metallic ring.
    - Carbon Brushes (X & Y): Press against split rings to supply current from battery.
    Working: Current enters arm AB (towards B) and leaves arm CD (towards D). Magnetic field is left to right. By Fleming's Left-Hand rule, arm AB experiences a downward force and arm CD experiences an upward force, causing clockwise rotation. After half rotation, split rings reverse connections, reversing current in arms and sustaining continuous rotation in the same direction!

(c) Function:
    - Split rings (Commutator): Reverse the direction of current in the coil every half rotation (180°).
    - Carbon Brushes: Provide flexible electrical contact between the rotating split rings and the stationary external circuit.`,
    explanation: 'Award 1 mark for principle, 2 marks for construction/diagram, 1 mark for working, 1 mark for commutator/brushes function.',
    concept: 'Electric motor working',
    boardYear: 'CBSE 2019, 2023',
  },
];
