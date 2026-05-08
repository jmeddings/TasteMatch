-- Taste profiles for onboarding and preference storage

CREATE TABLE IF NOT EXISTS public.taste_profiles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.taste_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own taste profile" ON public.taste_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own taste profile" ON public.taste_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own taste profile" ON public.taste_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER handle_taste_profiles_updated_at
  BEFORE UPDATE ON public.taste_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
