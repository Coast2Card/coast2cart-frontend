import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import chartpie from "../../assets/icons/ChartPieSlice.png";
import person from "../../assets/icons/person.png";
import logo from "../../assets/logos/c2c_white_transparent.png";
import AdminNavItem from "./AdminNavItem";
import { api } from "../../services/api";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      if (raw) setAuthUser(JSON.parse(raw));
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } catch {
      // ignore storage errors
    }
    try {
      dispatch(api.util.resetApiState());
    } catch {
      // ignore dispatch errors
    }
    setAuthUser(null);
    setIsProfileOpen(false);
    toast.success("Logged out");
    navigate("/", { replace: true });
  };

  return (
    <aside className="bg-primary text-primary-content w-80  flex flex-col mt-3 mb-3 ml-3 rounded-2xl shadow-xl fixed top-0 left-0 bottom-0 z-40">
      <div className="h-24 flex items-center justify-center px-4 border-b border-primary/40">
        <Link to="/" className="inline-flex items-center gap-2">
          <img src={logo} alt="Coast2Cart" className="h-23 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {authUser?.role !== "superadmin" && (
          <>
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
            <AdminNavItem
              to="/admin/sellers"
              iconSrc={person}
              iconAlt="Sellers"
              label="Seller Account Management"
              iconWrapperClass="w-7 h-7 rounded-full bg-white grid place-items-center text-base-content"
            />
          </>
        )}
        {authUser?.role === "superadmin" && (
          <AdminNavItem
            to="/admin/admins"
            iconSrc={person}
            iconAlt="Admins"
            label="Admin Account Management"
            iconWrapperClass="w-7 h-7 rounded-full bg-white grid place-items-center text-base-content"
          />
        )}
      </nav>

      <div className="mt-auto p-4 border-t border-primary/40 relative">
        {isProfileOpen && (
          <div className="absolute bottom-16 left-4 right-4 bg-white text-base-content rounded-xl shadow-2xl p-2 z-50">
            <button
              type="button"
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-base-200 cursor-pointer transition-colors"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsProfileOpen((v) => !v)}
          className="w-full flex items-center gap-3 cursor-pointer hover:bg-primary/20 rounded-xl p-2 transition-colors"
          aria-haspopup="menu"
          aria-expanded={isProfileOpen}
        >
          <div className="w-10 h-10 rounded-full bg-primary-content/20 grid place-items-center text-lg">
            👤
          </div>
          <div className="leading-tight text-left">
            <p className="font-semibold">
              {(authUser?.firstName || authUser?.username || "").toString()}{" "}
              {authUser?.lastName || ""}
            </p>
            <p className="text-primary-content/80 text-sm">
              {authUser?.email || ""}
            </p>
            {authUser?.role && (
              <div className="mt-1">
                <span
                  className={
                    authUser.role === "superadmin"
                      ? "badge badge-sm bg-yellow-300 text-black border-0"
                      : authUser.role === "admin"
                      ? "badge badge-sm bg-white text-primary border-0"
                      : "badge badge-sm bg-white text-primary border-0"
                  }
                >
                  {(authUser.role === "superadmin" && "Super Admin") ||
                    (authUser.role === "admin" && "Admin") ||
                    authUser.role}
                </span>
              </div>
            )}
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
