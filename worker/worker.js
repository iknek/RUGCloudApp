require('dotenv').config({ path: '../.env' });
const amqp = require('amqplib/callback_api');
const { getAllItems, createItem } = require("./items.js");

const TASK_QUEUE = 'item_tasks_queue';
const RESPONSE_QUEUE = 'item_responses_queue';
// RabbitMQ setup
const mqUser = process.env.RABBITMQ_DEFAULT_USER;
const mqPassword = process.env.RABBITMQ_DEFAULT_PASS;
const mqPort = process.env.RABBITMQ_PORT;   
const RABBITMQ_URL = `amqp://${mqUser}:${mqPassword}@rabbit-rabbitmq-0.rabbit-rabbitmq-headless.default.svc.cluster.local:${mqPort}`;
let channel;

const connectToRabbitMQ = () => {
    amqp.connect(RABBITMQ_URL, (error, connection) => {
      if (error) {
        console.log('Connection Error:', error);
        setTimeout(connectToRabbitMQ, 5000);
        return;
      }
      connection.createChannel((err, ch) => {
        if (err) {
          console.log('Channel Error:', err);
          setTimeout(() => {
            connection.createChannel();
          }, 5000);
          return;
        }
        channel = ch;
        ch.assertQueue(TASK_QUEUE, { durable: false });
        ch.assertQueue(RESPONSE_QUEUE, { durable: false });

        channel.consume(TASK_QUEUE, async (msg) => {
          const request = JSON.parse(msg.content.toString());
          let response = { type: request.type };
        
          switch (request.type) {
            case 'GET_ALL_ITEMS':
              response.data = await getAllItems();
              break;
            case 'CREATE_ITEM':
              response.data = await createItem(request.data);
              break;
          }
        
          channel.sendToQueue(RESPONSE_QUEUE, Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId
          });
        }, { noAck: true });
      });
    });
};
connectToRabbitMQ();
