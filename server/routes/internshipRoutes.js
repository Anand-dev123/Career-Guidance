const express = require("express");

const Internship = require("../models/Internship");
const User = require("../models/User");
const Assessment = require("../models/Assessment");
const Roadmap = require("../models/Roadmap");

const protect = require("../middleware/authMiddleware");

const {
  getAdzunaJobs,
} = require("../services/adzunaService");

const calculateInternshipMatch = require("../algorithms/internshipMatching");

const router = express.Router();

// ======================================================
// ADZUNA CACHE
// ======================================================

// Cache helps prevent repeated Adzuna API calls
// when the user refreshes the page multiple times.

const adzunaCache = {
  liveJobs: null,
  liveJobsTime: 0,

  recommendations: new Map(),
};

// Cache duration = 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// ======================================================
// CAREER SEARCH KEYWORDS
// ======================================================

const careerSearches = [
  {
    career: "Software Developer",
    keyword: "software developer internship",
  },
  {
    career: "Full Stack Developer",
    keyword: "full stack developer internship",
  },
  {
    career: "Data Scientist",
    keyword: "data science internship",
  },
  {
    career: "AI/ML Engineer",
    keyword: "machine learning internship",
  },
  {
    career: "DevOps Engineer",
    keyword: "devops internship",
  },
  {
    career: "Cybersecurity Analyst",
    keyword: "cybersecurity internship",
  },
];

// ======================================================
// DETECT CAREER
// ======================================================

const detectCareer = (
  job,
  requestedCareer
) => {
  const title = (
    job.title || ""
  ).toLowerCase();

  const description = (
    job.description || ""
  ).toLowerCase();

  const text =
    `${title} ${description}`;

  // Full Stack
  if (
    text.includes("full stack") ||
    text.includes("full-stack") ||
    text.includes("mern") ||
    text.includes("mean stack")
  ) {
    return "Full Stack Developer";
  }

  // AI / ML
  if (
    text.includes("machine learning") ||
    text.includes("machine-learning") ||
    text.includes(
      "artificial intelligence"
    ) ||
    text.includes("ai/ml") ||
    text.includes("ai ml") ||
    text.includes("deep learning") ||
    text.includes("generative ai") ||
    text.includes("gen ai")
  ) {
    return "AI/ML Engineer";
  }

  // Data Scientist
  if (
    text.includes("data scientist") ||
    text.includes("data science") ||
    text.includes("data analytics") ||
    text.includes("data analyst")
  ) {
    return "Data Scientist";
  }

  // DevOps
  if (
    text.includes("devops") ||
    text.includes("dev ops") ||
    text.includes("cloud engineer") ||
    text.includes(
      "site reliability"
    ) ||
    text.includes("sre") ||
    text.includes("kubernetes") ||
    text.includes("docker")
  ) {
    return "DevOps Engineer";
  }

  // Cybersecurity
  if (
    text.includes("cybersecurity") ||
    text.includes("cyber security") ||
    text.includes(
      "security analyst"
    ) ||
    text.includes(
      "information security"
    ) ||
    text.includes("infosec") ||
    text.includes(
      "penetration testing"
    ) ||
    text.includes(
      "ethical hacking"
    )
  ) {
    return "Cybersecurity Analyst";
  }

  // Software Developer
  if (
    text.includes(
      "software developer"
    ) ||
    text.includes(
      "software engineer"
    ) ||
    text.includes(
      "software development"
    ) ||
    text.includes(
      "frontend developer"
    ) ||
    text.includes(
      "front-end developer"
    ) ||
    text.includes(
      "backend developer"
    ) ||
    text.includes(
      "back-end developer"
    ) ||
    text.includes(
      "web developer"
    ) ||
    text.includes(
      "react developer"
    ) ||
    text.includes(
      "node.js developer"
    ) ||
    text.includes(
      "java developer"
    )
  ) {
    return "Software Developer";
  }

  return (
    requestedCareer ||
    "Software Developer"
  );
};

// ======================================================
// EXTRACT SKILLS
// ======================================================

