/**
 * Freeze the page behind an overlay.
 *
 * `overflow: hidden` on the body is enough on desktop but iOS Safari ignores it and
 * keeps scrolling the page behind the drawer. Pinning the body with `position: fixed`
 * does hold — at the cost of losing the scroll position, since a fixed body starts at
 * zero — so the offset is stashed and reapplied on release.
 *
 * Reference-counted: the drawer and the lightbox can both be open (open the menu, tap a
 * photo), and whichever closes second must not release the lock early.
 */

let depth = 0;
let savedY = 0;

export function lockScroll() {
  if (depth++ > 0) return;

  savedY = window.scrollY;
  const body = document.body;
  body.style.position = 'fixed';
  body.style.top = `-${savedY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  body.style.overflow = 'hidden';
}

export function unlockScroll() {
  if (depth === 0) return;
  if (--depth > 0) return;

  const body = document.body;
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  body.style.overflow = '';
  // Restore instantly — a smooth scroll here reads as the page jumping on close.
  window.scrollTo({ top: savedY, behavior: 'instant' as ScrollBehavior });
}
