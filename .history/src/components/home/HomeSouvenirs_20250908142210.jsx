import React from "react";
import souvenirBanner from "../../assets/images/home_banner2.png";
const HomeSouvenirs = () => {
  return (
    <>
      <div className="min-w-100 max-w-150">
        <img
          className="bg-red-100 w-full h-full object-cover "
          src={souvenirBanner}
        />
      </div>
      <div className="flex-1"></div>
    </>
  );
};

export default HomeSouvenirs;
