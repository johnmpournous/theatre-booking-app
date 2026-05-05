const pool = require("../config/db");

exports.getSeats = async (req, res) => {
  let conn;

  try {
    const { showtimeId } = req.query;

    if (!showtimeId) {
      return res.status(400).json({ message: "Το showtimeId είναι υποχρεωτικό" });
    }

    conn = await pool.getConnection();

    const seats = await conn.query(
      "SELECT * FROM seats WHERE showtime_id = ? ORDER BY seat_number ASC",
      [showtimeId]
    );

    res.json(seats);
  } catch (error) {
    res.status(500).json({
      message: "Σφάλμα στην ανάκτηση θέσεων",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

exports.createReservation = async (req, res) => {
  let conn;

  try {
    const userId = req.user.user_id;
    const { showtimeId, seatIds } = req.body;

    if (!showtimeId || !seatIds || seatIds.length === 0) {
      return res.status(400).json({
        message: "Το showtimeId και οι θέσεις είναι υποχρεωτικά"
      });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const placeholders = seatIds.map(() => "?").join(",");

    const availableSeats = await conn.query(
      `SELECT * FROM seats 
       WHERE seat_id IN (${placeholders}) 
       AND showtime_id = ? 
       AND is_reserved = FALSE
       FOR UPDATE`,
      [...seatIds, showtimeId]
    );

    if (availableSeats.length !== seatIds.length) {
      await conn.rollback();
      return res.status(409).json({
        message: "Μία ή περισσότερες θέσεις δεν είναι διαθέσιμες"
      });
    }

    const result = await conn.query(
      "INSERT INTO reservations (user_id, showtime_id) VALUES (?, ?)",
      [userId, showtimeId]
    );

    const reservationId = Number(result.insertId);

    for (const seatId of seatIds) {
      await conn.query(
        "INSERT INTO reservation_seats (reservation_id, seat_id) VALUES (?, ?)",
        [reservationId, seatId]
      );

      await conn.query(
        "UPDATE seats SET is_reserved = TRUE WHERE seat_id = ?",
        [seatId]
      );
    }

    await conn.commit();

    res.status(201).json({
      message: "Η κράτηση δημιουργήθηκε επιτυχώς",
      reservation_id: reservationId
    });
  } catch (error) {
    if (conn) await conn.rollback();

    res.status(500).json({
      message: "Σφάλμα στη δημιουργία κράτησης",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

exports.getUserReservations = async (req, res) => {
  let conn;

  try {
    const userId = req.user.user_id;

    conn = await pool.getConnection();

    const reservations = await conn.query(
      `
      SELECT 
        r.reservation_id,
        r.status,
        r.reservation_date,
        st.show_date,
        st.show_time,
        s.title,
        t.name AS theatre_name,
        GROUP_CONCAT(se.seat_number ORDER BY se.seat_number SEPARATOR ', ') AS seats
      FROM reservations r
      JOIN showtimes st ON r.showtime_id = st.showtime_id
      JOIN shows s ON st.show_id = s.show_id
      JOIN theatres t ON s.theatre_id = t.theatre_id
      JOIN reservation_seats rs ON r.reservation_id = rs.reservation_id
      JOIN seats se ON rs.seat_id = se.seat_id
      WHERE r.user_id = ?
      GROUP BY r.reservation_id
      ORDER BY r.reservation_date DESC
      `,
      [userId]
    );

    res.json(reservations);
  } catch (error) {
    res.status(500).json({
      message: "Σφάλμα στην ανάκτηση κρατήσεων",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

exports.cancelReservation = async (req, res) => {
  let conn;

  try {
    const userId = req.user.user_id;
    const { id } = req.params;

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const reservations = await conn.query(
      "SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ? AND status = 'ACTIVE'",
      [id, userId]
    );

    if (reservations.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        message: "Η κράτηση δεν βρέθηκε"
      });
    }

    const seats = await conn.query(
      "SELECT seat_id FROM reservation_seats WHERE reservation_id = ?",
      [id]
    );

    for (const seat of seats) {
      await conn.query(
        "UPDATE seats SET is_reserved = FALSE WHERE seat_id = ?",
        [seat.seat_id]
      );
    }

    await conn.query(
      "UPDATE reservations SET status = 'CANCELLED' WHERE reservation_id = ?",
      [id]
    );

    await conn.commit();

    res.json({
      message: "Η κράτηση ακυρώθηκε επιτυχώς"
    });
  } catch (error) {
    if (conn) await conn.rollback();

    res.status(500).json({
      message: "Σφάλμα στην ακύρωση κράτησης",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};