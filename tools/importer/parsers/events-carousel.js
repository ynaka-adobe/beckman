/* eslint-disable */
/* global WebImporter */

/**
 * Parser: events-carousel
 * Base block: carousel
 * Source: https://www.beckman.com/
 * Selector: #events
 * Generated: 2026-05-15
 * Validation: Live validation could not complete (network timeout to beckman.com); manually verified against source.html
 *
 * Structure (from block decoration):
 *   Row 0 (header): heading + "See all events" CTA link
 *   Rows 1..N (event cards): [image] | [badge paragraph, date paragraph, title-link paragraph]
 *
 * Source DOM validated selectors:
 *   - h2 (section heading "Upcoming events")
 *   - a[href="/events"] (see-all CTA link)
 *   - .swiper-wrapper > a (event card links with swiper-slide class)
 *   - img (card thumbnail image)
 *   - .gradient-primary (badge overlay containing event type)
 *   - p.flex span (date text span)
 *   - p:last-of-type span (event title text)
 */
export default function parse(element, { document }) {
  // === HEADER ROW ===
  // Source: h2 "Upcoming events" + a[href="/events"] "See all events"
  const heading = element.querySelector('h2');
  const seeAllLink = element.querySelector(':scope a[href="/events"], :scope a[href$="/events"]');

  const headerCell = [];
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    headerCell.push(h2);
  }
  if (seeAllLink) {
    const link = document.createElement('a');
    link.href = seeAllLink.href;
    link.textContent = 'See all events';
    headerCell.push(link);
  }

  const cells = [];
  cells.push(headerCell);

  // === EVENT CARD ROWS ===
  // Source: .swiper-wrapper > a.swiper-slide (each event card is a link element)
  const eventCards = element.querySelectorAll('.swiper-wrapper > a');

  eventCards.forEach((card) => {
    // Image: first img inside the card (event thumbnail)
    const img = card.querySelector('img');

    // Badge: text inside .gradient-primary overlay (e.g., "Tradeshow", "Webinar")
    const badgeContainer = card.querySelector('.gradient-primary');
    let badgeText = '';
    if (badgeContainer) {
      // The badge text is in a div with class ml-1 inside the gradient-primary container
      const badgeTextEl = badgeContainer.querySelector('[class*="ml-1"]');
      badgeText = badgeTextEl ? badgeTextEl.textContent.trim() : badgeContainer.textContent.trim();
    }

    // Date: the first <p> after the image container contains a date span
    // Source structure: <p class="flex ... text-sm ..."><svg>...</svg><span class="ml-0.5">May 11 - 15, 2026</span></p>
    const allParagraphs = Array.from(card.querySelectorAll(':scope > p'));
    const dateP = allParagraphs.find((p) => p.querySelector('svg') && p.querySelector('span'));
    const dateSpan = dateP ? dateP.querySelector('span') : null;
    const dateText = dateSpan ? dateSpan.textContent.trim() : '';

    // Title: the last <p> holds the event name in a nested span
    // Source structure: <p class="group-hover:text-brand-primary"><span>ASGCT Annual Meeting</span></p>
    const titleP = allParagraphs.length > 0 ? allParagraphs[allParagraphs.length - 1] : null;
    let titleText = '';
    if (titleP && titleP !== dateP) {
      const titleSpan = titleP.querySelector('span');
      titleText = titleSpan ? titleSpan.textContent.trim() : titleP.textContent.trim();
    }

    // Build image cell
    const imageCell = [];
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      imageCell.push(imgEl);
    }

    // Build text cell: badge paragraph, date paragraph, title-as-link paragraph
    // This matches the block decoration expectation: paragraphs[0]=badge, [1]=date, [2]=title with link
    const textCell = [];

    if (badgeText) {
      const badgeP = document.createElement('p');
      badgeP.textContent = badgeText;
      textCell.push(badgeP);
    }

    if (dateText) {
      const dateEl = document.createElement('p');
      dateEl.textContent = dateText;
      textCell.push(dateEl);
    }

    if (titleText) {
      const titleLink = document.createElement('a');
      titleLink.href = card.href || '#';
      titleLink.textContent = titleText;
      const titlePar = document.createElement('p');
      titlePar.appendChild(titleLink);
      textCell.push(titlePar);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'events-carousel', cells });
  element.replaceWith(block);
}
