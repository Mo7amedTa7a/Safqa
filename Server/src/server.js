// Server Bootstrap
// - Load environment variables (dotenv)
// - Connect to MongoDB (connectDB)
// - Start HTTP server on process.env.PORT
// - Handle unhandledRejection and uncaughtException events

import 'dotenv/config';
import app from './app.js';
import ConnectDB from './config/db.js'
import startCronJobs from './utils/cronJobs.js';

const PORT = process.env.PORT

ConnectDB()
startCronJobs();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})