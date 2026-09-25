require("dotenv").config();

const mongoose = require("mongoose");
const Career = require("./models/Career");

const careers = [

    {
        name: "Software Developer",

        description:
            "Build web, mobile and software applications using programming, problem solving and software development technologies.",

        category: "Software Development",

        requiredSkills: [
            "Java",
            "JavaScript",
            "DSA",
            "Git",
            "Programming"
        ],

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

        description:
            "Develop complete web applications by working with frontend and backend technologies.",

        category: "Web Development",

        requiredSkills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "MongoDB",
            "Web Development"
        ],

        roadmap: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "Express.js",
            "MongoDB"
        ],

        difficulty: "Intermediate"
    },

    {
        name: "Data Scientist",

        description:
            "Analyze data and build data-driven solutions using statistics, programming and machine learning.",

        category: "Data Science",

        requiredSkills: [
            "Python",
            "Statistics",
            "Machine Learning",
            "Data Analysis",
            "Data Visualization"
        ],

        roadmap: [
            "Python",
            "Statistics",
            "Data Analysis",
            "Data Visualization",
            "Machine Learning"
        ],

        difficulty: "Advanced"
    },

    {
        name: "AI/ML Engineer",

        description:
            "Design and develop intelligent systems using machine learning, deep learning and artificial intelligence techniques.",

        category: "Artificial Intelligence",

        requiredSkills: [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "Artificial Intelligence"
        ],

        roadmap: [
            "Python",
            "Mathematics",
            "Machine Learning",
            "Deep Learning",
            "Artificial Intelligence"
        ],

        difficulty: "Advanced"
    },

    {
        name: "DevOps Engineer",

        description:
            "Manage software deployment, automation, cloud infrastructure and development operations.",

        category: "Cloud & DevOps",

        requiredSkills: [
            "Linux",
            "Git",
            "Docker",
            "Cloud Computing",
            "CI/CD",
            "Kubernetes"
        ],

        roadmap: [
            "Linux",
            "Git",
            "Docker",
            "CI/CD",
            "Cloud Computing",
            "Kubernetes"
        ],

        difficulty: "Advanced"
    },

    {
        name: "Cybersecurity Analyst",

        description:
            "Protect applications, systems and networks from security threats and vulnerabilities.",

        category: "Cybersecurity",

        requiredSkills: [
            "Networking",
            "Cybersecurity",
            "Network Security",
            "Authentication"
        ],

        roadmap: [
            "Networking",
            "Cybersecurity Fundamentals",
            "Network Security",
            "Authentication",
            "Security"
        ],

        difficulty: "Advanced"
    }

];

const seedDatabase = async () => {
    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("MongoDB connected");

        await Career.deleteMany();

        await Career.insertMany(careers);

        console.log(
            `${careers.length} careers inserted successfully`
        );

        await mongoose.connection.close();

    } catch (error) {

        console.error(
            "Error:",
            error.message
        );

    }
};

seedDatabase();