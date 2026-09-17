require("dotenv").config();

const mongoose = require("mongoose");
const Skill = require("./models/Skill");

const skills = [
    {
        name: "Java",
        category: "Programming",
        difficulty: "Intermediate",
        prerequisites: [],
        relatedSkills: ["DSA", "JavaScript"]
    },

    {
        name: "JavaScript",
        category: "Programming",
        difficulty: "Beginner",
        prerequisites: [],
        relatedSkills: ["React", "Node.js"]
    },

    {
        name: "DSA",
        category: "Computer Science",
        difficulty: "Intermediate",
        prerequisites: ["Programming"],
        relatedSkills: ["Algorithms", "Problem Solving"]
    },

    {
        name: "Git",
        category: "Development Tools",
        difficulty: "Beginner",
        prerequisites: [],
        relatedSkills: ["GitHub", "CI/CD"]
    },

    {
        name: "HTML",
        category: "Web Development",
        difficulty: "Beginner",
        prerequisites: [],
        relatedSkills: ["CSS", "JavaScript"]
    },

    {
        name: "CSS",
        category: "Web Development",
        difficulty: "Beginner",
        prerequisites: ["HTML"],
        relatedSkills: ["JavaScript", "React"]
    },

    {
        name: "React",
        category: "Web Development",
        difficulty: "Intermediate",
        prerequisites: ["JavaScript", "HTML", "CSS"],
        relatedSkills: ["Node.js", "Frontend"]
    },

    {
        name: "Node.js",
        category: "Backend Development",
        difficulty: "Intermediate",
        prerequisites: ["JavaScript"],
        relatedSkills: ["Express", "MongoDB"]
    },

    {
        name: "Express",
        category: "Backend Development",
        difficulty: "Intermediate",
        prerequisites: ["Node.js"],
        relatedSkills: ["MongoDB", "Backend"]
    },

    {
        name: "MongoDB",
        category: "Database",
        difficulty: "Intermediate",
        prerequisites: ["Database"],
        relatedSkills: ["Express", "Node.js"]
    },

    {
        name: "Python",
        category: "Programming",
        difficulty: "Beginner",
        prerequisites: [],
        relatedSkills: ["Machine Learning", "Data Science"]
    },

    {
        name: "SQL",
        category: "Database",
        difficulty: "Beginner",
        prerequisites: [],
        relatedSkills: ["DBMS", "Data Analysis"]
    },

    {
        name: "Statistics",
        category: "Data Science",
        difficulty: "Intermediate",
        prerequisites: [],
        relatedSkills: ["Python", "Machine Learning"]
    },

    {
        name: "Machine Learning",
        category: "Artificial Intelligence",
        difficulty: "Advanced",
        prerequisites: ["Python", "Statistics"],
        relatedSkills: ["Deep Learning", "AI"]
    },

    {
        name: "Deep Learning",
        category: "Artificial Intelligence",
        difficulty: "Advanced",
        prerequisites: ["Machine Learning"],
        relatedSkills: ["AI"]
    },

    {
        name: "AI",
        category: "Artificial Intelligence",
        difficulty: "Advanced",
        prerequisites: ["Machine Learning", "Deep Learning"],
        relatedSkills: ["Python"]
    },

    {
        name: "Linux",
        category: "Cloud & DevOps",
        difficulty: "Intermediate",
        prerequisites: [],
        relatedSkills: ["Networking", "Docker"]
    },

    {
        name: "Docker",
        category: "Cloud & DevOps",
        difficulty: "Intermediate",
        prerequisites: ["Linux"],
        relatedSkills: ["CI/CD", "Cloud"]
    },

    {
        name: "Cloud",
        category: "Cloud & DevOps",
        difficulty: "Advanced",
        prerequisites: ["Linux", "Networking"],
        relatedSkills: ["Docker", "CI/CD"]
    },

    {
        name: "Networking",
        category: "Computer Networks",
        difficulty: "Intermediate",
        prerequisites: [],
        relatedSkills: ["Linux", "Security"]
    },

    {
        name: "Security",
        category: "Cybersecurity",
        difficulty: "Intermediate",
        prerequisites: ["Networking", "Linux"],
        relatedSkills: ["Cryptography"]
    },

    {
        name: "Cryptography",
        category: "Cybersecurity",
        difficulty: "Advanced",
        prerequisites: ["Security"],
        relatedSkills: ["Networking"]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Skill.deleteMany();

        await Skill.insertMany(skills);

        console.log("Skill data inserted successfully");

        await mongoose.connection.close();

    } catch (error) {
        console.error("Error:", error.message);
    }
};

seedDatabase();