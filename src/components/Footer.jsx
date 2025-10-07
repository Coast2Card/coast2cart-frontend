import React from "react";
import logo from "../assets/logos/c2c_white_transparent.png";
import fbPng from "../assets/icons/facebok.png";
import igPng from "../assets/icons/instagram.png";
import ttPng from "../assets/icons/tiktok.png";

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden">
      <div className="relative flex items-end p-6 md:p-10 max-w-8xl mx-auto overflow-hidden px-4 bg-accent min-h-[200px] max-h-[400px] md:px-8 bg-accent overflow-hidden">
        {/* Wave backdrop using background image; crops on small screens, full on md+ */}
        <div
          className="absolute left-0 right-0 top-0 bottom-0 z-0 bg-no-repeat bg-top"
          style={{
            backgroundImage: "url(/waves.svg)",
            backgroundSize: "auto 100%",
          }}
        />

        {/* Content */}
        <div className="relative px-6 z-10 text-white">
          <div className="flex flex-col gap-4 ">
            <div>
              {/* Brand */}
              <img
                src={logo}
                alt="Coast2Cart"
                className="h-28 md:h-40 w-auto select-none pointer-events-none"
              />
            </div>
            {/* Socials */}
            <div className="flex items-center gap-4 text-white/95 mt-[-24px] md:mt-[-40px]">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="hover:opacity-90">
                <img
                  src={fbPng}
                  alt="Facebook"
                  className="h-5 w-5 md:h-6 md:w-6 object-contain invert"
                />
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="hover:opacity-90">
                <img
                  src={igPng}
                  alt="Instagram"
                  className="h-5 w-5 md:h-6 md:w-6 object-contain invert"
                />
              </a>
              {/* TikTok */}
              <a href="#" aria-label="TikTok" className="hover:opacity-90">
                <img
                  src={ttPng}
                  alt="TikTok"
                  className="h-5 w-5 md:h-6 md:w-6 object-contain invert"
                />
              </a>
            </div>
            <div className="text-xs text-white/90">
              © Coast2Cart 2025. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
