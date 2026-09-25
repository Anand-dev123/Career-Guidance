const { buildSkillGraph } = require("./skillGraph");
const { topologicalSort } = require("./graph/topologicalSort");

const getPersonalizedRoadmap = (
    roadmapSteps,
    userSkills = {}
) => {
    if (!roadmapSteps || roadmapSteps.length === 0) {
        return [];
    }

    const graph = buildSkillGraph();

    // Skills already known by the student
    const knownSkills = new Set();

    Object.entries(userSkills).forEach(
        ([skill, score]) => {
            if (Number(score) >= 2) {
                knownSkills.add(skill);
            }
        }
    );

    // Find roadmap skills
    const roadmapSkills = [];

    roadmapSteps.forEach((step) => {
        step.skills.forEach((skill) => {
            if (!roadmapSkills.includes(skill)) {
                roadmapSkills.push(skill);
            }
        });
    });

    // Add prerequisite relationships
    roadmapSteps.forEach((step) => {
        step.prerequisites.forEach(
            (prerequisite) => {
                step.skills.forEach((skill) => {
                    graph.addEdge(
                        prerequisite,
                        skill
                    );
                });
            }
        );
    });

    // Get learning order
    const learningOrder =
        topologicalSort(graph);

    // Skills that still need to be learned
    const requiredSkills =
        roadmapSkills.filter(
            (skill) =>
                !knownSkills.has(skill)
        );

    // Map skills to roadmap steps
    const personalizedSteps =
        roadmapSteps
            .filter((step) =>
                step.skills.some(
                    (skill) =>
                        requiredSkills.includes(
                            skill
                        )
                )
            )
            .sort((a, b) => {
                const aIndex =
                    learningOrder.indexOf(
                        a.skills[0]
                    );

                const bIndex =
                    learningOrder.indexOf(
                        b.skills[0]
                    );

                if (
                    aIndex === -1 &&
                    bIndex === -1
                ) {
                    return a.order - b.order;
                }

                if (aIndex === -1) return 1;
                if (bIndex === -1) return -1;

                return aIndex - bIndex;
            });

    return personalizedSteps;
};

module.exports = {
    getPersonalizedRoadmap
};