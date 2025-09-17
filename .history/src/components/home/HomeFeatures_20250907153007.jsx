import cartIcon from "../../assets/icons/cart.png";
import commentIcon from "../../assets/icons/comment.png";
import profileIcon from "../../assets/icons/profile.png";
import searchIcon from "../../assets/icons/search.png";

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
      <section className="grid grid-cols-1 bg-red-100 sm:grid-cols-2 space-y-6 lg:grid-cols-4 gap-6 sm:w-[95%] lg:w-[90%] xl:w-[80%] mx-auto">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-start gap-2"
          >
            <div className="bg-accent mb-2 p-11 sm:p-11 flex justify-center items-center rounded-full">
              <div className="bg-gray-300 rounded-xl p-1 h-14 w-14"></div>
            </div>
            <h3 className="text-2xl font-bold text-primary">{item.title}</h3>
            <h3 className="text-md text-center">{item.description}</h3>
          </div>
        ))}
      </section>
    </article>
  );
};

export default HomeFeatures;
