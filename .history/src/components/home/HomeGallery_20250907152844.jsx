import React from "react";
import homeGallery1 from "../../assets/home_gallery1.png";
const HomeGallery = () => {
  return (
    <div className="w-full flex bg-red-100">
      <img src={homeGallery1} className="flex-1 bg-red-100 " />
      <div className="flex flex-col gap-6">
        <h2>Fresh From the Sea, Straight to You</h2>
        <p>
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
