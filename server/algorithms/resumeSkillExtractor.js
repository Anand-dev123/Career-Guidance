// ==========================================
// Rule-Based Resume Skill Extractor
// ==========================================

// Skill aliases
const skillDictionary = {

    "HTML": [
        "html",
        "html5",
        "hyper text markup language"
    ],

    "CSS": [
        "css",
        "css3",
        "cascading style sheets"
    ],

    "JavaScript": [
        "javascript",
        "java script",
        "js"
    ],

    "React": [
        "react",
        "reactjs",
        "react.js"
    ],

    "Node.js": [
        "node",
        "nodejs",
        "node.js"
    ],

    "Express.js": [
        "express",
        "expressjs",
        "express.js"
    ],

    "MongoDB": [
        "mongodb",
        "mongo db",
        "mongo"
    ],

    "MySQL": [
        "mysql",
        "my sql"
    ],

    "Java": [
        "java"
    ],

    "Python": [
        "python"
    ],

    "C++": [
        "c++",
        "cpp"
    ],

    "C": [
        "c programming",
        "c language"
    ],

    "Git": [
        "git"
    ],

    "GitHub": [
        "github",
        "git hub"
    ],

    "Bootstrap": [
        "bootstrap"
    ],

    "Tailwind CSS": [
        "tailwind",
        "tailwind css"
    ],

    "Next.js": [
        "nextjs",
        "next.js",
        "next js"
    ],

    "TypeScript": [
        "typescript",
        "type script",
        "ts"
    ],

    "SQL": [
        "sql",
        "structured query language"
    ],

    "DSA": [
        "dsa",
        "data structures",
        "data structure",
        "algorithms",
        "data structures and algorithms"
    ],

    "OOP": [
        "oop",
        "object oriented programming",
        "object-oriented programming"
    ],

    "REST API": [
        "rest api",
        "restful api",
        "rest apis"
    ],

    "JWT": [
        "jwt",
        "json web token",
        "json web tokens"
    ],

    "Docker": [
        "docker"
    ],

    "AWS": [
        "aws",
        "amazon web services"
    ],

    "Linux": [
        "linux"
    ],

    "Figma": [
        "figma"
    ],

    "Machine Learning": [
        "machine learning",
        "machine-learning",
        "ml"
    ],

    "Artificial Intelligence": [
        "artificial intelligence",
        "artificial intelligence ai",
        "ai"
    ],

    "Generative AI": [
        "generative ai",
        "gen ai",
        "genai"
    ],

    "Prompt Engineering": [
        "prompt engineering",
        "prompt design"
    ]
};


// ==========================================
// Normalize Resume Text
// ==========================================

const normalizeText = (text) => {

    return text
        .toLowerCase()
        .replace(/[^\w\s+#.-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};


// ==========================================
// Check Skill Match
// ==========================================

const containsSkill = (
    normalizedText,
    alias
) => {

    const normalizedAlias =
        alias
            .toLowerCase()
            .replace(/[^\w\s+#.-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    // Special handling for short skills
    if (
        ["c", "js", "ts", "ai", "ml"].includes(
            normalizedAlias
        )
    ) {

        const words =
            normalizedText.split(" ");

        return words.includes(
            normalizedAlias
        );
    }

    return normalizedText.includes(
        normalizedAlias
    );
};


// ==========================================
// Extract Skills
// ==========================================

const extractSkills = (resumeText) => {

    if (
        !resumeText ||
        !resumeText.trim()
    ) {
        return [];
    }


    const normalizedText =
        normalizeText(resumeText);


    const detectedSkills = [];


    Object.entries(
        skillDictionary
    ).forEach(
        ([skillName, aliases]) => {

            const found =
                aliases.some(
                    (alias) =>
                        containsSkill(
                            normalizedText,
                            alias
                        )
                );


            if (found) {

                detectedSkills.push(
                    skillName
                );
            }
        }
    );


    return detectedSkills;
};


// ==========================================
// Estimate Skill Level
// ==========================================

const estimateSkillLevel = (
    resumeText,
    skill
) => {

    const text =
        normalizeText(resumeText);


    const strongKeywords = [
        "expert",
        "advanced",
        "proficient",
        "experienced",
        "developed",
        "built",
        "implemented",
        "worked with",
        "project"
    ];


    const beginnerKeywords = [
        "beginner",
        "basic",
        "learning",
        "familiar",
        "currently learning"
    ];


    let strongScore = 0;
    let beginnerScore = 0;


    strongKeywords.forEach(
        (keyword) => {

            if (
                text.includes(keyword)
            ) {
                strongScore++;
            }
        }
    );


    beginnerKeywords.forEach(
        (keyword) => {

            if (
                text.includes(keyword)
            ) {
                beginnerScore++;
            }
        }
    );


    if (beginnerScore > strongScore) {

        return {
            level: "Beginner",
            score: 1
        };
    }


    if (strongScore >= 2) {

        return {
            level: "Advanced",
            score: 3
        };
    }


    return {
        level: "Intermediate",
        score: 2
    };
};


// ==========================================
// Extract Skills With Levels
// ==========================================

const extractSkillsWithLevels = (
    resumeText
) => {

    const skills =
        extractSkills(resumeText);


    return skills.map(
        (skill) => {

            const skillLevel =
                estimateSkillLevel(
                    resumeText,
                    skill
                );


            return {

                name: skill,

                level:
                    skillLevel.level,

                score:
                    skillLevel.score
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