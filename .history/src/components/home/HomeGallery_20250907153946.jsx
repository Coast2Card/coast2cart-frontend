import React from "react";
import homeGallery1 from "../../assets/images/home_gallery1.png";
const HomeGallery = () => {
  return (
    <div className="w-full flex gap-4 mb-20 ">
      <div className="flex-1 min-w-80 w-full h-110 ">
        <img src={homeGallery1} className="w-full h-full object-cover  " />
      </div>
      <div className=" flex flex-col min-w-20  p-4 gap-4 justify-center">
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none" />
            <circle cx="156" cy="76" r="12" />
            <path
              d="M8,175.87l56.07,16.06,16,56.07,24-56.07C258.51,188.26,220,38.68,219,37c-1.73-1-151.25-39.46-155,114.9Z"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            />
            <path
              d="M185.82,167.62A44,44,0,0,1,136.2,119.8,44,44,0,0,1,88.38,70.21"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            />
          </svg>
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
