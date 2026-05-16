export default async function decorate(block) {
  // Each row (direct child div) has one cell containing a link.
  // Restructure into a flat grid of tile cards.
  const rows = [...block.children];
  block.innerHTML = '';

  rows.forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;

    const tile = document.createElement('a');
    tile.href = link.href;
    tile.className = 'topics-nav-tile';
    tile.textContent = link.textContent;

    // Add arrow indicator
    const arrow = document.createElement('span');
    arrow.className = 'topics-nav-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    tile.append(arrow);

    block.append(tile);
  });
}
