-- Seed script for Book My Venue (Kerala Venues)

-- 1. Ensure the presence of the Host Profile
INSERT INTO profiles (
  id, 
  name, 
  email, 
  email_verified, 
  created_at_auth, 
  updated_at_auth, 
  role
) VALUES (
  'rY2XeurYfx151wxgozkerT0DibGUFTUc', 
  'MUHAMMED A', 
  'muhammed@example.com', 
  1, 
  1718360000000, 
  1718360000000, 
  'host'
) ON CONFLICT(id) DO UPDATE SET role = 'host';

-- 2. Add the host role mapping
INSERT INTO user_roles (id, user_id, role)
VALUES ('seed-user-role-host-1', 'rY2XeurYfx151wxgozkerT0DibGUFTUc', 'host')
ON CONFLICT(user_id, role) DO NOTHING;

-- 3. Ensure the presence of a Customer Profile
INSERT INTO profiles (
  id, 
  name, 
  email, 
  email_verified, 
  created_at_auth, 
  updated_at_auth, 
  role
) VALUES (
  'customer-seed-1', 
  'Adarsh Nair', 
  'adarsh@example.com', 
  1, 
  1718360000000, 
  1718360000000, 
  'customer'
) ON CONFLICT(id) DO UPDATE SET role = 'customer';

-- 4. Add the customer role mapping
INSERT INTO user_roles (id, user_id, role)
VALUES ('seed-user-role-customer-1', 'customer-seed-1', 'customer')
ON CONFLICT(user_id, role) DO NOTHING;

-- 5. Delete existing seeded venues, bookings, and reviews to avoid duplication/FK constraint errors
DELETE FROM bookings WHERE venue_id IN (
  '8b50e7a2-1d54-47f6-953e-bfa5c73c2421',
  'f4a8dc22-83b6-4554-949e-1dc63f707f5a',
  'a9b23b1b-dcde-41c3-8818-b711e74f8c6e',
  'c5cf420d-773a-44e2-b062-1132de62c5eb',
  '5e2b0de4-91bb-4f38-89c0-54e7d97b91fc',
  '7f8f94cb-59b0-4c74-8b01-de5d2b1f81d1',
  '0be21f1d-cbbf-49f3-a1df-b463777d1302',
  '2b7b848c-7f55-4a57-ab1c-3df46399b380',
  'b1e2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
  '12345678-abcd-1234-abcd-1234567890ab'
);
DELETE FROM venues WHERE id IN (
  '8b50e7a2-1d54-47f6-953e-bfa5c73c2421',
  'f4a8dc22-83b6-4554-949e-1dc63f707f5a',
  'a9b23b1b-dcde-41c3-8818-b711e74f8c6e',
  'c5cf420d-773a-44e2-b062-1132de62c5eb',
  '5e2b0de4-91bb-4f38-89c0-54e7d97b91fc',
  '7f8f94cb-59b0-4c74-8b01-de5d2b1f81d1',
  '0be21f1d-cbbf-49f3-a1df-b463777d1302',
  '2b7b848c-7f55-4a57-ab1c-3df46399b380',
  'b1e2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
  '12345678-abcd-1234-abcd-1234567890ab'
);
DELETE FROM venues WHERE id LIKE 'venue-kerala-%'; -- Clean up the old string-based venue IDs