const extractSkills = (job) => {
  const text = `
    ${job.title || ""}
    ${job.description || ""}
  `.toLowerCase();

  const skillMap = [
    {
      name: "JavaScript",
      keywords: [
        "javascript",
        "js",
      ],
    },
    {
      name: "React",
      keywords: [
        "react",
        "react.js",
        "reactjs",
      ],
    },
    {
      name: "Node.js",
      keywords: [
        "node.js",
        "nodejs",
        "node js",
      ],
    },
    {
      name: "Java",
      keywords: [
        "java",
      ],
    },
    {
      name: "Python",
      keywords: [
        "python",
      ],
    },
    {
      name: "C++",
      keywords: [
        "c++",
      ],
    },
    {
      name: "HTML",
      keywords: [
        "html",
      ],
    },
    {
      name: "CSS",
      keywords: [
        "css",
      ],
    },
    {
      name: "MongoDB",
      keywords: [
        "mongodb",
        "mongo db",
      ],
    },
    {
      name: "SQL",
      keywords: [
        "sql",
        "mysql",
        "postgresql",
      ],
    },
    {
      name: "Git",
      keywords: [
        "git",
        "github",
      ],
    },
    {
      name: "Express.js",
      keywords: [
        "express.js",
        "expressjs",
        "express js",
      ],
    },
    {
      name: "AWS",
      keywords: [
        "aws",
        "amazon web services",
      ],
    },
    {
      name: "Azure",
      keywords: [
        "azure",
      ],
    },
    {
      name: "Docker",
      keywords: [
        "docker",
      ],
    },
    {
      name: "Kubernetes",
      keywords: [
        "kubernetes",
        "k8s",
      ],
    },
    {
      name: "Machine Learning",
      keywords: [
        "machine learning",
        "machine-learning",
      ],
    },
    {
      name: "TensorFlow",
      keywords: [
        "tensorflow",
      ],
    },
    {
      name: "PyTorch",
      keywords: [
        "pytorch",
      ],
    },
    {
      name: "Spring Boot",
      keywords: [
        "spring boot",
        "springboot",
      ],
    },
  ];

  const detectedSkills = [];

  skillMap.forEach(
    (skill) => {
      const found =
        skill.keywords.some(
          (keyword) =>
            text.includes(keyword)
        );

      if (found) {
        detectedSkills.push(
          skill.name
        );
      }
    }
  );

  return detectedSkills;
};

// ======================================================
// EXTRACT SALARY FROM DESCRIPTION
// ======================================================

const extractSalaryFromDescription = (
  description
) => {
  if (!description) {
    return null;
  }

  const text =
    description.replace(
      /\s+/g,
      " "
    );

  const patterns = [
    /(?:stipend|salary)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)\s*(?:per|\/)\s*month/i,

    /(?:₹|rs\.?|inr)\s*([\d,]+)\s*(?:per|\/)\s*month/i,

    /(?:stipend|salary)\s*(?:of)?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i,
  ];

  for (
    const pattern of patterns
  ) {
    const match =
      text.match(pattern);

    if (
      match &&
      match[1]
    ) {
      const amount =
        match[1].replace(
          /,/g,
          ""
        );

      return `₹${Number(
        amount
      ).toLocaleString(
        "en-IN"
      )}/month`;
    }
  }

  return null;
};

// ======================================================
// FORMAT SALARY
// ======================================================

const formatSalary = (
  job
) => {
  const descriptionSalary =
    extractSalaryFromDescription(
      job.description
    );

  if (descriptionSalary) {
    return descriptionSalary;
  }

  const min =
    job.salary_min;

  const max =
    job.salary_max;

  if (min && max) {
    return `${Number(
      min
    ).toLocaleString(
      "en-IN"
    )} - ${Number(
      max
    ).toLocaleString(
      "en-IN"
    )}`;
  }

  if (min) {
    return `${Number(
      min
    ).toLocaleString(
      "en-IN"
    )}+`;
  }

  if (max) {
    return `Up to ${Number(
      max
    ).toLocaleString(
      "en-IN"
    )}`;
  }

  return "Not specified";
};

// ======================================================
// DETECT JOB TYPE
// ======================================================

const detectJobType = (
  job
) => {
  const text = `
    ${job.title || ""}
    ${job.description || ""}
  `.toLowerCase();

  if (
    text.includes(
      "internship"
    ) ||
    text.includes("intern")
  ) {
    return "Internship";
  }

  if (
    job.contract_time ===
    "part_time"
  ) {
    return "Part-time";
  }

  if (
    job.contract_time ===
    "full_time"
  ) {
    return "Full-time";
  }

  return "Not specified";
};

// ======================================================
// DETECT MODE
// ======================================================

const detectMode = (
  job
) => {
  const text = `
    ${job.title || ""}
    ${job.description || ""}
  `.toLowerCase();

  if (
    text.includes("remote") ||
    text.includes(
      "work from home"
    ) ||
    text.includes("wfh")
  ) {
    return "Remote";
  }

  if (
    text.includes("hybrid")
  ) {
    return "Hybrid";
  }

  return "On-site";
};

