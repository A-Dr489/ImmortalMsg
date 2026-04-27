const pool = require("./pool.js");

async function checkGoogleIdExsits(googleId) {
    const { rows } = await pool.query("SELECT * FROM users WHERE providerid = $1", [googleId]);
    return rows;
}

async function getUserByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows;
}

async function updateUserData(googleId, method, userid) {
    await pool.query(
        `
            UPDATE users
            SET providerid = $1,
                method = $2,
                updatedat = CURRENT_TIMESTAMP
            WHERE id = $3
        `, [googleId, method, userid]);
}

async function addUser(username, email, method, googleId) {
    const { rows } = await pool.query(
        `
            INSERT INTO users (username, email, method, providerid)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [username, email, method, googleId]);
    return rows;
}

async function getUserById(id) {
    const { rows } = await pool.query("SELECT id, email, role, provider FROM users WHERE id = $1", [id]);
    return rows;
}

module.exports = {
    checkGoogleIdExsits,
    getUserByEmail,
    updateUserData,
    addUser,
    getUserById
}