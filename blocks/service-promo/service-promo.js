export default async function decorate(block) {
  // The block has 3 rows:
  // Row 1: intro content (eyebrow, heading, description, CTA)
  // Row 2: cards row 1 (2 cards)
  // Row 3: cards row 2 (2 cards)

  // Make each card cell a clickable link
  const cardRows = [...block.children].slice(1);
  cardRows.forEach((row) => {
    [...row.children].forEach((cell) => {
      const link = cell.querySelector('a');
      if (link) {
        const href = link.href;
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', (e) => {
          if (!e.target.closest('a')) {
            window.location.href = href;
          }
        });
      }
    });
  });
}
