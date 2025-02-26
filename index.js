require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const app = express();
const userRoutes = require("./routes/userRoutes");
const busRoutes = require("./routes/busRoutes");
const seatRoutes = require("./routes/seatRoutes");
const routeRoutes = require("./routes/routeRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

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
app.use("/api/payment", paymentRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});