/* eslint-disable */
/* global WebImporter */

/**
 * Parser: topics-nav
 * Base block: cards
 * Source: https://www.beckman.com/
 * Selector: #topics .grid
 * Description: Flat list of topic links displayed in a card grid. Each source
 *   anchor becomes one row containing a single link element.
 * Generated: 2026-05-15
 * Validated: offline via JSDOM against cached source.html
 */
export default function parse(element, { document }) {
  // Each child <a> in the grid is a topic link card.
  // Source structure: div.grid > a[title][href] > div (label) + div (arrow)
  const topicLinks = element.querySelectorAll(':scope > a');

  const cells = [];

  topicLinks.forEach((link) => {
    // Extract the text from the first child div (the label text)
    const labelDiv = link.querySelector('div');
    const linkText = labelDiv
      ? labelDiv.textContent.trim()
      : link.getAttribute('title') || link.textContent.trim();
    const href = link.getAttribute('href') || '';

    // Create a proper anchor element for the cell
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.textContent = linkText;

    // Each topic link becomes one row with one cell containing the anchor
    cells.push([anchor]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'topics-nav', cells });
  element.replaceWith(block);
}
