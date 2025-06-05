import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

// load env vars
dotenv.config();

// Create a new express application instance
const app = express();
// create chat message model
const Message = mongoose.model(
    "Message",
    new mongoose.Schema({
        uid: String,
        text: String,
        sentOn: Date,
    }),
);

// middleware to parse json in body
app.use(express.json());
// middleware to cors allow all
app.use(cors());

// Define the root path with a greeting message
app.get("/", (_: Request, res: Response) => {
    res.json({ message: "Chat Backend API" });
});

// Chat API
// add new message to mongo db database
app.post("/chat", async (req: Request, res: Response) => {
    const text = req.body.text;

    if (text.includes("CRASH")) {
        // Simulate a crash for testing purposes
        process.exit(1);
    }

    if (text.includes("HANG")) {
        // Simulate a hang for testing purposes
        console.log("fatal: backend hanged.");
        while (true) { }
    }
    await Message.create({
        uid: req.body.uid,
        text,
        sentOn: new Date(),
    });
    res.end();
});

// get messages from the mongo db database
app.get("/chat", async (_req: Request, res: Response) => {
    const messages = await Message.find();
    res.json(
        messages.map(({ uid, text, sentOn }) => {
            return {
                uid,
                text,
                sentOn,
            };
        }),
    );
});

// boot backend server
// connect to monogo db
mongoose.connect(process.env.MONGO_URL || "").then(() => {
    // Set the network port
    const port = process.env.PORT || 3001;

    // Start the Express server
    app.listen(port, () => {
        console.log(`The server is running at http://localhost:${port}`);
    });
});

