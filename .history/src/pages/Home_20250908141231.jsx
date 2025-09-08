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
const Home = () => {
  return (
    <main className="relative overflow-x-hidden">
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
            <button className="mt-0 sm:mt-[-10px] b-20 bg-secondary text-primary uppercase px-6 py-2 rounded-full text-md sm:text-lg font-semibold hover:bg-secondary/90 transition-colors">
              Shop Now
            </button>
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
      <section className="flex bg-primary h-100mx-auto w-full">
        <div className="min-w-100 max-w-150"></div>
        <div className="flex-1"></div>
      </section>
    </main>
  );
};

export default Home;
