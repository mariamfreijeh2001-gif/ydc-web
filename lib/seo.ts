/**
 * Trim body copy down to a search-result description.
 *
 * Slicing at a fixed character count left snippets ending mid-word — "Utilizing
 * cutting-edge 3", "Unlike traditional implants" — which is what Google would have
 * shown under the result. Prefer to end on a full sentence inside the useful range,
 * fall back to a word boundary, and only then add an ellipsis.
 */
export function metaDescription(text: string | undefined, fallback: string): string {
  const source = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!source) return fallback;
  if (source.length <= 160) return source;

  const window = source.slice(0, 160);

  // A sentence that ends late enough to still be a useful description.
  const sentenceEnd = Math.max(
    window.lastIndexOf('. '),
    window.lastIndexOf('? '),
    window.lastIndexOf('! '),
  );
  if (sentenceEnd >= 110) return window.slice(0, sentenceEnd + 1);

  const wordEnd = window.lastIndexOf(' ');
  return `${window.slice(0, wordEnd > 0 ? wordEnd : 157).replace(/[,;:—-]$/, '')}…`;
}
