import { describe, it, expect } from 'vitest';
import { parseQueryWithUnderstanding, runUnderstoodSearch } from '../understand';
import { runBaselineSearch } from '../baseline';
import { Product } from '../types';

const mockCatalog: Product[] = [
  {
    id: 'p1',
    name: 'Printed Cotton Kurti',
    price: 250,
    category: 'Kurti',
    colour: 'blue',
    material: 'Cotton',
    occasion: 'office',
    size: 'M',
    rating: 4.2,
  },
  {
    id: 'p2',
    name: 'Silk Embroidered Saree',
    price: 450,
    category: 'Saree',
    colour: 'red',
    material: 'Silk',
    occasion: 'wedding',
    size: 'Free',
    rating: 4.4,
  },
  {
    id: 'p3',
    name: 'Pocket Emergency Raincoat',
    price: 103,
    category: 'Raincoat',
    colour: 'blue',
    material: 'PVC',
    occasion: 'monsoon',
    size: 'Free',
    rating: 3.7,
  },
  {
    id: 'p4',
    name: 'Stormproof Heavy Raincoat',
    price: 528,
    category: 'Raincoat',
    colour: 'black',
    material: 'Nylon',
    occasion: 'monsoon',
    size: 'L',
    rating: 4.3,
  },
  {
    id: 'p5',
    name: 'Summer Casual Crop Top',
    price: 199,
    category: 'Top',
    colour: 'yellow',
    material: 'Cotton',
    occasion: 'summer',
    size: 'M',
    rating: 4.5,
  },
  {
    id: 'p6',
    name: 'Basic Daily Top',
    price: 175,
    category: 'Top',
    colour: 'pink',
    material: 'Rayon',
    occasion: 'casual',
    size: 'L',
    rating: 3.8,
  },
];

describe('Engine: Understanding Layer Tests (10+ Queries)', () => {
  it('1. Parses price cap and product for "Office ke liye kurti 700 ke andar"', () => {
    const parse = parseQueryWithUnderstanding('Office ke liye kurti 700 ke andar');
    expect(parse.intent).toBe('shop');
    expect(parse.product).toBe('kurti');
    expect(parse.max_price).toBe(700);
  });

  it('2. Extracts sort=cheapest for "Show me cheapest raincoat"', () => {
    const parse = parseQueryWithUnderstanding('Show me cheapest raincoat');
    expect(parse.intent).toBe('shop');
    expect(parse.product).toBe('raincoat');
    expect(parse.sort).toBe('cheapest');

    const result = runUnderstoodSearch('Show me cheapest raincoat', mockCatalog);
    expect(result.matched_products[0].price).toBe(103);
  });

  it('3. Filters rating >= 4.1 for "Summer tops rated 4.1 above"', () => {
    const parse = parseQueryWithUnderstanding('Summer tops rated 4.1 above');
    expect(parse.intent).toBe('shop');
    expect(parse.min_rating).toBe(4.1);

    const result = runUnderstoodSearch('Summer tops rated 4.1 above', mockCatalog);
    // 3.8 rated item should be filtered out
    expect(result.matched_products.every((p) => p.rating >= 4.1)).toBe(true);
  });

  it('4. Correctly routes support intent for "Mera order kahan hai"', () => {
    const parse = parseQueryWithUnderstanding('Mera order kahan hai');
    expect(parse.intent).toBe('support');

    const result = runUnderstoodSearch('Mera order kahan hai', mockCatalog);
    expect(result.support_card).not.toBeNull();
    expect(result.support_card?.screen_name).toContain('Order Tracking');
  });

  it('5. Routes "Customer care number" to customer care helpline card', () => {
    const parse = parseQueryWithUnderstanding('Customer care number');
    expect(parse.intent).toBe('support');

    const result = runUnderstoodSearch('Customer care number', mockCatalog);
    expect(result.support_card).not.toBeNull();
    expect(result.support_card?.title).toContain('Customer Support');
  });

  it('6. Routes "Delivery kitne din mein hoga" to support delivery tracker', () => {
    const parse = parseQueryWithUnderstanding('Delivery kitne din mein hoga');
    expect(parse.intent).toBe('support');
  });

  it('7. Routes "Password change karna hai" to account settings support card', () => {
    const parse = parseQueryWithUnderstanding('Password change karna hai');
    expect(parse.intent).toBe('support');
    const result = runUnderstoodSearch('Password change karna hai', mockCatalog);
    expect(result.support_card?.screen_name).toContain('Security');
  });

  it('8. Politely refuses off-topic request "Play a good song" with shopping suggestions', () => {
    const parse = parseQueryWithUnderstanding('Play a good song');
    expect(parse.intent).toBe('off-topic');

    const result = runUnderstoodSearch('Play a good song', mockCatalog);
    expect(result.off_topic_card).not.toBeNull();
    expect(result.off_topic_card?.suggestions.length).toBeGreaterThan(0);
  });

  it('9. Handles off-topic request "Tell me today\'s weather"', () => {
    const parse = parseQueryWithUnderstanding("Tell me today's weather");
    expect(parse.intent).toBe('off-topic');
  });

  it('10. Multi-turn memory: "Red saree" then "Isase sasta dikhao" inherits category and colour', () => {
    const turn1Parse = parseQueryWithUnderstanding('Red saree');
    expect(turn1Parse.product).toBe('saree');
    expect(turn1Parse.colour).toBe('red');

    const turn1Result = runUnderstoodSearch('Red saree', mockCatalog);

    // Turn 2 follow up with context from Turn 1
    const turn2Parse = parseQueryWithUnderstanding('Isase sasta dikhao', {
      lastQuery: 'Red saree',
      lastParse: turn1Parse,
      lastProducts: turn1Result.matched_products,
    });

    expect(turn2Parse.intent).toBe('follow-up');
    expect(turn2Parse.product).toBe('saree');
    expect(turn2Parse.colour).toBe('red');
    expect(turn2Parse.sort).toBe('cheapest');
  });

  it('11. Extracts occasion and price cap for "Saree under 500 for a wedding"', () => {
    const parse = parseQueryWithUnderstanding('Saree under 500 for a wedding');
    expect(parse.product).toBe('saree');
    expect(parse.max_price).toBe(500);
    expect(parse.occasion).toBe('wedding');
  });

  it('12. Extracts size and product for "Ladies chappal size six"', () => {
    const parse = parseQueryWithUnderstanding('Ladies chappal size six');
    expect(parse.product).toBe('chappal');
    expect(parse.size).toBe('6');
  });
});

describe('Engine: Baseline As-Observed Tests', () => {
  it('Drops "ke andar" and marks price cap as UNPROVEN', () => {
    const result = runBaselineSearch('Office ke liye kurti 700 ke andar', mockCatalog);
    expect(result.is_unproven_cap).toBe(true);
    expect(result.dropped_tokens.length).toBeGreaterThan(0);
  });

  it('Fails follow-up memory and searches literal "isase"', () => {
    const result = runBaselineSearch('Isase sasta dikhao', mockCatalog);
    expect(result.rewritten_query).toBe('isase');
  });

  it('Misroutes "mera order kahan hai" to literal keyword "where"', () => {
    const result = runBaselineSearch('Mera order kahan hai', mockCatalog);
    expect(result.rewritten_query).toBe('where');
  });
});
