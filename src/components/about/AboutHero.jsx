import React from "react";
import heroBgImg from "../../assets/images/about/HeroBg.jpg";

const AboutHero = () => {
  return (
    <>
      <style>
        {`
          @media (max-width: 767px) {
            .transparent-text-mobile {
              background-image: none !important;
              -webkit-background-clip: initial !important;
              background-clip: initial !important;
              -webkit-text-fill-color: white !important;
              color: white !important;
            }
          }
        `}
      </style>
      <section className="relative">
      {/* Hero Background Image */}
      <div
        className="w-full h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] 2xl:h-[650px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      >
        {/* Semi-transparent overlay on left half - Hidden on small screens */}
        <div 
          className="hidden md:block absolute inset-0 w-1/2 h-full bg-gray-300/80"
        ></div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center h-full px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 w-full">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 mb-3 xs:mb-4 sm:mb-6 md:mb-8">
              {/* Left side - FRESH FROM */}
              <div className="w-full sm:w-1/2">
                <h1 
                  className="font-outfit font-normal leading-[100%] tracking-[0%] align-middle"
                  style={{
                    fontSize: 'clamp(28px, 6vw, 130px)',
                  }}
                >
                  <span 
                    className="text-white md:text-transparent md:bg-clip-text md:bg-cover md:bg-center transparent-text-mobile"
                    style={{ 
                      backgroundImage: 'url(' + heroBgImg + ')',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text'
                    }}
                  >
                    FRESH FROM
                  </span>
                </h1>
              </div>

              {/* Right side - THE SEA */}
              <div className="w-full sm:w-1/2">
                <h1 
                  className="font-outfit font-normal leading-[100%] tracking-[0%] align-middle text-white"
                  style={{
                    fontSize: 'clamp(28px, 6vw, 130px)',
                  }}
                >
                  THE SEA
                </h1>
              </div>
            </div>

            {/* TO YOUR TABLE - Full width on left side */}
            <div className="w-full sm:w-1/2">
              <h1 
                className="font-outfit font-normal leading-[100%] tracking-[0%] align-middle"
                style={{
                  fontSize: 'clamp(24px, 5vw, 105px)',
                }}
              >
                <span 
                  className="text-white md:text-transparent md:bg-clip-text md:bg-cover md:bg-center transparent-text-mobile"
                  style={{ 
                    backgroundImage: 'url(' + heroBgImg + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}
                >
                  TO YOUR TABLE
                </span>
              </h1>
            </div>

            <div className="flex items-start gap-1 xs:gap-2 sm:gap-3 md:gap-4">
              <div className="w-1 bg-blue-700 h-12 xs:h-14 sm:h-16 md:h-20 lg:h-24 flex-shrink-0"></div>
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white max-w-2xl leading-relaxed">
                Coast2Cart has a clear and simple vision: "Bringing Baybayon's
                Fresh Catch and Local Treasures Closer to Every Home."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Separator - Always visible on all screen sizes */}
      <div className="absolute bottom-0 left-0 w-full h-12 xs:h-16 sm:h-20 md:h-24 z-20">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path
            d="M0,0V50.49c29.09,12.2,103.59,32.17,148,28,70.36-5.37,146.33-33.31,220.0-47.5C448.64,22.43,522.34,53.67,573,71.05c78.20,20,152.3,20.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1013-14.29,1200,20.47V0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
    </>
  );
};

export default AboutHero;
