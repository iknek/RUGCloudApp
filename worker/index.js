const axios = require('axios');
const express = require('express');
const { connectDB } = require('./connect');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = process.env.WORKER_PORT;

const serverUrl = 'http://server:3001';
const clientUrl = 'http://client:3000';

const ping = async (url) => {
  try {
    const start = Date.now();
    await axios.get(url);
    const end = Date.now();

    const responseTime = end - start;
    return {
      success: true,
      responseTime,
    };
  } catch (error) {
    console.error(`Error pinging ${url}:`, error);
    return {
      success: false,
      responseTime: -1,
    };
  }
};

app.get('/', async (req, res) => {
  // Perform the database connection health check
  const dbConnectionStatus = await connectDB();

  const serverPingResult = await ping(serverUrl);
  const clientPingResult = await ping(clientUrl);

  res.send(`
    <h1>Worker Health Check</h1>
    <p>Server Ping: ${serverPingResult.success ? 'Success' : 'Failure'}</p>
    <p>Server Response Time: ${serverPingResult.responseTime} ms</p>
    <p>Client Ping: ${clientPingResult.success ? 'Success' : 'Failure'}</p>
    <p>Client Response Time: ${clientPingResult.responseTime} ms</p>
    <p>Database Connection: ${dbConnectionStatus ? 'Connected' : 'Failed'}</p>
  `);
});

app.listen(port, () => {
  console.log(`Worker app listening at http://localhost:${port}`);
});
