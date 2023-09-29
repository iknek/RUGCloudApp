require('dotenv').config({ path: '../.env' });
const amqp = require('amqplib/callback_api');
const { getAllItems, createItem, deleteItem, updateItem } = require("./items.js");

const RABBITMQ_URL = `amqp://user:dmp2qDZ127TBdJON@rabbit-rabbitmq-headless.default.svc.cluster.local:5672`;
const TASK_QUEUE = 'item_tasks_queue';
const RESPONSE_QUEUE = 'item_responses_queue';

const connectToRabbitMQ = () => {
    amqp.connect(RABBITMQ_URL, (error, connection) => {
      if (error) {
        console.log('Connection Error:', error);
        // Retry the connection after 5 seconds
        setTimeout(connectToRabbitMQ, 5000);
        return;
      }
      console.log("I'm fine!");
      connection.createChannel((err, channel) => {
        if (err) {
          console.log('Channel Error:', err);
          // Retry creating channel after 5 seconds
          setTimeout(() => {
            connection.createChannel();
          }, 5000);
          return;
        }

        channel.assertQueue(TASK_QUEUE, { durable: false });
        channel.assertQueue(RESPONSE_QUEUE, { durable: false });
        console.log("im still fine!")

        channel.consume(TASK_QUEUE, async (msg) => {
            const request = JSON.parse(msg.content.toString());
            console.log("im still still fine!")

            switch (request.type) {
                case 'FETCH_ALL_ITEMS':
                    const items = await getAllItems();
                    channel.sendToQueue(RESPONSE_QUEUE, Buffer.from(JSON.stringify(items)), {
                        correlationId: msg.properties.correlationId
                    });
                    break; 

                case 'CREATE_ITEM':
                    const newItem = await createItem(request.data);
                    channel.sendToQueue(RESPONSE_QUEUE, Buffer.from(JSON.stringify(newItem)), {
                        correlationId: msg.properties.correlationId
                    });
                    break;

                case 'DELETE_ITEM':
                    await deleteItem(request.itemId);
                    channel.sendToQueue(RESPONSE_QUEUE, Buffer.from(JSON.stringify({ success: true })), {
                        correlationId: msg.properties.correlationId
                    });
                    break;

                case 'UPDATE_ITEM':
                    const updatedItem = await updateItem(request.itemId, request.data);
                    channel.sendToQueue(RESPONSE_QUEUE, Buffer.from(JSON.stringify(updatedItem)), {
                        correlationId: msg.properties.correlationId
                    });
                    break;

                default:
                    channel.sendToQueue(RESPONSE_QUEUE, Buffer.from(JSON.stringify({ error: "Unknown request type" })), {
                        correlationId: msg.properties.correlationId
                    });
            }
        }, { noAck: true });
        });
  });
};

connectToRabbitMQ();