// ======================================================
// EXTRACT DURATION
// ======================================================

const extractDuration = (
  description
) => {
  if (!description) {
    return "Not specified";
  }

  const text =
    description.replace(
      /\s+/g,
      " "
    );

  const patterns = [
    /duration\s+(\d+)\s*(month|months)/i,

    /(\d+)\s*(month|months)\s*(internship|intern)/i,

    /(\d+)\s*(week|weeks)\s*(internship|intern)/i,
  ];

  for (
    const pattern of patterns
  ) {
    const match =
      text.match(pattern);

    if (match) {
      return `${match[1]} ${match[2]}`;
    }
  }

  return "Not specified";
};

// ======================================================
// CHECK INTERNSHIP
// ======================================================

const isInternship = (
  job
) => {
  const text = `
    ${job.title || ""}
    ${job.description || ""}
  `.toLowerCase();

  return (
    text.includes("intern") ||
    text.includes("trainee") ||
    text.includes(
      "apprentice"
    )
  );
};

// ======================================================
// CONVERT ADZUNA JOB
// ======================================================

const convertAdzunaJob = (
  job,
  requestedCareer
) => {
  const career =
    detectCareer(
      job,
      requestedCareer
    );

  const skills =
    extractSkills(job);

  return {
    _id:
      `adzuna-${job.id || job.adref}`,

    title:
      job.title ||
      "Internship Opportunity",

    company:
      job.company
        ?.display_name ||
      "Company not specified",

    description:
      job.description ||
      "No description available.",

    location:
      job.location
        ?.display_name ||
      "India",

    mode:
      detectMode(job),

    career,

    skills,

    duration:
      extractDuration(
        job.description
      ),

    jobType:
      detectJobType(job),

    stipend:
      formatSalary(job),

    applyUrl:
      job.redirect_url ||
      "#",

    source:
      "Adzuna",

    isActive:
      true,

    deadline:
      null,

    createdAt:
      job.created ||
      null,
  };
};

// ======================================================
// TEST ADZUNA API
// ======================================================

router.get(
  "/test/adzuna",
  protect,
  async (req, res) => {
    try {
      const data =
        await getAdzunaJobs({
          keyword:
            "software developer internship",

          location:
            "India",

          page: 1,

          resultsPerPage: 5,
        });

      res.json({
        success: true,

        count:
          data.count,

        jobs:
          data.results,
      });
    } catch (error) {
      console.error(
        "Adzuna test failed:",
        error.message
      );

      res.status(500).json({
        success: false,

        message:
          "Adzuna API test failed",

        error:
          error.message,
      });
    }
  }
);

// ======================================================
// GET LIVE INTERNSHIPS
// ======================================================

