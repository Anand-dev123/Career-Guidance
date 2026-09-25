import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!userData) {
        return <Navigate to="/dashboard" replace />;
    }

    try {
        const user = JSON.parse(userData);

        if (user.role !== "admin") {
            return <Navigate to="/dashboard" replace />;
        }

        return children;
    } catch (error) {
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }
}

export default AdminProtectedRoute;