import seafoodBanner from "../assets/images/fisher_man.png";
import alumahan from "../assets/images/alumahan.png";
import hipon from "../assets/images/hipon.png";
import tuna from "../assets/images/tuna.png";
import pusit from "../assets/images/pusit.png";
import talakitok from "../assets/images/talakitok.png";
import hasa from "../assets/images/hasa_hasa.png";
import bisugo from "../assets/images/bisugo.png";

const Seafood = () => {
  return (
    <main className="relative overflow-x-hidden">
      {/* Seafood Banner */}
      <section className="w-full h-[70vh] md:h-185 relative">
        <div className="absolute inset-0 bg-primary opacity-100 z-10"></div>

        {/* Content Container */}
        <div className="relative z-20 h-full flex items-center">
          {/* Left Side - Text Content */}
          <div className="w-1/2 h-full flex items-center px-8 md:px-16">
            <div className="text-white">
              <h1 className="font-outfit font-bold text-[64px] leading-[100%] tracking-[0%] mb-10">
                <div className="mb-4">Discover the</div>
                <div className="mb-4">Finest Seafood</div>
                <div>Selection</div>
              </h1>
              <p className="font-inter font-normal text-[20px] leading-[100%] tracking-[0%] mb-6 opacity-90">
                From the shores of Barangay Baybayon to your table, our <br />
                fisherfolk bring in daily catches that are fresh, flavorful,{" "}
                <br />
                and carefully handled. Every purchase lets you enjoy the
                <br />
                best of the ocean while supporting our community's <br />
                livelihood.
              </p>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="w-1/2 h-full flex items-center justify-end">
            <img
              src={seafoodBanner}
              alt="Fresh Seafood"
              className="h-[930px] w-auto object-contain -mr-8 md:-mr-16 lg:-mr-24 -mb-8 md:-mb-16 lg:-mb-14"
            />
          </div>
        </div>
      </section>

      {/* White Background Cover Section with Products */}
      <section className="relative z-30 bg-white py-16 -mt-20 md:-mt-36 lg:-mt-15">
        <div className="container mx-auto px-4 md:px-8">
          {/* Seafood Products Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <div className="lg:w-1/4 space-y-8">
              {/* Categories Filter */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="font-outfit font-bold text-xl text-primary mb-4">
                  Categories
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Fresh Fish", count: 35 },
                    { name: "Shrimp & Prawns", count: 20 },
                    { name: "Crabs", count: 5 },
                    { name: "Squid & Octopus", count: 12 },
                    { name: "Shellfish", count: 8 },
                    { name: "Seaweed", count: 10 },
                  ].map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between cursor-pointer hover:text-primary transition-colors"
                    >
                      <span className="font-inter font-medium text-gray-700">
                        {category.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          ({category.count})
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h3 className="font-outfit font-bold text-xl text-primary mb-4">
                  Price Range
                </h3>
                <div className="space-y-3">
                  {[
                    { range: "P100.00 - P199.00", checked: true },
                    { range: "P200.00 - P399.00", checked: false },
                    { range: "P400.00 - P699.00", checked: false },
                    { range: "P700.00 and above", checked: false },
                  ].map((price, index) => (
                    <label
                      key={index}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={price.checked}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="font-inter font-medium text-gray-700">
                        {price.range}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Products */}
            <div className="lg:w-3/4">
              {/* Search and Info Bar */}
              <div className="bg-white p-6 mb-8">
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search...."
                      className="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="text-left">
                    <p className="font-inter font-bold text-gray-700 mb-1">
                      Showing 1-9 of 36 item(s)
                    </p>
                    <p className="font-inter text-sm text-gray-500">
                      Below is the list of our available fresh fish for today's
                      catch.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    name: "Dalagang Bukid Bilog",
                    price: "P360/kg",
                    description: "Fresh Chilled Twinstripe Fusiller",
                    image: "fish1",
                  },
                  {
                    name: "Bangus",
                    price: "P289/kg",
                    description: "Fresh Chilled Milkfish",
                    image: "fish2",
                  },
                  {
                    name: "Bisugo",
                    price: "P380/kg",
                    description: "Fresh Chilled Threadfin Bream",
                    image: "fish3",
                  },
                  {
                    name: "Hasa-Hasa",
                    price: "P170/kg",
                    description: "Fresh Chilled Short Mackerel",
                    image: "fish4",
                  },
                  {
                    name: "Talakitok",
                    price: "P255/kg",
                    description: "Fresh Chilled Golden Trevally",
                    image: "fish5",
                  },
                  {
                    name: "Pusit",
                    price: "P239/kg",
                    description: "Fresh Chilled Squid",
                    image: "fish1",
                  },
                  {
                    name: "Alumahan",
                    price: "P240/kg",
                    description: "Fresh Chilled Indian Mackerel",
                    image: "fish2",
                  },
                  {
                    name: "Hipon",
                    price: "P325/kg",
                    description: "Fresh Chilled Shrimp",
                    image: "fish3",
                  },
                  {
                    name: "Tuna",
                    price: "P280/kg",
                    description: "Fresh Chilled Tuna",
                    image: "fish4",
                  },
                ].map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                      {/* Product Image */}
                      <img
                        src={
                          product.name === "Dalagang Bukid Bilog"
                            ? bisugo
                            : product.name === "Bangus"
                            ? hasa
                            : product.name === "Bisugo"
                            ? bisugo
                            : product.name === "Hasa-Hasa"
                            ? hasa
                            : product.name === "Talakitok"
                            ? talakitok
                            : product.name === "Pusit"
                            ? pusit
                            : product.name === "Alumahan"
                            ? alumahan
                            : product.name === "Hipon"
                            ? hipon
                            : product.name === "Tuna"
                            ? tuna
                            : bisugo // fallback
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-outfit font-bold text-lg text-primary">
                          {product.price}
                        </span>
                      </div>
                      <h3 className="font-outfit font-bold text-lg text-gray-800 mb-2">
                        {product.name}
                      </h3>
                      <p className="font-inter text-sm text-gray-600">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Section */}
              <div className="text-center">
                <p className="font-inter font-medium text-gray-600 mb-4">
                  Showing 1-9 of 36 item(s)
                </p>
                {/* Progress Bar */}
                <div className="w-full max-w-md mx-auto mb-6">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
                <button className="bg-secondary text-primary font-outfit font-bold px-8 py-3 rounded-full hover:bg-secondary/90 transition-colors">
                  LOAD MORE &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Seafood;
