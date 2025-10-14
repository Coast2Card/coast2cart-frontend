// Import images as modules for proper Vite processing
import dalagangBukid from "../assets/images/dalagang_bukid.png";
import bangus from "../assets/images/bangus.png";
import bisugo from "../assets/images/bisugo.png";
import hasaHasa from "../assets/images/hasa_hasa.jpg";

// Navigation links data
export const navLinks = [
  { path: "/", label: "Home" },
  { path: "/seafood", label: "Seafood" },
  { path: "/souvenirs", label: "Souvenirs" },
  { path: "/about", label: "About" },
  // { path: "/cart", label: "Cart" },
  // { path: "/profile", label: "Profile" },
  // { path: "/colors", label: "Colors" },
];

export const freshCatchItems = [
  {
    id: 1,
    price: "₱360/kg",
    name: "Dalagang Bukid Bilog",
    description: "Fresh Chilled Twinstripe Fusilier",
    image: dalagangBukid,
  },
  {
    id: 2,
    price: "₱420/kg",
    name: "Bangus",
    description: "Fresh milkfish from local farms",
    image: bangus,
  },
  {
    id: 3,
    price: "₱520/kg",
    name: "Bisugo",
    description: "Premium cuts, freshly caught",
    image: bisugo,
  },
  {
    id: 4,
    price: "₱300/kg",
    name: "Hasa-hasa",
    description: "Locally sourced mackerel",
    image: hasaHasa,
  },
];
