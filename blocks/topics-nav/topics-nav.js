export default async function decorate(block) {
  // Flatten the rows into a single inline list of links
  const links = [...block.querySelectorAll('a')];
  block.innerHTML = '';
  links.forEach((link) => {
    block.append(link);
  });
}
