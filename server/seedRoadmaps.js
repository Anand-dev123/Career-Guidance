const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Roadmap = require("./models/Roadmap");

dotenv.config();

const roadmaps = [
    // =========================
    // FULL STACK DEVELOPER
    // =========================
    {
        career: "Full Stack Developer",
        title: "HTML & CSS Fundamentals",
        description: "Learn webpage structure, semantic HTML, CSS layouts and responsive design.",
        skills: ["HTML", "CSS"],
        prerequisites: [],
        difficulty: "Beginner",
        estimatedWeeks: 2,
        resources: ["HTML Documentation", "CSS Documentation"],
        order: 1
    },
    {
        career: "Full Stack Developer",
        title: "JavaScript Fundamentals",
        description: "Learn variables, functions, arrays, objects, DOM and modern JavaScript.",
        skills: ["JavaScript"],
        prerequisites: ["HTML", "CSS"],
        difficulty: "Beginner",
        estimatedWeeks: 3,
        resources: ["JavaScript Documentation"],
        order: 2
    },
    {
        career: "Full Stack Developer",
        title: "React Development",
        description: "Build modern frontend applications using React components, hooks and routing.",
        skills: ["React"],
        prerequisites: ["JavaScript"],
        difficulty: "Intermediate",
        estimatedWeeks: 3,
        resources: ["React Documentation"],
        order: 3
    },
    {
        career: "Full Stack Developer",
        title: "Node.js & Express",
        description: "Learn backend development, REST APIs, middleware and server-side JavaScript.",
        skills: ["Node.js", "Express.js", "REST API"],
        prerequisites: ["JavaScript"],
        difficulty: "Intermediate",
        estimatedWeeks: 3,
        resources: ["Node.js Documentation", "Express Documentation"],
        order: 4
    },
    {
        career: "Full Stack Developer",
        title: "MongoDB & Database",
        description: "Learn database design, CRUD operations and MongoDB integration.",
        skills: ["MongoDB"],
        prerequisites: ["Node.js", "Express.js"],
        difficulty: "Intermediate",
        estimatedWeeks: 2,
        resources: ["MongoDB Documentation"],
        order: 5
    },
    {
        career: "Full Stack Developer",
        title: "Authentication & Deployment",
        description: "Learn JWT authentication, Git and deployment of full-stack applications.",
        skills: ["JWT", "Git", "GitHub"],
        prerequisites: ["React", "Node.js", "MongoDB"],
        difficulty: "Advanced",
        estimatedWeeks: 3,
        resources: ["JWT Documentation", "Git Documentation"],
        order: 6
    },

    // =========================
    // SOFTWARE DEVELOPER
    // =========================
    {
        career: "Software Developer",
        title: "Programming Fundamentals",
        description: "Build strong programming fundamentals and problem-solving skills.",
        skills: ["Java", "OOP"],
        prerequisites: [],
        difficulty: "Beginner",
        estimatedWeeks: 3,
        resources: ["Java Documentation"],
        order: 1
    },
    {
        career: "Software Developer",
        title: "Data Structures & Algorithms",
        description: "Learn arrays, linked lists, stacks, queues, trees, graphs and algorithms.",
        skills: ["DSA"],
        prerequisites: ["Java", "OOP"],
        difficulty: "Intermediate",
        estimatedWeeks: 6,
        resources: ["DSA Practice"],
        order: 2
    },
    {
        career: "Software Developer",
        title: "Problem Solving",
        description: "Practice searching, sorting, recursion, greedy and dynamic programming.",
        skills: ["DSA"],
        prerequisites: ["DSA"],
        difficulty: "Advanced",
        estimatedWeeks: 4,
        resources: ["Coding Practice"],
        order: 3
    },

    // =========================
    // DATA SCIENTIST
    // =========================
    {
        career: "Data Scientist",
        title: "Python Fundamentals",
        description: "Learn Python programming and data manipulation fundamentals.",
        skills: ["Python"],
        prerequisites: [],
        difficulty: "Beginner",
        estimatedWeeks: 3,
        resources: ["Python Documentation"],
        order: 1
    },
    {
        career: "Data Scientist",
        title: "SQL & Databases",
        description: "Learn SQL queries, joins, aggregation and database concepts.",
        skills: ["SQL", "MySQL"],
        prerequisites: ["Python"],
        difficulty: "Intermediate",
        estimatedWeeks: 2,
        resources: ["SQL Documentation"],
        order: 2
    },
    {
        career: "Data Scientist",
        title: "Machine Learning",
        description: "Learn supervised and unsupervised machine learning concepts.",
        skills: ["Machine Learning"],
        prerequisites: ["Python", "SQL"],
        difficulty: "Advanced",
        estimatedWeeks: 5,
        resources: ["ML Documentation"],
        order: 3
    },

    // =========================
    // AI/ML ENGINEER
    // =========================
    {
        career: "AI/ML Engineer",
        title: "Python & Programming",
        description: "Build Python programming and computational problem-solving skills.",
        skills: ["Python"],
        prerequisites: [],
        difficulty: "Beginner",
        estimatedWeeks: 3,
        resources: ["Python Documentation"],
        order: 1
    },
    {
        career: "AI/ML Engineer",
        title: "Machine Learning Fundamentals",
        description: "Learn machine learning algorithms and model evaluation.",
        skills: ["Machine Learning"],
        prerequisites: ["Python"],
        difficulty: "Intermediate",
        estimatedWeeks: 5,
        resources: ["ML Documentation"],
        order: 2
    },
    {
        career: "AI/ML Engineer",
        title: "Artificial Intelligence",
        description: "Learn AI concepts, neural networks and intelligent systems.",
        skills: ["Artificial Intelligence"],
        prerequisites: ["Machine Learning"],
        difficulty: "Advanced",
        estimatedWeeks: 5,
        resources: ["AI Documentation"],
        order: 3
    },

    // =========================
    // DEVOPS ENGINEER
    // =========================
    {
        career: "DevOps Engineer",
        title: "Linux Fundamentals",
        description: "Learn Linux commands, file systems, processes and permissions.",
        skills: ["Linux"],
        prerequisites: [],
        difficulty: "Beginner",
        estimatedWeeks: 2,
        resources: ["Linux Documentation"],
        order: 1
    },
    {
        career: "DevOps Engineer",
        title: "Git & GitHub",
        description: "Learn version control, branching, merging and collaboration.",
        skills: ["Git", "GitHub"],
        prerequisites: ["Linux"],
        difficulty: "Beginner",
        estimatedWeeks: 2,
        resources: ["Git Documentation"],
        order: 2
    },
    {
        career: "DevOps Engineer",
        title: "Docker & Cloud",
        description: "Learn containerization and cloud deployment fundamentals.",
        skills: ["Docker", "AWS"],
        prerequisites: ["Linux", "Git"],
        difficulty: "Advanced",
        estimatedWeeks: 5,
        resources: ["Docker Documentation", "AWS Documentation"],
        order: 3
    },

    // =========================
    // CYBERSECURITY ANALYST
    // =========================
    {
        career: "Cybersecurity Analyst",
        title: "Networking Fundamentals",
        description: "Learn networking, protocols, IP addressing and security basics.",
        skills: ["Linux"],
        prerequisites: [],
        difficulty: "Beginner",
        estimatedWeeks: 3,
        resources: ["Networking Documentation"],
        order: 1
    },
    {
        career: "Cybersecurity Analyst",
        title: "Linux Security",
        description: "Learn Linux security, permissions and system administration.",
        skills: ["Linux"],
        prerequisites: ["Linux"],
        difficulty: "Intermediate",
        estimatedWeeks: 3,
        resources: ["Linux Documentation"],
        order: 2
    },
    {
        career: "Cybersecurity Analyst",
        title: "Web Security",
        description: "Learn authentication, APIs and common web security concepts.",
        skills: ["REST API", "JWT"],
        prerequisites: ["Linux"],
        difficulty: "Advanced",
        estimatedWeeks: 4,
        resources: ["Web Security Documentation"],
        order: 3
    }
];

const seedRoadmaps = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Roadmap.deleteMany({});

        await Roadmap.insertMany(roadmaps);

        console.log(`✅ ${roadmaps.length} roadmap steps inserted successfully`);

        await mongoose.connection.close();
    } catch (error) {
        console.error("❌ Roadmap seeding failed:", error);
        process.exit(1);
    }
};

seedRoadmaps();