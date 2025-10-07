const express = require("express");
const app = express();
const Subscriber = require("./models/subscribers");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger configuration
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Subscribers API",
            version: "1.0.0",
            description: "API to manage subscribers",
        },
        servers: [
            { url: "http://localhost:3000" }
        ],
    },
    apis: ["./src/app.js"],

};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());

/**
 * @swagger
 * /subscribers:
 *   get:
 *     summary: Get all subscribers
 *     responses:
 *       200:
 *         description: List of subscribers
 */
app.get("/subscribers", async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /subscribers/names:
 *   get:
 *     summary: Get names and channels of subscribers
 *     responses:
 *       200:
 *         description: List of subscriber names and channels
 */
app.get("/subscribers/names", async (req, res) => {
    try {
        const subscribers = await Subscriber.find({}, { name: 1, subscribedChannel: 1, _id: 0 });
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /subscribers/{id}:
 *   get:
 *     summary: Get subscriber by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscriber data
 *       400:
 *         description: Subscriber not found
 */
app.get("/subscribers/:id", async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);
        if (!subscriber) {
            return res.status(400).json({ message: "subscriber not found" });
        }
        res.json(subscriber);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = app;
