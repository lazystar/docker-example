(async () => {
    const redis = require("redis");
    const express = require("express");
    const nodemailer = require("nodemailer");
    const cors = require("cors");

    const app = express();
    app.use(cors());

    const redisClient = redis.createClient({
        url: "redis://redis",
    });
    await redisClient.connect();

    const transporter = nodemailer.createTransport({
        host: "mailhog",
        port: 1025,
    });

    app.get("/", async (req, res) => {
        const keys = await redisClient.keys("message*");
        Promise.all(keys.map(async (key) => await redisClient.get(key))).then(
            (values) => res.send(values)
        );
    });

    app.get("/reset", async (req, res) => {
        const keys = await redisClient.keys("message*");
        keys.forEach((key) => redisClient.del(key));
        res.send("Done!");
    });

    app.get("/add", async (req, res) => {
        const messageId = "message" + Date.now();

        await redisClient.set(messageId, req.query.message);

        transporter.sendMail({
            from: "Example <test@example.com>",
            to: "test@example.com",
            subject: "Welcome to the docker example",
            text: `Message with "${messageId}" and body "${req.query.message}" was stored!`,
        });

        res.send("record was added as " + messageId);
    });

    app.listen(3000);
})();
