import { useLocation, useNavigate } from "react-router-dom";

const AdminNavItem = ({ to, end, iconSrc, iconAlt, iconWrapperClass, label }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Custom active detection without NavLink's built-in behavior
  const isActive = end 
    ? location.pathname === to
    : location.pathname.startsWith(to);
  
  const handleClick = () => {
    navigate(to);
  };

  const navItemClass = `flex relative items-center gap-3 px-4 py-3 rounded-l-2xl rounded-r-7xl shadow-none relative cursor-pointer ${
    isActive
      ? "bg-white text-base-content -mr-6"
      : "text-primary-content/90 hover:bg-primary/70 hover:text-primary-content"
  }`;

  return (
    <div className={navItemClass} onClick={handleClick}>
      <span className={iconWrapperClass || "w-7 h-7 rounded-full bg-white grid place-items-center text-base-content"}>
        {iconSrc && <img src={iconSrc} alt={iconAlt || label} className="w-4 h-4" />}
      </span>
      <span className="whitespace-nowrap">{label}</span>
      {isActive && (
        <>
          <div className="absolute right-0 -top-5 w-7 h-10 bg-white"></div>
          <div className="absolute right-2 -top-9 w-9.5 h-9 bg-primary rounded-full"></div>
          <div className="absolute right-0 top-8 w-7 h-10 bg-white"></div>
          <div className="absolute right-2 top-13 w-9.5 h-9 bg-primary rounded-full"></div>
        </>
      )}
    </div>
  );
};

export default AdminNavItem;