-- 6. Insert Venues
INSERT INTO venues (
  id,
  host_id,
  name,
  description,
  venue_type,
  capacity,
  base_price_cents,
  currency,
  address_data,
  amenities,
  cover_image_url,
  gallery_urls,
  pricing_mode,
  is_active,
  is_suspended
) VALUES 
(
  '8b50e7a2-1d54-47f6-953e-bfa5c73c2421',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Kumarakom Lake Symphony Lawn',
  'Located on the banks of the pristine Vembanad Lake in Kumarakom, this venue offers a majestic outdoor lawn with traditional Kerala architectural touches. Perfect for dreamy heritage destination weddings, evening receptions, and high-end celebrations under the stars.',
  'wedding',
  600,
  15000000, -- INR 1,50,000
  'INR',
  '{"address_line1":"Vembanad Lake Shore","address_line2":"Kumarakom North","landmark":"Near Kumarakom Bird Sanctuary","city":"Kumarakom","state":"Kerala","pincode":"686563","country":"India","gstin":"32AAACK1234F1Z1","contact_phone":"+91 9447123456","contact_email":"kumarakom.symphony@example.com","rules":"No firecrackers allowed near the lake. DJ allowed till 10 PM. No outside catering.","cancellation_policy":"50% refund for cancellations made 30 days prior to the event.","min_booking_hours":8}',
  '["Lake View","Spacious Lawn","Traditional Stage","Valet Parking","Catering Service","AC Changing Rooms","Wi-Fi"]',
  '/api/storage/public/venue-images/seed/kumarakom_cover.jpg',
  '["/api/storage/public/venue-images/seed/kumarakom_gallery_1.jpg","/api/storage/public/venue-images/seed/kumarakom_gallery_2.jpg"]',
  'per_day',
  1,
  0
),
(
  'f4a8dc22-83b6-4554-949e-1dc63f707f5a',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Munnar Tea Valley Heritage Hall',
  'Nestled amidst the lush green rolling tea gardens of Munnar, this heritage conference hall features high ceilings, timber cladding, and breathtaking views of the misty valleys. It is fully equipped with modern audio-visual technology, making it the perfect choice for corporate retreats, seminars, and strategic workshops.',
  'conference',
  150,
  2500000, -- INR 25,000
  'INR',
  '{"address_line1":"Tea Estate Road","address_line2":"Chithirapuram","landmark":"Near Pallivasal Powerhouse","city":"Munnar","state":"Kerala","pincode":"685565","country":"India","gstin":"32AAACK5678F1Z2","contact_phone":"+91 9447234567","contact_email":"munnar.valley@example.com","rules":"Eco-friendly zone. Littering strictly prohibited. Smoking is allowed only in designated areas.","cancellation_policy":"Full refund up to 14 days before the event.","min_booking_hours":4}',
  '["Valley View","High-speed Wi-Fi","AV Projector","Microphones","Generator Backup","Coffee Station","Catering Space"]',
  '/api/storage/public/venue-images/seed/munnar_cover.jpg',
  '["/api/storage/public/venue-images/seed/munnar_gallery_1.jpg","/api/storage/public/venue-images/seed/munnar_gallery_2.jpg"]',
  'per_hour',
  1,
  0
),
(
  'a9b23b1b-dcde-41c3-8818-b711e74f8c6e',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Varkala Cliff-Side Ocean Vista',
  'Perched high on the famous red cliffs of Varkala, this stunning venue offers uninterrupted panoramic views of the Arabian Sea. With an open-air deck, chic lounge seating, and tropical beach vibes, it is the ultimate spot for sunset cocktail parties, birthdays, and private social gatherings.',
  'party',
  120,
  1500000, -- INR 15,000
  'INR',
  '{"address_line1":"North Cliff","address_line2":"Kurakkanni","landmark":"Near Helipad","city":"Varkala","state":"Kerala","pincode":"695141","country":"India","gstin":"","contact_phone":"+91 9447345678","contact_email":"varkala.vista@example.com","rules":"Outside alcohol allowed with permit. Music level must be reduced after 11 PM.","cancellation_policy":"Non-refundable within 7 days of event.","min_booking_hours":3}',
  '["Ocean View","Sunset Deck","Sound System","Cocktail Bar Setup","Wi-Fi","Catering Allowed","Parking"]',
  '/api/storage/public/venue-images/seed/varkala_cover.jpg',
  '["/api/storage/public/venue-images/seed/varkala_gallery_1.jpg","/api/storage/public/venue-images/seed/varkala_gallery_2.jpg"]',
  'per_hour',
  1,
  0
),
(
  'c5cf420d-773a-44e2-b062-1132de62c5eb',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Eranad Heritage Naalukettu Palace',
  'Step back in time at this authentic, painstakingly restored traditional Kerala Naalukettu mansion in Thrissur. Featuring a central open courtyard (Nadumuttam), exquisite teak pillars, and hand-painted tiles, it provides a deeply cultural and majestic backdrop for traditional wedding ceremonies, pre-wedding rituals, and classical events.',
  'wedding',
  300,
  9500000, -- INR 95,000
  'INR',
  '{"address_line1":"Heritage Village Road","address_line2":"Cheruthuruthy","landmark":"Near Kerala Kalamandalam","city":"Thrissur","state":"Kerala","pincode":"679531","country":"India","gstin":"32AAACK9012F1Z3","contact_phone":"+91 9447456789","contact_email":"eranad.naalukettu@example.com","rules":"Only vegetarian food allowed inside the main heritage house. Footwear is restricted in the inner courtyard.","cancellation_policy":"80% refund up to 30 days in advance.","min_booking_hours":12}',
  '["Central Courtyard","Heritage Ambience","AC Groom & Bride Rooms","Traditional Dining Hall","In-house Temple Structure","Ample Parking"]',
  '/api/storage/public/venue-images/seed/eranad_cover.jpg',
  '["/api/storage/public/venue-images/seed/eranad_gallery_1.jpg","/api/storage/public/venue-images/seed/eranad_gallery_2.jpg"]',
  'per_day',
  1,
  0
),
(
  '5e2b0de4-91bb-4f38-89c0-54e7d97b91fc',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Kochi Waterfront Grand Ballroom',
  'Located on the Bolgatty Island waterfront, this state-of-the-art ballroom offers a vast column-free indoor space with a sophisticated pre-function lounge and a waterfront deck. It is the premier choice for large-scale international conferences, corporate galas, trade exhibitions, and premium award ceremonies.',
  'conference',
  1200,
  35000000, -- INR 3,50,000
  'INR',
  '{"address_line1":"Bolgatty Marina Road","address_line2":"Mulavukad","landmark":"Opposite Bolgatty Palace","city":"Kochi","state":"Kerala","pincode":"682050","country":"India","gstin":"32AAACK3456F1Z4","contact_phone":"+91 9447567890","contact_email":"kochi.ballroom@example.com","rules":"Compliance with all fire safety regulations. Sound restrictions apply after midnight.","cancellation_policy":"Strict: 25% refund for cancellations up to 45 days prior.","min_booking_hours":8}',
  '["Central AC","Marina & River Views","High-speed Wi-Fi","Advanced Sound & Light System","Professional Catering Stage","Valet Parking for 200 cars","Dedicated VIP Lounges"]',
  '/api/storage/public/venue-images/seed/kochi_cover.jpg',
  '["/api/storage/public/venue-images/seed/kochi_gallery_1.jpg","/api/storage/public/venue-images/seed/kochi_gallery_2.jpg"]',
  'per_day',
  1,
  0
),
(
  '7f8f94cb-59b0-4c74-8b01-de5d2b1f81d1',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Alleppey Backwater Royal Houseboat',
  'Cruise in style along the serene backwaters of Alleppey on our triple-deck luxury houseboat. Featuring fully air-conditioned bedroom suites, a glass-walled conference lounge, and an open sun deck, this unique moving venue is perfect for intimate family celebrations, high-level board meetings, and sunset cocktail cruises.',
  'other',
  50,
  8000000, -- INR 80,000
  'INR',
  '{"address_line1":"Punnamada Finishing Point","address_line2":"Starting Point Jetty","landmark":"Near Punnamada Lake","city":"Alappuzha","state":"Kerala","pincode":"688006","country":"India","gstin":"","contact_phone":"+91 9447678901","contact_email":"alleppey.houseboat@example.com","rules":"Life jackets are mandatory during cruising. Cruise timings are 11 AM to 5:30 PM. Over-night anchoring at designated spots.","cancellation_policy":"Full refund up to 15 days before departure.","min_booking_hours":24}',
  '["Fully Air Conditioned","Onboard Chef & Traditional Kerala Kitchen","Sunset Deck","Wi-Fi","Sound System","Bedrooms for Overnight Stay","River Cruise Route"]',
  '/api/storage/public/venue-images/seed/alleppey_cover.jpg',
  '["/api/storage/public/venue-images/seed/alleppey_gallery_1.jpg","/api/storage/public/venue-images/seed/alleppey_gallery_2.jpg"]',
  'per_day',
  1,
  0
),
(
  '0be21f1d-cbbf-49f3-a1df-b463777d1302',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Wayanad Rainforest Sanctuary Canopy Lounge',
  'Surrounded by a dense tropical rainforest canopy and whispering streams, this unique open-air treehouse-style deck in Wayanad offers a serene, close-to-nature celebration space. It is designed for luxury camping events, bonfire nights, acoustic musical gatherings, and wellness retreats.',
  'celebration',
  60,
  4500000, -- INR 45,000
  'INR',
  '{"address_line1":"Vythiri Forest Road","address_line2":"Lakkidi Ghats","landmark":"Near Lakkidi View Point","city":"Wayanad","state":"Kerala","pincode":"673576","country":"India","gstin":"32AAACK7890F1Z5","contact_phone":"+91 9447789012","contact_email":"wayanad.canopy@example.com","rules":"No plastic bottles or wrappers allowed in the forest area. Loud music is restricted after 9:30 PM due to forest regulations.","cancellation_policy":"7 days advance cancellation receives 90% refund.","min_booking_hours":6}',
  '["Rainforest Canopy View","Natural Brook Access","Bonfire Pit","Eco-friendly Dining","Solar Power Backup","Guided Nature Walks","Wi-Fi"]',
  '/api/storage/public/venue-images/seed/wayanad_cover.jpg',
  '["/api/storage/public/venue-images/seed/wayanad_gallery_1.jpg","/api/storage/public/venue-images/seed/wayanad_gallery_2.jpg"]',
  'per_day',
  1,
  0
),
(
  '2b7b848c-7f55-4a57-ab1c-3df46399b380',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Fort Kochi Colonial Courtyard',
  'A delightful colonial-era courtyard featuring Portuguese and Dutch architectural accents, located in the historic heart of Fort Kochi. Surrounded by heritage trees, exposed brick walls, and twinkling fairy lights, this venue is ideal for boutique engagements, art exhibitions, unplugged music shows, and vintage-themed parties.',
  'celebration',
  100,
  800000, -- INR 8,000
  'INR',
  '{"address_line1":"Princess Street","address_line2":"Fort Kochi","landmark":"Near Santa Cruz Basilica","city":"Kochi","state":"Kerala","pincode":"682001","country":"India","gstin":"","contact_phone":"+91 9447890123","contact_email":"fortkochi.courtyard@example.com","rules":"Respect local historical guidelines. No loud amplified music after 10 PM. Outside decorators are welcome.","cancellation_policy":"Full refund up to 7 days before event.","min_booking_hours":4}',
  '["Colonial Charm","Ambient Lighting","Catering Prep Area","Restrooms","Fairy Lights Decor","Wi-Fi","Close to Beach"]',
  '/api/storage/public/venue-images/seed/fortkochi_cover.jpg',
  '["/api/storage/public/venue-images/seed/fortkochi_gallery_1.jpg","/api/storage/public/venue-images/seed/fortkochi_gallery_2.jpg"]',
  'per_hour',
  1,
  0
),
(
  'b1e2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Ashtamudi Lake Vista Island Resort',
  'Located on a private island in the middle of Ashtamudi Lake in Kollam, this premium venue is reachable only by a scenic 5-minute boat ride. Featuring a luxury pool deck, palm trees, and an open bar lounge, it is the ultimate destination for high-end pool parties, elite family celebrations, and VIP gatherings.',
  'party',
  250,
  20000000, -- INR 2,00,000
  'INR',
  '{"address_line1":"Ashtamudi Private Isle","address_line2":"Mathilil","landmark":"Boat Jetty near Ashtamudi Bridge","city":"Kollam","state":"Kerala","pincode":"691601","country":"India","gstin":"32AAACK1234E1Z6","contact_phone":"+91 9447901234","contact_email":"ashtamudi.island@example.com","rules":"Includes free boat shuttle service for guests. Swimwear required for pool usage. Outside catering not allowed.","cancellation_policy":"No refund within 14 days. 50% refund up to 30 days.","min_booking_hours":12}',
  '["Private Island Access","Swimming Pool & Pool Deck","Open-air Bar Counter","Scenic Speedboat Transfers","In-house DJ & sound","Water Sports Available","Premium AC Lounge"]',
  '/api/storage/public/venue-images/seed/ashtamudi_cover.jpg',
  '["/api/storage/public/venue-images/seed/ashtamudi_gallery_1.jpg","/api/storage/public/venue-images/seed/ashtamudi_gallery_2.jpg"]',
  'per_day',
  1,
  0
),
(
  '12345678-abcd-1234-abcd-1234567890ab',
  'rY2XeurYfx151wxgozkerT0DibGUFTUc',
  'Kovalam Shoreline Wedding Pavilion',
  'A magnificent open-air beachfront pavilion overlooking the famous lighthouse beach in Kovalam. Exchange vows with the soothing sound of the waves and a spectacular golden sunset background. Designed with elegant white draping, traditional brass lamps, and customizable oceanfront stage setups.',
  'wedding',
  400,
  18000000, -- INR 1,80,000
  'INR',
  '{"address_line1":"Lighthouse Beach Road","address_line2":"Kovalam Beach","landmark":"Behind Kovalam Lighthouse","city":"Kovalam","state":"Kerala","pincode":"695527","country":"India","gstin":"32AAACK5678E1Z7","contact_phone":"+91 9447012345","contact_email":"kovalam.shoreline@example.com","rules":"Beach permissions included in booking fee. Environmental protection guidelines must be followed. Safe swimming zones are marked.","cancellation_policy":"Full refund if cancelled 60 days before event; 50% refund if cancelled between 30 to 60 days.","min_booking_hours":8}',
  '["Direct Beach Front","Panoramic Ocean Sunset View","Stage Draping & Lighting","VIP Dining Area","Valet Parking","Air-conditioned VIP Suites","Sound & Microphone Set"]',
  '/api/storage/public/venue-images/seed/kovalam_cover.jpg',
  '["/api/storage/public/venue-images/seed/kovalam_gallery_1.jpg","/api/storage/public/venue-images/seed/kovalam_gallery_2.jpg"]',
  'per_day',
  1,
  0
);

