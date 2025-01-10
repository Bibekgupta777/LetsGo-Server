require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const userRoutes = require('./routes/userRoutes');

connectDB();
const PORT = process.env.PORT ? process.env.PORT : 5001;

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
