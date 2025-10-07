import { Link } from "react-router-dom";
import heroBg from "../assets/images/about/HeroBg.jpg";
import fish1 from "../assets/images/home_fish1.png";
import fish2 from "../assets/images/home_fish2.png";
import fish3 from "../assets/images/home_fish3.png";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg">
        <img
          src={heroBg}
          alt="Ocean background"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />

        <div className="relative z-10 bg-base-100/70 backdrop-blur-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-content font-bold text-xl">
              404
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold text-primary m-0">
              Page not found
            </h1>
          </div>

          <p className="text-base-content/80 text-lg md:text-xl mb-8 max-w-2xl">
            Looks like this tide washed away the page you were looking for.
            Let’s guide you back to the freshest catches and coastal finds.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/" className="btn btn-primary group">
              <span>Back to Home</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ms-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.586 11H3a1 1 0 1 1 0-2h11.586l-4.293-4.293a1 1 0 0 1 0-1.414Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link to="/seafood" className="btn btn-secondary group">
              <span>Explore Seafood</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ms-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.586 11H3a1 1 0 1 1 0-2h11.586l-4.293-4.293a1 1 0 0 1 0-1.414Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link to="/souvenirs" className="btn btn-accent group">
              <span>Browse Souvenirs</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ms-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L14.586 11H3a1 1 0 1 1 0-2h11.586l-4.293-4.293a1 1 0 0 1 0-1.414Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Decorative fishes */}
        <img
          src={fish1}
          alt="fish"
          className="hidden md:block absolute -left-8 bottom-6 h-20 opacity-80 animate-fade-scale-in animate-float-slow"
          style={{ animationDelay: "80ms" }}
        />
        <img
          src={fish2}
          alt="fish"
          className="hidden md:block absolute right-4 -bottom-6 h-24 opacity-80 animate-fade-scale-in animate-float-slow"
          style={{ animationDelay: "160ms" }}
        />
        <img
          src={fish3}
          alt="fish"
          className="hidden md:block absolute right-28 top-6 h-16 opacity-70 animate-fade-scale-in animate-float-slow"
          style={{ animationDelay: "240ms" }}
        />
      </div>
    </div>
  );
}

export default NotFound;
