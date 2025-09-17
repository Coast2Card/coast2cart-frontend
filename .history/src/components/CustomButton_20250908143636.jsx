import React from "react";

const CustomButton = ({ text, className }) => {
  return (
    <button
      className={` bg-secondary text-primary uppercase px-6 py-2 rounded-full text-md  font-semibold hover:bg-secondary/90 transition-colors cursor-pointer ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
