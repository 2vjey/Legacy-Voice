import React from "react";
import { Download, Pencil } from "lucide-react";
import AudioPlayer from "./AudioPlayer";

export default function LetterView({ recipient, author, text, onDownload, onEdit }) {
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="relative animate-[fadeIn_0.7s_ease-out]">
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>

      <div className="relative mx-auto max-w-2xl">
        {/* paper */}
        <div className="rounded-[2rem] bg-card shadow-[0_20px_60px_-20px_rgba(120,60,20,0.35)] border border-border/60 overflow-hidden">
          <div className="px-8 sm:px-14 py-12 sm:py-16">
            <p className="font-serif-letter text-base text-muted-foreground italic">
              {today}
            </p>

            <p className="mt-8 font-serif-letter text-2xl sm:text-3xl leading-relaxed text-foreground text-balance whitespace-pre-line">
              {text}
            </p>

            <div className="mt-12 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="font-serif-letter italic text-muted-foreground">
                with love
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            {author?.trim() && (
              <p className="mt-3 text-right font-serif-letter text-xl text-foreground">
                {author.trim()}
              </p>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <AudioPlayer text={text} />
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:brightness-105 active:scale-[0.98] transition"
          >
            <Download className="w-4 h-4" /> Download letter
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>
    </article>
  );
}
