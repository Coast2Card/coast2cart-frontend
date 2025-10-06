import React from "react";
import heroBgImg from "../../assets/images/about/HeroBg.jpg";

const AboutHero = () => {
  return (
    <section className="relative">
      {/* Hero Background Image */}
      <div
        className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroBgImg})` }}
      >
        {/* Semi-transparent overlay on left half */}
        <div 
          className="absolute inset-0 w-1/2 h-full bg-gray-300/80"
        ></div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center h-full px-4 sm:px-6 md:px-12 lg:px-24 w-full">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-4 sm:mb-8">
              {/* Left side - FRESH FROM */}
              <div className="w-full sm:w-1/2">
                <h1 
                  style={{
                    fontFamily: 'Outfit',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: 'clamp(60px, 8vw, 130px)',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle'
                  }}
                >
                  <span 
                    style={{ 
                      background: 'url(' + heroBgImg + ')',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
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
                  style={{
                    fontFamily: 'Outfit',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: 'clamp(60px, 8vw, 130px)',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    color: 'white'
                  }}
                >
                  THE SEA
                </h1>
              </div>
            </div>

            {/* TO YOUR TABLE - Full width on left side */}
            <div className="w-full sm:w-1/2">
              <h1 
                style={{
                  fontFamily: 'Outfit',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: 'clamp(50px, 6vw, 105px)',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  verticalAlign: 'middle'
                }}
              >
                <span 
                  style={{ 
                    background: 'url(' + heroBgImg + ')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  TO YOUR TABLE
                </span>
              </h1>
            </div>

            <div className="flex items-start gap-2 sm:gap-4">
              <div className="w-1 bg-blue-700 h-16 sm:h-24 flex-shrink-0"></div>
              <p className="text-sm sm:text-lg md:text-xl text-white max-w-2xl leading-relaxed">
                Coast2Cart has a clear and simple vision: "Bringing Baybayon's
                Fresh Catch and Local Treasures Closer to Every Home."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Separator - Overlapping the hero background - Hidden on small screens */}
      <div className="hidden sm:block absolute bottom-0 left-0 w-full h-24 z-20">
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
  );
};

export default AboutHero;
