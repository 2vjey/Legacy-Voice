import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function LetterComposer({ recipient, onRecipientChange, author, onAuthorChange, value, onChange, onSubmit, isCreating }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur shadow-sm p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="recipient"
            className="block font-heading text-xl text-foreground mb-3"
          >
            Address to
          </label>
          <input
            id="recipient"
            value={recipient}
            onChange={(e) => onRecipientChange(e.target.value)}
            placeholder="Mom, Grandpa, my future self…"
            className="w-full rounded-xl border border-input bg-background/70 px-4 py-3 font-serif-letter text-lg text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>
        <div>
          <label
            htmlFor="author"
            className="block font-heading text-xl text-foreground mb-3"
          >
            From <span className="text-sm font-body text-muted-foreground not-italic">(optional)</span>
          </label>
          <input
            id="author"
            value={author}
            onChange={(e) => onAuthorChange(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-input bg-background/70 px-4 py-3 font-serif-letter text-lg text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
          />
        </div>
      </div>
      <label
        htmlFor="memory"
        className="block font-heading text-xl text-foreground mb-3 mt-6"
      >
        Your memory
      </label>
      <textarea
        id="memory"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="Write a memory, a message to someone you love, or the story you never want to forget…"
        className="w-full resize-y rounded-xl border border-input bg-background/70 px-4 py-3.5 font-serif-letter text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
      />
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Take your time — every word matters.
        </p>
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isCreating}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-primary-foreground font-medium shadow-sm hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isCreating ? "Crafting your letter…" : "Create your letter"}
        </button>
      </div>
    </div>
  );
}
