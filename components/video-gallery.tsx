"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { ClientVideo } from "@/lib/client-work";

/** Grid of every clip for one booth. Clips play muted while on screen; tap one to hear it. */
export function VideoGallery({ videos }: { videos: ClientVideo[] }) {
  const [sound, setSound] = useState<number | null>(null);
  return (
    <div className="video-grid">
      {videos.map((video, i) => (
        <GalleryTile key={video.src} video={video} soundOn={sound === i} onToggle={() => setSound((s) => (s === i ? null : i))} />
      ))}
    </div>
  );
}

function GalleryTile({ video, soundOn, onToggle }: { video: ClientVideo; soundOn: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
    if (prefersReduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = !soundOn;
    if (soundOn) el.play().catch(() => {});
  }, [soundOn]);

  return (
    <figure className="client-tile video-tile">
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduced}
        aria-label={video.title}
      />
      {!reduced && (
        <button type="button" className="video-sound" onClick={onToggle} aria-pressed={soundOn} aria-label={soundOn ? `Mute ${video.title}` : `Play ${video.title} with sound`}>
          <span>{soundOn ? <Volume2 /> : <VolumeX />}</span>
        </button>
      )}
    </figure>
  );
}
