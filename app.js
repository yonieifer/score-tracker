import express from "express";
import scoresRouter from "./routes/scores.js";
import leaderboardRouter from "./routes/leaderboard.js";

const app = express();

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(express.json())

app.use("/scores", scoresRouter);

app.use("/leaderboard", leaderboardRouter);

app.listen(3000, () => console.log("listening..."));
