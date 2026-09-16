import { SimulationMeta } from '../types/physics';

export const SIMULATIONS_LIST: SimulationMeta[] = [
  {
    id: 'sim-concave-mirror',
    title: 'Spherical Mirrors Ray Simulator (Concave & Convex)',
    chapterId: 'light',
    category: 'Light',
    tagline: 'Dynamically trace light rays, move the object along the principal axis, and observe real vs virtual image formation.',
    aim: 'To study the formation of images by a spherical mirror for various positions of the object, verify the mirror formula (1/f = 1/v + 1/u), and calculate linear magnification.',
    apparatus: [
      'Optical bench with calibrated centimetre scale',
      'Concave / Convex spherical mirror on adjustable stand',
      'Illuminated candle or needle (object)',
      'Translucent screen for catching real images',
      'Measuring tape and plumb line',
    ],
    theory: `For a spherical mirror of focal length f:
1/f = 1/v + 1/u
Where u is object distance (always -ve), v is image distance, and f is focal length (-ve for concave, +ve for convex).
Magnification m = h_i / h_o = -v / u.
Rays used for image construction:
1. Ray parallel to principal axis passes through (or appears to diverge from) the principal focus F after reflection.
2. Ray passing through the centre of curvature C retraces its path back after striking normally.`,
    procedure: [
      'Select mirror type (Concave or Convex) and set its focal length f.',
      'Slide the object distance u slider to place the object at various positions: beyond C, at C, between C & F, at F, and between P & F.',
      'Observe the real-time ray tracing of the two key light rays reflecting off the mirror surface.',
      'Notice the position, orientation (erect/inverted), and nature (real/virtual) of the image formed at the intersection point.',
      'Record values of u, calculate predicted v using the mirror formula, and verify with the simulated image position.',
    ],
    precautions: [
      'The principal axis of the mirror and the object must be collinear and horizontal.',
      'All distances must be measured from the pole P along the principal axis.',
      'Use the New Cartesian sign convention strictly: u is always negative.',
    ],
    vivaQuestions: [
      {
        question: 'Under what condition does a concave mirror form a virtual and magnified image?',
        answer: 'When the object is placed between the Pole (P) and the Principal Focus (F). Magnification m is positive and greater than 1.',
      },
      {
        question: 'What is the focal length of a plane mirror?',
        answer: 'Infinity (∞), because its radius of curvature is infinite. Its power is zero.',
      },
      {
        question: 'Why is a convex mirror used as a rear-view mirror instead of a concave mirror?',
        answer: 'A convex mirror always gives an erect and diminished image, and its outward curvature gives a much wider field of view.',
      },
    ],
  },
  {
    id: 'sim-spherical-lens',
    title: 'Spherical Lenses Optical Bench (Convex & Concave)',
    chapterId: 'light',
    category: 'Light',
    tagline: 'Adjust object position relative to F and 2F to visualize refraction, focal convergence, and lens formula.',
    aim: 'To determine the focal length of a convex/concave lens by plotting object vs image distance, verify 1/f = 1/v - 1/u, and measure lens power in Dioptres.',
    apparatus: [
      'Optical bench with upright holders',
      'Convex and Concave lenses (known focal lengths)',
      'Illuminated target object',
      'Ground glass screen',
      'Reading needle for parallax elimination',
    ],
    theory: `When light travels through a lens, refraction occurs at both spherical surfaces:
Lens Formula: 1/f = 1/v - 1/u
Linear Magnification: m = h_i / h_o = +v / u
Lens Power: P = 1 / f(in metres) Dioptres (D)
For convex lens: f is positive (+). Can form both real and virtual images.
For concave lens: f is negative (-). Always forms virtual, erect, and diminished images.`,
    procedure: [
      'Select lens type (Convex or Concave) and focal length.',
      'Move the object slider across 2F_1, F_1, and closer to optical centre O.',
      'Observe parallel ray bending through focus F_2 and the central ray passing through O undeviated.',
      'Inspect the generated image dimensions, nature (real vs virtual), and calculated power in Dioptres.',
    ],
    precautions: [
      'Ensure the optical centre of the lens lies on the horizontal line passing through the object centre.',
      'Avoid looking directly at high-intensity light sources through the lens.',
    ],
    vivaQuestions: [
      {
        question: 'Why does a ray passing through the optical centre pass undeviated?',
        answer: 'Near the optical centre, the opposite surfaces of a thin lens are essentially parallel, like a very thin glass plate, causing negligible lateral displacement.',
      },
      {
        question: 'What is the nature and power of a lens with focal length -20 cm?',
        answer: 'Since focal length is negative, it is a concave lens. Power P = 100 / (-20) = -5.0 Dioptres.',
      },
    ],
  },
  {
    id: 'sim-glass-slab',
    title: 'Refraction & Lateral Displacement in Glass Slab',
    chapterId: 'light',
    category: 'Light',
    tagline: 'Vary the angle of incidence and medium refractive index to investigate Snell’s Law and measure lateral shift.',
    aim: 'To trace the path of a ray of light through a rectangular glass slab for different angles of incidence, verify ∠i = ∠e, and study lateral displacement.',
    apparatus: [
      'Rectangular glass slab',
      'Drawing board, white sheet, fixing pins',
      'Protractor and optical pins',
      'Sharp pencil and millimeter scale',
    ],
    theory: `Refraction occurs at two interfaces:
1. Air to Glass: Ray bends towards normal: sin(i) / sin(r) = n
2. Glass to Air: Ray bends away from normal: sin(r) / sin(e) = 1/n
Since opposing faces are parallel, ∠i = ∠e (Angle of incidence equals angle of emergence).
The emergent ray is parallel to the incident ray, shifted by lateral displacement:
d = [t * sin(i - r)] / cos(r)
Where t is the thickness of the glass slab.`,
    procedure: [
      'Adjust the angle of incidence (i) using the slider from 0° to 75°.',
      'Select different optical media (Water n=1.33, Crown Glass n=1.52, Dense Flint n=1.65, Diamond n=2.42).',
      'Watch the incident ray enter the first surface, bend at angle r, travel through thickness t, and emerge parallel at angle e.',
      'Observe how lateral displacement d increases with higher incidence angles and greater refractive indices.',
    ],
    precautions: [
      'Pins must be placed vertically and separated by at least 5 cm for accurate alignment.',
      'Ensure the glass slab does not shift position while taking readings.',
    ],
    vivaQuestions: [
      {
        question: 'Why does a ray striking normally (i = 0°) pass without deviation?',
        answer: 'At i = 0°, sin(i) = 0, so by Snell’s law sin(r) = 0 => r = 0°. All parts of the wavefront enter the new medium simultaneously with no tilt.',
      },
      {
        question: 'What factors determine the lateral displacement produced by a glass slab?',
        answer: '1) Thickness of slab (t), 2) Refractive index of slab (n), 3) Angle of incidence (i).',
      },
    ],
  },
  {
    id: 'sim-prism-dispersion',
    title: 'Prism Refraction & White Light Dispersion (VIBGYOR)',
    chapterId: 'human-eye',
    category: 'Light',
    tagline: 'Split polychromatic white light into 7 colors through a triangular prism and study the angle of deviation.',
    aim: 'To observe the refraction of light through a triangular glass prism, measure the angle of deviation (D), and demonstrate the dispersion of white light into VIBGYOR.',
    apparatus: [
      'Triangular glass prism (equilateral, A = 60°)',
      'Ray box with white light and monochromatic slit',
      'Drawing board and protractor',
      'Screen to capture the spectrum',
    ],
    theory: `A triangular prism has non-parallel refracting faces:
i + e = A + D
Where A is the angle of the prism (usually 60°), i is incidence angle, e is emergence angle, and D is the angle of deviation.
Cause of Dispersion:
Different colours of white light possess different wavelengths. Glass has a higher refractive index for shorter wavelengths:
n_violet > n_red  =>  v_red > v_violet
Consequently, red light deviates least and violet light deviates most, fanning out into the VIBGYOR spectrum.`,
    procedure: [
      'Switch between Monochromatic Laser Beam and White Light Spectrum mode.',
      'Adjust the angle of incidence slider to observe how deviation D reaches a minimum (Angle of Minimum Deviation D_m).',
      'Inspect the spread of seven colors: Red (650 nm, deviates least) to Violet (400 nm, deviates most).',
      'Observe Newton’s recombination concept by introducing an inverted complementary prism.',
    ],
    precautions: [
      'Prism angles must be verified before measurement.',
      'Keep the light ray narrow to obtain crisp, non-overlapping spectral bands.',
    ],
    vivaQuestions: [
      {
        question: 'Which colour of visible light travels fastest in glass?',
        answer: 'Red light, because it has the longest wavelength and encounters the lowest refractive index in glass.',
      },
      {
        question: 'What was proved by Sir Isaac Newton using two identical prisms, one inverted?',
        answer: 'He proved that white light consists of seven colors and the prism does not create colors itself, but only separates the constituent colors already present in white light.',
      },
    ],
  },
  {
    id: 'sim-ohms-law',
    title: 'Ohm’s Law Verification & V-I Graph Plotter',
    chapterId: 'electricity',
    category: 'Electricity',
    tagline: 'Vary battery voltage and rheostat resistance, read live ammeter/voltmeter dials, and plot the real-time V-I line.',
    aim: 'To determine the resistance per unit length of a given wire by plotting a graph of potential difference (V) versus current (I), and verify Ohm’s Law.',
    apparatus: [
      'Regulated DC Power supply / Battery eliminator (0 - 12 V)',
      'Resistance wire (Nichrome / Constantan)',
      'DC Voltmeter (0 - 5 V)',
      'DC Ammeter (0 - 3 A)',
      'Rheostat (variable resistor)',
      'Plug key and thick connecting copper wires',
    ],
    theory: `Ohm’s Law states that at constant temperature and physical conditions:
V ∝ I  =>  V = I * R
The graph plotted between V (y-axis) and I (x-axis) is a straight line passing through origin (0, 0).
The slope of this line represents the resistance R of the conductor:
Slope = ΔV / ΔI = R (in Ohms, Ω).`,
    procedure: [
      'Set the circuit key to ON.',
      'Adjust the Voltage slider or move the Rheostat slider to vary the current in the circuit.',
      'Observe the deflection on the digital/analog Ammeter and Voltmeter dials.',
      'Click "Record Data Point" to plot the reading on the live coordinate graph.',
      'Notice the linear regression line formed through the origin; observe how the slope equals the measured resistance R.',
      'Toggle temperature to see how heating alters resistance in real metals.',
    ],
    precautions: [
      'Ammeter must always be connected in series; Voltmeter in parallel.',
      'The plug key should be inserted only while taking readings to prevent unnecessary heating of the wire.',
      'Clean the ends of connecting wires with sandpaper to eliminate contact resistance.',
    ],
    vivaQuestions: [
      {
        question: 'What physical quantity does the slope of a V-I graph represent?',
        answer: 'Resistance (R). If I is on y-axis and V on x-axis (I-V graph), the slope represents Conductance (1/R).',
      },
      {
        question: 'Why should current not be passed continuously for a long time during this experiment?',
        answer: 'Continuous current causes Joule heating (H = I²Rt). Temperature increase causes resistance of metallic wire to increase, deviating from Ohm’s law.',
      },
    ],
  },
  {
    id: 'sim-circuit-builder',
    title: 'Series & Parallel Resistors Circuit Workbench',
    chapterId: 'electricity',
    category: 'Electricity',
    tagline: 'Build multi-resistor networks, toggle configurations, and analyze branch currents, node voltages, and power dissipation.',
    aim: 'To verify the laws of combination of resistances in series (R_s = R_1 + R_2 + R_3) and parallel (1/R_p = 1/R_1 + 1/R_2 + 1/R_3).',
    apparatus: [
      'DC Battery source (variable voltage)',
      'Three standard resistors (R_1, R_2, R_3)',
      'Ammeter and Voltmeter probes',
      'SPST switches and connection breadboard',
    ],
    theory: `Series Combination:
- Current is identical across all resistors: I = I_1 = I_2 = I_3
- Voltage divides: V = V_1 + V_2 + V_3
- Equivalent Resistance: R_s = R_1 + R_2 + R_3 (Always > greatest resistor)

Parallel Combination:
- Voltage is identical across all branches: V = V_1 = V_2 = V_3
- Current splits: I = I_1 + I_2 + I_3
- Equivalent Resistance: 1/R_p = 1/R_1 + 1/R_2 + 1/R_3 (Always < smallest resistor)`,
    procedure: [
      'Switch between Series and Parallel topologies.',
      'Adjust values of R_1, R_2, and R_3 using sliders (1 Ω to 50 Ω).',
      'Change battery potential V (0 V to 24 V).',
      'Observe real-time animated electron current flow (flow speed is proportional to current intensity).',
      'Read individual branch currents, voltage drops across each resistor, and total circuit wattage.',
    ],
    precautions: [
      'Verify that polarity of battery terminals matches meters.',
      'Check that total power does not exceed rated limits of real resistors to prevent burning.',
    ],
    vivaQuestions: [
      {
        question: 'Why is household wiring always connected in parallel rather than in series?',
        answer: '1) Each appliance gets full mains voltage (220 V); 2) Each can be operated independently with its own switch; 3) If one appliance breaks or blows, others continue functioning uninterrupted.',
      },
      {
        question: 'Two bulbs of 40 W and 100 W are connected in series. Which bulb glows brighter?',
        answer: 'The 40 W bulb! Since R = V²/P, the 40 W bulb has higher resistance (R_40 > R_100). In series, current I is the same, so heat produced H = I²R is greater in the 40 W bulb.',
      },
    ],
  },
  {
    id: 'sim-magnetic-field-motor',
    title: 'Magnetic Fields, Solenoid & Fleming’s Motor Lab',
    chapterId: 'magnetism',
    category: 'Magnetism',
    tagline: 'Visualize Maxwell’s thumb rule around straight wires, magnetic loops in solenoids, and rotary torque on motor armature.',
    aim: 'To demonstrate magnetic field patterns around current-carrying conductors (straight wire & solenoid) and verify Fleming’s Left-Hand Rule in an electric motor.',
    apparatus: [
      'Current-carrying wire and cardboard sheet',
      'Magnetic plotting compasses',
      'Helical solenoid coil with soft iron core',
      'DC battery with reversing commutator switch',
      'Permanent horseshoe magnet and rotating armature coil model',
    ],
    theory: `1. Straight Conductor: Field lines form concentric circles centered on the wire. Direction given by Maxwell’s Right-Hand Thumb Rule.
2. Solenoid: Cylindrical coil of wire. Field inside is uniform, strong, and parallel. Acts like an artificial bar magnet with North and South poles.
3. Fleming’s Left-Hand Rule:
When current I flows through a wire of length l placed perpendicular to magnetic field B:
Force F = B * I * l
Thumb = Force / Motion, Forefinger = Field (N to S), Centre finger = Current (+ to -).
In an electric motor, equal and opposite forces on arms AB and CD create a turning couple (torque).`,
    procedure: [
      'Choose setup mode: "Straight Wire & Compass", "Solenoid & Core", or "Electric Motor Armature".',
      'Toggle current ON/OFF and click "Reverse Current" to observe compass needles flip 180° instantaneously.',
      'In Motor mode: Inspect the 3D/2D Fleming’s vectors (B-field, Current, Force) on each arm of the armature.',
      'Watch the split-ring commutator switch contact polarity every 180° to keep the rotor spinning continuously!',
      'Insert soft-iron core into solenoid to see magnetic field line density surge.',
    ],
    precautions: [
      'Keep magnetic compass away from external ferromagnetic interference.',
      'Do not short-circuit heavy current sources without current-limiting resistors.',
    ],
    vivaQuestions: [
      {
        question: 'What is the function of the split-ring commutator in an electric motor?',
        answer: 'It reverses the direction of current in the armature coil arms every half rotation, ensuring that the direction of torque remains constant and the motor rotates in one continuous direction.',
      },
      {
        question: 'What happens to the magnetic field of a solenoid when a soft iron rod is inserted inside it?',
        answer: 'The magnetic field strength increases tremendously because soft iron has high magnetic permeability and becomes magnetized by induction, creating an electromagnet.',
      },
    ],
  },
];
