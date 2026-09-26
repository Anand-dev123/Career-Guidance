// ==========================================
// Resume Score Calculator
// ==========================================

const calculateResumeScore = ({
    skills = [],
    education = [],
    experience = [],
    projects = [],
    certifications = [],
    careerRecommendations = []
}) => {

    // ==========================================
    // 1. Skill Strength
    // ==========================================

    let skillStrength = 0;

    if (skills.length > 0) {

        const totalSkillScore = skills.reduce(
            (sum, skill) => sum + (skill.score || 0),
            0
        );

        const maxSkillScore =
            skills.length * 3;

        skillStrength =
            Math.round(
                (totalSkillScore / maxSkillScore) * 100
            );
    }


    // ==========================================
    // 2. Project Strength
    // ==========================================

    let projectStrength = 0;

    if (projects.length > 0) {

        projectStrength = 80;

        if (projects.length >= 3) {
            projectStrength = 90;
        }

        if (projects.length >= 5) {
            projectStrength = 100;
        }
    }


    // ==========================================
    // 3. Experience Strength
    // ==========================================

    let experienceStrength = 0;

    if (experience.length > 0) {

        experienceStrength = 70;

        if (experience.length >= 2) {
            experienceStrength = 85;
        }

        if (experience.length >= 3) {
            experienceStrength = 100;
        }
    }


    // ==========================================
    // 4. Education Strength
    // ==========================================

    let educationStrength = 0;

    if (education.length > 0) {
        educationStrength = 80;
    }


    // ==========================================
    // 5. Certification Strength
    // ==========================================

    let certificationStrength = 0;

    if (certifications.length > 0) {

        certificationStrength = 70;

        if (certifications.length >= 2) {
            certificationStrength = 85;
        }

        if (certifications.length >= 3) {
            certificationStrength = 100;
        }
    }


    // ==========================================
    // 6. Career Alignment
    // ==========================================

    let careerAlignment = 0;

    if (careerRecommendations.length > 0) {

        const topCareer =
            careerRecommendations[0];

        careerAlignment =
            topCareer.matchPercentage || 0;
    }


    // ==========================================
    // 7. Overall Resume Score
    // ==========================================

    const overallScore =
        Math.round(
            (
                skillStrength * 0.35 +
                projectStrength * 0.20 +
                experienceStrength * 0.15 +
                educationStrength * 0.10 +
                certificationStrength * 0.10 +
                careerAlignment * 0.10
            )
        );


    // ==========================================
    // 8. Score Category
    // ==========================================

    let category = "Needs Improvement";

    if (overallScore >= 80) {
        category = "Strong";
    } else if (overallScore >= 65) {
        category = "Good";
    } else if (overallScore >= 50) {
        category = "Developing";
    }


    return {

        overallScore,

        category,

        breakdown: {

            skillStrength,

            projectStrength,

            experienceStrength,

            educationStrength,

            certificationStrength,

            careerAlignment
        }
    };
};


module.exports = calculateResumeScore;