const pool = require("./pool.js");

async function checkUsernameExist(username) {
    const { rows } = await pool.query("SELECT username FROM users WHERE LOWER(username) = LOWER($1)", [username]);
    if(rows.length > 0) {
        return true;
    } else {
        return false;
    }
}

async function checkEmailExist(email) {
    const { rows } = await pool.query("SELECT email FROM users WHERE LOWER(email) = LOWER($1)", [email]);
    if(rows.length > 0) {
        return true;
    } else {
        return false;
    }
}

async function addUser(username, email, password, method) {
    const { rows } = await pool.query("INSERT INTO users (username, email, password, method) VALUES ($1, $2, $3, $4) RETURNING id, username, email", [username, email, password, method]);
    return rows;
}

async function getUserByEmail(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return rows;
}

async function addRefreshToken(userid, token, expire) {
    await pool.query("INSERT INTO refreshtokens (userid, token, expireat) VALUES ($1, $2, $3)", [userid, token, expire])
}

async function checkForRefreshToken(token, userid) {
    const { rows } = await pool.query("SELECT * FROM refreshtokens WHERE token = $1 AND userid = $2", [token, userid]);
    return rows;
}

async function deleteRefreshToken(token) {
    await pool.query("DELETE FROM refreshtokens WHERE token = $1", [token]);
}

async function getUserById(id) {
    const { rows } = await pool.query("SELECT id, username, email, createdat FROM users WHERE id = $1", [id]);
    return rows;
}

module.exports = {
    checkUsernameExist,
    checkEmailExist,
    addUser,
    getUserByEmail,
    addRefreshToken,
    checkForRefreshToken,
    deleteRefreshToken,
    getUserById,
}