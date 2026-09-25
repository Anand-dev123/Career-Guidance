import { Search, Bell } from "lucide-react";

function Navbar() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const userRole =
    user.role === "admin"
      ? "Admin"
      : "Student";

  return (
    <header
      style={{
        height: "72px",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        padding: "0 28px",

        background: "#FFFFFF",

        borderBottom: "1px solid #E2E8F0",

        boxSizing: "border-box",

        position: "sticky",
        top: 0,

        zIndex: 900,
      }}
    >
      {/* ==================================================
          SEARCH
      ================================================== */}

      <div
        style={{
          width: "min(360px, 42vw)",
          height: "40px",

          display: "flex",
          alignItems: "center",

          gap: "9px",

          padding: "0 13px",

          background: "#F8FAFC",

          border: "1px solid #E2E8F0",

          borderRadius: "8px",

          boxSizing: "border-box",
        }}
      >
        <Search
          size={18}
          strokeWidth={2}
          color="#64748B"
        />

        <input
          type="text"
          placeholder="Search careers, skills..."
          style={{
            width: "100%",

            border: "none",
            outline: "none",

            background: "transparent",

            color: "#0F172A",

            fontFamily: "inherit",

            fontSize: "13px",
          }}
        />
      </div>

      {/* ==================================================
          RIGHT SECTION
      ================================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",

          gap: "14px",
        }}
      >
        {/* Notification */}

        <button
          type="button"
          aria-label="Notifications"
          style={{
            width: "38px",
            height: "38px",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            border: "1px solid #E2E8F0",

            borderRadius: "8px",

            background: "#FFFFFF",

            color: "#64748B",

            cursor: "pointer",

            transition:
              "background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "#F8FAFC";

            e.currentTarget.style.borderColor =
              "#CBD5E1";

            e.currentTarget.style.color =
              "#2563EB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "#FFFFFF";

            e.currentTarget.style.borderColor =
              "#E2E8F0";

            e.currentTarget.style.color =
              "#64748B";
          }}
        >
          <Bell
            size={19}
            strokeWidth={2}
          />
        </button>

        {/* Divider */}

        <div
          style={{
            width: "1px",
            height: "30px",

            background: "#E2E8F0",
          }}
        />

        {/* User */}

        <div
          style={{
            display: "flex",
            alignItems: "center",

            gap: "10px",
          }}
        >
          {/* Avatar */}

          <div
            style={{
              width: "38px",
              height: "38px",

              flexShrink: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: "9px",

              background: "#EFF6FF",

              color: "#2563EB",

              fontSize: "13px",

              fontWeight: "700",
            }}
          >
            {firstLetter}
          </div>

          {/* User Info */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",

              minWidth: 0,
            }}
          >
            <strong
              style={{
                maxWidth: "150px",

                overflow: "hidden",

                color: "#0F172A",

                fontSize: "12px",

                fontWeight: "600",

                whiteSpace: "nowrap",

                textOverflow: "ellipsis",
              }}
            >
              {user.name || "User"}
            </strong>

            <span
              style={{
                marginTop: "2px",

                color: "#64748B",

                fontSize: "10px",

                fontWeight: "500",
              }}
            >
              {userRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;