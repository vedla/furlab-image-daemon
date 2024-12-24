import express, { Application } from 'express';
import cors from 'cors';
import imageRoutes from './routes/imageRoutes';
import { server, info, warn, error } from 'good-logs';

// Initialize express application
const app: Application = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Define the port from environment variables or use 3003 as default
const portFromEnv = process.env.PORT_FINDMYFLUFF
  ? parseInt(process.env.PORT_FINDMYFLUFF, 10)
  : null;
const PORT: number = portFromEnv && !isNaN(portFromEnv) ? portFromEnv : 3001;

/**
 * Image routes
 * @route /images
 */
app.use('/', imageRoutes);

/**
 * Start the server and listen on the defined port.
 */
// Start the server
app.listen(PORT, () => {
  server(`${PORT}`, 'Media Server Service', 'http://localhost:${PORT}', true);
  info(`Media Server Service running on http://localhost:${PORT}`);
});

// Handle 404 for undefined routes
app.use((req: express.Request, res: express.Response) => {
  error(req.url, 'Internal Server Error', '400');
  res.status(404).json({ message: 'Media Server Service: Resource not found' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  error(err.stack, 'Internal Server Error', '500');
  res.status(500).json({ message: 'Internal Server Error' });
});

// Gracefully shut down the server
process.on('SIGINT', () => {
  warn('SIGINT signal received. Shutting down gracefully...');
  process.exit(0);
});
