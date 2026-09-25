const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Assignment = require("./models/Assignment");

dotenv.config();


// ==========================================
// Assignment Data
// ==========================================

const assignments = [

  // ==========================================
  // Full Stack Developer
  // ==========================================

  {
    title: "Build a Responsive Portfolio Page",
    description:
      "Create a responsive portfolio page using HTML and CSS with sections for profile, skills, projects and contact information.",
    career: "Full Stack Developer",
    skill: "HTML",
    difficulty: "Beginner",
    estimatedTime: 60,
    resources: [
      "MDN HTML",
      "MDN CSS"
    ],
    order: 1,
  },

  {
    title: "JavaScript Interactive Form",
    description:
      "Build a form using JavaScript that validates user input and displays appropriate messages.",
    career: "Full Stack Developer",
    skill: "JavaScript",
    difficulty: "Beginner",
    estimatedTime: 60,
    resources: [
      "MDN JavaScript"
    ],
    order: 2,
  },

  {
    title: "Build a React Task Manager",
    description:
      "Create a task manager in React using components, state management and event handling.",
    career: "Full Stack Developer",
    skill: "React",
    difficulty: "Intermediate",
    estimatedTime: 120,
    resources: [
      "React Documentation"
    ],
    order: 3,
  },

  {
    title: "Create a REST API",
    description:
      "Build a REST API using Node.js and Express with basic CRUD operations.",
    career: "Full Stack Developer",
    skill: "Node.js",
    difficulty: "Intermediate",
    estimatedTime: 120,
    resources: [
      "Node.js Documentation",
      "Express.js Documentation"
    ],
    order: 4,
  },

  {
    title: "Connect MongoDB with Backend",
    description:
      "Create a MongoDB database and connect it with your Node.js and Express backend.",
    career: "Full Stack Developer",
    skill: "MongoDB",
    difficulty: "Intermediate",
    estimatedTime: 90,
    resources: [
      "MongoDB Documentation"
    ],
    order: 5,
  },


  // ==========================================
  // Software Developer
  // ==========================================

  {
    title: "Solve Array Programming Problems",
    description:
      "Solve a collection of array problems covering traversal, searching and basic manipulation.",
    career: "Software Developer",
    skill: "Programming Fundamentals",
    difficulty: "Beginner",
    estimatedTime: 60,
    resources: [
      "Practice Array Problems"
    ],
    order: 1,
  },

  {
    title: "Implement Searching Algorithms",
    description:
      "Implement Linear Search and Binary Search and compare their time complexities.",
    career: "Software Developer",
    skill: "Problem Solving",
    difficulty: "Beginner",
    estimatedTime: 60,
    resources: [
      "Searching Algorithms"
    ],
    order: 2,
  },

  {
    title: "Implement Sorting Algorithms",
    description:
      "Implement Bubble Sort, Selection Sort and Insertion Sort and compare their performance.",
    career: "Software Developer",
    skill: "DSA",
    difficulty: "Intermediate",
    estimatedTime: 90,
    resources: [
      "Sorting Algorithms"
    ],
    order: 3,
  },

  {
    title: "Solve Intermediate DSA Problems",
    description:
      "Solve problems involving stacks, queues, linked lists and recursion.",
    career: "Software Developer",
    skill: "DSA",
    difficulty: "Intermediate",
    estimatedTime: 120,
    resources: [
      "DSA Practice"
    ],
    order: 4,
  },


  // ==========================================
  // Data Scientist
  // ==========================================

  {
    title: "Python Data Analysis Task",
    description:
      "Load a dataset in Python and perform basic cleaning, filtering and analysis.",
    career: "Data Scientist",
    skill: "Python",
    difficulty: "Beginner",
    estimatedTime: 90,
    resources: [
      "Python Documentation"
    ],
    order: 1,
  },

  {
    title: "SQL Data Query Challenge",
    description:
      "Write SQL queries using SELECT, WHERE, GROUP BY, ORDER BY and JOIN operations.",
    career: "Data Scientist",
    skill: "SQL",
    difficulty: "Intermediate",
    estimatedTime: 90,
    resources: [
      "SQL Documentation"
    ],
    order: 2,
  },

  {
    title: "Explore a Dataset",
    description:
      "Perform exploratory data analysis and identify patterns and relationships in a dataset.",
    career: "Data Scientist",
    skill: "Data Analysis",
    difficulty: "Intermediate",
    estimatedTime: 120,
    resources: [
      "Data Analysis Guide"
    ],
    order: 3,
  },

  {
    title: "Build a Simple ML Model",
    description:
      "Train a basic machine learning model on a small dataset and evaluate its performance.",
    career: "Data Scientist",
    skill: "Machine Learning",
    difficulty: "Advanced",
    estimatedTime: 150,
    resources: [
      "Scikit-learn Documentation"
    ],
    order: 4,
  },


  // ==========================================
  // AI/ML Engineer
  // ==========================================

  {
    title: "Python Programming Practice",
    description:
      "Build a small Python application using functions, collections and object-oriented concepts.",
    career: "AI/ML Engineer",
    skill: "Python",
    difficulty: "Beginner",
    estimatedTime: 90,
    resources: [
      "Python Documentation"
    ],
    order: 1,
  },

  {
    title: "Data Preprocessing Task",
    description:
      "Clean missing values, encode categorical data and prepare a dataset for machine learning.",
    career: "AI/ML Engineer",
    skill: "Machine Learning",
    difficulty: "Intermediate",
    estimatedTime: 120,
    resources: [
      "Scikit-learn Documentation"
    ],
    order: 2,
  },

  {
    title: "Build a Classification Model",
    description:
      "Train and evaluate a classification model using a suitable dataset.",
    career: "AI/ML Engineer",
    skill: "Artificial Intelligence",
    difficulty: "Advanced",
    estimatedTime: 150,
    resources: [
      "Machine Learning Guide"
    ],
    order: 3,
  },


  // ==========================================
  // DevOps Engineer
  // ==========================================

  {
    title: "Linux Command Practice",
    description:
      "Complete practical tasks using Linux file management, permissions and process commands.",
    career: "DevOps Engineer",
    skill: "Linux",
    difficulty: "Beginner",
    estimatedTime: 60,
    resources: [
      "Linux Documentation"
    ],
    order: 1,
  },

  {
    title: "Git and GitHub Workflow",
    description:
      "Create a Git repository, create branches, make commits and push changes to GitHub.",
    career: "DevOps Engineer",
    skill: "Git/GitHub",
    difficulty: "Beginner",
    estimatedTime: 60,
    resources: [
      "Git Documentation",
      "GitHub Documentation"
    ],
    order: 2,
  },

  {
    title: "Containerize a Web Application",
    description:
      "Create a Dockerfile and run your web application inside a Docker container.",
    career: "DevOps Engineer",
    skill: "Docker",
    difficulty: "Intermediate",
    estimatedTime: 120,
    resources: [
      "Docker Documentation"
    ],
    order: 3,
  },

  {
    title: "Deploy an Application",
    description:
      "Deploy a web application using a cloud hosting platform and configure environment variables.",
    career: "DevOps Engineer",
    skill: "Cloud Computing",
    difficulty: "Advanced",
    estimatedTime: 120,
    resources: [
      "Cloud Platform Documentation"
    ],
    order: 4,
  },


  // ==========================================
  // Cybersecurity Analyst
  // ==========================================

  {
    title: "Networking Fundamentals Practice",
    description:
      "Identify common networking concepts including IP addresses, ports, protocols and DNS.",
    career: "Cybersecurity Analyst",
    skill: "Networking",
    difficulty: "Beginner",
    estimatedTime: 60,
    resources: [
      "Networking Fundamentals"
    ],
    order: 1,
  },

  {
    title: "Linux Security Practice",
    description:
      "Practice Linux permissions, users, groups and basic security commands.",
    career: "Cybersecurity Analyst",
    skill: "Linux Security",
    difficulty: "Intermediate",
    estimatedTime: 90,
    resources: [
      "Linux Security Documentation"
    ],
    order: 2,
  },

  {
    title: "Web Security Analysis",
    description:
      "Study common web security vulnerabilities and identify basic security issues in a sample application.",
    career: "Cybersecurity Analyst",
    skill: "Web Security",
    difficulty: "Intermediate",
    estimatedTime: 120,
    resources: [
      "OWASP Web Security"
    ],
    order: 3,
  },

];


// ==========================================
// Seed Database
// ==========================================

const seedAssignments = async () => {
  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully"
    );


    // Remove old assignments
    await Assignment.deleteMany({});


    // Insert new assignments
    await Assignment.insertMany(
      assignments
    );


    console.log(
      `${assignments.length} assignments seeded successfully`
    );


    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed"
    );

    process.exit(0);

  } catch (error) {

    console.error(
      "Failed to seed assignments:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};


seedAssignments();