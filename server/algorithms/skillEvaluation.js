// Skill Evaluation Engine
// HashMap is used for efficient skill score lookup

const evaluateSkills = (skillResults) => {
    const skillMap = new Map();

    skillResults.forEach((result) => {
        skillMap.set(result.skill, {
            score: result.score,
            maxScore: result.maxScore,
            percentage: result.percentage,
            level: result.level
        });
    });

    const strongSkills = [];
    const skillsToImprove = [];

    skillMap.forEach((data, skill) => {
        if (data.percentage >= 80) {
            strongSkills.push({
                skill,
                ...data
            });
        } else {
            skillsToImprove.push({
                skill,
                ...data
            });
        }
    });

    return {
        totalSkills: skillMap.size,
        strongSkills,
        skillsToImprove
    };
};

module.exports = evaluateSkills;