router.get(
  "/live",
  protect,
  async (req, res) => {
    try {
      // ------------------------------------------------
      // CHECK CACHE
      // ------------------------------------------------

      const now =
        Date.now();

      if (
        adzunaCache.liveJobs &&
        now -
          adzunaCache.liveJobsTime <
            CACHE_DURATION
      ) {
        console.log(
          "Returning live internships from cache."
        );

        return res.json({
          ...adzunaCache.liveJobs,

          cached:
            true,
        });
      }

      // ------------------------------------------------
      // Fetch all six career categories
      // ------------------------------------------------

      const results =
        await Promise.allSettled(
          careerSearches.map(
            async (
              search
            ) => {
              const data =
                await getAdzunaJobs({
                  keyword:
                    search.keyword,

                  location:
                    "India",

                  page: 1,

                  resultsPerPage: 10,
                });

              return {
                requestedCareer:
                  search.career,

                results:
                  data.results ||
                  [],
              };
            }
          )
        );

      // ------------------------------------------------
      // Combine successful results
      // ------------------------------------------------

      const allJobs = [];

      results.forEach(
        (result) => {
          if (
            result.status ===
            "fulfilled"
          ) {
            const {
              requestedCareer,
              results:
                jobs,
            } =
              result.value;

            jobs.forEach(
              (job) => {
                allJobs.push({
                  job,

                  requestedCareer,
                });
              }
            );
          } else {
            console.error(
              "One Adzuna career search failed:",
              result.reason
                ?.message ||
                result.reason
            );
          }
        }
      );

      // ------------------------------------------------
      // Keep internships only
      // ------------------------------------------------

      const internshipJobs =
        allJobs.filter(
          ({
            job,
          }) =>
            isInternship(job)
        );

      // ------------------------------------------------
      // Convert jobs
      // ------------------------------------------------

      const convertedJobs =
        internshipJobs.map(
          ({
            job,
            requestedCareer,
          }) =>
            convertAdzunaJob(
              job,
              requestedCareer
            )
        );

      // ------------------------------------------------
      // Remove duplicates
      // ------------------------------------------------

      const uniqueJobs =
        new Map();

      convertedJobs.forEach(
        (job) => {
          const uniqueKey =
            job.applyUrl !== "#"
              ? job.applyUrl
              : `${job.title}-${job.company}-${job.location}`;

          if (
            !uniqueJobs.has(
              uniqueKey
            )
          ) {
            uniqueJobs.set(
              uniqueKey,
              job
            );
          }
        }
      );

      const finalJobs =
        Array.from(
          uniqueJobs.values()
        );

      // ------------------------------------------------
      // Sort internships first
      // ------------------------------------------------

      finalJobs.sort(
        (a, b) => {
          if (
            a.jobType ===
              "Internship" &&
            b.jobType !==
              "Internship"
          ) {
            return -1;
          }

          if (
            a.jobType !==
              "Internship" &&
            b.jobType ===
              "Internship"
          ) {
            return 1;
          }

          return a.title.localeCompare(
            b.title
          );
        }
      );

      // ------------------------------------------------
      // Prepare response
      // ------------------------------------------------

      const responseData = {
        success:
          true,

        count:
          finalJobs.length,

        careers:
          careerSearches.map(
            (item) =>
              item.career
          ),

        jobs:
          finalJobs,
      };

      // ------------------------------------------------
      // SAVE CACHE
      // ------------------------------------------------

      adzunaCache.liveJobs =
        responseData;

      adzunaCache.liveJobsTime =
        Date.now();

      console.log(
        "Live internships fetched from Adzuna and cached."
      );

      res.json({
        ...responseData,

        cached:
          false,
      });
    } catch (error) {
      console.error(
        "Failed to fetch live internships:",
        error.message
      );

      res.status(500).json({
        success:
          false,

        message:
          "Failed to fetch live internships",
      });
    }
  }
);

// ======================================================
// GET PERSONALIZED INTERNSHIP RECOMMENDATIONS
// ======================================================

