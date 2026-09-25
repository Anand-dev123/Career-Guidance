// ==========================================
// Career Recommendation Engine
// Weighted Skill Proficiency Matching
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
// Convert User Skills to Map
// Supports:
// Map
// Object
// ==========================================

const convertSkillsToMap = (userSkills) => {
    const skillMap = new Map();

    if (!userSkills) {
        return skillMap;
    }


    // Already a Map
    if (userSkills instanceof Map) {
        userSkills.forEach((score, skill) => {
            skillMap.set(
                normalizeSkillName(skill),
                Number(score) || 0
            );
        });

        return skillMap;
    }


    // Normal JavaScript object
    if (typeof userSkills === "object") {
        Object.entries(userSkills).forEach(
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
// Get User Skill Score
// ==========================================

const getUserSkillScore = (
    skillMap,
    requiredSkill
) => {

    const normalizedRequiredSkill =
        normalizeSkillName(requiredSkill);

    return Number(
        skillMap.get(normalizedRequiredSkill) || 0
    );
};


// ==========================================
// Get Skill Level
// ==========================================

const getSkillLevel = (score) => {

    if (score >= 3) {
        return "Strong";
    }

    if (score >= 2) {
        return "Intermediate";
    }

    if (score >= 1) {
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


    // Convert user skills into normalized Map
    const skillMap =
        convertSkillsToMap(userSkills);


    // No required skills
    if (requiredSkills.length === 0) {

        return {
            career: career.name,

            matchPercentage: 0,

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
    // Compare Every Required Skill
    // ==========================================

    requiredSkills.forEach(
        (requiredSkill) => {

            const userSkill =
                getUserSkillScore(
                    skillMap,
                    requiredSkill
                );


            // Keep score between 0 and 3
            const score = Math.max(
                0,
                Math.min(3, userSkill)
            );


            totalScore += score;


            // ==========================================
            // Strong Skill
            // ==========================================

            if (score === 3) {

                matchedSkills.push({
                    skill: requiredSkill,
                    score,
                    level: "Strong"
                });
            }


            // ==========================================
            // Skill Needs Improvement
            // ==========================================

            else if (score === 2) {

                skillsToImprove.push({
                    skill: requiredSkill,
                    score,
                    level: "Intermediate"
                });
            }


            // ==========================================
            // Beginner Skill
            // ==========================================

            else if (score === 1) {

                skillsToImprove.push({
                    skill: requiredSkill,
                    score,
                    level: "Beginner"
                });
            }


            // ==========================================
            // Missing Skill
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
    // Career Match Percentage
    // ==========================================

    const matchPercentage =
        maximumScore > 0
            ? Math.round(
                  (totalScore / maximumScore) * 100
              )
            : 0;


    // ==========================================
    // Recommendation Reason
    // ==========================================

    let recommendationReason = "";


    if (matchedSkills.length > 0) {

        const strongSkillNames =
            matchedSkills
                .map(
                    (skill) => skill.skill
                )
                .join(", ");


        recommendationReason =
            `You have strong skills in ${strongSkillNames}, ` +
            `which align with the requirements of ${career.name}.`;


        if (skillsToImprove.length > 0) {

            recommendationReason +=
                ` You should improve ${skillsToImprove.length} ` +
                `skill(s) to strengthen your match.`;
        }


        if (missingSkills.length > 0) {

            recommendationReason +=
                ` You are also missing ${missingSkills.length} ` +
                `required skill(s).`;
        }

    } else if (
        skillsToImprove.length > 0
    ) {

        recommendationReason =
            `You have some foundational skills for ${career.name}, ` +
            `but several required skills need improvement.`;

    } else {

        recommendationReason =
            `Your current assessed skills have limited ` +
            `alignment with ${career.name}.`;
    }


    // ==========================================
    // Final Result
    // ==========================================

    return {
        career: career.name,

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

    if (!Array.isArray(careers)) {
        return [];
    }


    const recommendations =
        careers.map(
            (career) => {

                return calculateCareerMatch(
                    userSkills,
                    career
                );
            }
        );


    // Highest match first
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
    calculateCareerMatch,
    recommendCareers
};