import express from "express"
import { createScore } from "../service/service.js"

const router = express.Router()

router.post("/", async (req, res, next) => {
    const { playerName, game, points } = req.body
    if (!playerName || !game || !points) {
        throw new Error("body missing parameter")
    }
    const id = await createScore({playerName, game, points})
    res.status(201).send(`creted | id: ${id}`)
})

export default router