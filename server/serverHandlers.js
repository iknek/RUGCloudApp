require("dotenv").config({ path: '../env' });
const amqp = require('amqplib/callback_api');  
const {getAllItems} = require("./db/items.js");  

// RabbitMQ setup
const mqUser = process.env.RABBITMQ_DEFAULT_USER;
const mqPassword = process.env.RABBITMQ_DEFAULT_PASS;
const mqPort = process.env.RABBITMQ_PORT;

const RABBITMQ_URL = `amqp://${mqUser}:${mqPassword}@rabbit-rabbitmq-0.rabbit-rabbitmq-headless.default.svc.cluster.local:${mqPort}`;
const REQUEST_QUEUE = 'item_tasks_queue';  // Queue for incoming CRUD tasks from the client
const RESPONSE_QUEUE = 'item_responses_queue';  // Queue for sending back responses to the client

// Connect to RabbitMQ
amqp.connect(RABBITMQ_URL, (error, connection) => {
    if (error){
        setTimeout(connection.createChannel, 5000);
        console.log(error)
      }
    connection.createChannel((error, channel) => {
        if (error){
            setTimeout(connection.createChannel, 5000);
            console.log(error)
        }
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
