/**
 * /technologies/
 *
 * The intro is transcribed from the WordPress page. The equipment list came from the
 * clinic; the capability figures below are the manufacturers' published specifications
 * (ClaroNav for Navident and MicronMapper, Ray for RAYFace) and are worded as what the
 * system does, not as outcomes we promise.
 *
 * Deliberately not everything the clinic owns. A plain X-ray and a box of scan bodies
 * are in every practice; listing them beside a surgical robot flattens the argument the
 * page is making. The five steps carry it, and `alsoInUse` names the rest without
 * pretending each one is remarkable.
 */

export const technologies = {
  title: 'Our technologies',
  intro:
    'At Younes Dental Clinic, we are committed to using the latest dental technologies to provide our patients with the highest level of care. Advanced technology allows us to perform treatments more effectively, reduce recovery time, and achieve precise, comfortable results.',

  /**
   * Three claims the page then goes on to substantiate. Each is a plain statement of
   * what the clinic owns, not a promise about outcomes.
   */
  facts: [
    { label: 'Robotic surgery', text: 'Implants placed by a Navident robot, to a plan approved on your own scan.' },
    { label: 'Three scanners', text: 'Your face, your teeth and your bone, captured digitally before anything begins.' },
    { label: 'In-house lab', text: 'Designed and milled here, which is how a full arch can be fitted the same day.' },
  ],

  /**
   * Eve is the clinic's own name for its ClaroNav Navident unit — not a second system.
   * It leads the page because it is the one thing here most patients have never seen in
   * a dental practice.
   */
  flagship: {
    eyebrow: 'Robotic implant surgery',
    name: 'Eve',
    lede: 'Our Navident robot. We call her Eve.',
    text: 'Your implants are planned on a 3D scan before surgery. During it, a stereoscopic camera tracks both the drill and your jaw many times a second and holds them against that plan — so the position, angle and depth that were approved on screen are the ones that end up in the bone, even as you move.',
    points: [
      'Plan approved on your own CBCT before anything begins',
      'Drill and jaw tracked live, not checked afterwards',
      'No stent in the way of the surgeon’s view of the site',
    ],
  },

  /**
   * One course of treatment, in order. Every step has a photograph from the clinic's own
   * library rather than a stock image or a borrowed product shot.
   */
  flow: [
    {
      step: 'Your face',
      name: 'RAYFace 3D facial scanner',
      text: 'Six cameras and two depth sensors build a 3D model of your face in about half a second. It is aligned with the scans of your teeth and jaw to make one virtual patient, so a smile is designed against your actual face rather than against a photograph.',
      stat: '≈0.5s per face capture',
      image: '/media/2024/08/85.webp',
    },
    {
      step: 'Your teeth',
      name: 'Trios intraoral scanner',
      text: 'A wand traces your teeth and builds the model in real time. No trays, no impression material, and the file goes straight to the lab and the design software — nothing is re-measured by hand along the way.',
      stat: 'No impression trays',
      image: '/media/2024/08/MOVE_2018_TransparentBG2_MID_RGB_1024x1024-600x600-1.webp',
    },
    {
      step: 'Your bone',
      name: '3D X-ray (CBCT)',
      text: 'A cone beam scan showing bone volume, density and the position of every nerve in three dimensions. This is what tells us whether an implant is possible, where it can go, and how long it can be — the foundation the whole plan is built on.',
      stat: 'Bone, nerve and density in 3D',
      image: '/media/2024/08/84.webp',
    },
    {
      step: 'The surgery',
      name: 'Eve — Navident dynamic navigation',
      text: 'The plan is carried into the mouth by the robot rather than re-judged at the chair. Registration takes a couple of minutes at the start of the appointment, and from then on the drill’s position is on screen against the plan for the whole procedure.',
      stat: 'Drill tracked live against the plan',
      image: '/media/2024/08/152355959_2610908519200630_831233507284446161_n-1.webp',
    },
    {
      step: 'Your teeth back',
      name: 'MicronMapper photogrammetry and our in-house lab',
      text: 'MicronMapper records the exact 3D position of every implant in under a minute — no impression, no verification jig. Our own lab designs and mills from that file, which is how a full arch can be fitted the same day rather than weeks later.',
      stat: 'Every implant located in under a minute',
      image: '/media/2024/08/82.webp',
    },
  ],

  /**
   * Named, not written up. These are ordinary equipment in a good practice; three of
   * them we were given as names only, and inventing a description for clinical kit on a
   * dentist's website is not something to do.
   */
  alsoInUse: {
    heading: 'Also in daily use',
    items: ['Panoramic X-ray', 'Ultrasound', 'Scan bodies', 'Augment', 'Guided surgical stents'],
  },
} as const;
