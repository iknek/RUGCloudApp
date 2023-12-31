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

app.use(bodyParser.json());

let channel;

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    connection.on("error", (err) => {
      console.log("Connection Error:", err);
    });

    channel = await connection.createChannel();
    channel.on("error", (err) => {
      console.log("Channel Error:", err);
    });

    await channel.assertQueue(TASK_QUEUE, { durable: false });
    await channel.assertQueue(RESPONSE_QUEUE, { durable: false });

    channel.consume(RESPONSE_QUEUE, (msg) => {
        const response = JSON.parse(msg.content.toString());
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
  socket.on('requestItems', () => {
    const correlationId = generateUuid();
    sendToTaskQueue('GET_ALL_ITEMS', null, correlationId);
  });
  
  socket.on('addItem', (newItemData) => {
    const correlationId = generateUuid();
    sendToTaskQueue('CREATE_ITEM', newItemData, correlationId);
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});

function sendToTaskQueue(type, data, correlationId) {
  if (channel) {
    channel.sendToQueue(TASK_QUEUE, Buffer.from(JSON.stringify({ type, data })), {
      correlationId: correlationId,
      replyTo: RESPONSE_QUEUE
    });
  } else {
    console.log("Channel is not ready. Retrying in 5 seconds.");
    setTimeout(() => sendToTaskQueue(type, data, correlationId), 5000);
  }
}

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}
