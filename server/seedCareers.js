require("dotenv").config();

const mongoose = require("mongoose");
const Career = require("./models/Career");

const careers = [
    {
        name: "Software Developer",
        category: "Software Development",
        description:
            "Build web, mobile and software applications using programming and development technologies.",
        requiredSkills: ["Java", "JavaScript", "DSA", "Git"],
        roadmap: [
            "Programming Fundamentals",
            "Java",
            "DSA",
            "Git",
            "Software Development"
        ],
        difficulty: "Intermediate"
    },

    {
        name: "Full Stack Developer",
        category: "Web Development",
        description:
            "Develop complete web applications by working with both frontend and backend technologies.",
        requiredSkills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js"
        ],
        roadmap: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "Express",
            "MongoDB"
        ],
        difficulty: "Intermediate"
    },

    {
        name: "Data Scientist",
        category: "Data Science",
        description:
            "Analyze data and build data-driven solutions using statistics, programming and machine learning.",
        requiredSkills: [
            "Python",
            "Statistics",
            "SQL",
            "Machine Learning"
        ],
        roadmap: [
            "Python",
            "Statistics",
            "SQL",
            "Data Analysis",
            "Machine Learning"
        ],
        difficulty: "Advanced"
    },

    {
        name: "AI/ML Engineer",
        category: "Artificial Intelligence",
        description:
            "Design and develop intelligent systems using machine learning and artificial intelligence techniques.",
        requiredSkills: [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "AI"
        ],
        roadmap: [
            "Python",
            "Mathematics",
            "Machine Learning",
            "Deep Learning",
            "AI"
        ],
        difficulty: "Advanced"
    },

    {
        name: "DevOps Engineer",
        category: "Cloud & DevOps",
        description:
            "Manage software deployment, automation, cloud infrastructure and development operations.",
        requiredSkills: [
            "Linux",
            "Git",
            "Docker",
            "Cloud",
            "CI/CD"
        ],
        roadmap: [
            "Linux",
            "Git",
            "Networking",
            "Docker",
            "CI/CD",
            "Cloud"
        ],
        difficulty: "Advanced"
    },

    {
        name: "Cybersecurity Analyst",
        category: "Cybersecurity",
        description:
            "Protect applications, systems and networks from security threats and vulnerabilities.",
        requiredSkills: [
            "Networking",
            "Linux",
            "Security",
            "Cryptography"
        ],
        roadmap: [
            "Networking",
            "Linux",
            "Cybersecurity Fundamentals",
            "Cryptography",
            "Security"
        ],
        difficulty: "Advanced"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Career.deleteMany();

        await Career.insertMany(careers);

        console.log("Career data inserted successfully");

        await mongoose.connection.close();

    } catch (error) {
        console.error("Error:", error.message);
    }
};

seedDatabase();