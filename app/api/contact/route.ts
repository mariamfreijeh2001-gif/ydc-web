import { NextResponse } from 'next/server';

import { contact } from '@/content/site';

export const runtime = 'nodejs';

type Payload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: a filled `website` field means a bot. Accept silently so it doesn't retry.
  if (body.website) return NextResponse.json({ ok: true });

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const message = body.message?.trim() ?? '';

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Please fill in every field.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid e-mail address.' }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: 'That message is a little too long.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  /*
   * No mail provider configured yet. Rather than pretend the message was delivered,
   * log it and tell the visitor to reach us directly — silently dropping an enquiry
   * from a prospective patient would be worse than an honest fallback.
   */
  if (!apiKey) {
    console.warn('[contact] RESEND_API_KEY is not set — enquiry not delivered:', {
      name,
      email,
      message,
    });
    return NextResponse.json(
      {
        error: `Our contact form isn't connected yet. Please email ${contact.email} or WhatsApp ${contact.whatsapp}.`,
      },
      { status: 503 },
    );
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? 'Younes Dental Website <website@younes.dental>',
      to: [process.env.CONTACT_TO ?? contact.email],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error('[contact] delivery failed:', res.status, await res.text());
    return NextResponse.json(
      { error: `We couldn't send that. Please email ${contact.email} instead.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
