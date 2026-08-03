/**
 * /technologies/
 *
 * The intro and the five `detail` entries are transcribed verbatim from the WordPress
 * page. Everything in `stages` and `flagship` is new — the equipment list came from the
 * clinic directly.
 *
 * NOTE — three entries below carry no description: Ultrasound, Micromapper and Augment.
 * We were given the names only, and guessing at what a piece of clinical equipment does
 * is not something to invent on a dentist's website. The page renders a name-only tool
 * cleanly; add a sentence and it will pick it up.
 */

export type Tool = { name: string; text?: string };

export const technologies = {
  title: 'Our technologies',
  intro:
    'At Younes Dental Clinic, we are committed to using the latest dental technologies to provide our patients with the highest level of care. Advanced technology allows us to perform treatments more effectively, reduce recovery time, and achieve precise, comfortable results.',

  /**
   * The one piece of equipment most patients have never seen in a dental practice, so it
   * leads the page rather than sitting in a list with everything else.
   */
  flagship: {
    eyebrow: 'Robotic implant surgery',
    name: 'Eve',
    text: 'Eve is a surgical robot that places dental implants. The positions are planned on a 3D scan before surgery, and Eve holds the drill to that plan while your surgeon works — the same position, angle and depth that were approved on screen.',
    note: 'Planned digitally · placed robotically · restored in our own lab',
  },

  /**
   * Grouped by where each tool sits in a course of treatment, so the page reads as one
   * connected workflow rather than a shelf of equipment.
   */
  stages: [
    {
      name: 'Capture',
      blurb: 'Everything starts as data — your face, your teeth, and the bone underneath.',
      tools: [
        {
          name: 'RAYFace',
          text: 'A 3D scan of your face, so a smile is designed to suit it rather than to look right on its own.',
        },
        {
          name: 'Trios',
          text: 'An intraoral scanner. A wand traces your teeth and builds a 3D model as it goes, so there are no impression trays.',
        },
        {
          name: 'X-Ray',
          text: 'Standard and panoramic radiographs for a first look at teeth, roots and the bone around them.',
        },
        {
          name: '3D X-Ray (CBCT)',
          text: 'A cone beam scan showing bone volume, density and nerve position in three dimensions — what implant planning is built on.',
        },
        { name: 'Ultrasound' },
        {
          name: 'Scan bodies',
          text: 'Markers fitted to an implant so the scanner can record its exact position for the restoration that follows.',
        },
      ],
    },
    {
      name: 'Plan',
      blurb: 'The treatment is designed and agreed on screen before anything is done.',
      tools: [
        {
          name: 'Digital implant planning',
          text: 'Implant positions are placed against the CBCT and checked against bone, nerves and the final restoration before surgery is booked.',
        },
        {
          name: 'Digital Smile Design',
          text: 'Your new smile is designed against your face scan, so you see the result before treatment starts.',
        },
        { name: 'Micromapper' },
        { name: 'Augment' },
      ],
    },
    {
      name: 'Operate',
      blurb: 'The plan is carried into the mouth rather than re-improvised at the chair.',
      tools: [
        {
          name: 'Eve',
          text: 'The surgical robot. It holds the implant drill to the position planned on your scan.',
        },
        {
          name: 'Navident',
          text: 'Dynamic navigation: the drill and the jaw are tracked live against the plan, so the position is on screen as it happens.',
        },
        {
          name: 'Guided surgery',
          text: 'Printed surgical guides that seat over the teeth or bone and hold each drill to its planned path.',
        },
      ],
    },
    {
      name: 'Restore',
      blurb: 'Designed and made in our own lab, so the plan and the finished work never drift apart.',
      tools: [
        {
          name: 'CAD/CAM',
          text: 'Crowns, bridges and full arches designed digitally and milled to fit the scan they were planned on.',
        },
        {
          name: '3D printer',
          text: 'Surgical guides, models and temporary restorations printed on site, often the same day.',
        },
      ],
    },
  ],

  /** The five the clinic already wrote about at length, kept in their own words. */
  detail: [
    {
      title: 'Trios intraoral scanner',
      text: 'The TRIOS scanner replaces traditional messy impressions with a quick, comfortable, and highly accurate 3D scan of your teeth. This non-invasive technology captures detailed images in real-time, ensuring precise treatment planning and custom-made restorations. Patients experience reduced chair time and faster results.',
      image: '/media/2024/08/MOVE_2018_TransparentBG2_MID_RGB_1024x1024-600x600-1.webp',
    },
    {
      title: 'CAD/CAM',
      text: 'We use CAD/CAM (Computer-Aided Design/Manufacturing) to create custom dental restorations like crowns, bridges, and veneers with incredible precision. After capturing a 3D scan of your teeth, our team designs and fabricates your restoration digitally, often in a single visit. This technology ensures a perfect fit, great aesthetics, and long-lasting results.',
      image: '/media/2024/08/82.webp',
    },
    {
      title: '3D Xray',
      text: 'CBCT provides detailed 3D images of your mouth, jaw, and face, including bone density and nerve locations. This technology helps us diagnose issues accurately, plan treatments like implant placement, and detect early signs of oral health problems. It’s especially helpful for patients who may struggle with traditional x-rays.',
      image: '/media/2024/08/84.webp',
    },
    {
      title: 'Guided Surgery and Digital Implant Planning',
      text: 'Guided Surgery uses 3D imaging and computer-guided software to plan and execute precise implant placements. This method reduces surgery time, minimizes complications, and enhances patient comfort, ensuring a successful outcome.',
      image: '/media/2024/08/152355959_2610908519200630_831233507284446161_n-1.webp',
    },
    {
      title: '3D face scanning and Digital Smile Design',
      text: 'Using a 3D face scanner, we create a comprehensive plan to enhance your smile while considering your facial features. Digital Smile Design allows you to see a preview of your new smile before treatment begins, ensuring you’re fully satisfied with the result.',
      image: '/media/2024/08/85.webp',
    },
  ],
} as const;
