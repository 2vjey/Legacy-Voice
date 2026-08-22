import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Upload, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AudioPlayer({ text }) {
  const audioRef = useRef(null);
  const fileRef = useRef(null);
  const [src, setSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const playAfterLoad = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  // When a new src is applied (synthesized or uploaded), auto-play only if
  // the user just requested it — without awaiting load events first.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (playAfterLoad.current) {
      playAfterLoad.current = false;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [src]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // First play: synthesize the letter's voice via ElevenLabs.
    if (!src) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await base44.functions.invoke("synthesizeSpeech", {
          text: text?.trim() || "",
        });
        const data = response.data || {};
        if (!data.audioUrl) throw new Error(data.error || "No audio returned.");
        setIsLoading(false);
        // Set src once via state; the [src] effect calls play() right after
        // React applies it — single load, no double assignment, no load-await.
        playAfterLoad.current = true;
        setSrc(data.audioUrl);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Could not generate voice.");
      }
      return;
    }

    audio.play();
    setIsPlaying(true);
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (src?.startsWith("blob:")) URL.revokeObjectURL(src);
    const url = URL.createObjectURL(file);
    setSrc(url);
    setIsPlaying(false);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <audio ref={audioRef} src={src ?? undefined} preload="metadata" />
        <button
          onClick={toggle}
          disabled={isLoading || !text?.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-5 py-2.5 text-sm font-medium hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating voice…
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-4 h-4" /> Pause voice
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Play voice
            </>
          )}
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition"
        >
          <Upload className="w-4 h-4" /> Your audio
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="audio/*"
          onChange={onUpload}
          className="hidden"
        />
      </div>
      {error && (
        <p className="text-xs text-destructive text-center max-w-xs">{error}</p>
      )}
    </div>
  );
}
