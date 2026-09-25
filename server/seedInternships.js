const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Internship = require("./models/Internship");

dotenv.config();

const internships = [
  {
    title: "Full Stack Web Development Intern",
    company: "TechNova Solutions",
    description:
      "Work on frontend and backend web applications using modern JavaScript technologies.",
    location: "Remote",
    mode: "Remote",
    career: "Full Stack Developer",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
    ],
    duration: "3 Months",
    stipend: "₹10,000/month",
    applyUrl: "https://example.com/apply/fullstack",
    source: "Development Dataset",
    isActive: true,
    deadline: new Date("2026-12-31"),
  },

  {
    title: "Frontend Developer Intern",
    company: "WebCraft Labs",
    description:
      "Build responsive user interfaces and reusable React components for web applications.",
    location: "Noida",
    mode: "Hybrid",
    career: "Full Stack Developer",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
    ],
    duration: "3 Months",
    stipend: "₹8,000/month",
    applyUrl: "https://example.com/apply/frontend",
    source: "Development Dataset",
    isActive: true,
    deadline: new Date("2026-11-30"),
  },

  {
    title: "Java Software Developer Intern",
    company: "CodeSphere Technologies",
    description:
      "Develop backend applications and APIs using Java and object-oriented programming.",
    location: "Bengaluru",
    mode: "On-site",
    career: "Software Developer",
    skills: [
      "Java",
      "DSA",
      "Problem Solving",
    ],
    duration: "6 Months",
    stipend: "₹15,000/month",
    applyUrl: "https://example.com/apply/java",
    source: "Development Dataset",
    isActive: true,
    deadline: new Date("2026-12-15"),
  },

  {
    title: "Data Science Intern",
    company: "DataMind Analytics",
    description:
      "Work with datasets, data analysis and machine learning models to solve real-world problems.",
    location: "Remote",
    mode: "Remote",
    career: "Data Scientist",
    skills: [
      "Python",
      "SQL",
      "Machine Learning",
    ],
    duration: "4 Months",
    stipend: "₹12,000/month",
    applyUrl: "https://example.com/apply/data-science",
    source: "Development Dataset",
    isActive: true,
    deadline: new Date("2026-11-15"),
  },

  {
    title: "AI/ML Engineer Intern",
    company: "IntelliTech Labs",
    description:
      "Assist in developing machine learning models and AI-powered applications.",
    location: "Hyderabad",
    mode: "Hybrid",
    career: "AI/ML Engineer",
    skills: [
      "Python",
      "Machine Learning",
      "AI",
    ],
    duration: "6 Months",
    stipend: "₹18,000/month",
    applyUrl: "https://example.com/apply/aiml",
    source: "Development Dataset",
    isActive: true,
    deadline: new Date("2026-12-20"),
  },

  {
    title: "DevOps Intern",
    company: "CloudBridge Technologies",
    description:
      "Learn CI/CD, cloud infrastructure, containers and deployment automation.",
    location: "Pune",
    mode: "Hybrid",
    career: "DevOps Engineer",
    skills: [
      "Linux",
      "Git/GitHub",
      "Docker",
      "Cloud",
    ],
    duration: "4 Months",
    stipend: "₹12,000/month",
    applyUrl: "https://example.com/apply/devops",
    source: "Development Dataset",
    isActive: true,
    deadline: new Date("2026-11-25"),
  },

  {
    title: "Cybersecurity Analyst Intern",
    company: "SecureNet Systems",
    description:
      "Assist with security monitoring, networking fundamentals and web security testing.",
    location: "Gurugram",
    mode: "On-site",
    career: "Cybersecurity Analyst",
    skills: [
      "Networking Fundamentals",
      "Linux Security",
      "Web Security",
    ],
    duration: "3 Months",
    stipend: "₹10,000/month",
    applyUrl: "https://example.com/apply/security",
    source: "Development Dataset",
    isActive: true,
    deadline: new Date("2026-12-10"),
  },
];

const seedInternships = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Internship.deleteMany({});

    await Internship.insertMany(internships);

    console.log(
      `${internships.length} internships seeded successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to seed internships:",
      error.message
    );

    process.exit(1);
  }
};

seedInternships();