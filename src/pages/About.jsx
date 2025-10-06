import React from "react";
import AboutHero from "../components/about/AboutHero";
import fishermenImg from "../assets/images/about/Fishermen.jpg";
import souvenirImg from "../assets/images/about/Souvenir.jpg";

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <AboutHero />

      {/* About Us Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 max-w-8xl mx-auto">
        <h2 className="text-10xl md:text-5xl font-bold text-[#012466] text-center mb-10">
          About Us
        </h2>
        <p className="text-center max-w-4xl mx-auto text-base md:text-lg text-gray-700 leading-relaxed">
          Barangay Baybayon is a coastal community where fishing, dried seafood,
          and small-scale tourism have long been the livelihood of families.
          With a population of over 2,000, many households rely on the sea for
          their daily income, catching fresh fish and crafting souvenirs that
          reflect the culture and spirit of the barangay.
        </p>
      </section>

      {/* Life By The Sea Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-24 max-w-8xl mx-auto flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        <div className="w-full md:w-1/2">
          <img
            src={fishermenImg}
            alt="Fishermen at dawn"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center mb-6">
            <h2 className="text-5xl md:text-4xl font-bold text-orange-500 whitespace-nowrap">
              LIFE BY THE SEA
            </h2>
            <div className="h-[1px] bg-gray-400 flex-grow ml-4"></div>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">
            Fishing is at the heart of Baybayon. Most families rely on the sea
            for their income, catching fresh fish that is enjoyed not only
            within the barangay but also in nearby towns. The work begins before
            sunrise and often depends on weather and season, making every catch
            valuable. Freshness and quality are the pride of Baybayon's
            fishermen, who continue to pass down this tradition from one
            generation to the next.
          </p>
        </div>
      </section>

      {/* Souvenirs and Local Craft Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-24 max-w-8xl mx-auto flex flex-col md:flex-row-reverse items-center gap-6 sm:gap-8">
        <div className="w-full md:w-2/5">
          <img
            src={souvenirImg}
            alt="Local market with souvenirs"
            className="w-full h-auto max-h-80 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="w-full md:w-3/5">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl md:text-4xl font-bold text-orange-500 whitespace-nowrap">
              SOUVENIRS AND LOCAL CRAFT
            </h2>
            <div className="h-[1px] bg-gray-400 flex-grow ml-4"></div>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">
            Aside from fishing, Baybayon is also known for souvenir making.
            Locals create simple yet meaningful items that reflect the coastal
            lifestyle. These handmade pieces can be brought home by visitors as
            a memory of the barangay. Together with dried seafood products,
            these crafts provide residents with an extra source of income and
            highlight the creativity and resourcefulness of the community.
          </p>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Fresh and Local */}
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#012466] mb-8">
              FRESH AND LOCAL
            </h2>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed tracking-wide">
              From seafood to souvenirs, Baybayon products come directly from
              hardworking families, keeping everything natural, fresh, and
              authentic.
            </p>
          </div>

          {/* Fish Icons Section - Between Sections */}
          <div className="flex flex-col items-center justify-center space-y-4 px-4">
            <div className="w-px h-16 bg-gray-300"></div>
            <div className="flex flex-col space-y-4">
              {/* Fish Icons */}
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                🐟
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                🐠
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                🦈
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                🐡
              </div>
            </div>
            <div className="w-px h-16 bg-gray-300"></div>
          </div>

          {/* Small-Scale Tourism */}
          <div className="text-right">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#012466] mb-8">
              SMALL-SCALE TOURISM
            </h2>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed tracking-wide">
              Baybayon is more than just a fishing community. It also thrives on
              small-scale tourism, with visitors drawn to its coastal scenery,
              fresh seafood, and the warmth of its people. Tourism has become an
              added source of livelihood for local families.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
