require('dotenv').config({ path: '../.env' });
const express = require("express");
const socketIo = require("socket.io");
const amqp = require('amqplib');
const bodyParser = require("body-parser");
const http = require('http');

const PORT = process.env.SERVER_PORT;
const TASK_QUEUE = 'item_tasks_queue';
const RESPONSE_QUEUE = 'item_responses_queue';

// RabbitMQ setup
const mqUser = process.env.RABBITMQ_DEFAULT_USER;
const mqPassword = process.env.RABBITMQ_DEFAULT_PASS;
const mqPort = process.env.RABBITMQ_PORT;   
const RABBITMQ_URL = `amqp://${mqUser}:${mqPassword}@rabbit-rabbitmq-0.rabbit-rabbitmq-headless.default.svc.cluster.local:${mqPort}`;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});
console.log("27 in index");
app.use(bodyParser.json());

let channel;
const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(TASK_QUEUE, { durable: false });
        await channel.assertQueue(RESPONSE_QUEUE, { durable: false });
        console.log("37 in index");
        channel.consume(RESPONSE_QUEUE, (msg) => {
            const response = JSON.parse(msg.content.toString());
            console.log("37 in index. consuming");
            switch(response.type) {
                case 'GET_ALL_ITEMS':
                io.emit('itemsFetched', response.data);
                break;
                case 'CREATE_ITEM':
                io.emit('itemAdded', response.data);
                break;
            }
        }, { noAck: true });
    } catch (error) {
      console.log('Connection or Channel Error:', error);
      setTimeout(connectToRabbitMQ, 5000);
    }
  };
  
connectToRabbitMQ();

io.on('connection', (socket) => {
  console.log('User connected');
  console.log("37 in index");
  socket.on('requestItems', () => {
    const correlationId = generateUuid();
    channel.sendToQueue(TASK_QUEUE, Buffer.from(JSON.stringify({
      type: 'GET_ALL_ITEMS'
    })), {
      correlationId: correlationId,
      replyTo: RESPONSE_QUEUE
    });
  });

  socket.on('addItem', (newItemData) => {
    const correlationId = generateUuid();
    channel.sendToQueue(TASK_QUEUE, Buffer.from(JSON.stringify({
      type: 'CREATE_ITEM',
      data: newItemData
    })), {
      correlationId: correlationId,
      replyTo: RESPONSE_QUEUE
    });
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
