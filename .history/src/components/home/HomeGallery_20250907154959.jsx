import React from "react";
import homeGallery1 from "../../assets/images/home_gallery1.png";
import FishIcon from "../icons/FishIcon";
const HomeGallery = () => {
  return (
    <div className="w-full flex gap-4 mb-20  ">
      <div className="flex-1 min-w-80 w-full h-[100%] bg-blue-100 ">
        <img src={homeGallery1} className="  " />
      </div>
      <div className=" flex flex-col min-w-20  p-4 gap-4 justify-center">
        <h2 className="font-bold text-3xl text-primary mb-2">
          Fresh From the Sea, Straight to You
        </h2>
        <p className="text-md mb-4">
          Every day, the fishermen of Barangay Baybayon bring in the freshest
          catch from our coastal waters, ensuring top quality seafood for your
          table. Proudly harvested and carefully handled, we take pride in
          delivering the goodness of the sea with every haul.
        </p>
        <div className="flex items-start gap-4 text-primary">
          <div className="h-22 w-22 font-bold pt-0.5">
            <FishIcon />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-xl mb-2">Sustainably Caught</h3>
            <p className="text-black">
              Our Baybayon fisherfolk use responsible fishing practices that
              respect both the ocean and its future.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 text-primary">
          <div className="h-22 w-22 font-bold pt-0.5">
            <FishIcon />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-xl mb-2">Sustainably Caught</h3>
            <p className="text-black">
              Our Baybayon fisherfolk use responsible fishing practices that
              respect both the ocean and its future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeGallery;
