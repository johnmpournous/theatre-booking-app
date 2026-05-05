const authRoutes = require("./routes/authRoutes");
const showRoutes = require("./routes/showRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const theatreRoutes = require("./routes/theatreRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Theatre Booking API is running"
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api", showRoutes);
app.use("/api", reservationRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});