const redis = require("redis");
const express = require("express");

const app = express();
const redisClient = redis.createClient({
    url: "redis://redis",
});

app.get("/", async (req, res) => {
    await redisClient.connect();
    const keys = await redisClient.keys("message*");
    Promise.all(
        keys.map(async (key) => {
            const value = await redisClient.get(key);

            return `<div>${value}</div>`;
        })
    ).then((values) => res.send(values.join("")));
    await redisClient.quit();
});

app.get("/add", async (req, res) => {
    const messageId = "message" + Date.now();
    await redisClient.connect();
    await redisClient.set(messageId, req.query.message);
    res.send("record was added as " + messageId);
    await redisClient.quit();
});

app.listen(3000);
