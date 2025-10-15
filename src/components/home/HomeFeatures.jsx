import fishIcon from "../../assets/icons/fish.png";
import driedIcon from "../../assets/icons/dried.png";
import souvenirsIcon from "../../assets/icons/souvenirs.png";
import marketplaceIcon from "../../assets/icons/marketplace.png";

const features = [
  {
    icon: fishIcon,
    title: "Fresh Catch",
    description: "Daily seafood direct from local fishers.",
  },
  {
    icon: driedIcon,
    title: "Dried Goods",
    description: "High-quality dried seafood.",
  },
  {
    icon: souvenirsIcon,
    title: "Souvenirs",
    description: "Souvenirs made by our community.",
  },
  {
    icon: marketplaceIcon,
    title: "Marketplace",
    description: "Easy orders and pickup with fishing time.",
  },
];

const HomeFeatures = ({ className = "" }) => {
  return (
    <article className={` mx-auto w-full ${className}`}>
      <section className="grid grid-cols-1 sm:grid-cols-2 space-y-6 lg:grid-cols-4 gap-6 sm:w-[95%] lg:w-[90%] xl:w-[80%] mx-auto">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-start gap-2"
          >
            <div className="bg-accent mb-2 p-11 sm:p-11 flex justify-center items-center rounded-full">
              <img
                src={item.icon}
                alt={item.title}
                className="h-14 w-14 object-contain"
              />
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
