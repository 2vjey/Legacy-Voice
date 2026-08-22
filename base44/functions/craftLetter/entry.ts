import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const memory = (body?.memory || '').trim();
    const recipient = (body?.recipient || '').trim();

    if (!memory) {
      return Response.json({ error: 'A memory is required.' }, { status: 400 });
    }
    if (memory.length > 4000) {
      return Response.json({ error: 'Memory is too long (max 4000 characters).' }, { status: 400 });
    }

    const salutation = recipient ? `Dear ${recipient},` : 'Dear friend,';

    const prompt = `You are a gifted, empathetic writer who helps people preserve their most cherished memories as heartfelt letters.

Transform the following personal memory into a beautifully written, heartfelt letter. Follow this structure:
1. A warm, loving opening line right after the salutation that sets a tender tone.
2. An emotional body that expands on the memory with sensory, intimate detail — keep it genuine and never overly flowery. Preserve the speaker's voice and the real people, places, and feelings they mentioned. Do not invent new facts, names, or events that are not in the memory.
3. A brief, loving closing line that ends the letter naturally. Do NOT add a sign-off such as "With love" or a sender name — those are shown separately.

Rules:
- Begin with the exact salutation: "${salutation}"
- Write in the first person, as if the author is speaking directly to the recipient.
- Keep it warm, sincere, and human — not cliché or saccharine.
- Length: 2 to 4 short paragraphs. No bullet points, no headings, no markdown.
- Return only the letter text itself, nothing else.

Personal memory to transform:
"""
${memory}
"""`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
    });

    return Response.json({ letter: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
