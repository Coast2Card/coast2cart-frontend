import React from "react";
import souvenirBanner from "../../assets/images/home_banner2.png";
import { freshCatchItems } from "../../data/navigation";
import ItemCard from "./ItemCard";
const HomeSouvenirs = () => {
  return (
    <>
      <div className="relative flex flex-col items-end justify-end h-155 w-full min-w-100 max-w-70">
        <div className="absolute flex items-end justify-end p-6 px-8 inset-0  bg-black opacity-40"></div>
        <div className="absolute flex items-end justify-end p-6 px-8 inset-0 ">
          <div className="flex flex-col items-end">
            <h2 className="text-5xl font-bold text-secondary-light mb-3">
              Souvenirs
            </h2>
            <button className=" bg-secondary-light text-primary uppercase  px-6 py-2 rounded-full text-md  font-semibold hover:bg-secondary/90 transition-colors cursor-pointer">
              view all
            </button>
          </div>
        </div>
        <img
          className="w-full h-full object-cover object-top "
          src={souvenirBanner}
        />
      </div>
      <article className="flex-1 flex flex-col justify-center p-6 text-white text-md gap-2">
        <p className="mb-4">
          Discover handcrafted keepsakes inspired by the vibrant coastal living
          and rich fisheries of Baybayon. Each piece reflects the community’s
          connection to the sea—blending tradition, creativity, and the local
          way of life into memorable tokens you can bring home.
        </p>
        <section className="flex grid-cols-1  w-[190%] max-h-100 gap-2">
          {freshCatchItems.map((item, index) => {
            return (
              <ItemCard
                name={item.name}
                price={item.price}
                description={item.description}
                id={item.id}
              />
            );
          })}
        </section>
      </article>
    </>
  );
};

export default HomeSouvenirs;
