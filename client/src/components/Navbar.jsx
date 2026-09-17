import { Search, Bell } from "lucide-react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <header className="navbar">
      <div className="navbar-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search careers, skills..."
        />
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <Bell size={20} />
        </button>

        <div className="navbar-user">
          <div className="user-avatar">
            {firstLetter}
          </div>

          <div className="user-info">
            <strong>{user.name || "User"}</strong>
            <span>Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;