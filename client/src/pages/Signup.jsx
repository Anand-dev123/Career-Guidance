import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        education: "",
        college: "",
        year: "",
        targetCareer: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post(
                "/auth/signup",
                form
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Signup failed"
            );
        }
    };

    return (
        <div>
            <h1>Create Account</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>

                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <input
                    name="education"
                    placeholder="Education"
                    value={form.education}
                    onChange={handleChange}
                />

                <input
                    name="college"
                    placeholder="College"
                    value={form.college}
                    onChange={handleChange}
                />

                <input
                    name="year"
                    placeholder="Year"
                    value={form.year}
                    onChange={handleChange}
                />

                <select
                    name="targetCareer"
                    value={form.targetCareer}
                    onChange={handleChange}
                >
                    <option value="">
                        Select Career
                    </option>

                    <option value="Software Developer">
                        Software Developer
                    </option>

                    <option value="Full Stack Developer">
                        Full Stack Developer
                    </option>

                    <option value="DevOps Engineer">
                        DevOps Engineer
                    </option>

                    <option value="Cloud Engineer">
                        Cloud Engineer
                    </option>

                    <option value="Data Analyst">
                        Data Analyst
                    </option>
                </select>

                <button type="submit">
                    Create Account
                </button>

            </form>

            <p>
                Already have an account?
                <Link to="/login"> Login</Link>
            </p>
        </div>
    );
}

export default Signup;