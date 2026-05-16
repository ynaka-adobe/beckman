/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero variant.
 * Base block: hero
 * Source: https://www.beckman.com/
 * Selector: .relative.justify-end
 *
 * Source structure:
 *   div.relative.justify-end
 *     div > div.inset-0 > img (full-width background image)
 *     div.hero__body
 *       h1 > span > span.hero-heading-animate (heading text)
 *       p.hero-intro-animate (description paragraph)
 *
 * Target table: single row with two cells
 *   Cell 1: background image
 *   Cell 2: heading (h1) + paragraph
 */
export default function parse(element, { document }) {
  // Extract image - the hero background image
  const image = element.querySelector('img');

  // Extract heading - h1 contains nested spans with the actual heading text
  const heading = element.querySelector('h1');

  // Extract description paragraph with fallback selector
  const description = element.querySelector('p.hero-intro-animate')
    || element.querySelector('.hero__body p');

  // Build cells: single row with [imageCell, contentCell]
  const imageCell = [];
  if (image) {
    imageCell.push(image);
  }

  const contentCell = [];
  if (heading) {
    // Create a clean h1 to flatten the nested span structure
    const cleanHeading = document.createElement('h1');
    cleanHeading.textContent = heading.textContent.trim();
    contentCell.push(cleanHeading);
  }
  if (description) {
    contentCell.push(description);
  }

  const cells = [[imageCell, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
