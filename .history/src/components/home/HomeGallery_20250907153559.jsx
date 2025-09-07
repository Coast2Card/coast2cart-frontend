import React from "react";
import homeGallery1 from "../../assets/images/home_gallery1.png";
const HomeGallery = () => {
  return (
    <div className="w-full flex gap-4 mb-20 ">
      <div className="flex-1 w-full h-full ">
        <img src={homeGallery1} className="w-full h-full object-cover  " />
      </div>
      <div className=" bg-red-100 flex-col min-w-100 p-4 gap-4 justify-center">
        <h2 className="font-bold text-2xl text-primary">
          Fresh From the Sea, Straight to You
        </h2>
        <p className="text-md">
          Every day, the fishermen of Barangay Baybayon bring in the freshest
          catch from our coastal waters, ensuring top quality seafood for your
          table. Proudly harvested and carefully handled, we take pride in
          delivering the goodness of the sea with every haul.
        </p>
        <div className="flex gap-2">
          <img />
          <div className="flex flex-col">
            <h3>Sustainably Caught</h3>
            <h3>Sustainably Caught</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeGallery;
