import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardCheck,
  Brain,
  BriefcaseBusiness,
  Map,
  BookOpen,
  CalendarDays,
  TrendingUp,
  User,
  LogOut,
  FileText,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";

// ======================================================
// Sidebar Menu Items
// ======================================================

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },

  {
    name: "Career Assessment",
    icon: ClipboardCheck,
    path: "/assessment",
  },

  {
    name: "My Skills",
    icon: Brain,
    path: "/skills",
  },

  {
    name: "Career Explorer",
    icon: BriefcaseBusiness,
    path: "/careers",
  },

  {
    name: "Resume Analyzer",
    icon: FileText,
    path: "/resume-analyzer",
  },

  {
    name: "Learning Roadmap",
    icon: Map,
    path: "/roadmap",
  },

  {
    name: "Learning Hub",
    icon: BookOpen,
    path: "/learning",
  },

  {
    name: "Assignments",
    icon: FileText,
    path: "/assignments",
  },

  {
    name: "Study Planner",
    icon: CalendarDays,
    path: "/planner",
  },

  {
    name: "Internships",
    icon: BriefcaseBusiness,
    path: "/internships",
  },

  {
    name: "Progress",
    icon: TrendingUp,
    path: "/progress",
  },

  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
];

// ======================================================
// Sidebar Component
// ======================================================

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // ====================================================
  // Set initial sidebar width
  // ====================================================

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      "250px"
    );

    return () => {
      document.documentElement.style.removeProperty(
        "--sidebar-width"
      );
    };
  }, []);

  // ====================================================
  // Toggle Sidebar
  // ====================================================

  const handleToggle = () => {
    setCollapsed((previous) => {
      const nextState = !previous;

      document.documentElement.style.setProperty(
        "--sidebar-width",
        nextState ? "76px" : "250px"
      );

      return nextState;
    });
  };

  // ====================================================
  // Logout
  // ====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,

        width: collapsed ? "76px" : "250px",

        display: "flex",
        flexDirection: "column",

        background: "#1E293B",
        color: "#E2E8F0",

        borderRight: "1px solid #334155",

        zIndex: 1000,

        boxSizing: "border-box",

        transition: "width 0.25s ease",
      }}
    >

      {/* ==================================================
          HEADER / BRAND
      ================================================== */}

      <div
        style={{
          height: "72px",

          padding: collapsed
            ? "0 14px"
            : "0 18px",

          display: "flex",
          alignItems: "center",

          justifyContent: collapsed
            ? "center"
            : "space-between",

          gap: "10px",

          flexShrink: 0,

          borderBottom: "1px solid #334155",

          boxSizing: "border-box",
        }}
      >

        {!collapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",

              minWidth: 0,
            }}
          >

            {/* Logo */}

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
              <GraduationCap
                size={22}
                strokeWidth={2.2}
              />
            </div>

            {/* Brand */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span
                style={{
                  color: "#FFFFFF",

                  fontSize: "16px",
                  fontWeight: "700",

                  lineHeight: "1.2",
                }}
              >
                CareerGuide
              </span>

              <span
                style={{
                  marginTop: "3px",

                  color: "#94A3B8",

                  fontSize: "10px",
                  fontWeight: "500",
                }}
              >
                Student Panel
              </span>
            </div>

          </div>
        )}

        {/* Toggle Button */}

        <button
          onClick={handleToggle}
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          style={{
            width: "34px",
            height: "34px",

            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            border: "1px solid #475569",
            borderRadius: "8px",

            background: "#334155",
            color: "#CBD5E1",

            cursor: "pointer",

            transition:
              "background-color 0.18s ease, color 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "#475569";

            e.currentTarget.style.color =
              "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "#334155";

            e.currentTarget.style.color =
              "#CBD5E1";
          }}
        >
          {collapsed ? (
            <Menu size={19} />
          ) : (
            <X size={19} />
          )}
        </button>

      </div>


      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav
        style={{
          flex: 1,

          padding: collapsed
            ? "18px 10px"
            : "18px 12px",

          overflowY: "auto",
          overflowX: "hidden",

          boxSizing: "border-box",
        }}
      >

        {!collapsed && (
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
            LEARNING & CAREER
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",

            gap: "3px",
          }}
        >

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.name : ""}
                style={({ isActive }) => ({
                  minHeight: "42px",

                  padding: collapsed
                    ? "0"
                    : "0 11px",

                  display: "flex",
                  alignItems: "center",

                  justifyContent: collapsed
                    ? "center"
                    : "flex-start",

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
                  const isActive =
                    e.currentTarget.getAttribute(
                      "aria-current"
                    ) === "page";

                  if (!isActive) {
                    e.currentTarget.style.background =
                      "#334155";

                    e.currentTarget.style.color =
                      "#FFFFFF";
                  }
                }}
                onMouseLeave={(e) => {
                  const isActive =
                    e.currentTarget.getAttribute(
                      "aria-current"
                    ) === "page";

                  if (!isActive) {
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

                {!collapsed && (
                  <span
                    style={{
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </span>
                )}

              </NavLink>
            );
          })}

        </div>

      </nav>


      {/* ==================================================
          LOGOUT
      ================================================== */}

      <div
        style={{
          padding: collapsed
            ? "10px"
            : "12px",

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
          title={collapsed ? "Logout" : ""}
          aria-label="Logout"
          style={{
            width: "100%",

            minHeight: "42px",

            padding: collapsed
              ? "0"
              : "0 11px",

            display: "flex",
            alignItems: "center",

            justifyContent: collapsed
              ? "center"
              : "flex-start",

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

          {!collapsed && (
            <span>Logout</span>
          )}

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;