// Breadth-First Search (BFS)
// Used to find the nearest skills in the dependency graph

const bfs = (graph, startSkill) => {
  const queue = [];
  const visited = new Set();
  const result = [];

  queue.push(startSkill);
  visited.add(startSkill);

  while (queue.length > 0) {
    const currentSkill = queue.shift();

    result.push(currentSkill);

    const nextSkills = graph.getNextSkills(currentSkill);

    for (const skill of nextSkills) {
      if (!visited.has(skill)) {
        visited.add(skill);
        queue.push(skill);
      }
    }
  }

  return result;
};

module.exports = bfs;
