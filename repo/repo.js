import db from "../db.js"


const collection = db.collection("scores")

export const create = async (data) => {
    const result = await collection.insertOne(data)
    return result.insertedId.toString()
}

export const read = async (filter={}, sort={}, limit=0) => {
    const result = await collection.find(filter).sort(sort).limit(limit).toArray()
    return result
}


