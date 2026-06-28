import './HowItWorks.css';

export default function HowItWorks() {
  const stepsData = [
    {
      id: 1,
      number: '01',
      title: 'Find Your Space',
      desc: 'Browse through hundreds of unique spaces tailored to your exact event style and guest size.'
    },
    {
      id: 2,
      number: '02',
      title: 'Book Instantly',
      desc: 'Connect with verified hosts, confirm your date selection, and secure your booking securely.'
    },
    {
      id: 3,
      number: '03',
      title: 'Host Your Event',
      desc: 'Show up to your beautifully arranged venue and create unforgettable memories with your guests.'
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="how-header">
        <h2>How It Works</h2>
        <p>Your journey from discovery to hosting made incredibly simple.</p>
      </div>

      <div className="how-grid">
        {stepsData.map((step) => (
          <div key={step.id} className="how-card">
            <div className="how-number-badge">{step.number}</div>
            <h3 className="how-card-title">{step.title}</h3>
            <p className="how-card-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}