router.get(
  "/recommended",
  protect,
  async (req, res) => {
    try {
      // ------------------------------------------------
      // Get logged-in user
      // ------------------------------------------------

      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          success:
            false,

          message:
            "User not found",
        });
      }

      const targetCareer =
        user.targetCareer;

      if (!targetCareer) {
        return res.status(400).json({
          success:
            false,

          message:
            "Please select your target career first.",
        });
      }

      // ------------------------------------------------
      // Recommendation cache key
      // ------------------------------------------------

      const recommendationCacheKey =
        `${req.userId}-${targetCareer}`;

      const cachedRecommendation =
        adzunaCache.recommendations.get(
          recommendationCacheKey
        );

      if (
        cachedRecommendation &&
        Date.now() -
          cachedRecommendation.time <
            CACHE_DURATION
      ) {
        console.log(
          "Returning internship recommendations from cache."
        );

        return res.json({
          ...cachedRecommendation.data,

          cached:
            true,
        });
      }

      // ------------------------------------------------
      // Get latest assessment
      // ------------------------------------------------

      const latestAssessment =
        await Assessment.findOne({
          user:
            req.userId,
        }).sort({
          createdAt:
            -1,
        });

      const userSkills =
        latestAssessment
          ?.skillResults ||
        [];

      // ------------------------------------------------
      // Get target career roadmap
      // ------------------------------------------------

      const roadmapSteps =
        await Roadmap.find({
          career:
            targetCareer,
        }).select(
          "skills"
        );

      // ------------------------------------------------
      // Combine roadmap skills
      // ------------------------------------------------

      const roadmapSkills = [
        ...new Set(
          roadmapSteps.flatMap(
            (step) =>
              step.skills ||
              []
          )
        ),
      ];

      // ------------------------------------------------
      // Find career search
      // ------------------------------------------------

      const careerSearch =
        careerSearches.find(
          (item) =>
            item.career ===
            targetCareer
        );

      if (!careerSearch) {
        return res.status(400).json({
          success:
            false,

          message:
            "Internship recommendations are not available for this career yet.",
        });
      }

      // ------------------------------------------------
      // Fetch live internships
      // ------------------------------------------------

      const data =
        await getAdzunaJobs({
          keyword:
            careerSearch.keyword,

          location:
            "India",

          page: 1,

          resultsPerPage: 20,
        });

      // ------------------------------------------------
      // Keep internships only
      // ------------------------------------------------

      const internshipJobs =
        (
          data.results ||
          []
        ).filter(
          (job) =>
            isInternship(job)
        );

      // ------------------------------------------------
      // Convert jobs
      // ------------------------------------------------

      const convertedJobs =
        internshipJobs.map(
          (job) =>
            convertAdzunaJob(
              job,
              targetCareer
            )
        );

      // ------------------------------------------------
      // Remove duplicates
      // ------------------------------------------------

      const uniqueJobs =
        new Map();

      convertedJobs.forEach(
        (job) => {
          const key =
            job.applyUrl !== "#"
              ? job.applyUrl
              : `${job.title}-${job.company}-${job.location}`;

          if (
            !uniqueJobs.has(
              key
            )
          ) {
            uniqueJobs.set(
              key,
              job
            );
          }
        }
      );

      const internships =
        Array.from(
          uniqueJobs.values()
        );

      // ------------------------------------------------
      // Calculate personalized match
      // ------------------------------------------------

      const recommendations =
        internships.map(
          (
            internship
          ) => {
            const matching =
              calculateInternshipMatch(
                {
                  internship,

                  targetCareer,

                  userSkills,

                  roadmapSkills,
                }
              );

            return {
              ...internship,

              ...matching,
            };
          }
        );

      // ------------------------------------------------
      // Sort highest match first
      // ------------------------------------------------

      recommendations.sort(
        (a, b) =>
          b.matchPercentage -
          a.matchPercentage
      );

      // ------------------------------------------------
      // Prepare response
      // ------------------------------------------------

      const responseData = {
        success:
          true,

        targetCareer,

        assessmentAvailable:
          Boolean(
            latestAssessment
          ),

        assessedSkills:
          userSkills.length,

        roadmapSkillsCount:
          roadmapSkills.length,

        roadmapSkills,

        count:
          recommendations.length,

        recommendations,
      };

      // ------------------------------------------------
      // SAVE RECOMMENDATION CACHE
      // ------------------------------------------------

      adzunaCache.recommendations.set(
        recommendationCacheKey,
        {
          time:
            Date.now(),

          data:
            responseData,
        }
      );

      console.log(
        "Internship recommendations calculated and cached."
      );

      res.json({
        ...responseData,

        cached:
          false,
      });
    } catch (error) {
      console.error(
        "Failed to generate internship recommendations:",
        error.message
      );

      res.status(500).json({
        success:
          false,

        message:
          "Failed to generate internship recommendations",
      });
    }
  }
);

// ======================================================
// GET ALL ACTIVE DATABASE INTERNSHIPS
// ======================================================

router.get(
  "/",
  protect,
  async (req, res) => {
    try {
      const internships =
        await Internship.find({
          isActive:
            true,
        }).sort({
          deadline:
            1,

          createdAt:
            -1,
        });

      res.json(
        internships
      );
    } catch (error) {
      console.error(
        "Failed to fetch internships:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch internships",
      });
    }
  }
);

// ======================================================
// GET INTERNSHIPS BY CAREER
// ======================================================

router.get(
  "/career/:career",
  protect,
  async (req, res) => {
    try {
      const career =
        decodeURIComponent(
          req.params.career
        );

      const internships =
        await Internship.find({
          career,

          isActive:
            true,
        }).sort({
          deadline:
            1,

          createdAt:
            -1,
        });

      res.json(
        internships
      );
    } catch (error) {
      console.error(
        "Failed to fetch career internships:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch career internships",
      });
    }
  }
);

// ======================================================
// GET INTERNSHIPS BY SKILL
// ======================================================

router.get(
  "/skill/:skill",
  protect,
  async (req, res) => {
    try {
      const skill =
        decodeURIComponent(
          req.params.skill
        );

      const internships =
        await Internship.find({
          skills:
            skill,

          isActive:
            true,
        }).sort({
          deadline:
            1,

          createdAt:
            -1,
        });

      res.json(
        internships
      );
    } catch (error) {
      console.error(
        "Failed to fetch skill internships:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch skill internships",
      });
    }
  }
);

// ======================================================
// GET SINGLE INTERNSHIP
// ======================================================

router.get(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const internship =
        await Internship.findOne({
          _id:
            req.params.id,

          isActive:
            true,
        });

      if (!internship) {
        return res.status(404).json({
          message:
            "Internship not found",
        });
      }

      res.json(
        internship
      );
    } catch (error) {
      console.error(
        "Failed to fetch internship:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch internship",
      });
    }
  }
);

module.exports = router;