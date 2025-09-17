const freshCatchItems = [
  {
    id: 1,
    price: "₱360/kg",
    name: "Dalagang Bukid Bilog",
    description: "Fresh Chilled Twinstripe Fusilier",
    image: null,
  },
  {
    id: 2,
    price: "₱420/kg",
    name: "Bangus",
    description: "Fresh milkfish from local farms",
    image: null,
  },
  {
    id: 3,
    price: "₱520/kg",
    name: "Bisugo",
    description: "Premium cuts, freshly caught",
    image: null,
  },
  {
    id: 4,
    price: "₱300/kg",
    name: "Hasa-hasa",
    description: "Locally sourced mackerel",
    image: null,
  },
];

const HomeFreshCatch = ({ className = "" }) => {
  return (
    <div className={`flex flex-col text-center ${className}`}>
      <h1 className="text-4xl font-bold text-accent mb-10">Fresh Catch</h1>
      <section className="grid grid-cols-1 grid-cols-4  gap-6 mb-8 mx-8">
        {freshCatchItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col shadow-md overflow-hidden rounded-3xl"
          >
            <div className="bg-gray-100 h-80 flex items-center justify-center text-gray-400">
              Placeholder
            </div>
            <div className="bg-white p-6  flex flex-col gap-2 text-center items-center justify-center">
              <h3 className="text-success text-2xl font-bold">{item.price}</h3>
              <h3 className="text-black font-bold text-xl">{item.name}</h3>
              <p className="text-md">{item.description}</p>
            </div>
          </div>
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
