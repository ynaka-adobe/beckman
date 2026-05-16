/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import insightCardsParser from './parsers/insight-cards.js';
import topicsNavParser from './parsers/topics-nav.js';
import eventsCarouselParser from './parsers/events-carousel.js';
import servicePromoParser from './parsers/service-promo.js';
import aboutCompanyParser from './parsers/about-company.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/beckman-cleanup.js';
import sectionsTransformer from './transformers/beckman-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'insight-cards': insightCardsParser,
  'topics-nav': topicsNavParser,
  'events-carousel': eventsCarouselParser,
  'service-promo': servicePromoParser,
  'about-company': aboutCompanyParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Beckman Coulter homepage with hero, product categories, and promotional content',
  urls: [
    'https://www.beckman.com/'
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.relative.justify-end']
    },
    {
      name: 'insight-cards',
      instances: ['#latest .grid']
    },
    {
      name: 'topics-nav',
      instances: ['#topics .grid']
    },
    {
      name: 'events-carousel',
      instances: ['#events']
    },
    {
      name: 'service-promo',
      instances: ['#service > div']
    },
    {
      name: 'about-company',
      instances: ['#about']
    }
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero',
      selector: '.relative.justify-end',
      style: null,
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'latest',
      name: 'Fresh Insights',
      selector: '#latest',
      style: null,
      blocks: ['insight-cards'],
      defaultContent: ['#latest h2']
    },
    {
      id: 'topics',
      name: 'Popular Topics',
      selector: '.gradient-section-background',
      style: 'gradient',
      blocks: ['topics-nav'],
      defaultContent: ['#topics > div:first-child']
    },
    {
      id: 'diagnostics-banner',
      name: 'Diagnostics Banner',
      selector: '.mx-auto.bg-brand-gray-50.p-2',
      style: 'grey',
      blocks: [],
      defaultContent: ['.mx-auto.bg-brand-gray-50.p-2 p']
    },
    {
      id: 'events',
      name: 'Upcoming Events',
      selector: '#events',
      style: null,
      blocks: ['events-carousel'],
      defaultContent: []
    },
    {
      id: 'service',
      name: 'Service and Support',
      selector: '#service',
      style: 'off-white',
      blocks: ['service-promo'],
      defaultContent: []
    },
    {
      id: 'about',
      name: 'About Company',
      selector: '#about',
      style: null,
      blocks: ['about-company'],
      defaultContent: []
    }
  ]
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
