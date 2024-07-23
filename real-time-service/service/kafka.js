const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'real-time-service-consumer',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: "con1" });

// Function to connect and consume messages

/*
 * Runs a Kafka consumer that listens for messages on a specified topic,
 * processes each message, and emits notifications to clients via Socket.IO room.
 * Automatically commits offsets after processing each message.
 * 
 * @param {Server} io The Socket.IO server instance to emit notifications to clients.
 * @returns {Promise<void>}
 * */
async function runConsumer(io) {
  await consumer.connect();
  await consumer.subscribe({ topic: process.env.KAFKA_TOPIC });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      /*
       * @type { {userId: string, message: string, notificationId: string} }*/
      const notification = JSON.parse(message.value.toString());
      
      io.to(notification.userId).emit("notification", notification);

      // Manually commit the offset to Kafka once message is emitted.
      await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
    },
  });
};

module.exports.runConsumer = runConsumer;
