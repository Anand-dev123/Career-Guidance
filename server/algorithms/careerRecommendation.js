// ==========================================
// Career Recommendation Engine
// Domain Independent Weighted Matching
// ==========================================


// ==========================================
// Normalize Skill Name
// ==========================================

const normalizeSkillName = (skill) => {

    return String(skill || "")
        .toLowerCase()
        .trim()
        .replace(/[._/-]+/g, " ")
        .replace(/\s+/g, " ");
};


// ==========================================
// Skill Aliases / Composite Skills
// ==========================================

const skillAliases = {

    "git github": [
        "git",
        "github"
    ],

    "networking fundamentals": [
        "networking fundamentals",
        "networking",
        "network fundamentals"
    ],

    "ci cd": [
        "ci cd",
        "ci/cd",
        "continuous integration",
        "continuous deployment",
        "continuous delivery"
    ],

    "machine learning": [
        "machine learning",
        "ml"
    ],

    "artificial intelligence": [
        "artificial intelligence",
        "ai"
    ],

    "web development": [
        "web development",
        "web developer",
        "full stack web development",
        "full-stack web development"
    ],

    "rest api": [
        "rest api",
        "restful api",
        "rest apis"
    ]
};


// ==========================================
// Convert User Skills to Map
// Supports:
// Map
// Object
// ==========================================

const convertSkillsToMap = (
    userSkills
) => {

    const skillMap =
        new Map();


    if (!userSkills) {
        return skillMap;
    }


    // ==========================================
    // Already a Map
    // ==========================================

    if (
        userSkills instanceof Map
    ) {

        userSkills.forEach(
            (score, skill) => {

                skillMap.set(
                    normalizeSkillName(skill),
                    Number(score) || 0
                );

            }
        );


        return skillMap;
    }


    // ==========================================
    // Normal Object
    // ==========================================

    if (
        typeof userSkills === "object"
    ) {

        Object.entries(
            userSkills
        ).forEach(
            ([skill, score]) => {

                skillMap.set(
                    normalizeSkillName(skill),
                    Number(score) || 0
                );

            }
        );
    }


    return skillMap;
};


// ==========================================
// Get Direct Skill Score
// ==========================================

const getDirectSkillScore = (
    skillMap,
    skill
) => {

    const normalizedSkill =
        normalizeSkillName(skill);


    return Number(
        skillMap.get(
            normalizedSkill
        ) || 0
    );
};


// ==========================================
// Get User Skill Score
// Supports Composite Skills
// ==========================================

const getUserSkillScore = (
    skillMap,
    requiredSkill
) => {

    const normalizedRequiredSkill =
        normalizeSkillName(
            requiredSkill
        );


    // ==========================================
    // Direct Match
    // ==========================================

    const directScore =
        getDirectSkillScore(
            skillMap,
            requiredSkill
        );


    if (
        directScore > 0
    ) {

        return directScore;
    }


    // ==========================================
    // Alias Match
    // ==========================================

    const aliases =
        skillAliases[
            normalizedRequiredSkill
        ];


    if (
        aliases &&
        aliases.length > 0
    ) {

        let bestScore = 0;


        aliases.forEach(
            alias => {

                const score =
                    getDirectSkillScore(
                        skillMap,
                        alias
                    );


                if (
                    score > bestScore
                ) {

                    bestScore =
                        score;
                }

            }
        );


        return bestScore;
    }


    return 0;
};


// ==========================================
// Get Skill Level
// ==========================================

const getSkillLevel = (
    score
) => {

    if (
        score >= 3
    ) {

        return "Strong";
    }


    if (
        score >= 2
    ) {

        return "Intermediate";
    }


    if (
        score >= 1
    ) {

        return "Beginner";
    }


    return "Missing";
};


// ==========================================
// Calculate Career Match
// ==========================================

