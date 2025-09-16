import React, { useState } from "react";
import home_test1 from "../../assets/images/home_test1.png";
import home_test2 from "../../assets/images/home_test2.png";
import home_test3 from "../../assets/images/home_test3.png";
import home_test4 from "../../assets/images/home_test4.png";
import home_test5 from "../../assets/images/home_test5.png";

export const HomeCarousel = () => {
  const [cards] = useState([
    {
      id: 1,
      name: "John Ortazo",
      role: "Barangay Chairman",
      quote:
        "As chairman of Barangay Baybayon, I am proud to support our hardworking fisherfolk. Our community has lived by the sea for generations, and through this initiative, we aim to bring the freshest catch directly from our waters to your table. Every purchase supports not just our fishermen, but also the future of our barangay.",
      imgUrl: home_test1,
    },
    {
      id: 2,
      name: "Maria Santos",
      role: "Fisherfolk Leader",
      quote:
        "Every dawn at sea is a promise. With your support, our catch becomes sustenance for families and strength for our community.",
      imgUrl: home_test2,
    },
    {
      id: 3,
      name: "Carlos Dela Cruz",
      role: "Market Vendor",
      quote:
        "Freshness you can taste. This program connects our shores to your kitchen the right way.",
      imgUrl: home_test3,
    },
    {
      id: 4,
      name: "Ana Villanueva",
      role: "Youth Volunteer",
      quote:
        "Buying local keeps our traditions alive and our oceans respected for generations to come.",
      imgUrl: home_test4,
    },
    {
      id: 5,
      name: "Liza Ramos",
      role: "Community Organizer",
      quote:
        "Stronger markets mean stronger families. Thank you for choosing local.",
      imgUrl: home_test5,
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const active = cards[activeIndex];
  const getCardAt = (offset) => cards[(activeIndex + offset) % cards.length];

  const goToIndex = (index) => {
    if (index < 0 || index >= cards.length) return;
    setActiveIndex(index);
  };

  return (
    <section className="flex flex-col gap-4 mb-20 max-w-8xl mx-auto">
      <h1 className="text-primary text-center text-4xl xl:text-5xl font-bold mb-12">
        Voices of Baybayon
      </h1>
      <div className="relative flex flex-col mx-3 ">
        <div className="flex gap-4 h-100 overflow-hidden md:h-120 lg:h-140">
          <div
            className="basis-[35%] lg:basis-[30%] min-w-[160px] rounded-xl h-[100%] bg-center bg-cover animate-fade-scale-in flex-none"
            style={{ backgroundImage: `url(${getCardAt(0).imgUrl})` }}
          ></div>
          <div
            className="basis-[15%] lg:basis-[17%] rounded-xl h-[55%] bg-center bg-cover  animate-fade-scale-in flex-none"
            style={{ backgroundImage: `url(${getCardAt(1).imgUrl})` }}
          ></div>
          <div
            className="basis-[15%] lg:basis-[17%] rounded-xl h-[55%] bg-center bg-cover  animate-fade-scale-in flex-none"
            style={{ backgroundImage: `url(${getCardAt(2).imgUrl})` }}
          ></div>
          <div
            className="basis-[15%] lg:basis-[17%] rounded-xl h-[55%] bg-center bg-cover  animate-fade-scale-in flex-none"
            style={{ backgroundImage: `url(${getCardAt(3).imgUrl})` }}
          ></div>
          <div
            className="basis-[15%] lg:basis-[17%] rounded-xl h-[55%] bg-center bg-cover  animate-fade-scale-in flex-none"
            style={{ backgroundImage: `url(${getCardAt(4).imgUrl})` }}
          ></div>
        </div>
        <div className="absolute top-[100%] -translate-y-5/6 md:-translate-y-12/12  left-1/2 -translate-x-1/2 w-[50%] flex flex-col items-center gap-4 relative">
          <div className="w-full flex flex-col gap-2 bg-[#FFCD0F] p-6 px-8 rounded-md text-[#012466] ">
            <h2 className="font-bold text-2xl mb-1">{active.name}</h2>
            <p className="font-semibold mb-5">{active.role}</p>
            <p className="">{active.quote}</p>
          </div>
          <div className="flex items-center gap-2 ">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => goToIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`${
                  i === activeIndex ? "w-6 bg-[#012466]" : "w-2 bg-[#012466]/30"
                } h-2.5 rounded-full transition-all ring-1 ring-[#012466]/40`}
              />
            ))}
          </div>
          <div className="absolute right-2 bottom-0 flex gap-2 ">
            <button
              onClick={handlePrev}
              className="bg-base-200 w-10 h-10 p-2 rounded-full shadow cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none" />
                <line
                  x1="216"
                  y1="128"
                  x2="40"
                  y2="128"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="35"
                />
                <polyline
                  points="112 56 40 128 112 200"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="35"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="bg-base-200 w-10 h-10 p-2 rounded-full shadow cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none" />
                <line
                  x1="40"
                  y1="128"
                  x2="216"
                  y2="128"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="35"
                />
                <polyline
                  points="144 56 216 128 144 200"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="35"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
