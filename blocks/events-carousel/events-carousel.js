export default async function decorate(block) {
  const rows = [...block.children];

  // First row is the header (heading + "See all events" link)
  // Remaining rows are event cards
  const headerRow = rows[0];
  const cardRows = rows.slice(1);

  // Create a scrollable cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-row';

  cardRows.forEach((row) => {
    const cells = [...row.children];
    // Cell 0: image, Cell 1: text content (badge, date, title with link)
    const imageCell = cells[0];
    const textCell = cells[1];

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
    if (img) {
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

    // Date
    if (date) {
      const dateDiv = document.createElement('div');
      dateDiv.className = 'card-date';
      dateDiv.innerHTML = `<span>📅</span><span>${date}</span>`;
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
