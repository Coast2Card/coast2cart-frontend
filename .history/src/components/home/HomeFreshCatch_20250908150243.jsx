import { freshCatchItems } from "../../data/navigation";
import ItemCard from "./ItemCard";
const HomeFreshCatch = ({ className = "" }) => {
  return (
    <div className={`flex flex-col text-center ${className}`}>
      <h1 className="text-4xl font-bold text-accent mb-10">Fresh Catch</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4  gap-6 mb-8">
        {freshCatchItems.map((item) => (
          <ItemCard
            name={item.name}
            price={item.price}
            description={item.description}
            id={item.id}
          />
        ))}
      </section>
      <div className="mb-20">
        <button className="bg-secondary text-primary uppercase px-6 py-2 rounded-full text-md font-semibold hover:bg-secondary/90 transition-colors">
          View All
        </button>
      </div>
    </div>
  );
};

export default HomeFreshCatch;
