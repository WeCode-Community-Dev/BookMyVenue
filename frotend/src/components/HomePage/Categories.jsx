
import './Categories.css';

export default function Categories() {
  const categoryData = [
    { id: 1, name: 'Weddings', desc: 'Romantic & Grand', icon: '❤️' },
    { id: 2, name: 'Workshops', desc: 'Creative & Focused', icon: '💡' },
    { id: 3, name: 'Parties', desc: 'Lively & Social', icon: '🎉' },
    { id: 4, name: 'Meetings', desc: 'Corporate & Pro', icon: '👥' }
  ];

  return (
    <section className="categories-section">
      <div className="categories-header">
        <div>
          <h2>Browse by Category</h2>
          <p className="categories-subtitle">Find the perfect layout setup for your event type.</p>
        </div>
      </div>

      <div className="categories-grid">
        {categoryData.map((category) => (
          <div key={category.id} className="category-card">
            
            <div className="category-top-banner">
              <div className="category-icon-circle">
                <span className="category-icon">{category.icon}</span>
              </div>
            </div>

            <div className="category-details">
              <h3 className="category-title">{category.name}</h3>
              <p className="category-desc">{category.desc}</p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}