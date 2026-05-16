export default async function decorate(block) {
  const rows = [...block.children];

  // First row is the header (heading + "See all events" link)
  // Remaining rows are event cards
  const cardRows = rows.slice(1);

  // The "See all events" link already contains arrow text from content
  // No need to add additional arrow

  // Create a scrollable cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-row';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    // Cell 0: image, Cell 1: text content (badge, date, title with link)
    const imageCell = cells[0];
    const textCell = cells[1];

    const picture = imageCell?.querySelector('picture');
    const img = imageCell?.querySelector('img');
    const paragraphs = textCell ? [...textCell.querySelectorAll('p')] : [];

    // Extract data from text cell
    const badge = paragraphs[0]?.textContent.trim() || '';
    const date = paragraphs[1]?.textContent.trim() || '';
    const titleP = paragraphs[2];
    const link = titleP?.querySelector('a');
    const title = link?.textContent.trim() || titleP?.textContent.trim() || '';
    const href = link?.href || '#';

    // Build card as a link
    const card = document.createElement('a');
    card.className = 'event-card';
    card.href = href;

    // Image container with badge overlay
    const imageDiv = document.createElement('div');
    imageDiv.className = 'card-image';
    if (picture) {
      imageDiv.appendChild(picture);
    } else if (img) {
      img.loading = 'lazy';
      imageDiv.appendChild(img);
    }

    if (badge) {
      const badgeEl = document.createElement('span');
      badgeEl.className = 'badge';
      badgeEl.textContent = badge;
      imageDiv.appendChild(badgeEl);
    }

    card.appendChild(imageDiv);

    // Date with calendar SVG icon
    if (date) {
      const dateDiv = document.createElement('div');
      dateDiv.className = 'card-date';
      const calendarSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
      dateDiv.innerHTML = `<span class="calendar-icon">${calendarSvg}</span><span>${date}</span>`;
      card.appendChild(dateDiv);
    }

    // Title
    if (title) {
      const titleDiv = document.createElement('p');
      titleDiv.className = 'card-title';
      titleDiv.textContent = title;
      card.appendChild(titleDiv);
    }

    cardsContainer.appendChild(card);
    row.remove();
  });

  block.appendChild(cardsContainer);
}
