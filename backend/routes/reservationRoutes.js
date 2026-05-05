const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getSeats,
  createReservation,
  getUserReservations,
  cancelReservation
} = require("../controllers/reservationController");

router.get("/seats", authMiddleware, getSeats);
router.post("/reservations", authMiddleware, createReservation);
router.get("/user/reservations", authMiddleware, getUserReservations);
router.delete("/reservations/:id", authMiddleware, cancelReservation);

module.exports = router;