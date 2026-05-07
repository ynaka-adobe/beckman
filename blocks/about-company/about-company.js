export default async function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  const imgCell = cells[0]; // background image cell
  const textCell = cells[1]; // content card cell

  // Move image cell to be a direct child of block for full-section background
  const picture = imgCell.querySelector('picture');
  if (picture) {
    imgCell.classList.add('about-company-bg');
    block.prepend(imgCell);
  }

  // Add card class to text cell
  if (textCell) {
    textCell.classList.add('about-company-card');
    block.append(textCell);
  }

  // Remove the now-empty row
  row.remove();
}
