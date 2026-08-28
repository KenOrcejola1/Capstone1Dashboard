const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    ['/survey-management-content', '/admin', '/api/surveys'],
    createProxyMiddleware({
      target: 'http://localhost:8002',
      changeOrigin: true,
    })
  );
};
