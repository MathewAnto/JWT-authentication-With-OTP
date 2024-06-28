import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import bodyParser from 'body-parser';
import { router } from './routes/router.js';

const app = express();
const port = 7200;

// Body parser middleware
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

// Routes
app.use('/', router);

// MongoDB connection
mongoose.connect("mongodb+srv://matheweee89:N99No0TcIUWsY7YJ@users.hfmhcva.mongodb.net/jwtTest")
.then(() => {
    console.log("Connected to MongoDB successfully.");
})
.catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
});

// Start the server
app.listen(port, () => {
    console.log(`Authentication service started on port ${port}`);
});