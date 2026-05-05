const pool = require("../config/db");

exports.getTheatres = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const theatres = await conn.query(
      "SELECT * FROM theatres ORDER BY name ASC"
    );

    res.json(theatres);
  } catch (error) {
    res.status(500).json({
      message: "Σφάλμα σύνδεσης με τη βάση",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};