const mongoose = require("mongoose");
const dotenv = require("dotenv");

const LearningResource = require("./models/LearningResource");

dotenv.config();

const learningResources = [
  // ==========================================
  // FULL STACK DEVELOPER
  // ==========================================

  {
    title: "HTML Basics",
    description:
      "Learn the fundamentals of HTML and how web pages are structured.",
    skill: "HTML",
    career: "Full Stack Developer",
    type: "Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
    difficulty: "Beginner",
    estimatedMinutes: 60,
    order: 1,
  },

  {
    title: "CSS Basics",
    description:
      "Learn CSS fundamentals, selectors, layouts and responsive design.",
    skill: "CSS",
    career: "Full Stack Developer",
    type: "Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Learn/CSS",
    difficulty: "Beginner",
    estimatedMinutes: 90,
    order: 2,
  },

  {
    title: "JavaScript Guide",
    description:
      "Learn JavaScript fundamentals, functions, objects, arrays and modern JavaScript.",
    skill: "JavaScript",
    career: "Full Stack Developer",
    type: "Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    difficulty: "Beginner",
    estimatedMinutes: 120,
    order: 3,
  },

  {
    title: "React Learn",
    description:
      "Learn React components, state, events and modern React development.",
    skill: "React",
    career: "Full Stack Developer",
    type: "Course",
    url: "https://react.dev/learn",
    difficulty: "Intermediate",
    estimatedMinutes: 120,
    order: 4,
  },

  {
    title: "Node.js Learn",
    description:
      "Learn Node.js and understand server-side JavaScript development.",
    skill: "Node.js",
    career: "Full Stack Developer",
    type: "Documentation",
    url: "https://nodejs.org/en/learn",
    difficulty: "Intermediate",
    estimatedMinutes: 90,
    order: 5,
  },

  {
    title: "Express.js Guide",
    description:
      "Learn how to build backend APIs using Express.js.",
    skill: "Express.js",
    career: "Full Stack Developer",
    type: "Documentation",
    url: "https://expressjs.com/en/starter/installing.html",
    difficulty: "Intermediate",
    estimatedMinutes: 90,
    order: 6,
  },

  {
    title: "MongoDB Fundamentals",
    description:
      "Learn MongoDB databases, collections, documents and CRUD operations.",
    skill: "MongoDB",
    career: "Full Stack Developer",
    type: "Course",
    url: "https://www.mongodb.com/docs/manual/introduction/",
    difficulty: "Intermediate",
    estimatedMinutes: 120,
    order: 7,
  },

  {
    title: "Git and GitHub Basics",
    description:
      "Learn version control and how to manage projects using Git and GitHub.",
    skill: "Git",
    career: "Full Stack Developer",
    type: "Article",
    url: "https://docs.github.com/en/get-started/start-your-journey",
    difficulty: "Beginner",
    estimatedMinutes: 60,
    order: 8,
  },


  // ==========================================
  // SOFTWARE DEVELOPER
  // ==========================================

  {
    title: "Java Programming",
    description:
      "Learn Java programming fundamentals including variables, loops, methods and OOP.",
    skill: "Java",
    career: "Software Developer",
    type: "Course",
    url: "https://dev.java/learn/",
    difficulty: "Beginner",
    estimatedMinutes: 120,
    order: 1,
  },

  {
    title: "Data Structures and Algorithms",
    description:
      "Learn important data structures and algorithms used in software development.",
    skill: "DSA",
    career: "Software Developer",
    type: "Course",
    url: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/",
    difficulty: "Intermediate",
    estimatedMinutes: 180,
    order: 2,
  },

  {
    title: "Object Oriented Programming",
    description:
      "Understand classes, objects, inheritance, polymorphism and abstraction.",
    skill: "OOP",
    career: "Software Developer",
    type: "Article",
    url: "https://docs.oracle.com/javase/tutorial/java/concepts/",
    difficulty: "Intermediate",
    estimatedMinutes: 90,
    order: 3,
  },


  // ==========================================
  // DATA SCIENTIST
  // ==========================================

  {
    title: "Python for Beginners",
    description:
      "Learn Python programming fundamentals for data science and automation.",
    skill: "Python",
    career: "Data Scientist",
    type: "Course",
    url: "https://docs.python.org/3/tutorial/",
    difficulty: "Beginner",
    estimatedMinutes: 120,
    order: 1,
  },

  {
    title: "SQL Tutorial",
    description:
      "Learn SQL queries, filtering, joins, grouping and database operations.",
    skill: "SQL",
    career: "Data Scientist",
    type: "Documentation",
    url: "https://www.w3schools.com/sql/",
    difficulty: "Beginner",
    estimatedMinutes: 120,
    order: 2,
  },

  {
    title: "Machine Learning",
    description:
      "Learn the fundamentals of machine learning and common ML algorithms.",
    skill: "Machine Learning",
    career: "Data Scientist",
    type: "Course",
    url: "https://developers.google.com/machine-learning",
    difficulty: "Intermediate",
    estimatedMinutes: 180,
    order: 3,
  },


  // ==========================================
  // AI / ML ENGINEER
  // ==========================================

  {
    title: "Artificial Intelligence",
    description:
      "Learn fundamental concepts of artificial intelligence.",
    skill: "Artificial Intelligence",
    career: "AI/ML Engineer",
    type: "Course",
    url: "https://www.ibm.com/think/topics/artificial-intelligence",
    difficulty: "Beginner",
    estimatedMinutes: 90,
    order: 1,
  },

  {
    title: "Machine Learning Fundamentals",
    description:
      "Understand supervised, unsupervised and reinforcement learning concepts.",
    skill: "Machine Learning",
    career: "AI/ML Engineer",
    type: "Course",
    url: "https://developers.google.com/machine-learning/crash-course",
    difficulty: "Intermediate",
    estimatedMinutes: 180,
    order: 2,
  },

  {
    title: "Generative AI Fundamentals",
    description:
      "Understand the fundamentals of generative AI and large language models.",
    skill: "Generative AI",
    career: "AI/ML Engineer",
    type: "Course",
    url: "https://www.cloudskillsboost.google/paths/118",
    difficulty: "Intermediate",
    estimatedMinutes: 120,
    order: 3,
  },


  // ==========================================
  // DEVOPS ENGINEER
  // ==========================================

  {
    title: "Linux Fundamentals",
    description:
      "Learn Linux commands, file systems, permissions and basic administration.",
    skill: "Linux",
    career: "DevOps Engineer",
    type: "Course",
    url: "https://ubuntu.com/tutorials/command-line-for-beginners",
    difficulty: "Beginner",
    estimatedMinutes: 90,
    order: 1,
  },

  {
    title: "Docker Get Started",
    description:
      "Learn Docker containers, images and basic container workflows.",
    skill: "Docker",
    career: "DevOps Engineer",
    type: "Documentation",
    url: "https://docs.docker.com/get-started/",
    difficulty: "Intermediate",
    estimatedMinutes: 120,
    order: 2,
  },

  {
    title: "AWS Cloud Fundamentals",
    description:
      "Learn fundamental cloud concepts and AWS services.",
    skill: "AWS",
    career: "DevOps Engineer",
    type: "Course",
    url: "https://aws.amazon.com/training/",
    difficulty: "Intermediate",
    estimatedMinutes: 120,
    order: 3,
  },


  // ==========================================
  // CYBERSECURITY ANALYST
  // ==========================================

  {
    title: "Networking Fundamentals",
    description:
      "Learn networking basics, protocols, IP addresses and network communication.",
    skill: "Networking Fundamentals",
    career: "Cybersecurity Analyst",
    type: "Course",
    url: "https://www.cisco.com/c/en/us/training-events/training-certifications/training.html",
    difficulty: "Beginner",
    estimatedMinutes: 120,
    order: 1,
  },

  {
    title: "Linux Security",
    description:
      "Learn Linux security fundamentals, permissions and system security.",
    skill: "Linux Security",
    career: "Cybersecurity Analyst",
    type: "Documentation",
    url: "https://ubuntu.com/security",
    difficulty: "Intermediate",
    estimatedMinutes: 90,
    order: 2,
  },

  {
    title: "Web Security",
    description:
      "Learn common web security concepts and application security practices.",
    skill: "Web Security",
    career: "Cybersecurity Analyst",
    type: "Course",
    url: "https://owasp.org/www-project-web-security-testing-guide/",
    difficulty: "Intermediate",
    estimatedMinutes: 120,
    order: 3,
  },
];


// ==========================================
// SEED FUNCTION
// ==========================================

const seedLearningResources = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await LearningResource.deleteMany();

    await LearningResource.insertMany(
      learningResources
    );

    console.log(
      `${learningResources.length} learning resources inserted successfully`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed");
  } catch (error) {
    console.error(
      "Error seeding learning resources:",
      error.message
    );

    process.exit(1);
  }
};

seedLearningResources();