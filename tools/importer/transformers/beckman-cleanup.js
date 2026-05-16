/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Beckman Coulter site-wide cleanup.
 * Removes non-authorable content from the DOM before and after block parsing.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove skeleton loading placeholders that may interfere with block parsing
    // Found in cleaned.html: <div role="status" class="z-0 absolute aspect-[3/2] w-full inset-0 animate-pulse ...">
    WebImporter.DOMUtils.remove(element, ['div[role="status"]']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove empty container div at top of page
    // Found in cleaned.html: <div class="container custome-container">
    WebImporter.DOMUtils.remove(element, ['.container.custome-container']);

    // Remove mobile jump-to-section dropdown navigation
    // Found in cleaned.html: <div class="container sticky top-4 z-20 mx-auto flex justify-center px-2 md:hidden">
    WebImporter.DOMUtils.remove(element, ['.container.sticky']);

    // Remove desktop scroll-to navigation bar
    // Found in cleaned.html: <nav class="sticky top-4 z-20 hidden items-center md:!flex">
    WebImporter.DOMUtils.remove(element, ['nav.sticky']);

    // Remove swiper navigation buttons (prev/next arrows, not authorable)
    // Found in cleaned.html: <div class="swiper-buttons flex items-center hidden">
    WebImporter.DOMUtils.remove(element, ['.swiper-buttons']);

    // Remove safe non-authorable elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);
  }
}
