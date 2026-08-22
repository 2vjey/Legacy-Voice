import React, { useState } from "react";
import { Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Hero from "@/components/legacy/Hero";
import LetterComposer from "@/components/legacy/LetterComposer";
import LetterView from "@/components/legacy/LetterView";

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [letter, setLetter] = useState("");
  const [letterRecipient, setLetterRecipient] = useState("");
  const [letterAuthor, setLetterAuthor] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!text.trim()) return;
    setIsCreating(true);
    try {
      const response = await base44.functions.invoke("craftLetter", {
        memory: text.trim(),
        recipient: recipient.trim(),
      });
      setLetter(response.data.letter);
      setLetterRecipient(recipient.trim());
      setLetterAuthor(author.trim());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setLetter(text.trim());
      setLetterRecipient(recipient.trim());
      setLetterAuthor(author.trim());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = () => {
    setLetter("");
  };

  const handleDownload = () => {
    import("jspdf").then(({ jsPDF }) => {
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 64;
      const maxW = pageWidth - margin * 2;

      const date = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      doc.setFont("times", "italic");
      doc.setFontSize(12);
      doc.setTextColor(120, 110, 100);
      doc.text(date, margin, margin);

      doc.setFont("times", "normal");
      doc.setFontSize(15);
      doc.setTextColor(40, 32, 26);
      const lines = doc.splitTextToSize(letter, maxW);
      doc.text(lines, margin, margin + 48);

      const y = margin + 48 + lines.length * 20 + 36;
      doc.setDrawColor(180, 160, 140);
      doc.line(margin, y, margin + 80, y);
      doc.setFont("times", "italic");
      doc.setFontSize(13);
      doc.setTextColor(120, 110, 100);
      doc.text("with love", margin + 96, y + 4);

      if (letterAuthor?.trim()) {
        doc.setFont("times", "normal");
        doc.setFontSize(15);
        doc.setTextColor(40, 32, 26);
        doc.text(letterAuthor.trim(), pageWidth - margin, y + 28, {
          align: "right",
        });
      }

      doc.save("LegacyVoice-letter.pdf");
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {letter ? (
        <div className="px-6 py-16 sm:py-20">
          <LetterView
            recipient={letterRecipient}
            author={letterAuthor}
            text={letter}
            onDownload={handleDownload}
            onEdit={handleEdit}
          />
        </div>
      ) : (
        <>
          <Hero />
          <main className="px-6 pb-24">
            <div className="mx-auto max-w-2xl">
              <LetterComposer
                recipient={recipient}
                onRecipientChange={setRecipient}
                author={author}
                onAuthorChange={setAuthor}
                value={text}
                onChange={setText}
                onSubmit={handleCreate}
                isCreating={isCreating}
              />
            </div>
          </main>
        </>
      )}

      <footer className="px-6 pb-10 text-center">
        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          Made with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> for
          the stories that matter
        </p>
      </footer>
    </div>
  );
}
