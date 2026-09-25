// ======================================================
// INTERNSHIP MATCHING ENGINE
// ======================================================

const calculateInternshipMatch = ({
  internship,
  targetCareer,
  userSkills = [],
  roadmapSkills = [],
}) => {
  // ----------------------------------------------------
  // NORMALIZE VALUES
  // ----------------------------------------------------

  const internshipCareer = (
    internship.career || ""
  ).trim().toLowerCase();

  const userCareer = (
    targetCareer || ""
  ).trim().toLowerCase();

  // ----------------------------------------------------
  // 1. CAREER MATCH
  // Weight = 30%
  // ----------------------------------------------------

  const careerMatch =
    Boolean(userCareer) &&
    Boolean(internshipCareer) &&
    internshipCareer === userCareer;

  const careerScore = careerMatch
    ? 100
    : 0;

  // ----------------------------------------------------
  // 2. USER SKILL MAP
  // ----------------------------------------------------

  const skillMap = new Map();

  userSkills.forEach((skill) => {
    if (!skill?.skill) {
      return;
    }

    skillMap.set(
      skill.skill.trim().toLowerCase(),
      Number(skill.percentage) || 0
    );
  });

  // ----------------------------------------------------
  // 3. INTERNSHIP SKILLS
  // ----------------------------------------------------

  const internshipSkills = (
    internship.skills || []
  ).filter(Boolean);

  // ----------------------------------------------------
  // 4. ROADMAP SKILL MAP
  // ----------------------------------------------------

  const roadmapSkillSet = new Set(
    roadmapSkills
      .filter(Boolean)
      .map((skill) =>
        skill.trim().toLowerCase()
      )
  );

  // ----------------------------------------------------
  // 5. MATCH CURRENT USER SKILLS
  // Weight = 50%
  // ----------------------------------------------------

  const matchedSkills = [];
  const skillsToImprove = [];
  const missingSkills = [];

  let currentSkillScore = 0;

  internshipSkills.forEach((skill) => {
    const normalizedSkill =
      skill.trim().toLowerCase();

    const userPercentage =
      skillMap.get(normalizedSkill);

    if (userPercentage !== undefined) {
      const percentage = Math.min(
        Math.max(userPercentage, 0),
        100
      );

      currentSkillScore += percentage;

      if (percentage >= 60) {
        matchedSkills.push({
          skill,
          percentage,
        });
      } else {
        skillsToImprove.push({
          skill,
          percentage,
        });
      }
    } else {
      missingSkills.push(skill);
    }
  });

  let skillScore = 0;

  if (internshipSkills.length > 0) {
    skillScore =
      currentSkillScore /
      internshipSkills.length;
  }

  // ----------------------------------------------------
  // 6. ROADMAP RELEVANCE
  // Weight = 20%
  // ----------------------------------------------------

  const roadmapMatchedSkills =
    internshipSkills.filter((skill) =>
      roadmapSkillSet.has(
        skill.trim().toLowerCase()
      )
    );

  let roadmapScore = 0;

  if (internshipSkills.length > 0) {
    roadmapScore =
      (roadmapMatchedSkills.length /
        internshipSkills.length) *
      100;
  }

  // ----------------------------------------------------
  // 7. FINAL SCORE
  // ----------------------------------------------------

  const finalScore =
    careerScore * 0.30 +
    skillScore * 0.50 +
    roadmapScore * 0.20;

  const matchPercentage = Math.round(
    Math.min(
      Math.max(finalScore, 0),
      100
    )
  );

  // ----------------------------------------------------
  // 8. SKILL GAP COUNT
  // ----------------------------------------------------

  const skillGapCount =
    skillsToImprove.length +
    missingSkills.length;

  // ----------------------------------------------------
  // 9. RECOMMENDATION LEVEL
  // ----------------------------------------------------

  let recommendationLevel =
    "Low";

  if (matchPercentage >= 80) {
    recommendationLevel =
      "Excellent Match";
  } else if (matchPercentage >= 65) {
    recommendationLevel =
      "Strong Match";
  } else if (matchPercentage >= 50) {
    recommendationLevel =
      "Good Match";
  } else if (matchPercentage >= 35) {
    recommendationLevel =
      "Potential Match";
  }

  // ----------------------------------------------------
  // 10. RECOMMENDATION REASON
  // ----------------------------------------------------

  let reason =
    "This opportunity has limited relevance to your current profile.";

  if (
    careerMatch &&
    matchedSkills.length > 0 &&
    roadmapMatchedSkills.length > 0
  ) {
    reason =
      "This internship matches your target career, existing skills, and career roadmap.";
  } else if (
    careerMatch &&
    matchedSkills.length > 0
  ) {
    reason =
      "This internship matches your target career and some of your existing skills.";
  } else if (
    careerMatch &&
    roadmapMatchedSkills.length > 0
  ) {
    reason =
      "This internship matches your target career and skills included in your learning roadmap.";
  } else if (careerMatch) {
    reason =
      "This internship matches your target career.";
  } else if (
    matchedSkills.length > 0
  ) {
    reason =
      "This internship matches some of your existing skills.";
  } else if (
    roadmapMatchedSkills.length > 0
  ) {
    reason =
      "This internship contains skills relevant to your career roadmap.";
  }

  // ----------------------------------------------------
  // RETURN MATCHING DATA
  // ----------------------------------------------------

  return {
    matchPercentage,

    recommendationLevel,

    careerMatch,

    careerScore: Math.round(
      careerScore
    ),

    skillScore: Math.round(
      skillScore
    ),

    roadmapScore: Math.round(
      roadmapScore
    ),

    matchedSkills,

    skillsToImprove,

    missingSkills,

    roadmapMatchedSkills,

    skillGapCount,

    reason,
  };
};

module.exports =
  calculateInternshipMatch;