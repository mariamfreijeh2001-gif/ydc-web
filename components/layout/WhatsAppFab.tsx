import { contact } from '@/content/site';
import { WhatsAppIcon } from '@/components/ui/Icon';
import styles from './WhatsAppFab.module.css';

/** Green "How can I help you?" pill, fixed bottom-right on every page. */
export function WhatsAppFab() {
  return (
    <a
      href={contact.whatsappHref}
      className={styles.fab}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with us on WhatsApp — ${contact.whatsappLabel}`}
    >
      <span className={styles.icon}>
        <WhatsAppIcon width={20} height={20} />
      </span>
      <span className={styles.label}>{contact.whatsappLabel}</span>
    </a>
  );
}
