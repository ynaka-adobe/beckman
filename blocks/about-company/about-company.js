export default async function decorate(block) {
  // Block structure after EDS decoration (single row, two cells):
  //   .about-company.block
  //     div (row)
  //       div (cell 0): background image (<p><picture><img></picture></p> or <p><img></p>)
  //       div (cell 1): eyebrow <p>, <h2>, description <p>, CTA <p.button-container>
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  const imgCell = cells[0];
  const textCell = cells[1];

  // --- background image ---
  if (imgCell) {
    imgCell.classList.add('about-company-bg');
    block.prepend(imgCell);
  }

  // --- content card ---
  if (textCell) {
    textCell.classList.add('about-company-card');
    block.appendChild(textCell);
  }

  // Remove the now-empty row wrapper
  if (row.parentNode) {
    row.remove();
  }
}
