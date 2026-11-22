export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  colour: string;
  material: string;
  occasion: string;
  size: string;
  rating: number;
}

export type IntentType = 'shop' | 'follow-up' | 'support' | 'off-topic';

export interface ParseResult {
  intent: IntentType;
  product: string | null;
  max_price: number | null;
  sort: 'cheapest' | null;
  min_rating: number | null;
  colour: string | null;
  size: string | null;
  occasion: string | null;
  raw_query: string;
  is_follow_up?: boolean;
}

export interface BaselineResult {
  raw_query: string;
  rewritten_query: string;
  dropped_tokens: string[];
  kept_tokens: string[];
  matched_products: Product[];
  price_cap_note: string | null;
  is_unproven_cap: boolean;
  intent_recognised: boolean;
  notes: string;
}

export interface SupportCard {
  title: string;
  description: string;
  screen_name: string;
  action_label: string;
}

export interface OffTopicCard {
  message: string;
  suggestion_title: string;
  suggestions: string[];
}

export interface UnderstandResult {
  raw_query: string;
  parse: ParseResult;
  matched_products: Product[];
  support_card: SupportCard | null;
  off_topic_card: OffTopicCard | null;
  active_filters_description: string[];
  context_inherited: boolean;
}

export interface ScoreItem {
  id: string;
  run: string;
  spoken: string;
  what_meesho_searched: string;
  mode: string;
  verdict: 'Pass' | 'Partial' | 'Fail';
  failure_category: 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'none';
  intent_recognised: string;
  constraint_applied: string;
  screenshot: string;
  note: string;
  group: string;
}

export interface QueryItem {
  id: string;
  text: string;
  language: string;
  group: string;
  expected_parse: Partial<ParseResult>;
}

export interface EvalMetric {
  key: string;
  name: string;
  baseline_pct: number;
  baseline_n: number;
  baseline_total: number;
  fix_pct: number;
  fix_n: number;
  fix_total: number;
}

export interface EvalsData {
  status: 'PLACEHOLDER' | 'VERIFIED';
  generated_at: string | null;
  metrics: EvalMetric[];
}
