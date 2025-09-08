import React from "react";
import souvenirBanner from "../../assets/images/home_banner2.png";
const HomeSouvenirs = () => {
  return (
    <>
      <div className="h-150 w-full min-w-100 max-w-60">
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
