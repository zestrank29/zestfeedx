import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  uuid,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "editor",
  "author",
  "advertiser",
  "subscriber",
]);

export const articleTypeEnum = pgEnum("article_type", [
  "original",
  "guest",
  "sponsored",
  "explainer",
]);

export const articleStatusEnum = pgEnum("article_status", [
  "draft",
  "in_review",
  "scheduled",
  "published",
  "archived",
]);

export const linkRelEnum = pgEnum("link_rel", [
  "dofollow",
  "nofollow",
  "sponsored",
]);

export const adProductTypeEnum = pgEnum("ad_product_type", [
  "guest_post",
  "sponsored_article",
  "press_release",
  "newsletter_slot",
  "display_banner",
]);

export const adOrderStatusEnum = pgEnum("ad_order_status", [
  "pending_payment",
  "paid",
  "under_editorial_review",
  "approved",
  "published",
  "rejected",
]);

// 1. Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("subscriber").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Authors Table
export const authors = pgTable("authors", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  roleTitle: varchar("role_title", { length: 255 }).notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  twitterHandle: varchar("twitter_handle", { length: 100 }),
  email: varchar("email", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. Categories Table
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  nameHi: varchar("name_hi", { length: 100 }),
  description: text("description"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. Articles Table
export const articles = pgTable(
  "articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: text("title").notNull(),
    titleHi: text("title_hi"),
    deck: text("deck").notNull(),
    deckHi: text("deck_hi"),
    bodyMarkdown: text("body_markdown").notNull(),
    bodyMarkdownHi: text("body_markdown_hi"),
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "restrict" })
      .notNull(),
    authorId: uuid("author_id")
      .references(() => authors.id, { onDelete: "restrict" })
      .notNull(),
    articleType: articleTypeEnum("article_type").default("original").notNull(),
    status: articleStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    readingTimeMins: integer("reading_time_mins").default(5).notNull(),
    wordCount: integer("word_count").default(0).notNull(),
    heroImage: text("hero_image").notNull(),
    heroImageCaption: text("hero_image_caption"),
    heroImageCredit: text("hero_image_credit"),
    keyTakeaways: jsonb("key_takeaways").$type<string[]>().default([]).notNull(),
    whyItMatters: text("why_it_matters"),
    citations: jsonb("citations")
      .$type<Array<{ label: string; url: string; publisher: string }>>()
      .default([])
      .notNull(),
    isLeadStory: boolean("is_lead_story").default(false).notNull(),
    isSecondaryStory: boolean("is_secondary_story").default(false).notNull(),
    isBreaking: boolean("is_breaking").default(false).notNull(),
    isIndexable: boolean("is_indexable").default(true).notNull(),
    relTag: linkRelEnum("rel_tag").default("dofollow").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("articles_slug_idx").on(table.slug),
    index("articles_published_at_idx").on(table.publishedAt),
    index("articles_category_idx").on(table.categoryId),
    index("articles_author_idx").on(table.authorId),
    index("articles_status_idx").on(table.status),
  ]
);

// 5. Feed Sources Table
export const feedSources = pgTable("feed_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  tier: integer("tier").notNull(), // 1=Official/Primary, 2=Discovery API, 3=Market
  adapterType: varchar("adapter_type", { length: 50 }).notNull(),
  configJson: jsonb("config_json").$type<Record<string, unknown>>().default({}),
  isActive: boolean("is_active").default(true).notNull(),
  licenseNotes: text("license_notes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 6. Curated Briefs Table
export const curatedBriefs = pgTable(
  "curated_briefs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    titleHi: text("title_hi"),
    summary: text("summary").notNull(), // Max 40 words, original synthesis
    sourceName: varchar("source_name", { length: 255 }).notNull(),
    sourceUrl: text("source_url").notNull(),
    sourceUrlHash: varchar("source_url_hash", { length: 64 }).notNull().unique(),
    categoryId: uuid("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    feedSourceId: uuid("feed_source_id").references(() => feedSources.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("curated_briefs_url_hash_idx").on(table.sourceUrlHash),
    index("curated_briefs_published_at_idx").on(table.publishedAt),
    index("curated_briefs_category_idx").on(table.categoryId),
  ]
);

// 7. Story Clusters Table
export const storyClusters = pgTable("story_clusters", {
  id: uuid("id").defaultRandom().primaryKey(),
  topicSlug: varchar("topic_slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  titleHi: text("title_hi"),
  editorialSummary: text("editorial_summary").notNull(),
  firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).defaultNow().notNull(),
  lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).defaultNow().notNull(),
  storyCount: integer("story_count").default(1).notNull(),
  outlets: jsonb("outlets").$type<string[]>().default([]).notNull(),
  citations: jsonb("citations")
    .$type<Array<{ title: string; source: string; url: string; publishedAt: string }>>()
    .default([])
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 8. Advertisers Table
export const advertisers = pgTable("advertisers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  website: varchar("website", { length: 255 }),
  gstNumber: varchar("gst_number", { length: 20 }),
  billingAddress: text("billing_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 9. Ad Orders Table
export const adOrders = pgTable("ad_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  advertiserId: uuid("advertiser_id")
    .references(() => advertisers.id, { onDelete: "cascade" })
    .notNull(),
  productType: adProductTypeEnum("product_type").notNull(),
  status: adOrderStatusEnum("status").default("pending_payment").notNull(),
  amountPaise: integer("amount_paise").notNull(),
  currency: varchar("currency", { length: 10 }).default("INR").notNull(),
  razorpayOrderId: varchar("razorpay_order_id", { length: 100 }),
  razorpayPaymentId: varchar("razorpay_payment_id", { length: 100 }),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 100 }),
  targetArticleId: uuid("target_article_id").references(() => articles.id, {
    onDelete: "set null",
  }),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  authorProfile: one(authors, {
    fields: [users.id],
    references: [authors.userId],
  }),
}));

export const authorsRelations = relations(authors, ({ one, many }) => ({
  user: one(users, {
    fields: [authors.userId],
    references: [users.id],
  }),
  articles: many(articles),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
  curatedBriefs: many(curatedBriefs),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  author: one(authors, {
    fields: [articles.authorId],
    references: [authors.id],
  }),
}));

export const curatedBriefsRelations = relations(curatedBriefs, ({ one }) => ({
  category: one(categories, {
    fields: [curatedBriefs.categoryId],
    references: [categories.id],
  }),
  feedSource: one(feedSources, {
    fields: [curatedBriefs.feedSourceId],
    references: [feedSources.id],
  }),
}));

export const advertisersRelations = relations(advertisers, ({ many }) => ({
  orders: many(adOrders),
}));

export const adOrdersRelations = relations(adOrders, ({ one }) => ({
  advertiser: one(advertisers, {
    fields: [adOrders.advertiserId],
    references: [advertisers.id],
  }),
  targetArticle: one(articles, {
    fields: [adOrders.targetArticleId],
    references: [articles.id],
  }),
}));
