import React from "react";
import souvenirBanner from "../../assets/images/home_banner2.png";
const HomeSouvenirs = () => {
  return (
    <>
      <div className="relative flex items-end justify-end h-150 w-full min-w-100 max-w-70">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          className="w-full h-full object-cover object-top "
          src={souvenirBanner}
        />
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-secondary">Souvenirs</h2>
        </div>
      </div>
      <div className="flex-1"></div>
    </>
  );
};

export default HomeSouvenirs;
