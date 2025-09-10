const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const cors = require('cors');

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true ,limit: '50mb' }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api", require("./src/route/index"));

const PORT = process.env.HTTP_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});