-- 7. Ensure reviews don't overlap
DELETE FROM venue_reviews WHERE id LIKE 'rev-kerala-%';

-- 8. Seed Reviews
INSERT INTO venue_reviews (id, venue_id, user_id, rating, feedback)
VALUES 
('rev-kerala-1', '8b50e7a2-1d54-47f6-953e-bfa5c73c2421', 'customer-seed-1', 5, 'An absolute paradise! The lakeside view during sunset was breathtaking. Highly recommend for weddings.'),
('rev-kerala-2', 'f4a8dc22-83b6-4554-949e-1dc63f707f5a', 'customer-seed-1', 4, 'Very professional setup and beautiful views of the tea gardens. The audio system was top notch.'),
('rev-kerala-3', 'a9b23b1b-dcde-41c3-8818-b711e74f8c6e', 'customer-seed-1', 5, 'Best sunset cocktail party ever! The cliffside view is unbeatable.'),
('rev-kerala-4', '7f8f94cb-59b0-4c74-8b01-de5d2b1f81d1', 'customer-seed-1', 5, 'Cruising through Alappuzha waters while enjoying freshly caught Karimeen was amazing. Top experience!'),
('rev-kerala-5', '0be21f1d-cbbf-49f3-a1df-b463777d1302', 'customer-seed-1', 4, 'Waking up to the sounds of nature and the misty forest was dreamlike. Excellent service.');
