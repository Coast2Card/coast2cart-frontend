import homeBanner from "../assets/images/home_banner.jpg";
import baybayonLogo from "../assets/logos/c2c_white_transparent.png";
import fish1 from "../assets/images/home_fish1.png";
import fish2 from "../assets/images/home_fish2.png";
import fish3 from "../assets/images/home_fish3.png";
import fish4 from "../assets/images/home_fish4.png";
import fish5 from "../assets/images/home_fish5.png";
import HomeFeatures from "../components/home/HomeFeatures";
import HomeFreshCatch from "../components/home/HomeFreshCatch";
import HomeGallery from "../components/home/HomeGallery";
import HomeSouvenirs from "../components/home/HomeSouvenirs";
import CustomButton from "../components/CustomButton";
const Home = () => {
  return (
    <main className="relative overflow-x-hidden bg-base-300">
      {/* Home Banner */}
      <section className="w-full h-135 sm:h-[70vh] md:h-185 relative">
        <img
          src={homeBanner}
          alt="Home Banner"
          className="w-full h-full object-cover relative z-4"
          onError={(e) => {
            console.log("Image failed to load:", homeBanner);
            e.target.style.display = "none";
          }}
          onLoad={() => console.log("Image loaded successfully:", homeBanner)}
        />

        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

        <div className="absolute inset-0 z-20 flex items-start py-20 justify-center">
          <div className="text-center text-white">
            <h1 className="text-xl sm:text-2xl  font-extrabold font-display mb-[-15px] sm:mb-[-30px] md:mb-[-35px] lg:mb-[-30px]">
              Sea the best of Baybayon, from
            </h1>
            <img
              className="w-6/8 max-w-120 sm:w-6/8 md:4/8 lg:3/8 md:max-w-170 h-auto mx-auto "
              src={baybayonLogo}
            />
            <CustomButton text="Shop Now" className="mt-0 sm:mt-[-10px]" />
          </div>
        </div>
      </section>
      <section className=" relative overflow-hidden w-[140vw] flex items-center justify-center gap-4 sm:gap-6 mb-15 sm:mb-25   z-30 -mt-51 md:-mt-75 lg:-mt-75 left-1/2 -translate-x-1/2">
        <img
          src={fish1}
          alt="Fish 1"
          className="min-w-20 h-40 md:w-65 md:h-75  object-cover rounded-2xl"
        />
        <img
          src={fish2}
          alt="Fish 2"
          className="min-w-35 h-55  md:w-80 md:h-85 object-cover rounded-2xl"
        />
        <img
          src={fish3}
          alt="Fish 3"
          className="min-w-46 h-70 md:w-95 md:h-100 object-cover rounded-2xl"
        />
        <img
          src={fish4}
          alt="Fish 4"
          className="min-w-35 h-55 md:w-80 md:h-85 object-cover rounded-2xl"
        />
        <img
          src={fish5}
          alt="Fish 5"
          className="min-w-20 h-40 md:w-65 md:h-75 object-cover rounded-2xl"
        />
      </section>
      <section className="max-w-8xl mx-auto p-4 flex flex-col">
        <HomeFeatures className="mb-25" />
        <HomeGallery />
        <HomeFreshCatch />
      </section>
      <section className="flex flex-col lg:flex-row bg-primary max-w-8xl mx-auto w-full mb-60">
        <HomeSouvenirs />
      </section>
      <section className="flex flex-col gap-4 mb-60">
        <h1 className="text-primary text-center text-3xl font-bold mb-6">
          Voices of Baybayon
        </h1>
        <div className="relative flex flex-col gap-3 mx-auto">
          <div className="flex gap-2 h-100">
            <div className="flex-3 min-w-[200px] bg-red-100 rounded-xl h-[100%]"></div>
            <div className="flex-2 bg-red-100 rounded-xl h-[55%]"></div>
            <div className="flex-2 bg-red-100 rounded-xl h-[55%]"></div>
            <div className="flex-2 bg-red-100 rounded-xl h-[55%]"></div>
          </div>
          <div className="absolute top-[100%] -translate-y-3/5  left-1/2 -translate-x-1/2 flex-flex-col gap-2 bg-[#FFCD0F] p-6 px-8 rounded-md text-[#012466] w-[55%] ">
            <h2 className="font-bold text-2xl mb-1">John Ortazo</h2>
            <p className="font-semibold mb-5">Barangay Chairman</p>
            <p className="">
              As chairman of Barangay Baybayon, I am proud to support our
              hardworking fisherfolk. Our community has lived by the sea for
              generations, and through this initiative, we aim to bring the
              freshest catch directly from our waters to your table. Every
              purchase supports not just our fishermen, but also the future of
              our barangay.
            </p>
            <div className="hidden z-[10] right-[-50px] top-0 flex gap-2 bg-base-100 w-100">
              <button className="bg-base-200 w-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                  <rect width="256" height="256" fill="none" />
                  <line
                    x1="216"
                    y1="128"
                    x2="40"
                    y2="128"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  />
                  <polyline
                    points="112 56 40 128 112 200"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
