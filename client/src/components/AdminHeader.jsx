import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import "./AdminHeader.css";

const pageInfo = {
  "/admin": {
    title: "Dashboard",
    description: "Overview of your CareerGuide platform",
  },
  "/admin/students": {
    title: "Students",
    description: "Manage registered students and their profiles",
  },
  "/admin/careers": {
    title: "Careers",
    description: "Manage career paths and requirements",
  },
  "/admin/skills": {
    title: "Skills",
    description: "Manage skills used across the platform",
  },
  "/admin/questions": {
    title: "Questions",
    description: "Manage assessment questions",
  },
  "/admin/roadmaps": {
    title: "Roadmaps",
    description: "Manage career learning roadmaps",
  },
  "/admin/resources": {
    title: "Learning Resources",
    description: "Manage learning resources and materials",
  },
  "/admin/assignments": {
    title: "Assignments",
    description: "Manage student assignments",
  },
  "/admin/internships": {
    title: "Internships",
    description: "Manage internship opportunities",
  },
};

function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const currentPage =
    pageInfo[location.pathname] || pageInfo["/admin"];

  const adminName = user.name || "Administrator";
  const adminEmail = user.email || "Admin account";

  const getInitials = () => {
    return adminName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-breadcrumb">
          <span>Admin</span>

          <ChevronRight size={14} />

          <strong>{currentPage.title}</strong>
        </div>

        <div className="admin-header-heading">
          <h1>{currentPage.title}</h1>

          <p>{currentPage.description}</p>
        </div>
      </div>

      <div className="admin-header-right">
        <button
          type="button"
          className="admin-notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>

        <div className="admin-header-divider" />

        <div className="admin-profile">
          <div className="admin-profile-avatar">
            {getInitials()}
          </div>

          <div className="admin-profile-info">
            <strong>{adminName}</strong>
            <span>{adminEmail}</span>
          </div>
        </div>

        <button
          type="button"
          className="admin-header-logout"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;