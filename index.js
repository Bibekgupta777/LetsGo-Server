require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const userRoutes = require('./routes/userRoutes');
const busRoutes = require("./routes/busRoutes");
const seatRoutes = require("./routes/seatRoutes");
const routeRoutes = require("./routes/routeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

connectDB();
const PORT = process.env.PORT ? process.env.PORT : 5001;

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/route", routeRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/booking", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
