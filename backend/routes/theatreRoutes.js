const express = require("express");
const router = express.Router();

const { getTheatres } = require("../controllers/theatreController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getTheatres);

module.exports = router;