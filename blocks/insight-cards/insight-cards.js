export default async function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    // First cell is the image, second cell is the text content
    // Wrap the entire row in a link if there's an anchor in the text cell
    const textCell = cells[1];
    if (textCell) {
      const link = textCell.querySelector('a');
      if (link) {
        const href = link.href;
        const wrapper = document.createElement('a');
        wrapper.href = href;
        wrapper.className = 'insight-card-link';
        // Move the link text content to a span to avoid nested links
        const linkText = link.textContent;
        const span = document.createElement('span');
        span.textContent = linkText;
        link.replaceWith(span);
        // Wrap the row content in the anchor
        row.before(wrapper);
        wrapper.append(row);
      }
    }
  });
}
