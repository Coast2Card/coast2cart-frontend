import notification from "../../assets/icons/notification.png";
import recent from "../../assets/icons/recent.png";
import searchIcon from "../../assets/icons/search.png";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between h-20 px-6 bg-base-300">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>Coast2Cart</li>
          <li>Dashboard</li>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 text-base-content/70 h-10 rounded-full px-4">
            <img src={searchIcon} alt="Search" className="w-4 h-4 opacity-60" />
            <input
              className="bg-transparent outline-none w-56 placeholder:text-base-content/50"
              placeholder="Search"
              aria-label="Search"
            />
            <span className="ml-2 text-xs rounded-md px-2 py-0.5 bg-gray-200 text-base-content/60">
              /
            </span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm text-base-content">
          <img src={recent} alt="Recent" className="w-6 h-6" />
        </button>
        <button className="btn btn-ghost btn-sm text-base-content">
          <img src={notification} alt="Notifications" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
