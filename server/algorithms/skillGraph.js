// Skill Dependency Graph
// Graph is represented using an adjacency list

class SkillGraph {
  constructor() {
    this.graph = new Map();
  }

  // Add a skill/node
  addSkill(skill) {
    if (!this.graph.has(skill)) {
      this.graph.set(skill, []);
    }
  }

  // Add dependency
  // prerequisite -> skill
  addDependency(prerequisite, skill) {
    this.addSkill(prerequisite);
    this.addSkill(skill);

    this.graph.get(prerequisite).push(skill);
  }

  // Get skills that depend on a given skill
  getNextSkills(skill) {
    return this.graph.get(skill) || [];
  }

  // Get complete graph
  getGraph() {
    return this.graph;
  }
}
// Create default skill dependency graph
const createSkillGraph = () => {
  const skillGraph = new SkillGraph();

  // Web Development
  skillGraph.addDependency("HTML", "CSS");
  skillGraph.addDependency("CSS", "JavaScript");
  skillGraph.addDependency("JavaScript", "React");
  skillGraph.addDependency("React", "Node.js");
  skillGraph.addDependency("Node.js", "Express");
  skillGraph.addDependency("Express", "MongoDB");

  // Programming / DSA
  skillGraph.addDependency("Java", "DSA");
  skillGraph.addDependency("DSA", "Advanced DSA");

  // AI / ML
  skillGraph.addDependency("Python", "Machine Learning");
  skillGraph.addDependency("Machine Learning", "Deep Learning");

  return skillGraph;
};
const testGraph = createSkillGraph();

console.log("Skills after HTML:", testGraph.getNextSkills("HTML"));

console.log("Skills after JavaScript:", testGraph.getNextSkills("JavaScript"));

console.log("Skills after React:", testGraph.getNextSkills("React"));

module.exports = {
  SkillGraph,
  createSkillGraph,
};
