/* eslint-disable */
/* global WebImporter */

/**
 * Parser for insight-cards
 * Base block: cards
 * Source: https://www.beckman.com/
 * Selector: #latest .grid
 * Generated: 2026-05-15
 *
 * Source structure: A grid div containing multiple <a class="group"> elements.
 * Each <a> wraps: an image container div, a category <p>, and a description <p>.
 * Target structure: One row per card. Cell 1 = image. Cell 2 = category + description + link.
 */
export default function parse(element, { document }) {
  // Each card is a direct child <a> with class "group"
  const cardLinks = element.querySelectorAll(':scope > a.group, :scope > a');
  const cells = [];

  cardLinks.forEach((cardLink) => {
    // Extract the image from the card
    const img = cardLink.querySelector('img');

    // Extract the category label (first <p> with brand-primary text color class)
    const categoryP = cardLink.querySelector('p.text-brand-primary, p[class*="text-14"]');

    // Extract the description paragraph (second <p>, the one with the description span)
    const allParagraphs = cardLink.querySelectorAll(':scope > p');
    let descriptionP = null;
    if (allParagraphs.length >= 2) {
      descriptionP = allParagraphs[1];
    } else if (allParagraphs.length === 1 && !categoryP) {
      descriptionP = allParagraphs[0];
    }

    // Build image cell
    const imageCell = document.createElement('div');
    if (img) {
      const picture = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      newImg.loading = 'lazy';
      picture.appendChild(newImg);
      imageCell.appendChild(picture);
    }

    // Build text cell with category, description, and link
    const textCell = document.createElement('div');

    if (categoryP) {
      const catP = document.createElement('p');
      catP.textContent = categoryP.textContent.trim();
      textCell.appendChild(catP);
    }

    // Create description with the card link
    const descP = document.createElement('p');
    const link = document.createElement('a');
    link.href = cardLink.href;
    if (cardLink.target === '_blank') {
      link.target = '_blank';
    }
    // Use description text if available, otherwise use category text as fallback
    if (descriptionP) {
      const descSpan = descriptionP.querySelector('span');
      link.textContent = descSpan ? descSpan.textContent.trim() : descriptionP.textContent.trim();
    } else {
      link.textContent = categoryP ? categoryP.textContent.trim() : cardLink.textContent.trim();
    }
    descP.appendChild(link);
    textCell.appendChild(descP);

    // Each card is one row with two cells: [image, text content]
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'insight-cards', cells });
  element.replaceWith(block);
}
