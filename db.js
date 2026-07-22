import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MDB_URI)

const connectToMongo = async () => {
    try {
        await client.connect()
        const db = client.db("score-tracker")
        console.log("connected to MongoDB...");
        return db
    } catch (error) {
        throw new Error("failed to connect client", error)
    }
}

const db = await connectToMongo()
export default db
