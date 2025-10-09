import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import chartpie from "../../assets/icons/ChartPieSlice.png";
import person from "../../assets/icons/person.png";
import logo from "../../assets/logos/c2c_white_transparent.png";
import AdminNavItem from "./AdminNavItem";

const navItemClass = ({ isActive }) =>
  `flex relative items-center gap-3 px-4 py-3 rounded-l-2xl rounded-r-7xl transition shadow-none relative ${
    isActive
      ? "bg-white text-base-content -mr-6"
      : "text-primary-content/90 hover:bg-primary/70 hover:text-primary-content"
  }`;

const Sidebar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    // Navigate to home page after logout. Hook up auth clearing here if needed.
    navigate("/");
  };

  return (
    <aside className="bg-primary text-primary-content w-80 min-h-screen flex flex-col mt-4 mb-4 ml-4 rounded-2xl shadow-xl">
      <div className="h-24 flex items-center justify-center px-4 border-b border-primary/40">
        <Link to="/" className="inline-flex items-center gap-2">
          <img src={logo} alt="Coast2Cart" className="h-23 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <AdminNavItem
          to="/admin"
          end
          iconSrc={chartpie}
          iconAlt="Dashboard"
          label="Dashboard"
          iconWrapperClass="w-7 h-7 rounded-full bg-white grid place-items-center text-base-content"
        />
        <AdminNavItem
          to="/admin/buyers"
          iconSrc={person}
          iconAlt="Buyers"
          label="Buyer Account Management"
          iconWrapperClass="w-7 h-7 rounded-full bg-white grid place-items-center text-base-content"
        />
      </nav>

      <div className="mt-auto p-4 border-t border-primary/40 relative">
        {isProfileOpen && (
          <div className="absolute bottom-16 left-4 right-4 bg-white text-base-content rounded-xl shadow-2xl p-2 z-50">
            <button
              type="button"
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-base-200"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsProfileOpen((v) => !v)}
          className="w-full flex items-center gap-3"
          aria-haspopup="menu"
          aria-expanded={isProfileOpen}
        >
          <div className="w-10 h-10 rounded-full bg-primary-content/20 grid place-items-center text-lg">
            👤
          </div>
          <div className="leading-tight text-left">
            <p className="font-semibold">Admin1</p>
            <p className="text-primary-content/80 text-sm">admin123@email.com</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
