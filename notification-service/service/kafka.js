const { Kafka } = require("kafkajs");

console.log("[KAFKA] Connecting...")
const kafkaClient = new Kafka({clientId: "notification-service", brokers: ["kafka:9092"]});
console.log("[KAFKA] Connected")

const producer = kafkaClient.producer();

/**
 * Asynchronously produces a message to Kafka.
 * @param {string} userId - The UUID string representing the user ID.
 * @param {string} message - The message string to be sent to Kafka.
 * @returns {Promise<void>}
 */
async function produceMessage(userId, message) {
  try {
    await producer.connect();
    await producer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [
        { key: userId, value: JSON.stringify({ userId, message }) }
      ]
    });
  } catch (error) {
    console.error("failed to produce message: ", error);
  } finally {
    producer.disconnect()
  }
}


/**
 * Creates a Kafka topic if it does not already exist.
 * This function should be invoked once at application startup.
 * @returns {Promise<void>}
 */
async function createTopic() {
  const admin = kafkaClient.admin();
  try {
    let topicName = process.env.KAFKA_TOPIC;
    await admin.connect();

    const topicConfig = {
      topic: topicName,
      numPartitions: 1,
      replicationFactor: 1
    };

    let created = await admin.createTopics({ topics: [topicConfig] });
    
    if (created) console.log("[KAFKA] notifications topic created");
  } catch (error) {
    throw error;
  } finally {
    await admin.disconnect();
  }
}

module.exports.produceMessage = produceMessage;
module.exports.createTopic = createTopic;
