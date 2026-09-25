// Depth-First Search (DFS)
// Used to deeply explore skill dependencies

const dfs = (graph, startSkill) => {
  const visited = new Set();
  const result = [];

  const traverse = (skill) => {
    if (visited.has(skill)) {
      return;
    }

    visited.add(skill);
    result.push(skill);

    const nextSkills = graph.getNextSkills(skill);

    for (const nextSkill of nextSkills) {
      traverse(nextSkill);
    }
  };

  traverse(startSkill);

  return result;
};

module.exports = dfs;