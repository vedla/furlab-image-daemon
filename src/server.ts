const dotenv = require('dotenv');
import express, { Application } from 'express';
import cors from 'cors';
import { swaggerUi, swaggerSpec } from './swagger';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { server, info, warn, error } from 'good-logs';
import { defaultRoute } from './routes/route';

// const logger = require('lazzer');
// Load environment variables from .env file

dotenv.config();

// Initialize express application
const app: Application = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Define the port from environment variables or use 3000 as default
const portFromEnv = process.env.MAIN_PORT ? parseInt(process.env.MAIN_PORT, 10) : null;
const PORT: number = portFromEnv && !isNaN(portFromEnv) ? portFromEnv : 3000;

/**
 * Image routes
 * @route /
 */
app.use('/', defaultRoute);

// Proxy configuration for microservices
const proxyConfig: { [key: string]: string } = {
  '/v1/media': 'http://localhost:3001',
};

// Set up proxy middleware for each service
Object.keys(proxyConfig).forEach((context) => {
  app.use(
    context,
    createProxyMiddleware({
      target: proxyConfig[context],
      changeOrigin: true,
      pathRewrite: (path) => path.replace(new RegExp(`^${context}`), ''),
    })
  );
});

// Start the server
app.listen(PORT, () => {
  server(`${PORT}`, 'API Gateway', 'http://localhost:${PORT}', true);
  info(`API Gateway running on http://localhost:${PORT}`);
});

/**
 * Swagger API documentation
 * @route /docs
 */
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

info(`API documentation available at http://localhost:${PORT}/docs`);

// Handle 404 for undefined routes
app.use((req: express.Request, res: express.Response) => {
  // error(req.url, 'Internal Server Error', '400');
  res.status(404).json({ message: 'Proxy: Resource not found' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  error(err.stack, 'Proxy: Internal Server Error', '500');
  res.status(500).json({ message: 'Proxy: Internal Server Error' });
});

// Gracefully shut down the server
process.on('SIGINT', () => {
  warn('SIGINT signal received. Shutting down gracefully...');
  process.exit(0);
});
