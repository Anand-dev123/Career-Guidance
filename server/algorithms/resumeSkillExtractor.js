// ==========================================
// Resume Skill Extractor
// Domain Independent + Evidence Based
// ==========================================


// ==========================================
// Skill Dictionary
// ==========================================

const skillDictionary = {

    // ==========================================
    // WEB / FULL STACK
    // ==========================================

    HTML: [
        "html",
        "html5"
    ],

    CSS: [
        "css",
        "css3"
    ],

    JavaScript: [
        "javascript",
        "js"
    ],

    React: [
        "react",
        "reactjs",
        "react.js"
    ],

    "Node.js": [
        "node.js",
        "nodejs",
        "node js"
    ],

    "Express.js": [
        "express",
        "express.js",
        "expressjs"
    ],

    MongoDB: [
        "mongodb",
        "mongo db"
    ],

    MySQL: [
        "mysql"
    ],

    PostgreSQL: [
        "postgresql",
        "postgres"
    ],

    Bootstrap: [
        "bootstrap"
    ],

    "Tailwind CSS": [
        "tailwind",
        "tailwind css"
    ],

    "Next.js": [
        "next.js",
        "nextjs",
        "next js"
    ],

    TypeScript: [
        "typescript",
        "ts"
    ],

    "REST API": [
        "rest api",
        "restful api",
        "rest apis"
    ],

    GraphQL: [
        "graphql"
    ],

    JWT: [
        "jwt",
        "json web token",
        "json web tokens"
    ],


    // ==========================================
    // PROGRAMMING / SOFTWARE DEVELOPMENT
    // ==========================================

    Programming: [
        "programming",
        "programming language",
        "programming languages",
        "coding",
        "software programming"
    ],

    Java: [
        "java"
    ],

    Python: [
        "python"
    ],

    "C++": [
        "c++",
        "cpp"
    ],

    C: [
        "c"
    ],

    "C#": [
        "c#",
        "c sharp"
    ],

    Go: [
        "golang",
        "go language",
        "go"
    ],

    PHP: [
        "php"
    ],

    Ruby: [
        "ruby"
    ],

    Kotlin: [
        "kotlin"
    ],

    Swift: [
        "swift"
    ],

    DSA: [
        "dsa",
        "data structures",
        "data structures and algorithms",
        "data structures & algorithms"
    ],

    OOP: [
        "oop",
        "object oriented programming",
        "object-oriented programming"
    ],

    Algorithms: [
        "algorithms",
        "algorithm design",
        "algorithm analysis"
    ],

    "System Design": [
        "system design",
        "software architecture",
        "system architecture"
    ],


    // ==========================================
    // VERSION CONTROL
    // ==========================================

    Git: [
        "git"
    ],

    GitHub: [
        "github",
        "git hub"
    ],

    GitLab: [
        "gitlab"
    ],


    // ==========================================
    // AI / MACHINE LEARNING
    // ==========================================

    "Artificial Intelligence": [
        "artificial intelligence",
        "ai"
    ],

    "Machine Learning": [
        "machine learning",
        "ml"
    ],

    "Deep Learning": [
        "deep learning"
    ],

    "Generative AI": [
        "generative ai",
        "gen ai",
        "genai"
    ],

    "Natural Language Processing": [
        "natural language processing",
        "nlp"
    ],

    "Computer Vision": [
        "computer vision"
    ],

    TensorFlow: [
        "tensorflow"
    ],

    PyTorch: [
        "pytorch"
    ],

    "Scikit-learn": [
        "scikit-learn",
        "scikit learn",
        "sklearn"
    ],

    Pandas: [
        "pandas"
    ],

    NumPy: [
        "numpy"
    ],

    "Hugging Face": [
        "hugging face",
        "huggingface"
    ],

    LLM: [
        "llm",
        "large language model",
        "large language models"
    ],

    RAG: [
        "rag",
        "retrieval augmented generation",
        "retrieval-augmented generation"
    ],

    "Prompt Engineering": [
        "prompt engineering"
    ],

    OpenAI: [
        "openai",
        "openai api"
    ],

    Gemini: [
        "gemini",
        "google gemini",
        "gemini api"
    ],


    // ==========================================
    // DATA SCIENCE
    // ==========================================

    SQL: [
        "sql"
    ],

    Statistics: [
        "statistics",
        "statistical analysis",
        "statistical modeling"
    ],

    "Data Analysis": [
        "data analysis",
        "data analytics",
        "data analyst"
    ],

    "Data Visualization": [
        "data visualization",
        "data visualisation"
    ],

    PowerBI: [
        "power bi",
        "powerbi"
    ],

    Tableau: [
        "tableau"
    ],

    Excel: [
        "excel",
        "microsoft excel"
    ],


    // ==========================================
    // DEVOPS
    // ==========================================

    Docker: [
        "docker"
    ],

    Kubernetes: [
        "kubernetes",
        "k8s"
    ],

    Jenkins: [
        "jenkins"
    ],

    "CI/CD": [
        "ci/cd",
        "ci cd",
        "continuous integration",
        "continuous deployment",
        "continuous delivery"
    ],

    Terraform: [
        "terraform"
    ],

    "GitHub Actions": [
        "github actions"
    ],

    Ansible: [
        "ansible"
    ],


    // ==========================================
    // CLOUD
    // ==========================================

    AWS: [
        "aws",
        "amazon web services"
    ],

    Azure: [
        "azure",
        "microsoft azure"
    ],

    GCP: [
        "gcp",
        "google cloud",
        "google cloud platform"
    ],

    "Cloud Computing": [
        "cloud computing",
        "cloud technology",
        "cloud services"
    ],

    Serverless: [
        "serverless"
    ],


    // ==========================================
    // LINUX / NETWORKING
    // ==========================================

    Linux: [
        "linux"
    ],

    Networking: [
        "networking",
        "computer networking",
        "network fundamentals"
    ],

    "Networking Fundamentals": [
        "networking fundamentals",
        "network fundamentals"
    ],


    // ==========================================
    // CYBERSECURITY
    // ==========================================

    Cybersecurity: [
        "cybersecurity",
        "cyber security"
    ],

    "Network Security": [
        "network security"
    ],

    "Ethical Hacking": [
        "ethical hacking"
    ],

    "Penetration Testing": [
        "penetration testing"
    ],

    OWASP: [
        "owasp"
    ],

    Cryptography: [
        "cryptography",
        "cryptographic"
    ],

    SIEM: [
        "siem"
    ],

    Authentication: [
        "authentication",
        "authorization"
    ],


    // ==========================================
    // WEB DEVELOPMENT CATEGORY
    // ==========================================

    "Web Development": [
        "web development",
        "web developer",
        "web development technologies",
        "full stack web development",
        "full-stack web development",
        "frontend development",
        "front-end development",
        "backend development",
        "back-end development"
    ],


    // ==========================================
    // DESIGN
    // ==========================================

    Figma: [
        "figma"
    ],

    UIUX: [
        "ui/ux",
        "ui ux",
        "user interface",
        "user experience"
    ]
};


