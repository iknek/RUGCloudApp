const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config({ path: '../../.env' });

module.exports = function(app) {
  app.use(
    ['/api', '/items', '/item', '/books', '/book'],
    createProxyMiddleware({
      target: `http://server:${process.env.WORKER_PORT}`,
      changeOrigin: true,
    })
  );
};