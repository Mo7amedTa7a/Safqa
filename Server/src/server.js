// Server Bootstrap
// - Load environment variables (dotenv)
// - Connect to MongoDB (connectDB)
// - Start HTTP server on process.env.PORT
// - Handle unhandledRejection and uncaughtException events

import 'dotenv/config';
import http from 'http';
import app from './app.js';
import ConnectDB from './config/db.js';
import startCronJobs from './utils/cronJobs.js';
import { initSocket } from './config/socket.js';

const PORT = process.env.PORT || 5000;

ConnectDB();
startCronJobs();

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});