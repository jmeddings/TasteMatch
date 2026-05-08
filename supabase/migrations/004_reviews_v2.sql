-- Reviews v2: add status enum and align fields with Review entity

DO $$ BEGIN
  CREATE TYPE public.review_status AS ENUM ('draft', 'published');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Existing schema created public.reviews; migrate it to new field names.

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS status public.review_status NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS photo_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Copy old images to photo_urls if images exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reviews'
      AND column_name = 'images'
  ) THEN
    UPDATE public.reviews
      SET photo_urls = COALESCE(images, ARRAY[]::TEXT[])
      WHERE (photo_urls IS NULL OR array_length(photo_urls, 1) IS NULL);
  END IF;
END $$;

-- Rename columns if they exist
DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reviews'
      AND column_name = 'review_text'
  ) THEN
    ALTER TABLE public.reviews RENAME COLUMN review_text TO content;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'reviews'
      AND column_name = 'id'
  ) THEN
    ALTER TABLE public.reviews RENAME COLUMN id TO review_id;
  END IF;
END $$;

-- If old images column exists, keep it for compatibility for now.

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_dish_id ON public.reviews(dish_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- RLS policies (ensure table is protected)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'reviews'
      AND policyname = 'Reviews are viewable by everyone'
  ) THEN
    CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'reviews'
      AND policyname = 'Users can manage own reviews'
  ) THEN
    CREATE POLICY "Users can manage own reviews" ON public.reviews FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
