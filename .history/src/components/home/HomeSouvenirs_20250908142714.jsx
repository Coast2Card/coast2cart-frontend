import React from "react";
import souvenirBanner from "../../assets/images/home_banner2.png";
const HomeSouvenirs = () => {
  return (
    <>
      <div className="relative h-150 w-full min-w-100 max-w-70">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <img
          className="w-full h-full object-cover object-top "
          src={souvenirBanner}
        />
      </div>
      <div className="flex-1"></div>
    </>
  );
};

export default HomeSouvenirs;
