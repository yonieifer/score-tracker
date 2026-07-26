import express from "express"
import {getGameTopTen, getGlobalTopTen } from "../service/service.js"

const router = express.Router()

router.get("/:game", async (req, res) => {
    const {game} = req.params
    const topTen = await getGameTopTen(game)
    res.send(topTen)
})

router.get("/global", async (req, res) => {
    const topTen = await getGlobalTopTen()
    res.send(topTen)
})

export default router