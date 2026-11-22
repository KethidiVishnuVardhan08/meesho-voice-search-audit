import {
  Product,
  ParseResult,
  UnderstandResult,
  SupportCard,
  OffTopicCard,
} from './types';

export interface ContextState {
  lastQuery?: string;
  lastParse?: ParseResult;
  lastProducts?: Product[];
}

export function parseQueryWithUnderstanding(
  query: string,
  context?: ContextState
): ParseResult {
  const normalized = query.trim().toLowerCase();

  // 1. Check for conversational follow-up markers
  const isFollowUpPattern = /\b(isase|isse|isme|ismein|issme|isse bhi|aur|further|next)\b/i.test(normalized);

  // 2. Check for Support intent
  const supportPatterns = [
    /\b(mera\s+)?order\s+kahan(\s+hai)?\b/i,
    /\bkahan\s+hai\b/i,
    /\bdelivery\s+kitne\s+din\b/i,
    /\btrack(ing)?\b/i,
    /\bcustomer\s+care(\s+number)?\b/i,
    /\bpassword(\s+change)?\b/i,
    /\b(return|refund|exchange|help|complaint|cancel)\b/i,
  ];

  const isSupport = supportPatterns.some((pattern) => pattern.test(normalized));

  // 3. Check for Off-topic intent
  const offTopicPatterns = [
    /\b(weather|mausam|today'?s\s+weather)\b/i,
    /\b(gaana|song|music|play\s+a\s+good\s+song)\b/i,
    /\b(joke|kuchh\s+sunao|shayari|story)\b/i,
    /\b(hospital|doctor|ambulance)\b/i,
    /\b(cricket\s+score|news|samachar)\b/i,
  ];

  const isOffTopic = offTopicPatterns.some((pattern) => pattern.test(normalized));

  if (isSupport) {
    return {
      intent: 'support',
      product: null,
      max_price: null,
      sort: null,
      min_rating: null,
      colour: null,
      size: null,
      occasion: null,
      raw_query: query,
    };
  }

  if (isOffTopic) {
    return {
      intent: 'off-topic',
      product: null,
      max_price: null,
      sort: null,
      min_rating: null,
      colour: null,
      size: null,
      occasion: null,
      raw_query: query,
    };
  }

  // 4. Follow-up handling: inherit from prior context
  if (isFollowUpPattern && context?.lastParse) {
    const parent = context.lastParse;
    
    // Check if new price/sort constraint is requested
    const hasSasta = /\b(sasta|sasti|saste|cheapest|budget|kam\s+dam)\b/i.test(normalized);
    const sort = hasSasta ? 'cheapest' : parent.sort;

    // Check if new price ceiling
    let max_price = parent.max_price;
    const priceMatch = normalized.match(/(?:ke\s+andar|se\s+kam|tak|under|below)\s*(\d+)/i) ||
                       normalized.match(/(\d+)\s*(?:ke\s+andar|se\s+kam|tak|rupees|rs)/i);
    if (priceMatch) {
      max_price = parseInt(priceMatch[1], 10);
    } else if (hasSasta && context.lastProducts && context.lastProducts.length > 0) {
      // "isase sasta": price should be strictly lower than the lowest or average seen before
      const minSeen = Math.min(...context.lastProducts.map((p) => p.price));
      max_price = minSeen;
    }

    return {
      intent: 'follow-up',
      product: parent.product,
      max_price,
      sort: sort || 'cheapest',
      min_rating: parent.min_rating,
      colour: parent.colour,
      size: parent.size,
      occasion: parent.occasion,
      raw_query: query,
      is_follow_up: true,
    };
  }

  // 5. Normal Product Shopping parse
  // Extract max_price
  let max_price: number | null = null;
  const priceRegex1 = /(?:ke\s+andar|se\s+kam|tak|under|below)\s*(\d+)/i;
  const priceRegex2 = /(\d+)\s*(?:ke\s+andar|se\s+kam|tak|rupees|rs)/i;
  const pMatch = normalized.match(priceRegex1) || normalized.match(priceRegex2);
  if (pMatch) {
    max_price = parseInt(pMatch[1], 10);
  }

  // Extract sort
  let sort: 'cheapest' | null = null;
  if (/\b(sasta|sasti|saste|cheapest|budget|low\s+price|kam\s+rate)\b/i.test(normalized)) {
    sort = 'cheapest';
  }

  // Extract min_rating
  let min_rating: number | null = null;
  const ratingMatch = normalized.match(/(?:rated\s*|rating\s*)(\d+(?:\.\d+)?)\s*(?:above|plus|\+)?/i) ||
                      normalized.match(/(\d+(?:\.\d+)?)\s*(?:star|se\s+upar|rating\s+se\s+upar)/i);
  if (ratingMatch) {
    min_rating = parseFloat(ratingMatch[1]);
  }

  // Extract colour
  const colours = ['red', 'blue', 'pink', 'green', 'black', 'white', 'yellow', 'purple', 'grey', 'brown', 'maroon', 'teal', 'tan', 'silver'];
  let colour: string | null = null;
  for (const c of colours) {
    if (new RegExp(`\\b${c}\\b`, 'i').test(normalized)) {
      colour = c;
      break;
    }
  }

  // Extract size
  let size: string | null = null;
  if (/\bdouble\s+bed\b/i.test(normalized)) {
    size = 'double';
  } else if (/\b(size\s+6|six)\b/i.test(normalized)) {
    size = '6';
  }

  // Extract occasion / gender
  let occasion: string | null = null;
  if (/\b(wedding|shaadi|shadi)\b/i.test(normalized)) occasion = 'wedding';
  else if (/\b(office|formal)\b/i.test(normalized)) occasion = 'office';
  else if (/\b(winter|sardi)\b/i.test(normalized)) occasion = 'winter';
  else if (/\b(summer|garmi)\b/i.test(normalized)) occasion = 'summer';
  else if (/\b(daily|roz)\b/i.test(normalized)) occasion = 'daily';

  // Extract product noun
  const productLexicon: Record<string, string[]> = {
    kurti: ['kurti', 'kurtis'],
    kurta: ['kurta', 'kurtas'],
    saree: ['saree', 'sarees', 'sari'],
    bedsheet: ['bedsheet', 'bed sheet', 'bedsheets'],
    raincoat: ['raincoat', 'rain coat', 'rainsuits'],
    top: ['tops', 'top', 'crop top'],
    jacket: ['jacket', 'jackets', 'coat', 'hoodie'],
    cardigan: ['cardigan', 'sweater'],
    lehenga: ['lehenga', 'lehnga'],
    chappal: ['chappal', 'slipper', 'slippers', 'sandals', 'footwear'],
    bartan: ['bartan', 'kitchen', 'utensil', 'utensils', 'plate'],
    'bluetooth speaker': ['bluetooth speaker', 'speaker', 'bluetooth'],
    wallet: ['wallet', 'purse'],
    'school bag': ['school bag', 'bag', 'backpack'],
    'tempered glass': ['tempered glass', 'screen guard'],
    'phone cover': ['phone cover', 'back cover', 'mobile cover'],
    gift: ['gift', 'tohar'],
  };

  let product: string | null = null;
  for (const [key, aliases] of Object.entries(productLexicon)) {
    if (aliases.some((alias) => new RegExp(`\\b${alias}\\b`, 'i').test(normalized))) {
      product = key;
      break;
    }
  }

  return {
    intent: 'shop',
    product: product || (normalized.split(' ')[0] || null),
    max_price,
    sort,
    min_rating,
    colour,
    size,
    occasion,
    raw_query: query,
  };
}

export function runUnderstoodSearch(
  query: string,
  catalog: Product[],
  context?: ContextState
): UnderstandResult {
  const parse = parseQueryWithUnderstanding(query, context);
  const active_filters: string[] = [];

  // Handle Support Intent
  if (parse.intent === 'support') {
    const norm = query.toLowerCase();
    let title = 'Order Tracking & Support';
    let description = 'We found your active shipment #MEE-849204 (Status: In Transit, Out for Delivery tomorrow).';
    let screen = 'Opens: Order Tracking Screen';
    let action = 'Track Live Order';

    if (norm.includes('customer care')) {
      title = 'Direct Customer Support';
      description = 'Connect directly with Meesho Support via verified in-app toll-free call or instant chat.';
      screen = 'Opens: Support Helpline & Ticket Portal';
      action = 'Call Customer Care';
    } else if (norm.includes('password')) {
      title = 'Security & Account Settings';
      description = 'Reset password or update two-factor SMS OTP authentication.';
      screen = 'Opens: Account Security Settings';
      action = 'Change Password';
    } else if (norm.includes('delivery')) {
      title = 'Estimated Delivery Calculator';
      description = 'Standard delivery takes 3-5 business days. Your last shipment arrives by 6 PM.';
      screen = 'Opens: Delivery Schedule Details';
      action = 'View Delivery Timeline';
    }

    const supportCard: SupportCard = {
      title,
      description,
      screen_name: screen,
      action_label: action,
    };

    return {
      raw_query: query,
      parse,
      matched_products: [],
      support_card: supportCard,
      off_topic_card: null,
      active_filters_description: ['Intent Routed: Customer Support'],
      context_inherited: false,
    };
  }

  // Handle Off-topic Intent
  if (parse.intent === 'off-topic') {
    const offTopicCard: OffTopicCard = {
      message: 'I am your Meesho shopping assistant! I can\'t play songs or check weather forecasts, but I can find you great deals on items below.',
      suggestion_title: 'Try shopping for these instead:',
      suggestions: [
        'Wireless Bluetooth Speakers under Rs 400',
        'Raincoats & Umbrellas for monsoon',
        'FM Radio & Audio Accessories',
        'Cotton Kurtis under Rs 300',
      ],
    };

    return {
      raw_query: query,
      parse,
      matched_products: [],
      support_card: null,
      off_topic_card: offTopicCard,
      active_filters_description: ['Intent Routed: Polite Off-Topic Refusal'],
      context_inherited: false,
    };
  }

  // Product Matching & Filtering
  let filtered = [...catalog];

  // 1. Filter by product keyword / category
  if (parse.product) {
    const prodLower = parse.product.toLowerCase();
    const keywordMatches = filtered.filter((p) => {
      const text = `${p.name} ${p.category}`.toLowerCase();
      return text.includes(prodLower) || p.category.toLowerCase().includes(prodLower);
    });
    if (keywordMatches.length > 0) {
      filtered = keywordMatches;
      active_filters.push(`Product: ${parse.product}`);
    }
  }

  // 2. Filter by colour
  if (parse.colour) {
    const cMatches = filtered.filter((p) => p.colour.toLowerCase() === parse.colour?.toLowerCase());
    if (cMatches.length > 0) {
      filtered = cMatches;
      active_filters.push(`Colour: ${parse.colour}`);
    }
  }

  // 3. Filter by size / occasion
  if (parse.size) {
    const sizeMatches = filtered.filter((p) => p.size.toLowerCase().includes(parse.size!.toLowerCase()));
    if (sizeMatches.length > 0) {
      filtered = sizeMatches;
      active_filters.push(`Size: ${parse.size}`);
    }
  }

  if (parse.occasion) {
    const occMatches = filtered.filter((p) => p.occasion.toLowerCase() === parse.occasion?.toLowerCase());
    if (occMatches.length > 0) {
      filtered = occMatches;
      active_filters.push(`Occasion: ${parse.occasion}`);
    }
  }

  // 4. Apply price cap as real filter
  if (parse.max_price !== null && parse.max_price !== undefined) {
    const priceMatches = filtered.filter((p) => p.price <= parse.max_price!);
    if (priceMatches.length > 0) {
      filtered = priceMatches;
      active_filters.push(`Max Price: <= Rs ${parse.max_price}`);
    } else {
      active_filters.push(`Max Price: <= Rs ${parse.max_price} (No exact matches in mock catalog)`);
    }
  }

  // 5. Apply minimum rating filter
  if (parse.min_rating !== null && parse.min_rating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= parse.min_rating!);
    active_filters.push(`Rating: >= ${parse.min_rating} Stars`);
  }

  // 6. Apply sort (cheapest first)
  if (parse.sort === 'cheapest') {
    filtered.sort((a, b) => a.price - b.price);
    active_filters.push('Sort: Price Low to High (Cheapest First)');
  }

  return {
    raw_query: query,
    parse,
    matched_products: filtered.slice(0, 4),
    support_card: null,
    off_topic_card: null,
    active_filters_description: active_filters,
    context_inherited: parse.intent === 'follow-up',
  };
}
