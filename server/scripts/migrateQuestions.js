const mongoose = require("mongoose");
require("dotenv").config();

const migrateQuestions = async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Source database
        const sourceDB = mongoose.connection.useDb("test");

        // Target database
        const targetDB = mongoose.connection.useDb(
            "career_guidance"
        );

        // Get questions collections
        const sourceCollection =
            sourceDB.collection("questions");

        const targetCollection =
            targetDB.collection("questions");

        // Get all questions from test database
        const questions =
            await sourceCollection.find({}).toArray();

        console.log(
            `Found ${questions.length} questions in test.questions`
        );

        if (questions.length === 0) {
            console.log("No questions found.");
            return;
        }

        // Copy questions without creating duplicates
        const operations = questions.map((question) => ({
            updateOne: {
                filter: {
                    _id: question._id,
                },
                update: {
                    $setOnInsert: question,
                },
                upsert: true,
            },
        }));

        const result =
            await targetCollection.bulkWrite(
                operations
            );

        console.log(
            `Inserted: ${result.upsertedCount}`
        );

        console.log(
            `Already existed: ${result.matchedCount}`
        );

        // Final count
        const finalCount =
            await targetCollection.countDocuments();

        console.log(
            `career_guidance.questions now has ${finalCount} questions`
        );

    } catch (error) {
        console.error(
            "Migration failed:",
            error.message
        );
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    }
};

migrateQuestions();