import cartIcon from "../../assets/icons/cart.png";
import commentIcon from "../../assets/icons/comment.png";
import profileIcon from "../../assets/icons/profile.png";
import searchIcon from "../../assets/icons/search.png";
import ItemCard from "./ItemCard";

const features = [
  {
    icon: cartIcon,
    title: "Fresh Catch",
    description: "Daily seafood direct from local fishers.",
  },
  {
    icon: searchIcon,
    title: "Dried Goods",
    description: "High-quality dried seafood.",
  },
  {
    icon: commentIcon,
    title: "Souvenirs",
    description: "Souvenirs made by our community.",
  },
  {
    icon: profileIcon,
    title: "Marketplace",
    description: "Easy orders and pickup with fishing time.",
  },
];

const HomeFeatures = ({ className = "" }) => {
  return (
    <article className={` mx-auto w-full ${className}`}>
      <section className="grid grid-cols-1 sm:grid-cols-2 space-y-6 lg:grid-cols-4 gap-6 sm:w-[95%] lg:w-[90%] xl:w-[80%] mx-auto">
        {features.map((item, index) => (
          <ItemCard
            title={item.title}
            description={item.description}
            key={index}
          />
        ))}
      </section>
    </article>
  );
};

export default HomeFeatures;
