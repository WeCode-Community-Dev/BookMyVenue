import NavBar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Hero = () => (
  <section className="max-w-7xl mx-auto px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div className="space-y-6 md:pr-10">
      <div className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
        Host Community
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
        Turn your extra space into <span className="text-[#ff6660] italic font-serif">community impact.</span>
      </h1>
      <p className="text-gray-600 text-lg leading-relaxed">
        Earn extra income while providing a sanctuary for local creators, teachers, and neighbors. Our platform makes it effortless to list, manage, and grow your neighborhood venue.
      </p>
      
      <div className="flex flex-wrap items-center gap-4 pt-4">
        <Link to="/host/dashboard" className="bg-[#ff6660] cursor-pointer text-white px-6 py-3 rounded-xl font-medium flex items-center hover:bg-[#e55b56] transition-colors shadow-sm">
            Start Listing
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </Link>
        <a href='#howitworks' className="border border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors" >
            How it works
        </a>
      </div>

      <div className="flex items-center gap-3 pt-6">
        <div className="flex -space-x-2">
          <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User 1" />
          <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User 2" />
          <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="User 3" />
        </div>
        <span className="text-sm text-gray-500 font-medium">Joined by 1,200+ local hosts</span>
      </div>
    </div>

    <div className="relative">
      <img 
        src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80" 
        alt="Empty studio space with large windows" 
        className="rounded-3xl object-cover w-full h-[500px] shadow-lg"
      />
      <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl flex justify-between items-center shadow-md">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Micro-Venue</p>
          <p className="font-bold text-gray-900 text-lg">Sunset Yoga Studio</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl text-gray-900">$450</p>
          <p className="text-xs text-gray-500 font-medium">Earned today</p>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    {
      title: "Easy Management",
      desc: "Sync your calendar, set custom pricing, and manage bookings from our intuitive dashboard designed for busy people.",
      icon: (
        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Trusted Neighbors",
      desc: "Every guest is verified. Read reviews and communicate directly before accepting any booking to ensure a perfect fit.",
      icon: (
        <svg className="w-6 h-6 text-[#ff6660]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Transparent Earnings",
      desc: "No hidden fees. Get paid directly to your bank account 24 hours after every successful booking. Track it all in real-time.",
      icon: (
        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-[#faf9f8] py-20 px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          We've built the tools so you can focus on building your community and growing your revenue.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl text-left border border-gray-100">
              <div className="w-12 h-12 bg-[#faf9f8] rounded-md flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: 1,
      title: "Create Profile",
      desc: "Tell us about yourself and your venue's mission. Highlight the unique character of your space."
    },
    {
      num: 2,
      title: "List Details",
      desc: "Add professional photos, set your rules, and pick your available hours. You have total control."
    },
    {
      num: 3,
      title: "Receive Bookings",
      desc: "Review requests as they come in. Chat with organizers and confirm the sessions you love."
    }
  ];

  return (
    <section id='howitworks' className="max-w-7xl mx-auto py-24 px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-10">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-6">
            {/* Updated number bubble to #ff6660 */}
            <div className="shrink-0 w-8 h-8 rounded-full bg-[#ff6660] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {step.num}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <img 
          src="https://images.unsplash.com/photo-1487700160041-babef9c3cb55?auto=format&fit=crop&w=800&q=80" 
          alt="Plants on a credenza" 
          className="rounded-3xl w-full h-[500px] object-cover shadow-lg"
        />
      </div>
    </section>
  );
};

const EarningPotential = () => {
  const spaces = [
    { name: "Creative Studio", price: "$45" },
    { name: "Photo Studio", price: "$65" },
    { name: "Event Hall", price: "$120" }
  ];

  return (
    <section className="bg-[#e9e4d5] py-24 px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">See your earning potential</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {/* Updated highlight text to #ff6660 */}
            Hosts in neighborhoods like yours are earning an average of <span className="font-bold text-[#ff6660]">$1,200/month</span> by listing under-utilized spaces.
          </p>
          <div className="space-y-4">
            {spaces.map((space, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 px-6 py-4 rounded-xl border border-gray-100">
                <span className="font-semibold text-gray-800">{space.name}</span>
                <div className="text-gray-900 font-bold text-lg">
                  {space.price} <span className="text-gray-500 font-normal text-sm">/ hr</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#ff6660] text-white rounded-3xl p-10 text-center relative overflow-hidden shadow-md">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-6">Host Spotlight</h3>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100" 
              alt="Davis K." 
              className="w-16 h-16 rounded-full mx-auto mb-6 border-2 border-white/40"
            />
            <p className="italic text-white mb-6 leading-relaxed">
              "BookMyVenue transformed my extra garage into a vibrant community pottery studio. It's paying my mortgage and I've met the most incredible local artists."
            </p>
            <p className="font-semibold text-sm">— Davis K., Brooklyn, NY</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I protect if something gets damaged?",
      answer: "We provide up to $1,000,000 in liability and property damage protection for every booking. Additionally, you can require a custom security deposit from guests before they book your space."
    },
    {
      question: "How do I get paid and how often?",
      answer: "Payments are processed securely through our platform and deposited directly into your bank account. Payouts are typically released 24 hours after your guest's scheduled check-in time."
    },
    {
      question: "Can I choose who books my space?",
      answer: "Absolutely. You can choose to manually review and approve every booking request, or use 'Instant Book' but set strict requirements—such as requiring a verified ID or past positive reviews."
    },
    {
      question: "Does it cost anything to list?",
      answer: "Creating a listing is completely free. We only deduct a standard host service fee (typically 3%) from your payout once a reservation is successfully confirmed to cover payment processing and platform support."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Common host questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <div 
              key={i} 
              onClick={() => toggleFAQ(i)}
              className="bg-gray-50 rounded-xl px-6 py-5 cursor-pointer hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="px-8 pb-24 max-w-6xl mx-auto">
    <div className="bg-[#ff6660] rounded-[2.5rem] p-16 text-center text-white shadow-lg">
      <h2 className="text-4xl font-bold mb-4">Ready to share your space?</h2>
      <p className="text-white max-w-2xl mx-auto mb-10 text-lg">
        Join thousands of hosts making a difference in their neighborhoods. Your space is exactly what someone is looking for.
      </p>
      <Link to="/host/dashboard" className="bg-white inline-block text-[#ff6660] cursor-pointer px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors mb-4 shadow-sm" >
        Join the Host Community
      </Link>
      <p className="text-sm text-white/80">Takes less than 5 minutes to get started.</p>
    </div>
  </section>
);

export default function BookMyVenueLanding() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-rose-100 selection:text-rose-900">
      <NavBar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <EarningPotential />
        <FAQ />
        <CTA />
      </main>
    </div>
  );
}