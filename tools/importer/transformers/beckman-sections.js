/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Beckman Coulter section breaks and section metadata.
 * Inserts <hr> section dividers and Section Metadata blocks based on template sections.
 * All selectors verified against migration-work/cleaned.html.
 *
 * Sections (7 total, 3 with styles):
 *   1. Hero           - selector: .relative.justify-end     - style: null
 *   2. Fresh Insights - selector: #latest                   - style: null
 *   3. Popular Topics - selector: .gradient-section-background - style: "gradient"
 *   4. Diagnostics Banner - selector: .mx-auto.bg-brand-gray-50.p-2 - style: "grey"
 *   5. Upcoming Events - selector: #events                  - style: null
 *   6. Service & Support - selector: #service               - style: "off-white"
 *   7. About Company  - selector: #about                    - style: null
 *
 * Expected: 6 <hr> breaks (before sections 2-7), 3 Section Metadata blocks.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block after the section element if style is defined
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Insert <hr> before every section except the first one
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
