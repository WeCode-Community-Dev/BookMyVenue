const CATEGORIES = [
    { icon: "💍", label: "Weddings" },
    { icon: "🏢", label: "Corporate" },
    { icon: "🎉", label: "Parties" },
    { icon: "🌿", label: "Outdoor" },
    { icon: "🎓", label: "Graduation" },
    { icon: "🎭", label: "Performances" },
  ];
  
  const CategoriesSection = () => {
    return (
      <section className="py-14 px-5 sm:px-8 lg:px-[6%] border-t">
  
        <div className="max-w-[1200px] mx-auto">
  
          <h2 className="text-2xl font-bold mb-6">
            Browse by occasion
          </h2>
  
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <div
                key={category.label}
                className="cat-chip"
              >
                <span>{category.icon}</span>
  
                {category.label}
              </div>
            ))}
          </div>
  
        </div>
  
      </section>
    );
  };
  
  export default CategoriesSection;