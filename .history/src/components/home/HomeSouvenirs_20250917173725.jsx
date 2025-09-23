import React from "react";
import souvenirBanner from "../../assets/images/home_banner2.png";
import ItemCard from "./ItemCard";
import fishWallet from "../../assets/images/fish_wallet.jpg";
import bottleOpener from "../../assets/images/bottle_opener.webp";
import baybayonFan from "../../assets/images/baybayon_fan.jpg";
import coconutMaracas from "../../assets/images/coconut_maracas.webp";
const HomeSouvenirs = () => {
  return (
    <>
      <div className="relative flex items-end justify-end h-90 lg:h-150 w-full min-w-100 lg:max-w-70 overflow-hidden">
        <div className="absolute flex items-end justify-end p-6 px-8 inset-0  bg-black opacity-40"></div>
        <div className="absolute flex items-end justify-start lg:justify-end  py-9 px-4 lg:px-8 inset-0 ">
          <div className="flex flex-col items-start lg:items-end">
            <h1 className="text-5xl font-bold text-secondary-light mb-3">
              Souvenirs
            </h1>
            <a
              href="/souvenirs"
              className=" bg-secondary-light text-primary uppercase  px-6 py-2 rounded-full text-md  font-semibold hover:bg-secondary/90 transition-colors cursor-pointer inline-block"
            >
              view all
            </a>
          </div>
        </div>
        <img
          className="w-full h-full object-cover object-top "
          src={souvenirBanner}
        />
      </div>
      <article className="flex-1 flex flex-col justify-center p-4 py-6 lg:p-6 text-white text-md gap-2">
        <p className="mb-4">
          Discover handcrafted keepsakes inspired by the vibrant coastal living
          and rich fisheries of Baybayon. Each piece reflects the community’s
          connection to the sea—blending tradition, creativity, and the local
          way of life into memorable tokens you can bring home.
        </p>
        <section className="flex grid-cols-1 w-[260%] lg:w-[190%] max-h-100 gap-4">
          {[
            { id: 1, name: "Fish Wallet", image: fishWallet },
            { id: 2, name: "Bottle Opener", image: bottleOpener },
            { id: 3, name: "Baybayon Fan", image: baybayonFan },
            { id: 4, name: "Coconut Maracas", image: coconutMaracas },
          ].map((item) => (
            <div key={item.id} className="w-64 sm:w-72 lg:w-80 flex-none">
              <ItemCard
                id={item.id}
                name={item.name}
                price=""
                description=""
                image={item.image}
              />
            </div>
          ))}
        </section>
      </article>
    </>
  );
};

export default HomeSouvenirs;
