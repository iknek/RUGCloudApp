require('dotenv').config({ path: '../.env' });
const amqp = require('amqplib/callback_api');
const { getAllItems, createItem, deleteItem, updateItem } = require("./items.js");

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@rabbitmq:5672`;
const TASK_QUEUE = 'item_tasks_queue';
const RESPONSE_QUEUE = 'item_responses_queue';

amqp.connect(RABBITMQ_URL, (error, connection) => {
    if (error) throw error;
    console.log("im fine!")

    connection.createChannel(async (err, channel) => {
        if (err) throw err;

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
