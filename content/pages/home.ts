/**
 * /  — home page copy.
 *
 * Everything here is drawn from the clinic's own material (the WordPress pages and
 * service copy). Nothing is invented: see the note on `stats` before adding to it.
 */

export const home = {
  hero: {
    eyebrow: 'Younes Dental · Ortho Implant Center',
    lines: ['Prioritize your dental health', 'State of the art dentistry'],
    video: '/media/2024/11/Clinic-Intro.mp4',
  },

  intro: {
    eyebrow: 'Why Younes Dental',
    quote: 'The best way to maintain a healthy smile is to be proactive!',
    body: 'At Younes Dental, we prioritize comfort, care, and efficiency to provide brighter, healthier smiles using the latest technology and training. Our comprehensive and affordable services range from dental implants and veneers to Clear Aligners, traditional orthodontics, and preventative care for the whole family. We value building long-lasting relationships with our patients for lifelong smiles.',
  },

  /*
   * Only figures the clinic already publishes. `250+` reviews and the international
   * patient base come from the live Services page; the surgeon and clinic counts come
   * from content/doctors.json and content/site.ts.
   *
   * A "years of experience" tile was requested but there is no founding year in any of
   * the source material — add one here once it's confirmed rather than guessing.
   */
  stats: [
    { value: 250, suffix: '+', label: 'Five-star Google reviews' },
    { value: 4, suffix: '', label: 'Specialist surgeons' },
    { value: 3, suffix: '', label: 'Clinics — Jeita, Sour & Antelias' },
    { value: 5, suffix: '', label: 'Continents our patients travel from' },
  ],

  family: {
    eyebrow: 'Meet our team',
    heading: 'A family of surgeons.',
    body: 'Younes Dental is led by the Younes family — surgeons who trained, and now operate, side by side. That continuity is the reason a case is planned, placed and restored by the same hands, and why patients see the same faces from consultation through to the final bridge.',
    cta: { label: 'Meet the team', href: '/doctors/' },
    /*
     * This section is specifically about the family, so it lists them by name rather
     * than showing every doctor. The full team, including colleagues who aren't
     * family, is on /doctors/ and in the About Us team grid.
     */
    members: ['Dr Ali Younes', 'Dr Jamal Younes', 'Dr Hassanain Younes'],
  },

  lab: {
    eyebrow: 'In-house digital lab',
    heading: 'Designed and milled under our own roof.',
    body: 'With our state-of-the-art digital in-house lab, we specialize in full arch prosthesis. Utilizing cutting-edge CAD/CAM technology and our innovative Zir-Arch technique, we create precise and stunning results — without sending your case out to a third party, and without the delays that come with it.',
    points: [
      'Screw-retained zirconia, never cemented metal-ceramic',
      'Every case digitally planned with 3D CBCT and guided surgery',
      'Temporary arch fitted the same day as surgery',
    ],
    cta: { label: 'Our technologies', href: '/technologies/' },
    /*
     * Hand-supplied, not from the WordPress export — anything under /media/site/ is
     * added directly to the repo and is not touched by scripts/import.mjs.
     * Transparent PNG, so it needs a white surface behind it.
     */
    image: '/media/site/digital-lab.webp',
  },

  journey: {
    eyebrow: 'How it works',
    heading: 'From first message to final bridge.',
    /* Steps mirror the visit structure published on the All-on-4 service page. */
    steps: [
      {
        step: 'First message',
        title: 'Tell us what’s bothering you',
        text: 'Send a photo or a question on WhatsApp. We’ll tell you honestly whether you’re a candidate before you travel anywhere.',
      },
      {
        step: 'First visit',
        title: 'Consultation & diagnosis',
        text: 'Facial aesthetic evaluation, X-rays, panoramic and 3D CBCT scan, then implant planning with 3D-printed surgical guides.',
      },
      {
        step: 'Second visit',
        title: 'Surgery, and teeth the same day',
        text: 'Guided implant placement, then a temporary arch designed and milled in our lab — you leave with teeth on the day of surgery.',
      },
      {
        step: 'Final bridge',
        title: 'Your permanent zirconia arch',
        text: 'Four to six months later, final digital impressions and your definitive Zir-Arch restoration. Implants carry a lifetime warranty.',
      },
    ],
    cta: {
      /*
       * One call to action, not two. No prices anywhere on the site, so this is how
       * someone asks. It points at /contacts/ for now; when the enquiry flow is
       * settled it becomes either the form or a WhatsApp deep link — one href here.
       */
      text: 'Every case is different, so we quote after we’ve seen your scans. Send us an X-ray or a photo and we’ll tell you what’s possible.',
      action: { label: 'Contact us', href: '/contacts/' },
    },
  },

  patients: {
    heading: 'Our Patients',
    cta: { label: 'View All Cases', href: '/before-after/' },
    /*
     * A single row on the home page; the rest live on /before-after/. The case order
     * in lib/content.ts alternates treatments, so the first four cover All-on-4,
     * C&B, All-on-6 and All-on-4 rather than four of a kind.
     */
    limit: 4,
  },

  services: {
    heading: 'Our Services',
    cta: { label: 'View All Services', href: '/services/' },
    /*
     * Four, so the grid is a single row — the full list is one click away. Two implant
     * treatments and two cosmetic ones, rather than the live site's implant-heavy set.
     */
    featured: ['allon6', 'zir-maxveneers', 'zaygoma', 'dentalcrowns'],
  },
} as const;