const calculateCareerMatch = (
    userSkills,
    career
) => {

    const requiredSkills =
        career.requiredSkills || [];


    const skillMap =
        convertSkillsToMap(
            userSkills
        );


    // ==========================================
    // No Required Skills
    // ==========================================

    if (
        requiredSkills.length === 0
    ) {

        return {

            career:
                career.name,

            matchPercentage:
                0,

            matchedSkills: [],

            skillsToImprove: [],

            missingSkills: [],

            recommendationReason:
                `No required skills are defined for ${career.name}.`

        };
    }


    const matchedSkills = [];

    const skillsToImprove = [];

    const missingSkills = [];


    let totalScore = 0;


    // ==========================================
    // Compare Required Skills
    // ==========================================

    requiredSkills.forEach(
        requiredSkill => {

            const userSkillScore =
                getUserSkillScore(
                    skillMap,
                    requiredSkill
                );


            // Keep score 0-3
            const score =
                Math.max(
                    0,
                    Math.min(
                        3,
                        userSkillScore
                    )
                );


            totalScore +=
                score;


            // ==========================================
            // Strong
            // ==========================================

            if (
                score === 3
            ) {

                matchedSkills.push({

                    skill:
                        requiredSkill,

                    score,

                    level:
                        "Strong"

                });

            }


            // ==========================================
            // Intermediate
            // ==========================================

            else if (
                score === 2
            ) {

                skillsToImprove.push({

                    skill:
                        requiredSkill,

                    score,

                    level:
                        "Intermediate"

                });

            }


            // ==========================================
            // Beginner
            // ==========================================

            else if (
                score === 1
            ) {

                skillsToImprove.push({

                    skill:
                        requiredSkill,

                    score,

                    level:
                        "Beginner"

                });

            }


            // ==========================================
            // Missing
            // ==========================================

            else {

                missingSkills.push(
                    requiredSkill
                );

            }

        }
    );


    // ==========================================
    // Maximum Possible Score
    // ==========================================

    const maximumScore =
        requiredSkills.length * 3;


    // ==========================================
    // Match Percentage
    // ==========================================

    const matchPercentage =
        maximumScore > 0
            ? Math.round(
                  (
                      totalScore /
                      maximumScore
                  ) * 100
              )
            : 0;


    // ==========================================
    // Recommendation Reason
    // ==========================================

    let recommendationReason =
        "";


    if (
        matchedSkills.length > 0
    ) {

        const strongSkillNames =
            matchedSkills
                .map(
                    skill =>
                        skill.skill
                )
                .join(", ");


        recommendationReason =
            `You have strong skills in ${strongSkillNames}, ` +
            `which align with the requirements of ${career.name}.`;


        if (
            skillsToImprove.length > 0
        ) {

            recommendationReason +=
                ` You should improve ${skillsToImprove.length} ` +
                `skill(s) to strengthen your match.`;

        }


        if (
            missingSkills.length > 0
        ) {

            recommendationReason +=
                ` You are also missing ${missingSkills.length} ` +
                `required skill(s).`;

        }

    }

    else if (
        skillsToImprove.length > 0
    ) {

        recommendationReason =
            `You have some foundational skills for ${career.name}, ` +
            `but several required skills need improvement.`;

    }

    else {

        recommendationReason =
            `Your current assessed skills have limited ` +
            `alignment with ${career.name}.`;

    }


    // ==========================================
    // Final Result
    // ==========================================

    return {

        career:
            career.name,

        matchPercentage,

        matchedSkills,

        skillsToImprove,

        missingSkills,

        recommendationReason

    };
};


// ==========================================
// Recommend Careers
// ==========================================

const recommendCareers = (
    userSkills,
    careers
) => {

    if (
        !Array.isArray(careers)
    ) {

        return [];
    }


    const recommendations =
        careers.map(
            career => {

                return calculateCareerMatch(
                    userSkills,
                    career
                );

            }
        );


    // ==========================================
    // Highest Match First
    // ==========================================

    recommendations.sort(
        (a, b) =>
            b.matchPercentage -
            a.matchPercentage
    );


    return recommendations;
};


// ==========================================
// Export
// ==========================================

module.exports = {

    normalizeSkillName,

    getUserSkillScore,

    calculateCareerMatch,

    recommendCareers

};