require('dotenv').config({ path: '../.env' });
const Item = require('./models/item'); 
const { connectDB } = require("./db/connect.js");
const { getItem, getAllItems, createItem, updateItem } = require("./db/items.js");

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@rabbitmq:5672`;
const express = require("express");
const socketIo = require("socket.io");
const amqp = require('amqplib/callback_api');
const bodyParser = require("body-parser");
const http = require('http');

const PORT = 3001;
const TASK_QUEUE = 'item_tasks_queue';
const RESPONSE_QUEUE = 'item_responses_queue';
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: "http://localhost:3000", // This is the origin of client app.
      methods: ["GET", "POST"],
      credentials: true
  }
});

app.use(bodyParser.json());

let channel;

// Connect to RabbitMQ and set up the channel
amqp.connect(RABBITMQ_URL, (error, connection) => {
    if (error){
      setTimeout(connection.createChannel, 5000);
      console.log(error)
    }
    connection.createChannel((err, ch) => {
      if (err){
        setTimeout(connection.createChannel, 5000);
        console.log(err)
      }
        channel = ch;

        // Ensure queues exist
        ch.assertQueue(TASK_QUEUE, { durable: false });
        ch.assertQueue(RESPONSE_QUEUE, { durable: false });
    });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('requestItems', async () => {
      try {
          const items = await getAllItems();
          socket.emit('itemsFetched', items);
      } catch (error) {
          console.error('Error fetching items:', error);
      }
  });

  socket.on('addItem', async (newItemData) => {
      try {
          const newItem = await createItem(newItemData);
          io.emit('itemAdded', newItem); // Notify all connected clients
      } catch (error) {
          console.error('Error adding new item:', error);
      }
  });

  socket.on('disconnect', () => {
      console.log('User disconnected');
  });

  // Listen for the 'editItem' event from the client
  socket.on('editItem', ({ itemId, field, value }) => {
      // Here, we need to update our database with the new value
      // After updating the database, can emit an event to all clients to reflect the change in real-time
      // For now, just emit a placeholder 'itemUpdated' event
      io.emit('itemUpdated', { itemId, field, value });
  });
});

app.get("/items", (req, res) => {
  // Create a correlationId for this request
  const correlationId = generateUuid();

  // Listen for a response from the worker on the RESPONSE_QUEUE
  channel.consume(RESPONSE_QUEUE, (msg) => {
      if (msg.properties.correlationId === correlationId) {
          res.json(JSON.parse(msg.content.toString()));
      }
  }, { noAck: true });

  // Send the fetch all items task to RabbitMQ
  channel.sendToQueue(TASK_QUEUE, Buffer.from(JSON.stringify({
      type: 'FETCH_ALL_ITEMS'
  })), {
      correlationId: correlationId,
      replyTo: RESPONSE_QUEUE
  });
});

app.put("/item/:itemId", (req, res) => {
    const { itemId } = req.params;

    // Create a correlationId for this request
    const correlationId = generateUuid();

    // Listen for a response from the worker on the RESPONSE_QUEUE
    channel.consume(RESPONSE_QUEUE, (msg) => {
        if (msg.properties.correlationId === correlationId) {
            res.json(JSON.parse(msg.content.toString()));
        }
    }, { noAck: true });

    // Send the update task to RabbitMQ
    channel.sendToQueue(TASK_QUEUE, Buffer.from(JSON.stringify({
        type: 'UPDATE_ITEM',
        itemId,
        data: req.body
    })), {
        correlationId: correlationId,
        replyTo: RESPONSE_QUEUE
    });    io.emit('itemUpdated', req.body);
  });
  
  server.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
  });
  
  function generateUuid() {
      return Math.random().toString() + Math.random().toString() + Math.random().toString();
  }