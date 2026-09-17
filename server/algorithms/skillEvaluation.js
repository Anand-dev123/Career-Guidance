const MaxHeap = require("./maxHeap");

// Skill Evaluation Engine
// HashMap + Max Heap

const evaluateSkills = (skillResults) => {
  // HashMap for skill lookup
  const skillMap = new Map();

  // Max Heap for skill gap priority
  const gapHeap = new MaxHeap();

  skillResults.forEach((result) => {
    const skillData = {
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      level: result.level,
    };

    // Store skill in HashMap
    skillMap.set(result.skill, skillData);

    // Calculate gap priority
    if (result.percentage < 80) {
      const priority = 100 - result.percentage;

      gapHeap.insert({
        skill: result.skill,
        percentage: result.percentage,
        score: result.score,
        maxScore: result.maxScore,
        level: result.level,
        priority,
      });
    }
  });

  const strongSkills = [];
  const skillsToImprove = [];

  // Separate strong and weak skills
  skillMap.forEach((data, skill) => {
    if (data.percentage >= 80) {
      strongSkills.push({
        skill,
        ...data,
      });
    } else {
      skillsToImprove.push({
        skill,
        ...data,
      });
    }
  });

  // Get skills according to priority
  const prioritySkills = gapHeap.getPrioritySkills();

  return {
    totalSkills: skillMap.size,
    strongSkills,
    skillsToImprove,
    prioritySkills,
  };
};

module.exports = evaluateSkills;