export type ClientVideo = { src: string; poster: string; width: number; height: number; title: string };
export type ClientImage = { src: string; width: number; height: number; title: string };

export type ClientWorkSet = {
  title: string;
  category: string;
  description: string;
  videos: ClientVideo[];
  images: ClientImage[];
  /** Label above the still images (default "Guest-facing screens"). */
  imagesLabel?: string;
  /** Right-edge chapter rail label (default "Selected work"). */
  chapter?: string;
};

export const scribbleBooth: ClientWorkSet = {
  title: "Scribble Booth",
  category: "Video",
  description: "Hand-drawn animated accents bring guest clips to life. Real footage and guest-facing screens from a delivered event.",
  videos: [
    { src: "/scribble-video-1.mp4", poster: "/scribble-video-1-poster.jpg", width: 720, height: 1280, title: "Scribble Booth reel 1" },
    { src: "/scribble-video-2.mp4", poster: "/scribble-video-2-poster.jpg", width: 720, height: 1280, title: "Scribble Booth reel 2" },
    { src: "/scribble-video-3.mp4", poster: "/scribble-video-3-poster.jpg", width: 720, height: 1280, title: "Scribble Booth reel 3" },
  ],
  images: [
    { src: "/scribble-shot-1.jpg", width: 1055, height: 1703, title: "Scribble Booth screen 1" },
    { src: "/scribble-shot-2.jpg", width: 1170, height: 2050, title: "Scribble Booth screen 2" },
    { src: "/scribble-shot-3.jpg", width: 1170, height: 2055, title: "Scribble Booth screen 3" },
    { src: "/scribble-shot-4.jpg", width: 1170, height: 1553, title: "Scribble Booth screen 4" },
    { src: "/scribble-shot-5.jpg", width: 1170, height: 1462, title: "Scribble Booth screen 5" },
    { src: "/scribble-shot-6.webp", width: 640, height: 1137, title: "Scribble Booth screen 6" },
  ],
};

export const magicMirror: ClientWorkSet = {
  title: "Magic Mirror",
  category: "Photo",
  description: "A full-length interactive mirror with guided captures and branded overlays. Real footage from delivered events.",
  chapter: "Selected work",
  imagesLabel: "On the floor",
  videos: Array.from({ length: 10 }, (_, i) => ({
    src: `/magic-mirror/magic-mirror-${i + 1}.mp4`,
    poster: `/magic-mirror/magic-mirror-${i + 1}-poster.jpg`,
    width: i === 8 ? 726 : 720,
    height: 1280,
    title: `Magic Mirror reel ${i + 1}`,
  })),
  images: [{ src: "/magic-mirror/magic-mirror-shot-1.webp", width: 1280, height: 1706, title: "Magic Mirror at a delivered event" }],
};

/** Portfolio sections show the first 2 videos + first photo; the rest appears in "More footage" below them. */
export const PREVIEW_VIDEOS = 2;
export const PREVIEW_IMAGES = 1;
export const portfolioPreview = (w: ClientWorkSet): ClientWorkSet => ({
  ...w,
  videos: w.videos.slice(0, PREVIEW_VIDEOS),
  images: w.images.slice(0, PREVIEW_IMAGES),
});

/**
 * Experiences that have real footage, keyed by experience slug. This is the single source of truth:
 * the home rail, the booth pages and the Portfolio category row all read from it. To add a booth,
 * add its clips as a ClientWorkSet above and one line here.
 */
export const workBySlug: Record<string, ClientWorkSet> = {
  "magic-mirror-selfie-booth": magicMirror,
  "scribble-video-booth": scribbleBooth,
};
