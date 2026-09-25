require("dotenv").config();

const mongoose = require("mongoose");
const Question = require("./models/Question");

const questions = [

    // =====================================================
    // SOFTWARE DEVELOPER - 10 QUESTIONS
    // =====================================================

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
        question: "Which sorting algorithm has average time complexity O(n log n)?",
        options: [
            "Bubble Sort",
            "Selection Sort",
            "Merge Sort",
            "Linear Search"
        ],
        correctAnswer: "Merge Sort",
        skill: "DSA",
        career: "Software Developer",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "Which keyword is used for inheritance in Java?",
        options: ["this", "extends", "static", "super"],
        correctAnswer: "extends",
        skill: "Java",
        career: "Software Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which data structure is commonly used in BFS?",
        options: ["Stack", "Queue", "Heap", "Tree"],
        correctAnswer: "Queue",
        skill: "DSA",
        career: "Software Developer",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "What does OOP stand for?",
        options: [
            "Object Oriented Programming",
            "Online Object Processing",
            "Object Operation Program",
            "Open Oriented Programming"
        ],
        correctAnswer: "Object Oriented Programming",
        skill: "Programming",
        career: "Software Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which symbol is used for a single-line comment in Java?",
        options: ["#", "//", "/*", "<!--"],
        correctAnswer: "//",
        skill: "Java",
        career: "Software Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which Git command is used to upload local commits to a remote repository?",
        options: ["git pull", "git clone", "git push", "git fetch"],
        correctAnswer: "git push",
        skill: "Git",
        career: "Software Developer",
        difficulty: "Easy",
        marks: 1
    },


    // =====================================================
    // FULL STACK DEVELOPER - 10 QUESTIONS
    // =====================================================

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
        question: "Which technology is commonly used to build React applications?",
        options: ["JavaScript", "Java", "C", "PHP"],
        correctAnswer: "JavaScript",
        skill: "JavaScript",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which framework is commonly used with Node.js to create APIs?",
        options: ["Express.js", "Django", "Spring", "Laravel"],
        correctAnswer: "Express.js",
        skill: "Node.js",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which HTTP method is commonly used to create a new resource?",
        options: ["GET", "POST", "DELETE", "HEAD"],
        correctAnswer: "POST",
        skill: "Web Development",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which HTTP status code means 'Not Found'?",
        options: ["200", "201", "404", "500"],
        correctAnswer: "404",
        skill: "Web Development",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which package manager is commonly used with Node.js?",
        options: ["npm", "pip", "composer", "gradle"],
        correctAnswer: "npm",
        skill: "Node.js",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which technology is used to create reusable UI components?",
        options: ["React", "MongoDB", "Express", "Git"],
        correctAnswer: "React",
        skill: "React",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which file commonly stores environment variables in a Node.js project?",
        options: [".env", ".config", ".server", ".node"],
        correctAnswer: ".env",
        skill: "Node.js",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which HTTP method is commonly used to retrieve data?",
        options: ["POST", "GET", "PATCH", "DELETE"],
        correctAnswer: "GET",
        skill: "Web Development",
        career: "Full Stack Developer",
        difficulty: "Easy",
        marks: 1
    },


    // =====================================================
    // DATA SCIENTIST - 10 QUESTIONS
    // =====================================================

    {
        question: "Which programming language is widely used in Data Science?",
        options: ["Python", "HTML", "CSS", "JavaScript"],
        correctAnswer: "Python",
        skill: "Python",
        career: "Data Scientist",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which library is commonly used for numerical computing in Python?",
        options: ["NumPy", "React", "Express", "Bootstrap"],
        correctAnswer: "NumPy",
        skill: "Python",
        career: "Data Scientist",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which library is mainly used for data manipulation in Python?",
        options: ["Pandas", "TensorFlow", "React", "Node.js"],
        correctAnswer: "Pandas",
        skill: "Data Analysis",
        career: "Data Scientist",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "What does CSV stand for?",
        options: [
            "Comma Separated Values",
            "Computer System Values",
            "Common Separated Variables",
            "Column System Version"
        ],
        correctAnswer: "Comma Separated Values",
        skill: "Data Handling",
        career: "Data Scientist",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which graph is commonly used to show the distribution of numerical data?",
        options: ["Histogram", "Pie Chart", "Flowchart", "Tree"],
        correctAnswer: "Histogram",
        skill: "Data Visualization",
        career: "Data Scientist",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "What is the mean of 2, 4 and 6?",
        options: ["2", "4", "6", "12"],
        correctAnswer: "4",
        skill: "Statistics",
        career: "Data Scientist",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which technique is used to handle missing data?",
        options: [
            "Imputation",
            "Compilation",
            "Rendering",
            "Routing"
        ],
        correctAnswer: "Imputation",
        skill: "Data Preprocessing",
        career: "Data Scientist",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "Which type of learning uses labeled data?",
        options: [
            "Supervised Learning",
            "Unsupervised Learning",
            "Reinforcement Learning",
            "Random Learning"
        ],
        correctAnswer: "Supervised Learning",
        skill: "Machine Learning",
        career: "Data Scientist",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which measure represents the middle value of sorted data?",
        options: ["Mean", "Median", "Mode", "Range"],
        correctAnswer: "Median",
        skill: "Statistics",
        career: "Data Scientist",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which library can be used for data visualization in Python?",
        options: [
            "Matplotlib",
            "Express",
            "Mongoose",
            "Jest"
        ],
        correctAnswer: "Matplotlib",
        skill: "Data Visualization",
        career: "Data Scientist",
        difficulty: "Easy",
        marks: 1
    },


    // =====================================================
    // AI/ML ENGINEER - 10 QUESTIONS
    // =====================================================

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
        question: "Which type of learning uses labeled training data?",
        options: [
            "Supervised Learning",
            "Unsupervised Learning",
            "Reinforcement Learning",
            "Random Learning"
        ],
        correctAnswer: "Supervised Learning",
        skill: "Machine Learning",
        career: "AI/ML Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which algorithm is commonly used for classification?",
        options: [
            "Logistic Regression",
            "Linear Search",
            "Merge Sort",
            "DFS"
        ],
        correctAnswer: "Logistic Regression",
        skill: "Machine Learning",
        career: "AI/ML Engineer",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "What does AI stand for?",
        options: [
            "Artificial Intelligence",
            "Automated Internet",
            "Advanced Information",
            "Artificial Integration"
        ],
        correctAnswer: "Artificial Intelligence",
        skill: "Artificial Intelligence",
        career: "AI/ML Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which algorithm is used for finding clusters?",
        options: [
            "K-Means",
            "Binary Search",
            "Bubble Sort",
            "BFS"
        ],
        correctAnswer: "K-Means",
        skill: "Machine Learning",
        career: "AI/ML Engineer",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "What does ML stand for?",
        options: [
            "Machine Learning",
            "Manual Logic",
            "Model Language",
            "Machine Logic"
        ],
        correctAnswer: "Machine Learning",
        skill: "Machine Learning",
        career: "AI/ML Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which technology is commonly used to build neural networks?",
        options: [
            "TensorFlow",
            "MongoDB",
            "Express",
            "Bootstrap"
        ],
        correctAnswer: "TensorFlow",
        skill: "Deep Learning",
        career: "AI/ML Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "What is overfitting in Machine Learning?",
        options: [
            "Model performs well on training data but poorly on unseen data",
            "Model has no training data",
            "Model always gives random output",
            "Model has too few features"
        ],
        correctAnswer:
            "Model performs well on training data but poorly on unseen data",
        skill: "Machine Learning",
        career: "AI/ML Engineer",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "Which metric is commonly used for classification accuracy?",
        options: [
            "Accuracy",
            "Memory",
            "Latency",
            "Bandwidth"
        ],
        correctAnswer: "Accuracy",
        skill: "Machine Learning",
        career: "AI/ML Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which neural network architecture is commonly used for image processing?",
        options: [
            "CNN",
            "HTTP",
            "SQL",
            "BFS"
        ],
        correctAnswer: "CNN",
        skill: "Deep Learning",
        career: "AI/ML Engineer",
        difficulty: "Medium",
        marks: 1
    },


    // =====================================================
    // DEVOPS ENGINEER - 10 QUESTIONS
    // =====================================================

    {
        question: "Which tool is commonly used for version control?",
        options: ["Git", "MongoDB", "React", "Figma"],
        correctAnswer: "Git",
        skill: "Git",
        career: "DevOps Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which command creates a new Git repository?",
        options: [
            "git start",
            "git init",
            "git create",
            "git new"
        ],
        correctAnswer: "git init",
        skill: "Git",
        career: "DevOps Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "What does CI/CD stand for?",
        options: [
            "Continuous Integration / Continuous Delivery",
            "Code Integration / Code Design",
            "Computer Interface / Computer Deployment",
            "Continuous Internet / Continuous Data"
        ],
        correctAnswer:
            "Continuous Integration / Continuous Delivery",
        skill: "CI/CD",
        career: "DevOps Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which platform is commonly used for containerization?",
        options: ["Docker", "React", "MongoDB", "GitHub"],
        correctAnswer: "Docker",
        skill: "Docker",
        career: "DevOps Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which command lists running Docker containers?",
        options: [
            "docker ps",
            "docker list",
            "docker run",
            "docker show"
        ],
        correctAnswer: "docker ps",
        skill: "Docker",
        career: "DevOps Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which cloud platform is provided by Amazon?",
        options: ["AWS", "Azure", "GCP", "Heroku"],
        correctAnswer: "AWS",
        skill: "Cloud Computing",
        career: "DevOps Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which operating system is widely used on servers?",
        options: ["Linux", "Android", "iOS", "Windows Phone"],
        correctAnswer: "Linux",
        skill: "Linux",
        career: "DevOps Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which tool is commonly used for container orchestration?",
        options: [
            "Kubernetes",
            "MongoDB",
            "React",
            "Node.js"
        ],
        correctAnswer: "Kubernetes",
        skill: "Kubernetes",
        career: "DevOps Engineer",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "Which command is used to display the current directory in Linux?",
        options: ["pwd", "cd", "ls", "dir"],
        correctAnswer: "pwd",
        skill: "Linux",
        career: "DevOps Engineer",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which file is commonly used to define Docker container configuration?",
        options: [
            "Dockerfile",
            "docker.txt",
            "container.js",
            "docker.config"
        ],
        correctAnswer: "Dockerfile",
        skill: "Docker",
        career: "DevOps Engineer",
        difficulty: "Easy",
        marks: 1
    },


    // =====================================================
    // CYBERSECURITY ANALYST - 10 QUESTIONS
    // =====================================================

    {
        question: "Which protocol is mainly used for secure web communication?",
        options: ["HTTP", "FTP", "HTTPS", "SMTP"],
        correctAnswer: "HTTPS",
        skill: "Networking",
        career: "Cybersecurity Analyst",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "What does VPN stand for?",
        options: [
            "Virtual Private Network",
            "Virtual Public Network",
            "Verified Private Node",
            "Virtual Protected Node"
        ],
        correctAnswer: "Virtual Private Network",
        skill: "Networking",
        career: "Cybersecurity Analyst",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which attack attempts to make a service unavailable?",
        options: [
            "DDoS",
            "Phishing",
            "SQL Query",
            "Brute Force"
        ],
        correctAnswer: "DDoS",
        skill: "Cybersecurity",
        career: "Cybersecurity Analyst",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "What is phishing?",
        options: [
            "A social engineering attack",
            "A sorting algorithm",
            "A database technique",
            "A network protocol"
        ],
        correctAnswer: "A social engineering attack",
        skill: "Cybersecurity",
        career: "Cybersecurity Analyst",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which tool is used to filter network traffic?",
        options: [
            "Firewall",
            "Compiler",
            "Database",
            "Debugger"
        ],
        correctAnswer: "Firewall",
        skill: "Network Security",
        career: "Cybersecurity Analyst",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which principle ensures that only authorized users can access information?",
        options: [
            "Confidentiality",
            "Availability",
            "Redundancy",
            "Compression"
        ],
        correctAnswer: "Confidentiality",
        skill: "Cybersecurity",
        career: "Cybersecurity Analyst",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "Which attack tries many passwords until one works?",
        options: [
            "Brute Force",
            "DDoS",
            "Phishing",
            "Spoofing"
        ],
        correctAnswer: "Brute Force",
        skill: "Cybersecurity",
        career: "Cybersecurity Analyst",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which technology is used to encrypt web traffic?",
        options: [
            "TLS",
            "HTML",
            "CSS",
            "DNS"
        ],
        correctAnswer: "TLS",
        skill: "Network Security",
        career: "Cybersecurity Analyst",
        difficulty: "Medium",
        marks: 1
    },
    {
        question: "What does MFA stand for?",
        options: [
            "Multi-Factor Authentication",
            "Multiple File Access",
            "Managed Firewall Application",
            "Main Function Authentication"
        ],
        correctAnswer: "Multi-Factor Authentication",
        skill: "Authentication",
        career: "Cybersecurity Analyst",
        difficulty: "Easy",
        marks: 1
    },
    {
        question: "Which practice helps protect accounts from unauthorized access?",
        options: [
            "Using strong passwords",
            "Sharing passwords",
            "Disabling updates",
            "Using the same password everywhere"
        ],
        correctAnswer: "Using strong passwords",
        skill: "Cybersecurity",
        career: "Cybersecurity Analyst",
        difficulty: "Easy",
        marks: 1
    }

];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Question.deleteMany();

        await Question.insertMany(questions);

        console.log(
            `${questions.length} questions inserted successfully`
        );

        await mongoose.connection.close();

    } catch (error) {
        console.error("Error:", error.message);
    }
};

seedDatabase();