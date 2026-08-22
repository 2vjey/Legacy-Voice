import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const body = await req.json();
    const text = (body?.text || '').trim();

    if (!text) {
      return Response.json({ error: 'Text is required.' }, { status: 400 });
    }
    if (text.length > 5000) {
      return Response.json({ error: 'Text is too long (max 5000 characters).' }, { status: 400 });
    }

    const apiKey = secrets.get('ELEVENLABS_API_KEY');
    const voiceId = secrets.get('VOICE_ID');
    if (!apiKey || !voiceId) {
      return Response.json({ error: 'ElevenLabs is not configured.' }, { status: 500 });
    }

    const apiResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
          },
        }),
      }
    );

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      return Response.json(
        { error: `ElevenLabs error: ${apiResponse.status} ${errText}` },
        { status: 502 }
      );
    }

    const audioBuffer = await apiResponse.arrayBuffer();
    const bytes = new Uint8Array(audioBuffer);
    let binary = '';
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
    const dataUrl = `data:audio/mpeg;base64,${base64}`;

    return Response.json({ audioUrl: dataUrl });
  } catch (error) {
    console.error('[synthesizeSpeech] failed:', error?.message || error, error?.stack || '');
    return Response.json({ error: error.message }, { status: 500 });
  }
}
