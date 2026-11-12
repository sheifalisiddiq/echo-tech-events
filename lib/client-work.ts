export type ClientVideo = { src: string; poster: string; width: number; height: number; title: string };
export type ClientImage = { src: string; width: number; height: number; title: string };

export const scribbleBooth = {
  title: "Scribble Booth",
  category: "Video",
  description: "Hand-drawn animated accents bring guest clips to life. Real footage and guest-facing screens from a delivered event.",
  videos: [
    { src: "/scribble-video-1.mp4", poster: "/scribble-video-1-poster.jpg", width: 720, height: 1280, title: "Scribble Booth reel 1" },
    { src: "/scribble-video-2.mp4", poster: "/scribble-video-2-poster.jpg", width: 720, height: 1280, title: "Scribble Booth reel 2" },
    { src: "/scribble-video-3.mp4", poster: "/scribble-video-3-poster.jpg", width: 720, height: 1280, title: "Scribble Booth reel 3" },
  ] satisfies ClientVideo[],
  images: [
    { src: "/scribble-shot-1.jpg", width: 1055, height: 1703, title: "Scribble Booth screen 1" },
    { src: "/scribble-shot-2.jpg", width: 1170, height: 2050, title: "Scribble Booth screen 2" },
    { src: "/scribble-shot-3.jpg", width: 1170, height: 2055, title: "Scribble Booth screen 3" },
    { src: "/scribble-shot-4.jpg", width: 1170, height: 1553, title: "Scribble Booth screen 4" },
    { src: "/scribble-shot-5.jpg", width: 1170, height: 1462, title: "Scribble Booth screen 5" },
    { src: "/scribble-shot-6.webp", width: 640, height: 1137, title: "Scribble Booth screen 6" },
  ] satisfies ClientImage[],
};
