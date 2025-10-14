import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import notification from "../../assets/icons/notification.png";
import recent from "../../assets/icons/recent.png";
import searchIcon from "../../assets/icons/search.png";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const path = location.pathname;
  let current = "Dashboard";
  if (path.startsWith("/admin/")) {
    const sub = path.split("/")[2] || "";
    if (sub === "buyers") current = "Buyer Account Management";
    else if (sub === "sellers") current = "Seller Account Management";
    else current = "Dashboard";
  }

  return (
    <div className="flex items-center justify-between h-20 px-6 bg-base-300">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>Coast2Cart</li>
          <li>{current}</li>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        {current !== "Dashboard" && (
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 text-base-content/70 h-10 rounded-full px-4">
              <img src={searchIcon} alt="Search" className="w-4 h-4 opacity-60" />
              <input
                className="bg-transparent outline-none w-56 placeholder:text-base-content/50"
                placeholder={`Search ${current.toLowerCase()}`}
                aria-label="Search"
                defaultValue={qParam}
                onChange={(e) => {
                  // live-update q parameter to let pages react while typing
                  const value = e.currentTarget.value;
                  const next = new URLSearchParams(location.search);
                  if (value) next.set("q", value);
                  else next.delete("q");
                  setSearchParams(next, { replace: true });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = e.currentTarget.value;
                    const next = new URLSearchParams(location.search);
                    if (value) next.set("q", value);
                    else next.delete("q");
                    setSearchParams(next, { replace: true });
                    navigate({ pathname: location.pathname, search: next.toString() }, { replace: true });
                  }
                }}
                onBlur={(e) => {
                  const value = e.currentTarget.value;
                  const next = new URLSearchParams(location.search);
                  if (value) next.set("q", value);
                  else next.delete("q");
                  setSearchParams(next, { replace: true });
                }}
              />
              <span className="ml-2 text-xs rounded-md px-2 py-0.5 bg-gray-200 text-base-content/60">
                /
              </span>
            </div>
          </div>
        )}
        {/* Notification and recent buttons removed per request */}
      </div>
    </div>
  );
};

export default Topbar;
