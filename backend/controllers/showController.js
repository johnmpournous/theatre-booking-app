const pool = require("../config/db");

exports.getShows = async (req, res) => {
  let conn;

  try {
    const { theatreId, title } = req.query;

    conn = await pool.getConnection();

    let sql = `
      SELECT 
        s.show_id,
        s.title,
        s.description,
        s.duration,
        s.age_rating,
        t.theatre_id,
        t.name AS theatre_name,
        t.location
      FROM shows s
      JOIN theatres t ON s.theatre_id = t.theatre_id
      WHERE 1=1
    `;

    const params = [];

    if (theatreId) {
      sql += " AND s.theatre_id = ?";
      params.push(theatreId);
    }

    if (title) {
      sql += " AND s.title LIKE ?";
      params.push(`%${title}%`);
    }

    sql += " ORDER BY s.title ASC";

    const shows = await conn.query(sql, params);

    res.json(shows);
  } catch (error) {
    res.status(500).json({
      message: "Σφάλμα στην ανάκτηση παραστάσεων",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

exports.getShowtimes = async (req, res) => {
  let conn;

  try {
    const { showId, date } = req.query;

    conn = await pool.getConnection();

    let sql = `
      SELECT 
        st.showtime_id,
        st.show_date,
        st.show_time,
        st.price,
        s.show_id,
        s.title,
        t.name AS theatre_name,
        t.location
      FROM showtimes st
      JOIN shows s ON st.show_id = s.show_id
      JOIN theatres t ON s.theatre_id = t.theatre_id
      WHERE 1=1
    `;

    const params = [];

    if (showId) {
      sql += " AND st.show_id = ?";
      params.push(showId);
    }

    if (date) {
      sql += " AND st.show_date = ?";
      params.push(date);
    }

    sql += " ORDER BY st.show_date ASC, st.show_time ASC";

    const showtimes = await conn.query(sql, params);

    res.json(showtimes);
  } catch (error) {
    res.status(500).json({
      message: "Σφάλμα στην ανάκτηση showtimes",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};