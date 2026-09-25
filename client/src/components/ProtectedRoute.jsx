import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userData);

        // Admin ko student pages se admin dashboard par bhejo
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        }

        return children;

    } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        return <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;