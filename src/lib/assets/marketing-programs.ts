/**
 * Explicit local visuals for /marketing-programs.
 * Each file is an existing Kosick program image, saved locally so the
 * directory does not request staging.kosick.com at render time.
 */
export const MARKETING_PROGRAM_ASSETS = {
  hvac: {
    src: "/images/marketing-programs/hvac-ductless-bedroom.jpg",
    alt: "A ductless heat pump above a bright, calm bedroom",
  },
  dental: {
    src: "/images/marketing-programs/dental.jpg",
    alt: "Dental practice search advertising",
  },
  medicalAesthetics: {
    src: "/images/industries/medical-aesthetics/consultation-mirror.jpg",
    alt: "A clinician holding a mirror for a smiling client during an aesthetic consultation",
    position: "50% 35%",
  },
  golf: {
    src: "/images/marketing-programs/golf.jpg",
    alt: "Golf course marketing",
  },
  social: {
    src: "/images/marketing-programs/social.jpg",
    alt: "Social media campaign on desktop and phone",
  },
  email: {
    src: "/images/marketing-programs/email.jpg",
    alt: "Email campaign preview on a laptop",
  },
  seo: {
    src: "/images/marketing-programs/seo.png",
    alt: "Search results for a local service",
    position: "center 32%",
  },
  website: {
    src: "/images/marketing-programs/website.jpg",
    alt: "Website and e-commerce design on a laptop",
  },
} as const;
