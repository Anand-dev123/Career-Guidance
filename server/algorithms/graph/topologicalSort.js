// Topological Sort
// Used to find the correct prerequisite-based
// learning order of skills.

const topologicalSort = (graph) => {
  const inDegree = new Map();
  const queue = [];
  const result = [];

  // Initialize in-degree of every skill
  for (const skill of graph.graph.keys()) {
    inDegree.set(skill, 0);
  }

  // Calculate in-degree
  for (const [skill, nextSkills] of graph.graph) {
    for (const nextSkill of nextSkills) {
      inDegree.set(nextSkill, inDegree.get(nextSkill) + 1);
    }
  }

  // Add skills with no prerequisites
  for (const [skill, degree] of inDegree) {
    if (degree === 0) {
      queue.push(skill);
    }
  }

  // Process skills
  while (queue.length > 0) {
    const currentSkill = queue.shift();

    result.push(currentSkill);

    const nextSkills = graph.getNextSkills(currentSkill);

    for (const nextSkill of nextSkills) {
      inDegree.set(nextSkill, inDegree.get(nextSkill) - 1);

      if (inDegree.get(nextSkill) === 0) {
        queue.push(nextSkill);
      }
    }
  }

  // Cycle detection
  if (result.length !== inDegree.size) {
    return {
      success: false,
      message: "Cycle detected in skill dependencies",
      learningOrder: [],
    };
  }

  return {
    success: true,
    message: "Learning order generated successfully",
    learningOrder: result,
  };
};
// Get personalized learning order for selected skills
const getPersonalizedLearningOrder = (graph, targetSkills) => {
  const allSkills = new Set();

  // Find all prerequisite paths
  const collectPrerequisites = (skill) => {
    for (const [parent, children] of graph.graph) {
      if (children.includes(skill)) {
        if (!allSkills.has(parent)) {
          allSkills.add(parent);
          collectPrerequisites(parent);
        }
      }
    }

    allSkills.add(skill);
  };

  targetSkills.forEach((skill) => {
    collectPrerequisites(skill);
  });

  // Create filtered graph
  const filteredGraph = new Map();

  for (const skill of allSkills) {
    filteredGraph.set(skill, []);
  }

  for (const [skill, nextSkills] of graph.graph) {
    if (!allSkills.has(skill)) {
      continue;
    }

    for (const nextSkill of nextSkills) {
      if (allSkills.has(nextSkill)) {
        filteredGraph.get(skill).push(nextSkill);
      }
    }
  }

  // Calculate in-degree
  const inDegree = new Map();

  for (const skill of filteredGraph.keys()) {
    inDegree.set(skill, 0);
  }

  for (const nextSkills of filteredGraph.values()) {
    for (const nextSkill of nextSkills) {
      inDegree.set(nextSkill, inDegree.get(nextSkill) + 1);
    }
  }

  // Queue skills with no prerequisites
  const queue = [];

  for (const [skill, degree] of inDegree) {
    if (degree === 0) {
      queue.push(skill);
    }
  }

  const learningOrder = [];

  while (queue.length > 0) {
    const currentSkill = queue.shift();

    learningOrder.push(currentSkill);

    const nextSkills = filteredGraph.get(currentSkill) || [];

    for (const nextSkill of nextSkills) {
      inDegree.set(nextSkill, inDegree.get(nextSkill) - 1);

      if (inDegree.get(nextSkill) === 0) {
        queue.push(nextSkill);
      }
    }
  }

  return learningOrder;
};

module.exports = {
  topologicalSort,
  getPersonalizedLearningOrder,
};
