import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store.js";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const fullname = `${user.fullname.firstname} ${user.fullname.lastname}`;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Profile</h1>
        <p><strong>Name:</strong> {fullname}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user._id}</p>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};