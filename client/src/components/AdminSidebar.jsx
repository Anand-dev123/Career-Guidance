import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  Brain,
  ClipboardCheck,
  Map,
  BookOpen,
  FileText,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const adminMenuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    name: "Students",
    icon: Users,
    path: "/admin/students",
  },
  {
    name: "Careers",
    icon: BriefcaseBusiness,
    path: "/admin/careers",
  },
  {
    name: "Skills",
    icon: Brain,
    path: "/admin/skills",
  },
  {
    name: "Questions",
    icon: ClipboardCheck,
    path: "/admin/questions",
  },
  {
    name: "Roadmaps",
    icon: Map,
    path: "/admin/roadmaps",
  },
  {
    name: "Learning Resources",
    icon: BookOpen,
    path: "/admin/resources",
  },
  {
    name: "Assignments",
    icon: FileText,
    path: "/admin/assignments",
  },
  {
    name: "Internships",
    icon: BriefcaseBusiness,
    path: "/admin/internships",
  },
];

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,

        width: "250px",

        display: "flex",
        flexDirection: "column",

        background: "#1E293B",
        color: "#E2E8F0",

        borderRight: "1px solid #334155",

        zIndex: 1000,

        boxSizing: "border-box",
      }}
    >
      {/* ==================================================
          BRAND
      ================================================== */}

      <div
        style={{
          height: "72px",
          padding: "0 20px",

          display: "flex",
          alignItems: "center",
          gap: "11px",

          flexShrink: 0,

          borderBottom: "1px solid #334155",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",

            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            background: "#2563EB",
            color: "#FFFFFF",

            borderRadius: "9px",
          }}
        >
          <ShieldCheck
            size={22}
            strokeWidth={2.2}
          />
        </div>

        <div
          style={{
            minWidth: 0,

            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              margin: 0,

              color: "#FFFFFF",

              fontSize: "16px",
              fontWeight: "700",
              lineHeight: "1.2",
            }}
          >
            CareerGuide
          </h2>

          <span
            style={{
              marginTop: "3px",

              color: "#94A3B8",

              fontSize: "11px",
              fontWeight: "500",
            }}
          >
            Admin Panel
          </span>
        </div>
      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav
        style={{
          flex: 1,

          padding: "20px 12px",

          overflowY: "auto",
          overflowX: "hidden",

          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            padding: "0 10px",
            marginBottom: "9px",

            color: "#94A3B8",

            fontSize: "10px",
            fontWeight: "700",

            letterSpacing: "0.08em",
          }}
        >
          MANAGEMENT
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          {adminMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                style={({ isActive }) => ({
                  minHeight: "42px",

                  padding: "0 11px",

                  display: "flex",
                  alignItems: "center",

                  gap: "11px",

                  boxSizing: "border-box",

                  color: isActive
                    ? "#FFFFFF"
                    : "#CBD5E1",

                  background: isActive
                    ? "#2563EB"
                    : "transparent",

                  borderRadius: "8px",

                  textDecoration: "none",

                  fontSize: "13px",

                  fontWeight: isActive
                    ? "600"
                    : "500",

                  transition:
                    "background-color 0.18s ease, color 0.18s ease",
                })}
                onMouseEnter={(e) => {
                  if (
                    !e.currentTarget.classList.contains(
                      "active"
                    )
                  ) {
                    e.currentTarget.style.background =
                      "#334155";

                    e.currentTarget.style.color =
                      "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  if (
                    !e.currentTarget.classList.contains(
                      "active"
                    )
                  ) {
                    e.currentTarget.style.background =
                      "transparent";

                    e.currentTarget.style.color =
                      "#CBD5E1";
                  }
                }}
              >
                <span
                  style={{
                    width: "20px",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    flexShrink: 0,
                  }}
                >
                  <Icon
                    size={18}
                    strokeWidth={2}
                  />
                </span>

                <span
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div
        style={{
          padding: "12px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: "1px",

            marginBottom: "10px",

            background: "#334155",
          }}
        />

        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "100%",
            minHeight: "42px",

            padding: "0 11px",

            display: "flex",
            alignItems: "center",

            gap: "11px",

            border: "none",
            borderRadius: "8px",

            background: "transparent",

            color: "#CBD5E1",

            fontFamily: "inherit",

            fontSize: "13px",
            fontWeight: "500",

            cursor: "pointer",

            transition:
              "background-color 0.18s ease, color 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "#7F1D1D";

            e.currentTarget.style.color =
              "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "transparent";

            e.currentTarget.style.color =
              "#CBD5E1";
          }}
        >
          <LogOut
            size={18}
            strokeWidth={2}
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;