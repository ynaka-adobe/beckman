/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const image = element.querySelector("img");
    const heading = element.querySelector("h1");
    const description = element.querySelector("p.hero-intro-animate") || element.querySelector(".hero__body p");
    const imageCell = [];
    if (image) {
      imageCell.push(image);
    }
    const contentCell = [];
    if (heading) {
      const cleanHeading = document.createElement("h1");
      cleanHeading.textContent = heading.textContent.trim();
      contentCell.push(cleanHeading);
    }
    if (description) {
      contentCell.push(description);
    }
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/insight-cards.js
  function parse2(element, { document }) {
    const cardLinks = element.querySelectorAll(":scope > a.group, :scope > a");
    const cells = [];
    cardLinks.forEach((cardLink) => {
      const img = cardLink.querySelector("img");
      const categoryP = cardLink.querySelector('p.text-brand-primary, p[class*="text-14"]');
      const allParagraphs = cardLink.querySelectorAll(":scope > p");
      let descriptionP = null;
      if (allParagraphs.length >= 2) {
        descriptionP = allParagraphs[1];
      } else if (allParagraphs.length === 1 && !categoryP) {
        descriptionP = allParagraphs[0];
      }
      const imageCell = document.createElement("div");
      if (img) {
        const picture = document.createElement("picture");
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        newImg.loading = "lazy";
        picture.appendChild(newImg);
        imageCell.appendChild(picture);
      }
      const textCell = document.createElement("div");
      if (categoryP) {
        const catP = document.createElement("p");
        catP.textContent = categoryP.textContent.trim();
        textCell.appendChild(catP);
      }
      const descP = document.createElement("p");
      const link = document.createElement("a");
      link.href = cardLink.href;
      if (cardLink.target === "_blank") {
        link.target = "_blank";
      }
      if (descriptionP) {
        const descSpan = descriptionP.querySelector("span");
        link.textContent = descSpan ? descSpan.textContent.trim() : descriptionP.textContent.trim();
      } else {
        link.textContent = categoryP ? categoryP.textContent.trim() : cardLink.textContent.trim();
      }
      descP.appendChild(link);
      textCell.appendChild(descP);
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "insight-cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/topics-nav.js
  function parse3(element, { document }) {
    const topicLinks = element.querySelectorAll(":scope > a");
    const cells = [];
    topicLinks.forEach((link) => {
      const labelDiv = link.querySelector("div");
      const linkText = labelDiv ? labelDiv.textContent.trim() : link.getAttribute("title") || link.textContent.trim();
      const href = link.getAttribute("href") || "";
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.textContent = linkText;
      cells.push([anchor]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "topics-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/events-carousel.js
  function parse4(element, { document }) {
    const heading = element.querySelector("h2");
    const seeAllLink = element.querySelector(':scope a[href="/events"], :scope a[href$="/events"]');
    const headerCell = [];
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      headerCell.push(h2);
    }
    if (seeAllLink) {
      const link = document.createElement("a");
      link.href = seeAllLink.href;
      link.textContent = "See all events";
      headerCell.push(link);
    }
    const cells = [];
    cells.push(headerCell);
    const eventCards = element.querySelectorAll(".swiper-wrapper > a");
    eventCards.forEach((card) => {
      const img = card.querySelector("img");
      const badgeContainer = card.querySelector(".gradient-primary");
      let badgeText = "";
      if (badgeContainer) {
        const badgeTextEl = badgeContainer.querySelector('[class*="ml-1"]');
        badgeText = badgeTextEl ? badgeTextEl.textContent.trim() : badgeContainer.textContent.trim();
      }
      const allParagraphs = Array.from(card.querySelectorAll(":scope > p"));
      const dateP = allParagraphs.find((p) => p.querySelector("svg") && p.querySelector("span"));
      const dateSpan = dateP ? dateP.querySelector("span") : null;
      const dateText = dateSpan ? dateSpan.textContent.trim() : "";
      const titleP = allParagraphs.length > 0 ? allParagraphs[allParagraphs.length - 1] : null;
      let titleText = "";
      if (titleP && titleP !== dateP) {
        const titleSpan = titleP.querySelector("span");
        titleText = titleSpan ? titleSpan.textContent.trim() : titleP.textContent.trim();
      }
      const imageCell = [];
      if (img) {
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        imageCell.push(imgEl);
      }
      const textCell = [];
      if (badgeText) {
        const badgeP = document.createElement("p");
        badgeP.textContent = badgeText;
        textCell.push(badgeP);
      }
      if (dateText) {
        const dateEl = document.createElement("p");
        dateEl.textContent = dateText;
        textCell.push(dateEl);
      }
      if (titleText) {
        const titleLink = document.createElement("a");
        titleLink.href = card.href || "#";
        titleLink.textContent = titleText;
        const titlePar = document.createElement("p");
        titlePar.appendChild(titleLink);
        textCell.push(titlePar);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "events-carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/service-promo.js
  function parse5(element, { document }) {
    const introCol = element.querySelector(":scope > .lg\\:w-5\\/12, :scope > div:first-child");
    const eyebrow = introCol ? introCol.querySelector(":scope > p.text-sm, :scope > p:first-child") : null;
    const heading = introCol ? introCol.querySelector("h2") : null;
    const description = introCol ? introCol.querySelector(":scope > p.leading-relaxed, :scope > p:nth-child(3)") : null;
    const ctaLink = introCol ? introCol.querySelector(":scope > a") : null;
    const introCell = [];
    if (eyebrow) introCell.push(eyebrow);
    if (heading) introCell.push(heading);
    if (description) introCell.push(description);
    if (ctaLink) {
      const arrowSpan = ctaLink.querySelector("span");
      if (arrowSpan) {
        ctaLink.textContent = ctaLink.textContent.replace("->", "").trim();
      }
      const ctaParagraph = document.createElement("p");
      ctaParagraph.appendChild(ctaLink);
      introCell.push(ctaParagraph);
    }
    const cardsGrid = element.querySelector(":scope > .grid, :scope > div:nth-child(2)");
    const cardLinks = cardsGrid ? Array.from(cardsGrid.querySelectorAll(":scope > a")) : [];
    function buildCardCell(cardAnchor) {
      const cellContent = [];
      const cardHeading = cardAnchor.querySelector("h3");
      const cardDesc = cardAnchor.querySelector("p.text-14, p.leading-relaxed, p:not(:empty)");
      if (cardHeading) {
        const h3 = document.createElement("h3");
        h3.textContent = cardHeading.textContent.trim();
        cellContent.push(h3);
      }
      if (cardDesc) {
        const p = document.createElement("p");
        p.textContent = cardDesc.textContent.trim();
        cellContent.push(p);
      }
      const linkP = document.createElement("p");
      const link = document.createElement("a");
      link.href = cardAnchor.href;
      link.textContent = cardHeading ? cardHeading.textContent.trim() : "Learn more";
      linkP.appendChild(link);
      cellContent.push(linkP);
      return cellContent;
    }
    const card1 = cardLinks[0] ? buildCardCell(cardLinks[0]) : [];
    const card2 = cardLinks[1] ? buildCardCell(cardLinks[1]) : [];
    const card3 = cardLinks[2] ? buildCardCell(cardLinks[2]) : [];
    const card4 = cardLinks[3] ? buildCardCell(cardLinks[3]) : [];
    const cells = [
      introCell
    ];
    if (card1.length || card2.length) {
      cells.push([card1, card2]);
    }
    if (card3.length || card4.length) {
      cells.push([card3, card4]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "service-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/about-company.js
  function parse6(element, { document }) {
    const bgImage = element.querySelector('img.absolute, img[class*="object-cover"]');
    const eyebrow = element.querySelector('p.text-brand-primary, p[class*="text-brand-primary"]');
    const heading = element.querySelector("h2, h1, h3");
    const description = element.querySelector('p.text-brand-gray-600, p[class*="gray-600"]');
    const cta = element.querySelector('a.bg-brand-primary, a[class*="rounded-full"], a[href]');
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (eyebrow) contentCell.push(eyebrow);
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "about-company", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/beckman-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ['div[role="status"]']);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".container.custome-container"]);
      WebImporter.DOMUtils.remove(element, [".container.sticky"]);
      WebImporter.DOMUtils.remove(element, ["nav.sticky"]);
      WebImporter.DOMUtils.remove(element, [".swiper-buttons"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
    }
  }

  // tools/importer/transformers/beckman-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "insight-cards": parse2,
    "topics-nav": parse3,
    "events-carousel": parse4,
    "service-promo": parse5,
    "about-company": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Beckman Coulter homepage with hero, product categories, and promotional content",
    urls: [
      "https://www.beckman.com/"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".relative.justify-end"]
      },
      {
        name: "insight-cards",
        instances: ["#latest .grid"]
      },
      {
        name: "topics-nav",
        instances: ["#topics .grid"]
      },
      {
        name: "events-carousel",
        instances: ["#events"]
      },
      {
        name: "service-promo",
        instances: ["#service > div"]
      },
      {
        name: "about-company",
        instances: ["#about"]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "Hero",
        selector: ".relative.justify-end",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "latest",
        name: "Fresh Insights",
        selector: "#latest",
        style: null,
        blocks: ["insight-cards"],
        defaultContent: ["#latest h2"]
      },
      {
        id: "topics",
        name: "Popular Topics",
        selector: ".gradient-section-background",
        style: "gradient",
        blocks: ["topics-nav"],
        defaultContent: ["#topics > div:first-child"]
      },
      {
        id: "diagnostics-banner",
        name: "Diagnostics Banner",
        selector: ".mx-auto.bg-brand-gray-50.p-2",
        style: "grey",
        blocks: [],
        defaultContent: [".mx-auto.bg-brand-gray-50.p-2 p"]
      },
      {
        id: "events",
        name: "Upcoming Events",
        selector: "#events",
        style: null,
        blocks: ["events-carousel"],
        defaultContent: []
      },
      {
        id: "service",
        name: "Service and Support",
        selector: "#service",
        style: "off-white",
        blocks: ["service-promo"],
        defaultContent: []
      },
      {
        id: "about",
        name: "About Company",
        selector: "#about",
        style: null,
        blocks: ["about-company"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
