INSERT INTO venue_category (name, description)
VALUES
    ('Wedding Hall', 'Indoor halls for weddings and receptions'),
    ('Convention Center', 'Large venues for conferences and corporate events'),
    ('Resort', 'Resorts suitable for destination weddings and events'),
    ('Banquet Hall', 'Banquet halls for celebrations and gatherings'),
    ('Party Hall', 'Small and medium party venues'),
    ('Auditorium', 'Auditoriums for cultural and public events'),
    ('Conference Hall', 'Business meetings and seminars'),
    ('Sports Turf', 'Football, cricket and other sports grounds'),
    ('Farm House', 'Farm houses for private events'),
    ('Beach Venue', 'Beachside venues for weddings and parties'),
    ('Rooftop Venue', 'Open rooftop event spaces'),
    ('Community Hall', 'Community-owned multipurpose halls')
    ON CONFLICT (name) DO NOTHING;