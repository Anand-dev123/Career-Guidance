// AI Resume Analysis Service

const analyzeResumeText = async (resumeText) => {
    if (!resumeText || !resumeText.trim()) {
        throw new Error("Resume text is required");
    }

    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const model =
        process.env.AI_MODEL || "gemini-3.8-flash";

    const resumeSchema = {
        type: "object",
        properties: {
            skills: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        level: { type: "string" },
                        evidence: { type: "string" }
                    },
                    required: [
                        "name",
                        "level",
                        "evidence"
                    ]
                }
            },

            education: {
                type: "array",
                items: { type: "string" }
            },

            experience: {
                type: "array",
                items: { type: "string" }
            },

            projects: {
                type: "array",
                items: { type: "string" }
            },

            certifications: {
                type: "array",
                items: { type: "string" }
            },

            strengths: {
                type: "array",
                items: { type: "string" }
            },

            missingSkills: {
                type: "array",
                items: { type: "string" }
            },

            suggestions: {
                type: "array",
                items: { type: "string" }
            },

            careerMatches: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        career: { type: "string" },
                        reason: { type: "string" }
                    },
                    required: [
                        "career",
                        "reason"
                    ]
                }
            }
        },

        required: [
            "skills",
            "education",
            "experience",
            "projects",
            "certifications",
            "strengths",
            "missingSkills",
            "suggestions",
            "careerMatches"
        ]
    };

    const prompt = `
You are an AI Career Guidance Resume Analyzer.

Analyze the following resume.

Resume:
${resumeText}

Rules:

1. Extract only information supported by the resume.
2. Do not invent education, experience, projects or certifications.
3. Identify technical and soft skills.
4. Estimate skill level only from evidence available in the resume.
5. Identify useful missing skills for suitable technology careers.
6. Give practical career improvement suggestions.
7. Suggest suitable technology careers based on the resume.
8. Keep the analysis concise and useful for a college student.
`;

    try {

        const interaction =
            await ai.interactions.create({
                model,
                input: prompt,
                store: false,

                response_format: {
                    type: "text",
                    mime_type: "application/json",
                    schema: resumeSchema
                }
            });

        const text =
            interaction.output_text;

        if (!text) {
            throw new Error(
                "Gemini returned an empty response"
            );
        }

        const analysis =
            JSON.parse(text);

        return analysis;

    } catch (error) {

        console.error(
            "Gemini resume analysis error:",
            error.message
        );

        throw new Error(
            "Failed to analyze resume with AI"
        );
    }
};

module.exports = {
    analyzeResumeText
};