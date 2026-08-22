import React from "react";
import { Feather } from "lucide-react";

export default function Hero() {
  return (
    <header className="relative overflow-hidden text-center px-6 pt-20 pb-14">
      <div className="absolute inset-0 -z-10 opacity-60">
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[hsl(28_70%_70%)] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[hsl(18_70%_65%)] blur-3xl" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-4 py-1.5 mb-7 shadow-sm">
        <Feather className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium tracking-wide text-foreground/80">
          LegacyVoice
        </span>
      </div>

      <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] text-balance text-foreground">
        Preserve your words
        <span className="block italic text-primary">forever.</span>
      </h1>

      <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground text-balance">
        Turn a cherished memory into a heartfelt letter — beautifully kept, ready
        to be heard, and yours to carry forward.
      </p>
    </header>
  );
}
