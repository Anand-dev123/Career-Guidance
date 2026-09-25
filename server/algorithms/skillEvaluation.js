const MaxHeap = require("./maxHeap");

const { createSkillGraph } = require("./skillGraph");

const bfs = require("./graph/bfs");
const dfs = require("./graph/dfs");

const {
  topologicalSort,
  getPersonalizedLearningOrder,
} = require("./graph/topologicalSort");

// ==========================================
// Skill Evaluation Engine
// HashMap + Max Heap + Graph + BFS + DFS
// + Topological Sort
// ==========================================

const evaluateSkills = (skillResults) => {
  // ------------------------------------------
  // 1. HashMap
  // Store all skill results for fast lookup
  // ------------------------------------------

  const skillMap = new Map();

  // ------------------------------------------
  // 2. Max Heap
  // Used to prioritize skill gaps
  // ------------------------------------------

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

    // ------------------------------------------
    // Calculate skill-gap priority
    // Lower percentage = higher priority
    // ------------------------------------------

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

  // ------------------------------------------
  // 3. Separate Strong Skills
  //    and Skills To Improve
  // ------------------------------------------

  const strongSkills = [];
  const skillsToImprove = [];

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

  // ------------------------------------------
  // 4. Get Priority Skills
  //    using Max Heap
  // ------------------------------------------

  const prioritySkills = gapHeap.getPrioritySkills();

  // ------------------------------------------
  // 5. Create Skill Dependency Graph
  // ------------------------------------------

  const skillGraph = createSkillGraph();

  // ------------------------------------------
  // 6. Topological Sort
  //    Finds prerequisite-based order
  // ------------------------------------------

  const topologicalResult = topologicalSort(skillGraph);

  // ------------------------------------------
  // 7. Personalized Learning Order
  //    Based on skills needing improvement
  // ------------------------------------------

  const personalizedLearningOrder =
    getPersonalizedLearningOrder(
      skillGraph,
      skillsToImprove.map((skill) => skill.skill)
    );

  // ------------------------------------------
  // 8. BFS + DFS Learning Paths
  // ------------------------------------------

  const learningPaths = [];

  skillsToImprove.forEach((skillData) => {
    const skill = skillData.skill;

    // Breadth First Search
    const bfsPath = bfs(skillGraph, skill);

    // Depth First Search
    const dfsPath = dfs(skillGraph, skill);

    learningPaths.push({
      skill,
      bfsPath,
      dfsPath,
    });
  });

  // ------------------------------------------
  // 9. Return Complete Skill Analysis
  // ------------------------------------------

  return {
    totalSkills: skillMap.size,

    // Strong skills
    strongSkills,

    // Skills that need improvement
    skillsToImprove,

    // Highest priority skill gaps
    prioritySkills,

    // BFS + DFS learning paths
    learningPaths,

    // Personalized prerequisite order
    learningOrder: personalizedLearningOrder,

    // Complete topological order
    topologicalOrder: topologicalResult,
  };
};

// Export function
module.exports = evaluateSkills;