import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI)

const connectToMongo = async () => {
    try {
        await client.connect()
        const db = client.db("test")
        console.log("connected to MongoDB...");
        return db
    } catch (error) {
        throw new Error("failed to connect client")
    }
}

const db = await connectToMongo()
export default db
