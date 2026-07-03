import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "kafka-service",
    brokers: ["localhost:9094"],
});

const admin = kafka.admin();

const topics = ["venue-created", "venue-approved", "booking-successfull"];

const run = async () => {
    await admin.connect();

    const existing = await admin.listTopics();
    const toCreate = topics.filter((topic) => !existing.includes(topic));

    if (toCreate.length === 0) {
        console.log("All topics already exist:", topics.join(", "));
    } else {
        await admin.createTopics({
            topics: toCreate.map((topic) => ({ topic })),
        });
        console.log("Created topics:", toCreate.join(", "));
    }

    await admin.disconnect();
};

run().catch(async (err) => {
    console.error("Failed to create topics:", err);
    await admin.disconnect();
    process.exit(1);
});
