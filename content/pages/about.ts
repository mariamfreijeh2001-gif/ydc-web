/** /about-us/ — copy transcribed verbatim from the WordPress page. */

export const about = {
  hero: {
    eyebrow: 'About Us',
    title: 'Why We are the Best Clinic?',
    text: 'At Younes Dental Clinic, we combine advanced technology with personalized care to give you the best dental experience. Our expert team offers top-quality treatments, from routine check-ups to advanced solutions like same-day implants. With a focus on patient comfort and safety, we are committed to helping you achieve a healthy, beautiful smile in a welcoming environment.',
    image: '/media/2024/10/Untitled-design-2024-10-09T171941.341.webp',
  },
  welcome: {
    heading: 'Welcome to Younes Dental Clinic',
    text: 'At Younes Dental Clinic, we are passionate about delivering exceptional dental care tailored to your unique needs. Combining advanced technology with a patient-first approach, we aim to create a comfortable and welcoming environment for you and your family. From routine cleanings to complex restorative treatments, we offer a full spectrum of services designed to enhance your oral health and restore your confidence. With a focus on innovation and continuous improvement, we strive to provide high-quality, personalized care that ensures every patient walks out with a healthy, radiant smile.',
    image: '/media/2024/08/Beige-Minimalist-Carousel-Instagram-Post-44-e1724683455273.webp',
  },
  mission: {
    heading: 'Our Mission',
    text: 'At Younes Dental Clinic, we are dedicated to providing exceptional dental care that combines innovation, compassion, and a patient-centered approach. Our mission is to enhance the oral health and well-being of our patients by utilizing cutting-edge technology and personalized treatments, ensuring the highest standard of care in a welcoming environment. Our vision is to continually lead the way in modern dentistry, offering advanced solutions like same-day permanent teeth, while building lasting relationships that keep you and your family smiling for life.',
    main: '/media/2024/08/Trophy-Image-1-scaled-e1724683331276.webp',
    collage: [
      '/media/2024/08/Layer2.webp',
      '/media/2024/08/photo_2024-08-26_16-33-37-e1724683275733.webp',
    ],
  },
  team: {
    eyebrow: 'Meet our team',
    heading: 'Our Professional Team',
    cta: { label: 'View All Doctors', href: '/doctors/' },
  },
  services: { heading: 'Our Services' },
  /*
   * The regions come from the clinic's own "World-Class Clinic" copy on /services/ —
   * "renowned globally, attracting patients from the US, Canada, EU, MENA, and
   * Australia". Nothing here claims more than that: no patient counts, no cities.
   */
  origins: {
    eyebrow: 'Patients from around the world',
    heading: 'They travel to Jeita, Sour and Antelias',
    text: 'Patients come to us from the United States, Canada, Europe, the MENA region and Australia — many for full-arch treatment they were told was not possible at home, and most of it completed inside a single visit to Lebanon.',
  },
} as const;
