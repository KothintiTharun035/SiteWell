import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/helper";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/dashboard" className="navbar__brand">
          <span className="navbar__dial" aria-hidden="true" />
          Sitewell
        </NavLink>

        <nav className="navbar__links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Run a check
          </NavLink>

          <div className="navbar__user">
            <span className="navbar__avatar" title={user?.fullName}>
              {getInitials(user?.fullName)}
            </span>
            <button className="navbar__logout" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
