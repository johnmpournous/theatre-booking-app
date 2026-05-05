const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.register = async (req, res) => {
  let conn;

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Όλα τα πεδία είναι υποχρεωτικά"
      });
    }

    conn = await pool.getConnection();

    const existingUser = await conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Το email χρησιμοποιείται ήδη"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await conn.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Ο χρήστης δημιουργήθηκε επιτυχώς"
    });

  } catch (error) {
    res.status(500).json({
      message: "Σφάλμα server",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

exports.login = async (req, res) => {
  let conn;

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email και password είναι υποχρεωτικά"
      });
    }

    conn = await pool.getConnection();

    const users = await conn.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Λάθος email ή password"
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Λάθος email ή password"
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Επιτυχής σύνδεση",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Σφάλμα server",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};