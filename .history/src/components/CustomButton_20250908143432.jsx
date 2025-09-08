import React from "react";

const CustomButton = (text, className) => {
  return (
    <button
      className={`mt-0 sm:mt-[-10px] b-20 bg-secondary text-primary uppercase px-6 py-2 rounded-full text-md sm:text-lg font-semibold hover:bg-secondary/90 transition-colors ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
