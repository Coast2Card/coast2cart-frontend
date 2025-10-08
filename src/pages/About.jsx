import React from "react";
import AboutHero from "../components/about/AboutHero";
import fishermenImg from "../assets/images/about/Fishermen.jpg";
import souvenirImg from "../assets/images/about/Souvenir.jpg";
import fishIcon from "../assets/images/about/Group 1000001892.png";

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <AboutHero />

      {/* About Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-8xl">
          <h2 className="font-outfit text-5xl md:text-6xl lg:text-7xl font-light text-[#012466] text-center mb-10">
            About Us
          </h2>
          <p className="font-exo text-center max-w-4xl mx-auto text-base md:text-lg text-gray-700 leading-relaxed">
            Barangay Baybayon is a coastal community where fishing, dried
            seafood, and small-scale tourism have long been the livelihood of
            families. With a population of over 2,000, many households rely on
            the sea for their daily income, catching fresh fish and crafting
            souvenirs that reflect the culture and spirit of the barangay.
          </p>
        </div>
      </section>

      {/* Life By The Sea Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-8xl flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="w-full md:w-auto">
            <img
              src={fishermenImg}
              alt="Fishermen at dawn"
              className="w-full md:w-[500px] md:h-[400px] object-cover rounded-[10px] shadow-lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center mb-6">
              <h2 className="font-outfit text-3xl md:text-4xl lg:text-5xl font-light text-[#FF773C] whitespace-nowrap">
                LIFE BY THE SEA
              </h2>
              <div className="h-[1px] bg-gray-400 flex-grow ml-4"></div>
            </div>

            <p className="font-exo text-base md:text-lg text-gray-700 leading-relaxed md:w-[564px] md:h-[122px]">
              Fishing is at the heart of Baybayon. Most families rely on the sea
              for their income, catching fresh fish that is enjoyed not only
              within the barangay but also in nearby towns. The work begins
              before sunrise and often depends on weather and season, making
              every catch valuable. Freshness and quality are the pride of
              Baybayon's fishermen, who continue to pass down this tradition
              from one generation to the next.
            </p>
          </div>
        </div>
      </section>

      {/* Souvenirs and Local Craft Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-8xl flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          {/* Content */}
          <div className="w-full md:flex-1 flex flex-col items-end">
            <div className="flex items-start mb-6 w-full">
              <div className="h-[1px] bg-gray-400 flex-grow mt-8"></div>
              <h2 className="font-outfit text-3xl md:text-4xl lg:text-5xl font-light text-[#FF773C] ml-4 text-right leading-tight">
                SOUVENIRS AND<br />LOCAL CRAFT
              </h2>
            </div>

            <p className="font-exo text-base md:text-lg text-gray-700 leading-relaxed md:w-[476px] text-right">
              Aside from fishing, Baybayon is also known for souvenir making.
              Locals create simple yet meaningful items that reflect the coastal
              lifestyle. These handmade pieces can be brought home by visitors
              as a memory of the barangay. Together with dried seafood products,
              these crafts provide residents with an extra source of income and
              highlight the creativity and resourcefulness of the community.
            </p>
          </div>

          <div className="w-full md:w-auto">
            <img
              src={souvenirImg}
              alt="Local market with souvenirs"
              className="w-full md:w-[632px] md:h-[400px] object-cover rounded-[10px] shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8 max-w-8xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Fresh and Local */}
            <div className="text-left">
              <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-light text-[#012466] mb-8 leading-tight">
                FRESH AND<br />LOCAL
              </h2>

              <p className="font-exo text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                From seafood to souvenirs, Baybayon products come directly from
                hardworking families, keeping everything natural, fresh, and
                authentic.
              </p>
            </div>

            {/* Fish Icon Section - Between Sections */}
            <div className="flex items-center justify-center px-4">
              <img
                src={fishIcon}
                alt="Fish"
                className="w-80 h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] object-contain"
              />
            </div>

            {/* Small-Scale Tourism */}
            <div className="text-right">
              <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-light text-[#012466] mb-8 leading-tight">
                SMALL-SCALE<br />TOURISM
              </h2>

              <p className="font-exo text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                Baybayon is more than just a fishing community. It also thrives
                on small-scale tourism, with visitors drawn to its coastal
                scenery, fresh seafood, and the warmth of its people. Tourism
                has become an added source of livelihood for local families.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
