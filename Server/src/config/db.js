// Database Configuration
// - Connect to MongoDB using mongoose.connect()
// - Use MONGO_URI from environment variables
// - Log success or exit process on failure

import mongoose from 'mongoose'

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.log("MongoDB connection failed: ", error.message)
        process.exit(1)
    }
}


export default ConnectDB
