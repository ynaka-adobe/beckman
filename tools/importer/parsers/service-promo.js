/* eslint-disable */
/* global WebImporter */

/**
 * Parser for service-promo
 * Base block: columns
 * Source: https://www.beckman.com/
 * Selector: #service > div
 * Generated: 2026-05-15
 *
 * Structure (3 rows):
 *   Row 1: Intro content — eyebrow, heading, description, CTA link
 *   Row 2: Card 1, Card 2 (each with heading, description, link)
 *   Row 3: Card 3, Card 4 (each with heading, description, link)
 */
export default function parse(element, { document }) {
  // --- Row 1: Intro column ---
  // Left column contains: eyebrow <p>, <h2>, description <p>, <a> CTA
  const introCol = element.querySelector(':scope > .lg\\:w-5\\/12, :scope > div:first-child');

  const eyebrow = introCol ? introCol.querySelector(':scope > p.text-sm, :scope > p:first-child') : null;
  const heading = introCol ? introCol.querySelector('h2') : null;
  const description = introCol ? introCol.querySelector(':scope > p.leading-relaxed, :scope > p:nth-child(3)') : null;
  const ctaLink = introCol ? introCol.querySelector(':scope > a') : null;

  const introCell = [];
  if (eyebrow) introCell.push(eyebrow);
  if (heading) introCell.push(heading);
  if (description) introCell.push(description);
  if (ctaLink) {
    // Clean up the arrow span inside CTA, keep just the text
    const arrowSpan = ctaLink.querySelector('span');
    if (arrowSpan) {
      ctaLink.textContent = ctaLink.textContent.replace('->', '').trim();
    }
    const ctaParagraph = document.createElement('p');
    ctaParagraph.appendChild(ctaLink);
    introCell.push(ctaParagraph);
  }

  // --- Cards grid ---
  // Right column: 2x2 grid of <a> cards
  const cardsGrid = element.querySelector(':scope > .grid, :scope > div:nth-child(2)');
  const cardLinks = cardsGrid ? Array.from(cardsGrid.querySelectorAll(':scope > a')) : [];

  /**
   * Build a card cell from a source <a> element.
   * Each card contains: h3 (title), p (description), and the <a> wraps everything.
   * Output cell: [heading, description, link paragraph]
   */
  function buildCardCell(cardAnchor) {
    const cellContent = [];

    const cardHeading = cardAnchor.querySelector('h3');
    const cardDesc = cardAnchor.querySelector('p.text-14, p.leading-relaxed, p:not(:empty)');

    // Create a heading element for the card
    if (cardHeading) {
      const h3 = document.createElement('h3');
      h3.textContent = cardHeading.textContent.trim();
      cellContent.push(h3);
    }

    // Add description
    if (cardDesc) {
      const p = document.createElement('p');
      p.textContent = cardDesc.textContent.trim();
      cellContent.push(p);
    }

    // Add link as a paragraph with anchor
    const linkP = document.createElement('p');
    const link = document.createElement('a');
    link.href = cardAnchor.href;
    link.textContent = cardHeading ? cardHeading.textContent.trim() : 'Learn more';
    linkP.appendChild(link);
    cellContent.push(linkP);

    return cellContent;
  }

  // Build card cells (up to 4 cards, arranged in 2 rows of 2)
  const card1 = cardLinks[0] ? buildCardCell(cardLinks[0]) : [];
  const card2 = cardLinks[1] ? buildCardCell(cardLinks[1]) : [];
  const card3 = cardLinks[2] ? buildCardCell(cardLinks[2]) : [];
  const card4 = cardLinks[3] ? buildCardCell(cardLinks[3]) : [];

  // --- Assemble cells ---
  // Row 1: intro content (single cell spanning full width)
  // Row 2: card 1 | card 2
  // Row 3: card 3 | card 4
  const cells = [
    introCell,
  ];

  // Only add card rows if cards exist
  if (card1.length || card2.length) {
    cells.push([card1, card2]);
  }
  if (card3.length || card4.length) {
    cells.push([card3, card4]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'service-promo', cells });
  element.replaceWith(block);
}
