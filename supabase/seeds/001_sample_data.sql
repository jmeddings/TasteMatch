-- Sample data for TasteMatch application

-- Insert flavor profiles
INSERT INTO public.flavor_profiles (name, description) VALUES
('Spicy', 'Hot and peppery flavors'),
('Sweet', 'Sugary and honey-like tastes'),
('Savory', 'Rich and umami flavors'),
('Sour', 'Tangy and acidic tastes'),
('Bitter', 'Sharp and pungent flavors'),
('Salty', 'Seasoned and briny tastes'),
('Creamy', 'Smooth and rich textures'),
('Crispy', 'Crunchy and firm textures'),
('Smoky', 'Charred and wood-fired flavors'),
('Herby', 'Fresh and aromatic herbs'),
('Cheesy', 'Dairy-based and rich flavors'),
('Nutty', 'Earthy and nut-like tastes');

-- Insert sample restaurants
INSERT INTO public.restaurants (name, description, address, city, state, zip_code, latitude, longitude, phone, website, rating, price_range, cuisine_types) VALUES
('Ramen House', 'Authentic Japanese ramen and small plates', '123 Main St', 'Downtown', 'CA', '90210', 34.0522, -118.2437, '555-0123', 'https://ramenhouse.com', 4.8, 2, ARRAY['Japanese', 'Asian', 'Ramen']),
('Pizza Palace', 'Traditional Italian pizza with modern twists', '456 Oak Ave', 'Midtown', 'CA', '90211', 34.0522, -118.2437, '555-0124', 'https://pizzapalace.com', 4.6, 2, ARRAY['Italian', 'Pizza', 'Casual']),
('Taco Town', 'Authentic Mexican street food and tacos', '789 Elm St', 'Uptown', 'CA', '90212', 34.0522, -118.2437, '555-0125', 'https://tacotown.com', 4.5, 1, ARRAY['Mexican', 'Tacos', 'Street Food']),
('Burger Barn', 'Gourmet burgers and craft beer', '321 Pine Rd', 'Westside', 'CA', '90213', 34.0522, -118.2437, '555-0126', 'https://burgerbarn.com', 4.4, 2, ARRAY['American', 'Burgers', 'Bar Food']),
('Sushi Central', 'Fresh sushi and Japanese cuisine', '654 Maple Dr', 'Eastside', 'CA', '90214', 34.0522, -118.2437, '555-0127', 'https://sushicentral.com', 4.7, 3, ARRAY['Japanese', 'Sushi', 'Seafood']);

-- Insert sample dishes
INSERT INTO public.dishes (restaurant_id, name, description, price, rating, flavors, dietary_restrictions, spicy_level) VALUES
((SELECT id FROM public.restaurants WHERE name = 'Ramen House'), 'Spicy Miso Ramen', 'Rich miso broth with tender chashu pork, soft-boiled egg, and green onions', 14.99, 4.8, ARRAY['Spicy', 'Savory', 'Rich'], ARRAY['Gluten'], 3),
((SELECT id FROM public.restaurants WHERE name = 'Ramen House'), 'Tonkotsu Ramen', 'Creamy pork bone broth with thin noodles and traditional toppings', 13.99, 4.7, ARRAY['Savory', 'Rich', 'Creamy'], ARRAY['Gluten'], 1),
((SELECT id FROM public.restaurants WHERE name = 'Pizza Palace'), 'Margherita Pizza', 'Classic pizza with fresh mozzarella, tomatoes, and basil', 12.99, 4.6, ARRAY['Savory', 'Cheesy', 'Herby'], ARRAY['Vegetarian'], 0),
((SELECT id FROM public.restaurants WHERE name = 'Pizza Palace'), 'Pepperoni Pizza', 'Traditional pepperoni with mozzarella cheese', 14.99, 4.5, ARRAY['Savory', 'Spicy', 'Cheesy'], ARRAY['None'], 1),
((SELECT id FROM public.restaurants WHERE name = 'Taco Town'), 'Al Pastor Tacos', 'Marinated pork with pineapple, cilantro, and onions', 3.99, 4.5, ARRAY['Spicy', 'Savory', 'Sweet'], ARRAY['None'], 2),
((SELECT id FROM public.restaurants WHERE name = 'Taco Town'), 'Carnitas Tacos', 'Slow-cooked pork with traditional toppings', 3.49, 4.4, ARRAY['Savory', 'Rich'], ARRAY['None'], 0),
((SELECT id FROM public.restaurants WHERE name = 'Burger Barn'), 'Classic Cheeseburger', 'Angus beef patty with cheese, lettuce, tomato, and special sauce', 12.99, 4.4, ARRAY['Savory', 'Cheesy'], ARRAY['None'], 0),
((SELECT id FROM public.restaurants WHERE name = 'Burger Barn'), 'Spicy BBQ Burger', 'Beef patty with spicy BBQ sauce, onion rings, and jalapeños', 14.99, 4.3, ARRAY['Spicy', 'Savory', 'Sweet'], ARRAY['None'], 3),
((SELECT id FROM public.restaurants WHERE name = 'Sushi Central'), 'California Roll', 'Crab, avocado, and cucumber with sesame seeds', 8.99, 4.7, ARRAY['Savory', 'Creamy'], ARRAY['None'], 0),
((SELECT id FROM public.restaurants WHERE name = 'Sushi Central'), 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo and cucumber', 10.99, 4.6, ARRAY['Spicy', 'Savory', 'Fresh'], ARRAY['None'], 2);

-- Insert dish flavor relationships with intensity
INSERT INTO public.dish_flavors (dish_id, flavor_id, intensity)
SELECT d.id, f.id, CASE 
  WHEN f.name = ANY(d.flavors) THEN 4
  ELSE 0
END
FROM public.dishes d, public.flavor_profiles f
WHERE f.name = ANY(d.flavors);

-- Note: In a real application, you would also insert:
-- - Sample user profiles (these would come from Supabase Auth)
-- - Sample favorites
-- - Sample reviews
-- - Sample search history

-- The above data provides a good foundation for testing the application functionality
