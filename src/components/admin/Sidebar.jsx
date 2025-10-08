import { Link, NavLink } from "react-router-dom";
import chartpie from "../../assets/icons/ChartPieSlice.png";
import person from "../../assets/icons/person.png";
import logo from "../../assets/logos/c2c_white_transparent.png";

const navItemClass = ({ isActive }) =>
  `flex relative items-center gap-3 px-4 py-3 rounded-l-2xl rounded-r-7xl transition shadow-none relative ${
    isActive
      ? "bg-white text-base-content -mr-6"
      : "text-primary-content/90 hover:bg-primary/70 hover:text-primary-content"
  }`;

const Sidebar = () => {
  return (
    <aside className="bg-primary text-primary-content w-64 min-h-screen flex flex-col mt-4 mb-4 ml-4 rounded-2xl shadow-xl">
      <div className="h-24 flex items-center justify-center px-4 border-b border-primary/40">
        <Link to="/" className="inline-flex items-center gap-2">
          <img src={logo} alt="Coast2Cart" className="h-23 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/admin" end className={navItemClass}>
          <span className="w-7 h-7 rounded-full bg-white grid place-items-center text-base-content">
            <img src={chartpie} alt="Dashboard" className="w-4 h-4" />
          </span>
          <span>Dashboard</span>
          <div className="absolute right-0 -top-5 w-7 h-10  bg-white"></div>
          <div className="absolute right-2 -top-9 w-9.5 h-9 bg-primary rounded-full "></div>
          <div className="absolute right-0 top-7 w-7 h-10  bg-white"></div>
          <div className="absolute right-2 top-13 w-9.5 h-9 bg-primary rounded-full "></div>
        </NavLink>
        <NavLink to="/admin/sellers" className={navItemClass}>
          <span className="w-13 h-7 rounded-lg bg-white grid place-items-center text-base-content">
            <img src={person} alt="Sellers" className="w-4 h-4" />
          </span>
          <span>Seller Account Management</span>
        </NavLink>
      </nav>

      <div className="mt-auto p-4 border-t border-primary/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-content/20 grid place-items-center text-lg">
            👤
          </div>
          <div className="leading-tight">
            <p className="font-semibold">Admin1</p>
            <p className="text-primary-content/80 text-sm">
              admin123@email.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
