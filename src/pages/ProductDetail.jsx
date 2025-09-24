import { useLocation, useNavigate, useParams } from "react-router-dom";
import SellerSection from "../components/seafood/SellerSection";
import RelatedProducts from "../components/seafood/RelatedProducts";
import bisugo from "../assets/images/bisugo.png";
import hasa from "../assets/images/hasa_hasa.png";
import talakitok from "../assets/images/talakitok.png";
import pusit from "../assets/images/pusit.png";
import alumahan from "../assets/images/alumahan.png";
import hipon from "../assets/images/hipon.png";
import tuna from "../assets/images/tuna.png";

const productImageForName = (name) => {
  if (name === "Dalagang Bukid Bilog") return bisugo;
  if (name === "Bangus") return hasa;
  if (name === "Bisugo") return bisugo;
  if (name === "Hasa-Hasa") return hasa;
  if (name === "Talakitok") return talakitok;
  if (name === "Pusit") return pusit;
  if (name === "Alumahan") return alumahan;
  if (name === "Hipon") return hipon;
  if (name === "Tuna") return tuna;
  return bisugo;
};

const ProductDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const fallbackProducts = [
    {
      name: "Dalagang Bukid Bilog",
      price: "₱360/kg",
      description: "Fresh Chilled Twinstripe Fusiller",
    },
    { name: "Bangus", price: "₱289/kg", description: "Fresh Chilled Milkfish" },
    {
      name: "Bisugo",
      price: "₱380/kg",
      description: "Fresh Chilled Threadfin Bream",
    },
    {
      name: "Hasa-Hasa",
      price: "₱170/kg",
      description: "Fresh Chilled Short Mackerel",
    },
    {
      name: "Talakitok",
      price: "₱255/kg",
      description: "Fresh Chilled Golden Trevally",
    },
    { name: "Pusit", price: "₱239/kg", description: "Fresh Chilled Squid" },
    {
      name: "Alumahan",
      price: "₱240/kg",
      description: "Fresh Chilled Indian Mackerel",
    },
    { name: "Hipon", price: "₱325/kg", description: "Fresh Chilled Shrimp" },
    { name: "Tuna", price: "₱280/kg", description: "Fresh Chilled Tuna" },
  ];

  let product =
    state?.product ||
    fallbackProducts.find((p) => slug && slugify(p.name) === slug) ||
    fallbackProducts.find((p) => p.name === "Bangus");

  if (!product) {
    return (
      <div className="bg-white">
        <div className="max-w-8xl mx-auto px-4 py-16">
          <h1 className="font-outfit font-bold text-2xl mb-2">
            Product not found
          </h1>
          <p className="text-gray-600 mb-6">
            Please go back and select a product.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/seafood")}
          >
            Back to Seafood
          </button>
        </div>
      </div>
    );
  }

  const imageSrc = productImageForName(product.name);

  return (
    <div className="bg-white">
      <div className="max-w-8xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="flex gap-5">
            <div className="hidden sm:flex flex-col gap-4 w-24">
              {[imageSrc, imageSrc].map((src, i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 shadow-sm"
                >
                  <img
                    src={src}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div
                className="rounded-lg overflow-hidden bg-gray-100 shadow-sm"
                style={{ height: "540px" }}
              >
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="pt-2">
            <h1 className="font-outfit font-bold text-[28px] md:text-[36px] text-gray-900 mb-1">
              {product.name}
            </h1>
            <p className="text-gray-500 text-xs md:text-[11px] mb-3">
              Fresh Chilled Milkfish All Sizes
            </p>
            <div className="text-success font-outfit font-bold text-2xl md:text-3xl mb-4">
              {product.price}
            </div>
            <hr className="border-base-300 mb-4" />

            <div className="space-y-2 text-sm text-gray-700 mb-6">
              <p className="text-sm text-gray-600">Bangus (Milkfish)</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-start gap-2">
                  <span className="text-[12px]">📦</span>
                  <span>₱289 per kilo</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[12px]">🐟</span>
                  <span>Freshly caught this morning</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[12px]">⚖️</span>
                  <span>
                    Sold per kilogram. Average weight per fish: 300–500g (1 kg ≈
                    2–3 pieces)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[12px]">📍</span>
                  <span>Pickup at: Baybayon Market / agreed location</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-stretch gap-3 mb-3">
                <div className="flex items-center justify-between rounded-full border border-gray-300 h-11 px-3 min-w-[112px] select-none">
                  <button className="text-gray-600 hover:text-gray-900">
                    −
                  </button>
                  <span className="font-medium text-gray-800">1</span>
                  <button className="text-gray-600 hover:text-gray-900">
                    +
                  </button>
                </div>
                <button className="flex-1 h-11 rounded-full bg-[#E4490F] hover:bg-[#d0410d] text-white font-semibold">
                  Add to Cart
                </button>
              </div>
              <button className="w-full h-11 rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 font-medium">
                Message Seller
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Seller info and reviews */}
      <SellerSection />
      {/* Related products */}
      <RelatedProducts />
    </div>
  );
};

export default ProductDetail;
