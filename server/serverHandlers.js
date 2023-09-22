require("dotenv").config({ path: '../env' });
const amqp = require('amqplib/callback_api');  
const { getItem, getAllItems, createItem, updateItem } = require("./db/items.js");  

// RabbitMQ setup
const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@rabbitmq:5672`;
const REQUEST_QUEUE = 'item_tasks_queue';  // Queue for incoming CRUD tasks from the client
const RESPONSE_QUEUE = 'item_responses_queue';  // Queue for sending back responses to the client

// Connect to RabbitMQ
amqp.connect(RABBITMQ_URL, (error, connection) => {
    if (error) throw error;
    connection.createChannel((error, channel) => {
        if (error) throw error;

        // Ensure queues exist
        channel.assertQueue(REQUEST_QUEUE, { durable: false });
        channel.assertQueue(RESPONSE_QUEUE, { durable: false });

        // Listen for messages in the request queue
        channel.consume(REQUEST_QUEUE, async (message) => {
            const task = JSON.parse(message.content);

            // Handle the task based on its type
            let response;
            switch(task.type) {
                case 'GET_ALL_ITEMS':
                    response = await getAllItems();
                    break;
                // TODO: Handle other task types
                default:
                    response = { error: 'Unknown task type' };
            }

            // Send the response back to the response queue
            channel.sendToQueue(RESPONSE_QUEUE, Buffer.from(JSON.stringify(response)));
        }, { noAck: true });
    });
});
