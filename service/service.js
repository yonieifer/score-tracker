import { create, read } from "../repo/repo.js";

export const createScore = async (data) => {
    const { playerName, game, points } = data;
    if (points < 0) {
        throw new Error("points must be a positive value");
    }
    const score = { playerName, game, points, createdAt: new Date() };
    const newId = await create(score);
    return newId;
};

const getGameTopTen = async (game) => {
    const topTen = await read({game: game}, {points: -1}, 10)
    return topTen
}

const gatGlobalTopTen = async () => {
    const topTen = await read(null, {points: -1}, 10)
    return topTen
}

const getPlayerScores = async (name) => {
    const playerScores = await read({playerName: name}, {points: -1}, null)
    return playerScores
}

const stats = async () => {

}