// ==========================================
// Normalize Text
// ==========================================

const normalizeText = (text) => {

    return String(text || "")
        .toLowerCase()
        .replace(/[^\w+#./\- ]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};


// ==========================================
// Escape Regex
// ==========================================

const escapeRegex = (text) => {

    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
};


// ==========================================
// Check Skill Presence
// Exact Word / Phrase Matching
// ==========================================

const containsSkill = (
    normalizedText,
    skill
) => {

    const aliases =
        skillDictionary[skill] || [];


    return aliases.some(
        alias => {

            const normalizedAlias =
                normalizeText(alias);


            if (!normalizedAlias) {
                return false;
            }


            const escapedAlias =
                escapeRegex(
                    normalizedAlias
                );


            const regex =
                new RegExp(
                    `(^|\\s)${escapedAlias}(?=\\s|$)`,
                    "i"
                );


            return regex.test(
                normalizedText
            );
        }
    );
};


// ==========================================
// Extract Skills
// ==========================================

const extractSkills = (
    resumeText
) => {

    const normalizedText =
        normalizeText(resumeText);

    const detectedSkills = [];


    Object.keys(
        skillDictionary
    ).forEach(
        skill => {

            if (
                containsSkill(
                    normalizedText,
                    skill
                )
            ) {

                detectedSkills.push(
                    skill
                );
            }
        }
    );


    return detectedSkills;
};


// ==========================================
// Get Skill Contexts
// ==========================================

const getSkillContexts = (
    resumeText,
    skill
) => {

    const text =
        String(resumeText || "");

    const lowerText =
        text.toLowerCase();

    const contexts = [];

    const aliases =
        skillDictionary[skill] || [];


    aliases.forEach(
        alias => {

            const aliasLower =
                alias.toLowerCase();

            let index =
                lowerText.indexOf(
                    aliasLower
                );


            while (
                index !== -1
            ) {

                const start =
                    Math.max(
                        0,
                        index - 220
                    );


                const end =
                    Math.min(
                        text.length,
                        index +
                            alias.length +
                            220
                    );


                contexts.push(
                    text.substring(
                        start,
                        end
                    )
                );


                index =
                    lowerText.indexOf(
                        aliasLower,
                        index + alias.length
                    );
            }
        }
    );


    return contexts;
};


// ==========================================
// Get Skill Evidence
// ==========================================

const getSkillEvidence = (
    resumeText,
    skill
) => {

    const text =
        String(resumeText || "");

    const lowerText =
        text.toLowerCase();

    const aliases =
        skillDictionary[skill] || [];


    const evidence = {

        technicalSkills: false,

        projectUsage: false,

        experienceUsage: false,

        certificationUsage: false,

        explicitAdvanced: false,

        explicitBeginner: false,

        usageCount: 0
    };


    // ==========================================
    // Technical Skills Keywords
    // ==========================================

    const technicalSkillsKeywords = [

        "technical skills",
        "technical skill",
        "skills",
        "core skills",
        "programming skills",
        "technologies",
        "technical expertise"

    ];


    // ==========================================
    // Project Keywords
    // ==========================================

    const projectKeywords = [

        "project",
        "projects",
        "built",
        "developed",
        "implemented",
        "created",
        "application",
        "app",
        "platform",
        "dashboard",
        "website",
        "system",
        "model",
        "trained"

    ];


    // ==========================================
    // Experience Keywords
    // ==========================================

    const experienceKeywords = [

        "experience",
        "internship",
        "intern",
        "worked",
        "professional",
        "employment"

    ];


    // ==========================================
    // Advanced Keywords
    // ==========================================

    const advancedKeywords = [

        "advanced",
        "advanced level",
        "proficient",
        "proficiency",
        "expert",
        "expertise",
        "professional experience",
        "production",
        "deployed",
        "architected",
        "optimized"

    ];


    // ==========================================
    // Beginner Keywords
    // ==========================================

    const beginnerKeywords = [

        "beginner",
        "basic",
        "basics",
        "learning",
        "currently learning",
        "familiar with",
        "familiarity",
        "introduction to",
        "introductory"

    ];


    // ==========================================
    // Analyze Every Skill Occurrence
    // ==========================================

    aliases.forEach(
        alias => {

            const aliasLower =
                alias.toLowerCase();


            let index =
                lowerText.indexOf(
                    aliasLower
                );


            while (
                index !== -1
            ) {

                evidence.usageCount++;


                const start =
                    Math.max(
                        0,
                        index - 250
                    );


                const end =
                    Math.min(
                        text.length,
                        index +
                            alias.length +
                            250
                    );


                const context =
                    lowerText.substring(
                        start,
                        end
                    );


                // ==========================================
                // Technical Skills
                // ==========================================

                if (
                    technicalSkillsKeywords.some(
                        keyword =>
                            context.includes(
                                keyword
                            )
                    )
                ) {

                    evidence.technicalSkills =
                        true;
                }


                // ==========================================
                // Project Usage
                // ==========================================

                if (
                    projectKeywords.some(
                        keyword =>
                            context.includes(
                                keyword
                            )
                    )
                ) {

                    evidence.projectUsage =
                        true;
                }


                // ==========================================
                // Experience Usage
                // ==========================================

                if (
                    experienceKeywords.some(
                        keyword =>
                            context.includes(
                                keyword
                            )
                    )
                ) {

                    evidence.experienceUsage =
                        true;
                }


                // ==========================================
                // Certification
                // ==========================================

                if (
                    context.includes(
                        "certification"
                    ) ||
                    context.includes(
                        "certificate"
                    )
                ) {

                    evidence.certificationUsage =
                        true;
                }


                // ==========================================
                // Explicit Advanced
                // ==========================================

                if (
                    advancedKeywords.some(
                        keyword =>
                            context.includes(
                                keyword
                            )
                    )
                ) {

                    evidence.explicitAdvanced =
                        true;
                }


                // ==========================================
                // Explicit Beginner
                // ==========================================

                if (
                    beginnerKeywords.some(
                        keyword =>
                            context.includes(
                                keyword
                            )
                    )
                ) {

                    evidence.explicitBeginner =
                        true;
                }


                index =
                    lowerText.indexOf(
                        aliasLower,
                        index + alias.length
                    );
            }
        }
    );


    return evidence;
};


// ==========================================
// Generate Human Readable Evidence
// ==========================================

const generateEvidenceText = (
    skill,
    evidence
) => {

    if (
        evidence.explicitAdvanced
    ) {

        return (
            `${skill} is explicitly described with ` +
            `advanced or proficiency evidence.`
        );
    }


    if (
        evidence.projectUsage &&
        evidence.experienceUsage
    ) {

        return (
            `${skill} is demonstrated through ` +
            `projects and practical experience.`
        );
    }


    if (
        evidence.projectUsage
    ) {

        return (
            `${skill} is demonstrated through project work.`
        );
    }


    if (
        evidence.experienceUsage
    ) {

        return (
            `${skill} is demonstrated through ` +
            `internship or work experience.`
        );
    }


    if (
        evidence.technicalSkills
    ) {

        return (
            `${skill} is listed in the technical ` +
            `skills section.`
        );
    }


    return (
        `${skill} is mentioned in the resume.`
    );
};


// ==========================================
// Estimate Skill Level
// ==========================================

const estimateSkillLevel = (
    resumeText,
    skill
) => {

    const contexts =
        getSkillContexts(
            resumeText,
            skill
        );


    if (
        contexts.length === 0
    ) {

        return {

            level: "Beginner",

            score: 1
        };
    }


    const evidence =
        getSkillEvidence(
            resumeText,
            skill
        );


    // ==========================================
    // Explicit Beginner
    // ==========================================

    if (
        evidence.explicitBeginner &&
        !evidence.explicitAdvanced
    ) {

        return {

            level: "Beginner",

            score: 1
        };
    }


    // ==========================================
    // Explicit Advanced
    // ==========================================

    if (
        evidence.explicitAdvanced
    ) {

        return {

            level: "Advanced",

            score: 3
        };
    }


    // ==========================================
    // Project + Experience
    // ==========================================

    if (
        evidence.projectUsage &&
        evidence.experienceUsage
    ) {

        return {

            level: "Intermediate",

            score: 2
        };
    }


    // ==========================================
    // Project Usage
    // ==========================================

    if (
        evidence.projectUsage
    ) {

        return {

            level: "Intermediate",

            score: 2
        };
    }


    // ==========================================
    // Experience Usage
    // ==========================================

    if (
        evidence.experienceUsage
    ) {

        return {

            level: "Intermediate",

            score: 2
        };
    }


    // ==========================================
    // Technical Skills Section
    // ==========================================

    if (
        evidence.technicalSkills
    ) {

        return {

            level: "Intermediate",

            score: 2
        };
    }


    // ==========================================
    // DSA / OOP / Programming
    // ==========================================

    if (
        skill === "DSA" ||
        skill === "OOP" ||
        skill === "Programming"
    ) {

        return {

            level: "Intermediate",

            score: 2
        };
    }


    // ==========================================
    // Web Development
    // ==========================================

    if (
        skill === "Web Development"
    ) {

        return {

            level: "Intermediate",

            score: 2
        };
    }


    // ==========================================
    // Default
    // ==========================================

    return {

        level: "Beginner",

        score: 1
    };
};


// ==========================================
// Extract Skills With Levels + Evidence
// ==========================================

const extractSkillsWithLevels = (
    resumeText
) => {

    const skills =
        extractSkills(
            resumeText
        );


    return skills.map(
        skill => {

            const result =
                estimateSkillLevel(
                    resumeText,
                    skill
                );


            const evidence =
                getSkillEvidence(
                    resumeText,
                    skill
                );


            const evidenceText =
                generateEvidenceText(
                    skill,
                    evidence
                );


            return {

                name:
                    skill,

                level:
                    result.level,

                score:
                    result.score,

                evidence:
                    evidenceText
            };
        }
    );
};


// ==========================================
// Export
// ==========================================

module.exports = {

    skillDictionary,

    normalizeText,

    extractSkills,

    estimateSkillLevel,

    extractSkillsWithLevels

};