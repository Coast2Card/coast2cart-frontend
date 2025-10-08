import React from "react";
import heroBgImg from "../../assets/images/about/HeroBg.jpg";

const AboutHero = () => {
  return (
    <>
      <style>
        {`
          /* Mobile - disable transparent text effect */
          @media (max-width: 767px) {
            .transparent-text-mobile {
              background-image: none !important;
              -webkit-background-clip: initial !important;
              background-clip: initial !important;
              -webkit-text-fill-color: white !important;
              color: white !important;
            }
          }

          /* Tablet and above - enable transparent text effect */
          @media (min-width: 768px) {
            .transparent-text-desktop {
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
            }
          }

          /* Ensure smooth transitions between breakpoints */
          .transparent-text-mobile,
          .transparent-text-desktop {
            transition: all 0.3s ease-in-out;
          }
        `}
      </style>
      <section className="relative">
        {/* Hero Background Image */}
        <div
          className="w-full h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] 2xl:h-[650px] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroBgImg})` }}
        >
          {/* Semi-transparent overlay on left half - Visible on tablet and above */}
          <div className="hidden md:block absolute inset-0 w-1/2 h-full bg-gray-300/80 transition-opacity duration-300"></div>

          {/* Hero Content */}
          <div className="relative z-10 flex items-center h-full w-full">
            <div className="h-full w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 pt-6 xs:pt-8 sm:pt-10 md:pt-12 lg:pt-16 xl:pt-20">
              {/* FRESH FROM THE SEA - Title spanning full width on desktop */}
              <div className="w-full mb-2 xs:mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                <h1
                  className="font-outfit font-normal leading-[100%] tracking-normal md:tracking-wide align-middle whitespace-nowrap"
                  style={{
                    fontSize: "clamp(28px, 7vw, 140px)",
                  }}
                >
                  <span
                    className="text-white transparent-text-mobile transparent-text-desktop"
                    style={{
                      backgroundImage: `url(${heroBgImg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    FRESH FROM
                  </span>
                  <span className="text-white"> </span>
                  <span className="text-white">THE SEA</span>
                </h1>
              </div>

              {/* TO YOUR TABLE - Full width on mobile, left side on tablet+ */}
              <div className="w-full md:w-1/2 mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                <h1
                  className="font-outfit font-normal leading-[100%] tracking-[0%] align-middle"
                  style={{
                    fontSize: "clamp(24px, 4.5vw, 105px)",
                  }}
                >
                  <span
                    className="text-white transparent-text-mobile transparent-text-desktop"
                    style={{
                      backgroundImage: `url(${heroBgImg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    TO YOUR TABLE
                  </span>
                </h1>
              </div>

              {/* Subtext - Constrained to left half on tablet+, full width on mobile */}
              <div className="w-full md:w-1/2">
                <div className="flex items-start gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  <div className="w-1 md:w-1.5 lg:w-2 bg-primary h-16 xs:h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 flex-shrink-0 transition-all duration-300"></div>
                  <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-primary leading-relaxed">
                    Coast2Cart has a clear and simple vision: "Bringing
                    Baybayon's Fresh Catch and Local Treasures Closer to Every
                    Home."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator - Responsive height across all breakpoints */}
        <div className="absolute bottom-0 left-0 w-full h-10 xs:h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 z-20">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full transition-all duration-300"
            style={{ transform: "rotate(180deg)" }}
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
