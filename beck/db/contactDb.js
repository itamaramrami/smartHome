import mongoose from "mongoose";
const contactDb = async () => {
    try {
        console.log("mongo_uri:", process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('mongoDb connacted:', conn.connection.host)
    } catch (error) {
        console.log("error:", error.massage)
        process.exit(1)
    }
}
export default contactDb;