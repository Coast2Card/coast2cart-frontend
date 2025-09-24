import React from "react";
import bisugo from "../../assets/images/bisugo.png";
import hasa from "../../assets/images/hasa_hasa.png";
import talakitok from "../../assets/images/talakitok.png";

const items = [
  {
    name: "Dalagang Bukid Bilog",
    price: "₱360/kg",
    subtitle: "Fresh Chilled Twinstripe Fusiller",
    img: bisugo,
  },
  {
    name: "Talakitok",
    price: "₱255/kg",
    subtitle: "Fresh Chilled Trevally",
    img: talakitok,
  },
  {
    name: "Bisugo",
    price: "₱380/kg",
    subtitle: "Fresh Chilled Threadfin Bream",
    img: bisugo,
  },
  {
    name: "Hasa-Hasa",
    price: "₱170/kg",
    subtitle: "Fresh Chilled Short-bodied Mackerel",
    img: hasa,
  },
];

const RelatedProducts = () => {
  return (
    <section className="w-full">
      <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
        <h3 className="font-outfit font-bold text-xl text-primary mb-4">
          You May Also Like
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {items.map((item) => (
            <div
              key={item.name}
              className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-outfit font-bold text-lg text-success">{item.price}</span>
                </div>
                <div className="font-outfit font-bold text-lg text-gray-800">{item.name}</div>
                <div className="text-[11px] text-gray-500">{item.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
