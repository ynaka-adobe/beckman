export default async function decorate(block) {
  // Each card link gets an arrow indicator appended
  const cardCells = block.querySelectorAll(':scope > div:not(:first-child) > div');
  cardCells.forEach((cell) => {
    const link = cell.querySelector('a');
    if (link) {
      // Wrap entire cell in a clickable link
      const arrow = document.createElement('span');
      arrow.className = 'promo-banner-arrow';
      arrow.textContent = '→';
      cell.appendChild(arrow);

      // Make entire card clickable
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          link.click();
        }
      });
    }
  });
}
