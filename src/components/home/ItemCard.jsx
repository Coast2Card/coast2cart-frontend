import React from "react";

const ItemCard = ({ id, price, name, description, image }) => {
  return (
    <div
      key={id}
      className="flex flex-col shadow-md overflow-hidden rounded-3xl"
    >
      <div className="bg-gray-100 h-80 flex items-center justify-center text-gray-400">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span>Image unavailable</span>
        )}
      </div>
      <div className="bg-white p-6  flex flex-col gap-2 text-center items-center justify-center">
        <h3 className="text-success text-2xl font-bold">{price}</h3>
        <h3 className="text-black font-bold text-xl">{name}</h3>
        <p className="text-md text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default ItemCard;
