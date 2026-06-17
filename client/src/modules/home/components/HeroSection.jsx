const HeroSection = () => {
    return (
      <section className="pt-28 sm:pt-32 pb-14 sm:pb-20 px-5 sm:px-8 lg:px-[6%] max-w-[1200px] mx-auto">
  
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3.5 py-[5px] mb-5">
          <span className="w-[7px] h-[7px] rounded-full bg-green-500" />
  
          <span className="text-sm font-semibold text-green-700">
            10,000+ venues across India
          </span>
        </div>
  
        <h1 className="text-[2.2rem] sm:text-[3rem] font-extrabold leading-[1.1] tracking-[-0.03em] max-w-[700px] mb-5">
          Book the perfect venue for every occasion
        </h1>
  
        <p className="text-gray-500 max-w-[500px] leading-[1.7]">
          Weddings, corporate events, parties and more —
          discover, compare and book in minutes.
        </p>
      </section>
    );
  };
  
  export default HeroSection;