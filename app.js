import express from "express";
import scoresRouter from "./routes/scores.js";
import leaderboardRouter from "./routes/leaderboard.js";
import { getPlayerScores } from "./service/service.js";

const app = express();

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(express.json());

app.use("/scores", scoresRouter);

app.use("/leaderboard", leaderboardRouter);

app.get("/player/:name", async (req, res) => {
    const { name } = req.params;
    const scores = await getPlayerScores(name)
    res.send(scores)
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message || "server internal error")
})

app.listen(3000, () => console.log("listening..."));
