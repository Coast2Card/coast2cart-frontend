import { Navigate } from "react-router-dom";

const Profile = () => {
  let role = null;
  try {
    const raw = localStorage.getItem("auth_user");
    role = raw ? JSON.parse(raw)?.role : null;
  } catch {}

  if (role === "buyer") return <Navigate to="/profile/buyer" replace />;
  if (role === "seller") return <Navigate to="/profile/seller" replace />;
  if (role === "superadmin")
    return <Navigate to="/profile/superadmin" replace />;
  return <Navigate to="/" replace />;
};

export default Profile;
