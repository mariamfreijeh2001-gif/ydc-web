'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import styles from './ContactForm.module.css';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

      <Button type="submit" variant="accent" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </Button>

      <p className={styles.status} role="status" aria-live="polite">
        {status === 'sent' ? 'Thank you — we’ll get back to you shortly.' : null}
        {status === 'error' ? <span className={styles.error}>{error}</span> : null}
      </p>
    </form>
  );
}
