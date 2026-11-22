import { Product, BaselineResult } from './types';

// Deterministic baseline simulation replicating what was observed in black-box tests
export function runBaselineSearch(query: string, catalog: Product[]): BaselineResult {
  const normalized = query.trim().toLowerCase();

  // Known specific observations from the audit
  const knownObservations: Record<string, {
    rewritten: string;
    notes: string;
    unrelatedCategories?: string[];
  }> = {
    'office ke liye kurti 700 ke andar': {
      rewritten: 'office ke liye kurti 700',
      notes: '"ke andar" trimmed; items under Rs 700 appeared (unproven loose cap).',
    },
    'isase sasta dikhao': {
      rewritten: 'isase',
      notes: 'No memory of previous query. Searched literal Hindi pronoun "isase".',
      unrelatedCategories: ['Kitchen', 'Healthcare', 'Home Utility'],
    },
    'gift ke liye kuchh achcha dikhao': {
      rewritten: 'gift',
      notes: 'Trimmed down to "gift"; broad generic gift items shown.',
    },
    'mere bete ke liye school bag': {
      rewritten: 'mere bete ke liye school',
      notes: '"bag" dropped from search query.',
    },
    'mera order kahan hai': {
      rewritten: 'where',
      notes: 'Translated/misrouted to literal keyword "where". Displayed clotheslines, perfumes, hangers.',
      unrelatedCategories: ['Home Utility', 'Healthcare', 'Accessories'],
    },
    'saree under 500 for a wedding': {
      rewritten: 'saree under 500 for a',
      notes: '"wedding" qualifier dropped from query string.',
    },
    'tell me today\'s weather': {
      rewritten: 'tell me todays weather',
      notes: 'Off-topic command searched as products: returned books, thermometers, TDS meters.',
      unrelatedCategories: ['Healthcare', 'Home Utility', 'Accessories'],
    },
    'shaadi ke liye lehenga': {
      rewritten: 'shadi ke liye lehenga',
      notes: 'Spelling rewritten; women\'s and kids\' lehengas mixed.',
    },
    'office wear kurta for daily use': {
      rewritten: 'office kurta',
      notes: 'Trimmed to "office kurta"; daily wear qualifier ignored.',
    },
    'ghar ke liye bedsheet double bed': {
      rewritten: 'ghar ke liye bed sheet',
      notes: '"double bed" dropped from query.',
    },
    'ghar ke liye bedsheet double bed, sasta dikhao': {
      rewritten: 'ghar ke liye bed sheet',
      notes: '"sasta dikhao" dropped; items displayed in arbitrary non-sorted price order.',
    },
    'delivery kitne din mein hoga': {
      rewritten: 'delivery kitne din mein dhaga',
      notes: '"hoga" rewritten into "dhaga" (thread); pregnancy kits and astrology book shown.',
      unrelatedCategories: ['Healthcare', 'Home Utility'],
    },
    'winter ke liye warm jacket': {
      rewritten: 'winter jacket',
      notes: 'Trimmed to "winter jacket".',
    },
    'winter ke liye warm jacket ladkiyon ke liye': {
      rewritten: 'winter ke liye warm jacket',
      notes: '"ladkiyon ke liye" dropped; mixed men\'s, girls\', and toddler coats.',
    },
    'password change karna hai': {
      rewritten: 'password',
      notes: 'Account setting query searched as catalog keyword "password".',
      unrelatedCategories: ['Accessories', 'Home Utility'],
    },
    'customer care number': {
      rewritten: 'customer care',
      notes: 'Support query searched in catalog: returned insemination kits, incense sticks, thermometers.',
      unrelatedCategories: ['Healthcare', 'Home Utility'],
    },
    'ladies chappal size six': {
      rewritten: 'women slipper 6 size',
      notes: 'Rewritten to "women slipper 6 size".',
    },
    'rasoi ke bartan steel': {
      rewritten: 'kitchen ke steel ke bartan',
      notes: '"rasoi" translated to "kitchen"; mixed unrelated kitchen and bath racks.',
    },
    'bluetooth speaker': {
      rewritten: 'bluetooth speaker',
      notes: 'Speakers shown with occasional unrelated accessories.',
    },
    'play a good song': {
      rewritten: 'song',
      notes: 'Off-topic voice command searched as literal keyword "song". Returned toys and musical books.',
      unrelatedCategories: ['Healthcare', 'Home Utility', 'Accessories'],
    },
    'show me cheapest raincoat': {
      rewritten: 'raincoat',
      notes: '"cheapest" dropped; returned arbitrary prices (Rs 406, 597, 103, 528), not cheapest first.',
    },
    'summer tops rated 4.1 above': {
      rewritten: 'summer tops rated 41 above',
      notes: 'Google speech / search heard "41"; rating filter ignored, 3.8-star item shown.',
    },
    'kurti 150 ke andar': {
      rewritten: 'kurti 150',
      notes: '"ke andar" dropped; cap unproven.',
    },
    'red saree': {
      rewritten: 'red saree',
      notes: 'Searched "red saree".',
    }
  };

  const directMatch = knownObservations[normalized];

  let rewritten = '';
  let notes = '';
  let isSupportOrOffTopic = false;
  let unrelatedCategories: string[] = [];

  if (directMatch) {
    rewritten = directMatch.rewritten;
    notes = directMatch.notes;
    if (directMatch.unrelatedCategories) {
      isSupportOrOffTopic = true;
      unrelatedCategories = directMatch.unrelatedCategories;
    }
  } else {
    // General heuristic rule simulation
    // Detect support & off-topic
    const supportTerms = ['order kahan', 'kahan hai', 'delivery', 'tracking', 'refund', 'return', 'customer care', 'password', 'help'];
    const offTopicTerms = ['song', 'gaana', 'weather', 'mausam', 'joke', 'hospital', 'news', 'play'];

    if (supportTerms.some((t) => normalized.includes(t))) {
      isSupportOrOffTopic = true;
      rewritten = normalized.replace(/kahan hai|mera|hai|ke liye|chahiye/gi, '').trim() || 'order';
      notes = 'Support query treated as product search keyword.';
      unrelatedCategories = ['Healthcare', 'Home Utility', 'Accessories'];
    } else if (offTopicTerms.some((t) => normalized.includes(t))) {
      isSupportOrOffTopic = true;
      rewritten = normalized.replace(/play a|tell me|a good/gi, '').trim() || 'misc';
      notes = 'Off-topic voice command treated as product search keyword.';
      unrelatedCategories = ['Healthcare', 'Home Utility', 'Accessories'];
    } else {
      // General product search: drop sort words and conversational preambles
      rewritten = normalized
        .replace(/\b(sasta|sasti|saste|cheapest|budget|dikhao|show me|kuchh|achcha|ke andar|se kam|tak|above|rated)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      notes = 'Heuristic query rewrite: sort and constraint modifiers removed.';
    }
  }

  // Calculate dropped tokens for visual strikethrough
  const rawWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  const rewrittenWords = new Set(rewritten.toLowerCase().split(/\s+/).filter(Boolean));
  
  const dropped_tokens: string[] = [];
  const kept_tokens: string[] = [];

  for (const word of rawWords) {
    const clean = word.replace(/[^a-z0-9]/g, '');
    if (clean && !rewrittenWords.has(clean) && !rewritten.includes(clean)) {
      dropped_tokens.push(word);
    } else {
      kept_tokens.push(word);
    }
  }

  // Price cap observation detection
  const hasPriceCapPattern = /(ke andar|se kam|tak|under|below|\d+\s*(rupees|rs|ke andar|under))/i.test(query);
  const is_unproven_cap = hasPriceCapPattern;
  const price_cap_note = hasPriceCapPattern
    ? 'Price cap co-occurred in observed tests, but loose caps remain UNPROVEN.'
    : null;

  // Product selection
  let matched_products: Product[] = [];

  if (isSupportOrOffTopic) {
    // Return unrelated misrouted items as observed (e.g. thermometer, clotheslines, strange mix)
    matched_products = catalog.filter((p) =>
      unrelatedCategories.includes(p.category) || p.category === 'Healthcare' || p.category === 'Home Utility'
    ).slice(0, 4);
    if (matched_products.length === 0) {
      matched_products = catalog.slice(-4);
    }
  } else {
    // Normal catalog search based on rewritten terms, but IGNORING sort and rating
    const searchTokens = rewritten.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    matched_products = catalog.filter((p) => {
      const target = `${p.name} ${p.category} ${p.colour} ${p.material} ${p.occasion} ${p.size}`.toLowerCase();
      return searchTokens.some((token) => target.includes(token));
    });

    if (matched_products.length === 0) {
      // Fallback
      matched_products = catalog.slice(0, 4);
    } else {
      // Important: baseline does NOT sort cheapest first even if user asked for "cheapest" or "sasta"
      // Keep natural unsorted catalog order (as seen in screenshots 11 and 24: 406, 597, 103, 528)
      if (normalized.includes('raincoat')) {
        // Specifically mock the observed raincoat test order: Rs 406, 597, 103, 528
        const raincoats = catalog.filter((p) => p.category === 'Raincoat');
        matched_products = [
          raincoats.find((p) => p.price === 406) || raincoats[3],
          { ...raincoats[0], id: 'prod_19_alt', name: 'Premium Heavy Trench Raincoat', price: 597, rating: 4.4 },
          raincoats.find((p) => p.price === 103) || raincoats[0],
          raincoats.find((p) => p.price === 528) || raincoats[4],
        ].filter(Boolean) as Product[];
      } else if (normalized.includes('summer tops') || normalized.includes('4.1')) {
        // Replicate observed test showing 3.8-star item
        const tops = catalog.filter((p) => p.category === 'Top');
        matched_products = tops;
      } else {
        matched_products = matched_products.slice(0, 4);
      }
    }
  }

  return {
    raw_query: query,
    rewritten_query: rewritten,
    dropped_tokens,
    kept_tokens,
    matched_products,
    price_cap_note,
    is_unproven_cap,
    intent_recognised: !isSupportOrOffTopic,
    notes,
  };
}
