/* eslint-disable */
/* global WebImporter */

/**
 * Parser for about-company
 * Base block: about (hero pattern)
 * Source: https://www.beckman.com/
 * Selector: #about
 *
 * About section with background image and floating overlay content card
 * with accent border. Based on hero pattern.
 *
 * Structure (hero pattern):
 *   Row 1: background image
 *   Row 2: eyebrow, heading, description, CTA
 *
 * Validated selectors from source HTML:
 *   - Background image: img.absolute (or img[class*="absolute"])
 *   - Eyebrow: p.text-brand-primary (first p with brand-primary text)
 *   - Heading: h2
 *   - Description: p.text-brand-gray-600
 *   - CTA: a.bg-brand-primary (or a[href])
 */
export default function parse(element, { document }) {
  // Extract background image
  const bgImage = element.querySelector('img.absolute, img[class*="object-cover"]');

  // Extract eyebrow text (small brand-primary colored text)
  const eyebrow = element.querySelector('p.text-brand-primary, p[class*="text-brand-primary"]');

  // Extract heading
  const heading = element.querySelector('h2, h1, h3');

  // Extract description paragraph (distinct from eyebrow)
  const description = element.querySelector('p.text-brand-gray-600, p[class*="gray-600"]');

  // Extract CTA link
  const cta = element.querySelector('a.bg-brand-primary, a[class*="rounded-full"], a[href]');

  // Build cells following hero pattern:
  // Row 1: background image
  // Row 2: content (eyebrow + heading + description + CTA)
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell with eyebrow, heading, description, and CTA
  const contentCell = [];
  if (eyebrow) contentCell.push(eyebrow);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'about-company', cells });
  element.replaceWith(block);
}
