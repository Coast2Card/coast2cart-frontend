import React from "react";
import logo from "../assets/logos/c2c_white_transparent.png";
import fbPng from "../assets/icons/facebok.png";
import igPng from "../assets/icons/instagram.png";
import ttPng from "../assets/icons/tiktok.png";

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden">
      <div className="relative flex items-end p-10 max-w-8xl mx-auto overflow-hidden px-4 bg-accent h-85 md:px-8 bg-accent overflow-hidden">
        {/* Wave backdrop (constrained to page width) */}
        <div className="absolute left-0 right-0 top-0 bottom-0 z-0">
          {/* Top white to simulate page background intruding */}
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="block w-full h-120 text-white"
          >
            <path
              fill="currentColor"
              d="M0,50 C90,20 250,10 420,50 C500,70 900,170 1100,140 C1250,120 1350,80 1440,60 L1440,0 L0,0 Z"
            />
          </svg>

          {/* Subtle darker overlay wave to create depth */}
        </div>

        {/* Content */}
        <div className="relative px-6 z-10 text-white">
          <div className="flex flex-col gap-4 ">
            <div>
              {/* Brand */}
              <img
                src={logo}
                alt="Coast2Cart"
                className="h-40  w-auto select-none pointer-events-none"
              />
            </div>
            {/* Socials */}
            <div className="flex items-center gap-4 text-white/95 mt-[-40px]">
              {/* Facebook */}
              <a href="#" aria-label="Facebook" className="hover:opacity-90">
                <img
                  src={fbPng}
                  alt="Facebook"
                  className="h-6 w-6 object-contain invert"
                />
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="hover:opacity-90">
                <img
                  src={igPng}
                  alt="Instagram"
                  className="h-6 w-6 object-contain invert"
                />
              </a>
              {/* TikTok */}
              <a href="#" aria-label="TikTok" className="hover:opacity-90">
                <img
                  src={ttPng}
                  alt="TikTok"
                  className="h-6 w-6 object-contain invert"
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
