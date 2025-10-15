import { freshCatchItems } from "../../data/navigation";
import ItemCard from "./ItemCard";
const HomeFreshCatch = ({ className = "" }) => {
  return (
    <div className={`flex flex-col text-center ${className}`}>
      <h1 className="text-accent text-center text-4xl xl:text-5xl font-bold mb-12">
        Fresh Catch
      </h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4  gap-6 mb-8">
        {freshCatchItems.map((item) => (
          <ItemCard
            key={item.id}
            name={item.name}
            price={item.price}
            description={item.description}
            id={item.id}
            image={item.image}
          />
        ))}
      </section>
      <div className="mb-20">
        <a
          href="/seafood"
          className="bg-secondary text-primary uppercase px-6 py-2 rounded-full text-md font-semibold hover:bg-secondary/90 transition-colors inline-block"
        >
          View All
        </a>
      </div>
    </div>
  );
};

export default HomeFreshCatch;
