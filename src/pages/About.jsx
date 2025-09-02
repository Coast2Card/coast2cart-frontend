import React from "react";
import c2cLogoWhite from "../assets/logos/c2c_white_transparent.png";
import heroBgImg from "../assets/images/images/about/HeroBg.jpg";
import fishermenImg from "../assets/images/images/about/Fishermen.jpg";
import souvenirImg from "../assets/images/images/about/Souvenir.jpg";

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Background Image */}
        <div 
          className="w-full h-[500px] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroBgImg})` }}
        >
          <div className="absolute inset-0 bg-slate-900/60"></div>
          
          {/* Hero Content */}
          <div className="relative z-10 flex items-center h-full px-6 md:px-12 lg:px-24">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                FRESH FROM THE SEA<br />
                TO YOUR TABLE
              </h1>

              <div className="flex items-start gap-4">
                <div className="w-1 bg-yellow-400 h-24 flex-shrink-0"></div>
                <p className="text-lg md:text-xl text-white max-w-2xl leading-relaxed">
                  Coast2Cart has a clear and simple vision: "Bringing Baybayon's Fresh 
                  Catch and Local Treasures Closer to Every Home."
                </p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* About Us Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <h2 className="text-4xl md:text-5xl font-bold text-[#012466] text-center mb-10">About Us</h2>
        <p className="text-center max-w-4xl mx-auto text-base md:text-lg text-gray-700 leading-relaxed">
          Barangay Baybayon is a coastal community where fishing, dried seafood, and small-scale 
          tourism have long been the livelihood of families. With a population of over 
          2,000, many households rely on the sea for their daily income, catching fresh fish and 
          crafting souvenirs that reflect the culture and spirit of the barangay.
        </p>
      </section>

      {/* Life By The Sea Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        {/* Image */}
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
            <h2 className="text-2xl md:text-3xl font-bold text-orange-500 whitespace-nowrap">LIFE BY THE SEA</h2>
            <div className="h-[1px] bg-gray-400 flex-grow ml-4"></div>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">
            Fishing is at the heart of Baybayon. Most families rely on the 
            sea for their income, catching fresh fish that is enjoyed not 
            only within the barangay but also in nearby towns. The work 
            begins before sunrise and often depends on weather and 
            season, making every catch valuable. Freshness and quality 
            are the pride of Baybayon's fishermen, who continue to pass 
            down this tradition from one generation to the next.
          </p>
        </div>
      </section>

      {/* Souvenirs and Local Craft Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-24 flex flex-col md:flex-row-reverse items-center gap-6 sm:gap-8">
        {/* Image */}
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
            <h2 className="text-2xl md:text-3xl font-bold text-orange-500 whitespace-nowrap">SOUVENIRS AND LOCAL CRAFT</h2>
            <div className="h-[1px] bg-gray-400 flex-grow ml-4"></div>
          </div>

          <p className="text-base text-gray-700 leading-relaxed">
            Aside from fishing, Baybayon is also known for 
            souvenir making. Locals create simple yet 
            meaningful items that reflect the coastal lifestyle. 
            These handmade pieces can be brought home by 
            visitors as a memory of the barangay. Together 
            with dried seafood products, these crafts provide 
            residents with an extra source of income and 
            highlight the creativity and resourcefulness of the 
            community.
          </p>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Fresh and Local */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#012466] mb-6">FRESH AND LOCAL</h2>
            
            <p className="text-base text-gray-700 leading-relaxed">
              From seafood to souvenirs, Baybayon 
              products come directly from 
              hardworking families, keeping 
              everything natural, fresh, and authentic.
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
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#012466] mb-6">SMALL-SCALE TOURISM</h2>
            
            <p className="text-base text-gray-700 leading-relaxed">
              Baybayon is more than just a fishing 
              community. It also thrives on small-scale 
              tourism, with visitors drawn to its coastal 
              scenery, fresh seafood, and the warmth of its 
              people. Tourism has become an added source 
              of livelihood for local families.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative">
        {/* Top Wave */}
        <div className="w-full h-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#f97316" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,117.3C960,128,1056,128,1152,117.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Footer Content */}
        <div className="bg-orange-500 py-12">
          <div className="px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between">
            {/* Logo on Left */}
            <div className="mb-8 md:mb-0">
              <img src={c2cLogoWhite} alt="Coast2Cart Logo" className="h-16 md:h-20" />
            </div>
            
            {/* Social Media and Copyright on Right */}
            <div className="flex flex-col items-center md:items-end">
              {/* Social Media Icons */}
              <div className="flex space-x-6 mb-4">
                <a href="#" className="text-white hover:text-yellow-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>

                <a href="#" className="text-white hover:text-yellow-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                
                <a href="#" className="text-white hover:text-yellow-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
              
              {/* Copyright Text */}
              <p className="text-white/80 text-sm text-center md:text-right">
                © 2024 Coast2Cart. All rights reserved.
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="w-full h-20 bg-orange-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full rotate-180">
            <path fill="#f97316" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,117.3C960,128,1056,128,1152,117.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </footer>
    </div>
  );
};

export default About;