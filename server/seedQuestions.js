require("dotenv").config();

const mongoose = require("mongoose");
const Question = require("./models/Question");

const questions = [
    {
        question: "What is the time complexity of Binary Search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correctAnswer: "O(log n)",
        skill: "DSA",
        career: "Software Developer",
        difficulty: "Easy",
        marks: 1
    },

    {
        question: "Which data structure follows LIFO?",
        options: ["Queue", "Stack", "Tree", "Graph"],
        correctAnswer: "Stack",
        skill: "DSA",
        career: "Software Developer",
        difficulty: "Easy",
        marks: 1
    },

    {
        question: "Which keyword is used to create a class in Java?",
        options: ["function", "define", "class", "struct"],
        correctAnswer: "class",
        skill: "Java",
        career: "Software Developer",
        difficulty: "Easy",
        marks: 1
    },

    {
        question: "Which method is used to print output in JavaScript?",
        options: [
            "print()",
            "console.log()",
            "display()",
            "write.log()"
        ],
        correctAnswer: "console.log()",
        skill: "JavaScript",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },

    {
        question: "Which technology is used to create the structure of a web page?",
        options: ["CSS", "HTML", "Node.js", "MongoDB"],
        correctAnswer: "HTML",
        skill: "HTML",
        career: "Frontend Developer",
        difficulty: "Easy",
        marks: 1
    },

    {
        question: "Which technology is mainly used for styling web pages?",
        options: ["HTML", "CSS", "Java", "SQL"],
        correctAnswer: "CSS",
        skill: "CSS",
        career: "Frontend Developer",
        difficulty: "Easy",
        marks: 1
    },

    {
        question: "Which database type is MongoDB?",
        options: [
            "Relational Database",
            "Document Database",
            "Graph Database",
            "Key-Value Database"
        ],
        correctAnswer: "Document Database",
        skill: "MongoDB",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },

    {
        question: "Which language is commonly used for Machine Learning?",
        options: ["HTML", "Python", "CSS", "SQL"],
        correctAnswer: "Python",
        skill: "Python",
        career: "AI/ML Engineer",
        difficulty: "Easy",
        marks: 1
    },

    {
        question: "Which command is used to check the current Git status?",
        options: [
            "git check",
            "git status",
            "git current",
            "git info"
        ],
        correctAnswer: "git status",
        skill: "Git",
        career: "Software Developer",
        difficulty: "Easy",
        marks: 1
    },

    {
        question: "Which protocol is mainly used for secure web communication?",
        options: ["HTTP", "FTP", "HTTPS", "SMTP"],
        correctAnswer: "HTTPS",
        skill: "Networking",
        career: "Cybersecurity Analyst",
        difficulty: "Medium",
        marks: 1
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Question.deleteMany();

        await Question.insertMany(questions);

        console.log("Question data inserted successfully");

        await mongoose.connection.close();

    } catch (error) {
        console.error("Error:", error.message);
    }
};

seedDatabase();