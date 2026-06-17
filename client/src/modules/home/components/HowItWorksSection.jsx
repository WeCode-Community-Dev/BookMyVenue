const STEPS = [
    {
      title: "Search",
      desc: "Filter by location and occasion.",
      icon: "🔍",
    },
    {
      title: "Book",
      desc: "Choose your venue and reserve.",
      icon: "📅",
    },
    {
      title: "Pay",
      desc: "Pay securely online.",
      icon: "✅",
    },
  ];
  
  const HowItWorksSection = () => {
    return (
      <section className="py-16 px-5 sm:px-8 lg:px-[6%]">
  
        <div className="max-w-[1100px] mx-auto">
  
          <div className="text-center mb-10">
  
            <h2 className="text-3xl font-bold">
              Book in 3 easy steps
            </h2>
  
          </div>
  
          <div className="grid sm:grid-cols-3 gap-5">
  
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="step-card"
              >
                <div className="text-3xl mb-4">
                  {step.icon}
                </div>
  
                <h3 className="font-bold mb-2">
                  {step.title}
                </h3>
  
                <p className="text-gray-500">
                  {step.desc}
                </p>
              </div>
            ))}
  
          </div>
  
        </div>
  
      </section>
    );
  };
  
  export default HowItWorksSection;