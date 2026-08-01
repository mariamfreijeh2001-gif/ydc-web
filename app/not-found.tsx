import type { Metadata } from 'next';

import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className={styles.wrap}>
          <p className={styles.code}>404</p>
          <h1 className={styles.title}>We couldn’t find that page</h1>
          <p className={styles.text}>
            The page you’re looking for may have moved. Try our services, or get in touch and we’ll
            point you in the right direction.
          </p>
          <div className={styles.actions}>
            <Button href="/">Back to home</Button>
            <Button href="/services/" variant="outline">
              Browse services
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
