import { getMetadata, loadCSS } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Converts a <table> block definition into a decorated <div> block.
 * Tables in .plain.html use the pattern:
 *   <table><tbody>
 *     <tr><th colspan="2">block-name</th></tr>
 *     <tr><td>cell1</td><td>cell2</td></tr>
 *   </tbody></table>
 * @param {HTMLTableElement} table
 * @returns {HTMLDivElement|null}
 */
function tableToBlock(table) {
  const rows = [...table.querySelectorAll(':scope > tbody > tr, :scope > tr')];
  if (rows.length < 1) return null;

  // First row header cell contains the block name
  const headerCell = rows[0].querySelector('th, td');
  if (!headerCell) return null;
  const blockName = headerCell.textContent.trim().toLowerCase();
  if (!blockName) return null;

  const block = document.createElement('div');
  block.className = blockName;

  // Remaining rows become row divs with cell divs
  rows.slice(1).forEach((tr) => {
    const row = document.createElement('div');
    [...tr.children].forEach((cell) => {
      const div = document.createElement('div');
      div.innerHTML = cell.innerHTML;
      row.append(div);
    });
    block.append(row);
  });

  return block;
}

/**
 * Loads CSS for a footer sub-block and runs its decorate function if available.
 * @param {string} blockName - e.g. 'footer-columns'
 * @param {Element} blockEl - the block div element
 */
async function loadSubBlock(blockName, blockEl) {
  const basePath = `${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}`;
  // Load CSS
  loadCSS(`${basePath}.css`);
  // Try to load and run JS decorator
  try {
    const mod = await import(`${basePath}.js`);
    if (mod.default) await mod.default(blockEl);
  } catch (e) {
    // JS is optional for sub-blocks
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');

  if (fragment) {
    while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  }

  // Convert any remaining <table> block definitions to decorated divs
  // (handles local dev where tables are not server-converted)
  footer.querySelectorAll('table').forEach((table) => {
    const blockDiv = tableToBlock(table);
    if (blockDiv) {
      table.replaceWith(blockDiv);
    }
  });

  // Remove stray <hr> separators from the plain.html
  footer.querySelectorAll('hr').forEach((hr) => hr.remove());

  // Remove head.html artifacts (meta, link, script) that the local dev server injects
  footer.querySelectorAll(':scope meta, :scope link, :scope script').forEach((el) => el.remove());

  // Unwrap content from default-content-wrapper and section if present
  const section = footer.querySelector('.section');
  if (section) {
    const dcw = section.querySelector('.default-content-wrapper');
    const source = dcw || section;
    while (source.firstChild) {
      footer.append(source.firstChild);
    }
    section.remove();
  }

  // Remove empty wrapper divs that the fragment loader creates
  [...footer.children].forEach((child) => {
    if (child.tagName === 'DIV' && child.children.length === 0 && !child.textContent.trim()) {
      child.remove();
    }
  });

  block.append(footer);

  // Load CSS and JS for each footer sub-block
  const subBlocks = footer.querySelectorAll('.footer-columns, .footer-social, .footer-legal');
  await Promise.all([...subBlocks].map((sb) => {
    const name = sb.classList[0];
    return loadSubBlock(name, sb);
  }));
}
