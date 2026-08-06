import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVenueCategories } from "../../services/venueCategory.service.js";
import CategoryCard from "../../components/user/CategoryCard.jsx";

export function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bgColors = [
    "hover:bg-sky-50",
    "hover:bg-amber-50",
    "hover:bg-emerald-50",
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getVenueCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">
        Venue Categories
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <Link
            key={category._id}
            to={`/venue?category=${category.identifier}`}
          >
            <CategoryCard              
              category={category}
              bgColor={bgColors[index % bgColors.length]}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}