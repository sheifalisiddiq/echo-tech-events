export type Experience = {
  slug: string;
  title: string;
  shortTitle: string;
  category: "Photo" | "Video" | "AI" | "Immersive";
  description: string;
  image: string;
  featured?: boolean;
};

const photos = {
  robotic: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=88",
  blue: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1800&q=88",
  light: "https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1800&q=88",
  gala: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1800&q=88",
  tech: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1800&q=88",
  camera: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1800&q=88",
  stage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=88",
  wedding: "https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1800&q=88",
};

export const experiences: Experience[] = [
  { slug: "magic-mirror-selfie-booth", title: "Magic Mirror Selfie Booth", shortTitle: "Magic Mirror", category: "Photo", description: "A full-length interactive mirror with guided captures and branded overlays.", image: photos.gala },
  { slug: "dslr-candy-photo-booth", title: "DSLR Candy Photo Booth", shortTitle: "DSLR Candy", category: "Photo", description: "Studio-quality portraits from a compact, beautifully styled booth.", image: photos.camera },
  { slug: "classic-photo-booth", title: "Classic Photo Booth", shortTitle: "Classic Booth", category: "Photo", description: "A timeless open-air capture experience refined for modern events.", image: photos.light },
  { slug: "enclosed-pod-photo-booth", title: "Enclosed Pod Photo Booth", shortTitle: "Enclosed Pod", category: "Photo", description: "An intimate booth format for candid, high-energy photo moments.", image: photos.blue },
  { slug: "magazine-photo-booth", title: "Magazine Photo Booth", shortTitle: "Magazine Booth", category: "Immersive", description: "Guests step inside a dimensional magazine cover built around your brand.", image: photos.tech, featured: true },
  { slug: "instant-print-photo-booth", title: "Instant Print Photo Booth", shortTitle: "Instant Print", category: "Photo", description: "Beautiful on-the-spot prints designed as take-home event keepsakes.", image: photos.gala },
  { slug: "360-video-booth", title: "360 Video Booth", shortTitle: "360 Video", category: "Video", description: "Dynamic orbiting video clips with event-ready effects and branding.", image: photos.blue, featured: true },
  { slug: "glambot-experience", title: "Glambot / Robotic Camera Experience", shortTitle: "Glambot", category: "Video", description: "Cinematic, high-speed camera moves for red-carpet-level slow motion.", image: photos.robotic, featured: true },
  { slug: "reel-booth", title: "Reel Booth", shortTitle: "Reel Booth", category: "Video", description: "Social-first vertical content captured and styled live at your event.", image: photos.stage, featured: true },
  { slug: "ai-photo-booth", title: "AI Photo Booth", shortTitle: "AI Photo Booth", category: "AI", description: "Turn portraits into imaginative branded worlds using generative AI.", image: photos.tech, featured: true },
  { slug: "ai-face-swap-experience", title: "AI Face Swap Experience", shortTitle: "AI Face Swap", category: "AI", description: "Playful, themed transformations created for shareable guest moments.", image: photos.camera },
  { slug: "green-screen-photo-booth", title: "Green Screen Photo Booth", shortTitle: "Green Screen", category: "Immersive", description: "Transport guests into any scene with tailored digital environments.", image: photos.stage },
  { slug: "anti-gravity-photo-booth", title: "Anti Gravity Photo Booth", shortTitle: "Anti Gravity", category: "Immersive", description: "A perspective-bending set that creates impossible-looking portraits.", image: photos.light },
  { slug: "scribble-video-booth", title: "Scribble Video Booth", shortTitle: "Scribble Video", category: "Video", description: "Hand-drawn animated accents transform short clips into lively content.", image: photos.robotic },
];

export const featured = experiences.filter((item) => item.featured);

export const portfolioItems = [
  { title: "Corporate Gala Atmosphere", category: "Corporate", image: photos.gala },
  { title: "Immersive Brand Moment", category: "Brand Activations", image: photos.blue },
  { title: "Ceremonial Event Setting", category: "Government", image: photos.light },
  { title: "Conference Technology Floor", category: "Exhibitions", image: photos.tech },
  { title: "Luxury Hospitality Evening", category: "Luxury & Hospitality", image: photos.camera },
  { title: "Private Celebration", category: "Private Events", image: photos.stage },
];

export const occasions = [
  ["Corporate Events", "Polished guest experiences designed to complement professional gatherings.", photos.gala],
  ["Brand Activations", "Interactive moments that put the brand naturally inside the experience.", photos.blue],
  ["Exhibitions & Conferences", "High-throughput, engaging installations for busy event environments.", photos.tech],
  ["Luxury Hotels", "Elegant technology that sits comfortably in elevated hospitality settings.", photos.camera],
  ["Mall Activations", "Visually magnetic experiences created to invite and engage passing audiences.", photos.stage],
  ["Weddings & Private Celebrations", "Personalized keepsakes and joyful moments for meaningful occasions.", photos.wedding],
] as const;

export const faq = [
  ["Where does ECHO TECH EVENTS operate?", "ECHO is based in Dubai and creates event experiences across Dubai and the UAE. Availability for a specific date and location is confirmed during quotation."],
  ["Can the experience be customized for our brand?", "Yes. Depending on the selected experience, customization can include visual overlays, print layouts, digital backgrounds, physical styling and guest-facing screens."],
  ["How far in advance should we enquire?", "Early enquiries are recommended, especially for peak event dates. Share your date and preferred experience and the team can confirm availability."],
  ["Does ECHO handle setup and on-site operation?", "ECHO plans the equipment setup and event execution requirements with you. The exact staffing and support scope is outlined in the quotation."],
  ["What information is needed for a quotation?", "Event date, location, event type, estimated operating hours, preferred experience and any branding or customization requirements are the best starting point."],
] as const;
