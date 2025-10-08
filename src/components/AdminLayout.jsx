import { Outlet } from "react-router-dom";
import Sidebar from "./admin/Sidebar";
import Topbar from "./admin/Topbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-base-300 flex">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />
        {/* Main Content */}
        <div className="p-6 bg-base-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
