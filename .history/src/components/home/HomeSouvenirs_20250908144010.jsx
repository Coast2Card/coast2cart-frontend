import React from "react";
import souvenirBanner from "../../assets/images/home_banner2.png";
const HomeSouvenirs = () => {
  return (
    <>
      <div className="relative flex items-end justify-end h-150 w-full min-w-100 max-w-70">
        <div className="absolute flex items-end justify-end p-6 px-8 inset-0  bg-black opacity-40"></div>
        <div className="absolute flex items-end justify-end p-6 px-8 inset-0 ">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-secondary">Souvenirs</h2>
            <button className=" bg-secondary text-primary uppercase w-40 px-2 py-2 rounded-full text-md  font-semibold hover:bg-secondary/90 transition-colors cursor-pointer"></button>
          </div>
        </div>
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
