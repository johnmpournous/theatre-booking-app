const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getShows,
  getShowtimes
} = require("../controllers/showController");

router.get("/shows", authMiddleware, getShows);
router.get("/showtimes", authMiddleware, getShowtimes);

module.exports = router;