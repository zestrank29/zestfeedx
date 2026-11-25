export type NewsCategory =
  | "india"
  | "world"
  | "business"
  | "tech"
  | "entertainment"
  | "sports"
  | "science"
  | "health"
  | "food"
  | string;

export interface AuthorProfile {
  name: string;
  bio: string;
  company: string;
  url?: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  original_title?: string;
  summary: string;
  content: string;
  category: NewsCategory;
  source_url?: string;
  source_name?: string;
  source_courtesy?: string;
  image_url: string;
  image_alt?: string;
  image_courtesy?: string;
  image_prompt?: string;
  fact_check_status?: string;
  tags?: string;
  fomo_badge: string;
  read_time: string;
  views_count: number;
  shares_count: number;
  published_at: string;
  language?: "en" | "hi";
  // Dual-Language Curiosity Fields
  title_en?: string;
  content_en?: string;
  summary_en?: string;
  title_hi?: string;
  content_hi?: string;
  summary_hi?: string;
  // Author Profile Fields
  author_name?: string;
  author_bio?: string;
  author_company?: string;
  author_url?: string;
  // Clinical Review & Health Metadata
  topic?: string;
  medical_reviewed?: boolean;
  medical_reviewer_name?: string;
  medical_reviewer_credentials?: string;
  medical_review_date?: string;
  updated_at?: string;
  source_published_at?: string;
  event_at?: string;
  why_it_matters_today?: string;
  who_is_affected?: string;
  what_readers_are_searching_for?: string;
  primary_source?: string;
  image_license?: string;
  image_photographer?: string;
  // Festival & Observance Editorial Calendar Fields
  event_date?: string;
  event_date_formatted?: string;
  event_type?: string;
  event_region?: string;
  is_preview?: boolean;
  // Cricket & High-Frequency Match Telemetry
  is_live_cricket?: boolean;
  match_id?: string;
  live_score?: string;
  match_status?: string;
  score_verified_at?: string;
  // Latency & Pipeline Telemetry
  detected_at?: string;
  verified_at?: string;
  approved_at?: string;
}

export interface NewsResponse {
  items: Article[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_more: boolean;
}

export interface TrendingResponse {
  breaking: Article[];
  tags: string[];
}

export interface StatsResponse {
  total_articles: number;
  total_views: number;
  total_shares: number;
  last_scrape: {
    ran_at: string;
    items_created: number;
    status: string;
  } | null;
}
