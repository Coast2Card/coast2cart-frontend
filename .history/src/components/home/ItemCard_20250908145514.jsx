import React from "react";

const ItemCard = ({ title, description, index }) => {
  return (
    <div key={index} className="flex flex-col items-center justify-start gap-2">
      <div className="bg-accent mb-2 p-11 sm:p-11 flex justify-center items-center rounded-full">
        <div className="bg-gray-300 rounded-xl p-1 h-14 w-14"></div>
      </div>
      <h3 className="text-2xl font-bold text-primary">{title}</h3>
      <h3 className="text-md text-center">{description}</h3>
    </div>
  );
};

export default ItemCard;
