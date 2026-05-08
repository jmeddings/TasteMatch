-- Add color_tag to dishes for recommendation card color coding

ALTER TABLE public.dishes
  ADD COLUMN IF NOT EXISTS color_tag TEXT;

CREATE INDEX IF NOT EXISTS idx_dishes_color_tag ON public.dishes(color_tag);
