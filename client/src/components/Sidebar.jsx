import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  Brain,
  BriefcaseBusiness,
  Map,
  BookOpen,
  FileCheck,
  CalendarDays,
  Code2,
  TrendingUp,
  User,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Career Assessment", icon: ClipboardCheck, path: "/assessment" },
  { name: "My Skills", icon: Brain, path: "/skills" },
  { name: "Career Explorer", icon: BriefcaseBusiness, path: "/careers" },
  { name: "Learning Roadmap", icon: Map, path: "/roadmap" },
  { name: "Assignments", icon: BookOpen, path: "/assignments" },
  { name: "Tests", icon: FileCheck, path: "/tests" },
  { name: "Study Planner", icon: CalendarDays, path: "/planner" },
  { name: "DSA Lab", icon: Code2, path: "/dsa-lab" },
  { name: "Progress", icon: TrendingUp, path: "/progress" },
  { name: "Profile", icon: User, path: "/profile" },
];

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Code2 size={28} />
        <span>CareerGuide</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
              key={item.name}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={19} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
