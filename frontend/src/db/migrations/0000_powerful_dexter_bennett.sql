CREATE TYPE "public"."ad_order_status" AS ENUM('pending_payment', 'paid', 'under_editorial_review', 'approved', 'published', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."ad_product_type" AS ENUM('guest_post', 'sponsored_article', 'press_release', 'newsletter_slot', 'display_banner');--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('draft', 'in_review', 'scheduled', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."article_type" AS ENUM('original', 'guest', 'sponsored', 'explainer');--> statement-breakpoint
CREATE TYPE "public"."link_rel" AS ENUM('dofollow', 'nofollow', 'sponsored');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor', 'author', 'advertiser', 'subscriber');--> statement-breakpoint
CREATE TABLE "ad_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"advertiser_id" uuid NOT NULL,
	"product_type" "ad_product_type" NOT NULL,
	"status" "ad_order_status" DEFAULT 'pending_payment' NOT NULL,
	"amount_paise" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"razorpay_order_id" varchar(100),
	"razorpay_payment_id" varchar(100),
	"stripe_payment_intent_id" varchar(100),
	"target_article_id" uuid,
	"scheduled_for" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "advertisers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"website" varchar(255),
	"gst_number" varchar(20),
	"billing_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "advertisers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"title_hi" text,
	"deck" text NOT NULL,
	"deck_hi" text,
	"body_markdown" text NOT NULL,
	"body_markdown_hi" text,
	"category_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"article_type" "article_type" DEFAULT 'original' NOT NULL,
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"reading_time_mins" integer DEFAULT 5 NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"hero_image" text NOT NULL,
	"hero_image_caption" text,
	"hero_image_credit" text,
	"key_takeaways" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"why_it_matters" text,
	"citations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_lead_story" boolean DEFAULT false NOT NULL,
	"is_secondary_story" boolean DEFAULT false NOT NULL,
	"is_breaking" boolean DEFAULT false NOT NULL,
	"is_indexable" boolean DEFAULT true NOT NULL,
	"rel_tag" "link_rel" DEFAULT 'dofollow' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"role_title" varchar(255) NOT NULL,
	"bio" text NOT NULL,
	"avatar_url" text NOT NULL,
	"twitter_handle" varchar(100),
	"email" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "authors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name_en" varchar(100) NOT NULL,
	"name_hi" varchar(100),
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "curated_briefs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"title_hi" text,
	"summary" text NOT NULL,
	"source_name" varchar(255) NOT NULL,
	"source_url" text NOT NULL,
	"source_url_hash" varchar(64) NOT NULL,
	"category_id" uuid NOT NULL,
	"feed_source_id" uuid,
	"published_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "curated_briefs_source_url_hash_unique" UNIQUE("source_url_hash")
);
--> statement-breakpoint
CREATE TABLE "feed_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"tier" integer NOT NULL,
	"adapter_type" varchar(50) NOT NULL,
	"config_json" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"license_notes" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "feed_sources_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "story_clusters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic_slug" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"title_hi" text,
	"editorial_summary" text NOT NULL,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"story_count" integer DEFAULT 1 NOT NULL,
	"outlets" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"citations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "story_clusters_topic_slug_unique" UNIQUE("topic_slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'subscriber' NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ad_orders" ADD CONSTRAINT "ad_orders_advertiser_id_advertisers_id_fk" FOREIGN KEY ("advertiser_id") REFERENCES "public"."advertisers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_orders" ADD CONSTRAINT "ad_orders_target_article_id_articles_id_fk" FOREIGN KEY ("target_article_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authors" ADD CONSTRAINT "authors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curated_briefs" ADD CONSTRAINT "curated_briefs_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curated_briefs" ADD CONSTRAINT "curated_briefs_feed_source_id_feed_sources_id_fk" FOREIGN KEY ("feed_source_id") REFERENCES "public"."feed_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_published_at_idx" ON "articles" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "curated_briefs_url_hash_idx" ON "curated_briefs" USING btree ("source_url_hash");--> statement-breakpoint
CREATE INDEX "curated_briefs_published_at_idx" ON "curated_briefs" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "curated_briefs_category_idx" ON "curated_briefs" USING btree ("category_id");