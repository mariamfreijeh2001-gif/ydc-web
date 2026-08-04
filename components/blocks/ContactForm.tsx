'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icon';
import { contact } from '@/content/site';
import styles from './ContactForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Read the fields straight off the form element.
 *
 * The WhatsApp handoff needs the same values the e-mail path posts, and reading them
 * from the DOM on demand keeps the inputs uncontrolled — no state per keystroke.
 */
function readFields(form: HTMLFormElement) {
  const data = new FormData(form);
  return {
    name: String(data.get('name') ?? '').trim(),
    email: String(data.get('email') ?? '').trim(),
    message: String(data.get('message') ?? '').trim(),
    website: String(data.get('website') ?? ''),
  };
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const form = e.currentTarget;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(readFields(form)),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? 'Something went wrong.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  /**
   * Hand the same enquiry to WhatsApp instead of e-mail.
   *
   * No API, no key, no Meta account: it opens the visitor's own WhatsApp with the
   * message already written, and they press send. That last step is the catch — if they
   * don't press it, nothing reaches the clinic — so it sits beside the e-mail button
   * rather than replacing it. What it buys is a thread in the channel the clinic
   * actually answers, and the patient's phone number with it, which an e-mail form can
   * never capture.
   */
  function onWhatsApp(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form;
    if (!form) return;

    // Let the browser raise its own "required field" prompts rather than inventing ours.
    if (!form.reportValidity()) return;

    const { name, email, message } = readFields(form);
    const lines = [
      "Hello, I'd like to ask about treatment.",
      '',
      `Name: ${name}`,
      `E-mail: ${email}`,
      '',
      message,
    ];

    window.open(
      `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(lines.join('\n'))}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" />
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-email">E-mail</label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">Your Message</label>
        <textarea id="contact-message" name="message" rows={6} required />
      </div>

      {/* Honeypot — bots fill it, humans never see it. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="accent" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </Button>

        <button type="button" className={styles.whatsapp} onClick={onWhatsApp}>
          <WhatsAppIcon width={17} height={17} />
          Send on WhatsApp
        </button>
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {status === 'sent' ? 'Thank you — we’ll get back to you shortly.' : null}
        {status === 'error' ? <span className={styles.error}>{error}</span> : null}
      </p>
    </form>
  );
}
