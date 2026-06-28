import './Testimonials.css';

export default function Testimonials() {
  const testimonialData = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Event Planner',
      text: 'BookMyVenue made finding a workshop space incredibly simple. The real-time availability saved us weeks of back-and-forth emails.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Tech Lead',
      text: 'We hosted our annual team hackathon at a loft we discovered here. Seamless communication with the host and top-tier amenities.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Elena Rostova',
      role: 'Bride',
      text: 'Finding our dream wedding venue felt impossible until we used this platform. The filtering tools helped us find the perfect glass atelier.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2>What Our Users Say</h2>
        <p>Discover how event hosts and planners are finding their perfect spaces.</p>
      </div>

      <div className="testimonials-grid">
        {testimonialData.map((item) => (
          <div key={item.id} className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">"{item.text}"</p>
            <div className="testimonial-profile">
              <img src={item.avatar} alt={item.name} className="testimonial-avatar" />
              <div>
                <h4 className="testimonial-name">{item.name}</h4>
                <p className="testimonial-role">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}