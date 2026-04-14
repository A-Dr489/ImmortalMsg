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

async function addUser(username, email, password) {
    const { rows } = await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email", [username, email, password]);
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

async function getAllFriends(userid, status) {
    const { rows } = await pool.query(`
        SELECT f.friendid, u.id, u.username
        FROM friends as f
        JOIN users as u
        ON u.id = CASE
            WHEN f.reqid = $1 THEN f.recvid
            ELSE f.reqid
        END
        WHERE (reqid = $1 OR recvid = $1) AND status = $2;
    `, [userid, status]);
    
    return rows;
}

async function addConversation(userid1, userid2, room) {
    await pool.query(`
            INSERT INTO conversations (userid1, userid2, room) 
            SELECT LEAST($1::int, $2::int), GREATEST($1::int, $2::int), $3
            WHERE EXISTS (
                SELECT 1 FROM friends
                WHERE LEAST(reqid, recvid) = LEAST($1::int, $2::int)
                AND GREATEST(reqid, recvid) = GREATEST($1::int, $2::int)
            );
        `, [userid1, userid2, room]);
}

async function getConversationByUserid(userid) {
    const { rows } = await pool.query(`
        SELECT
        c.convid,
        c.room,

        u.id       AS other_id,
        u.username AS other_username,

        m.content AS latest_msg, 
        m.createdat AS latest_msg_time

        FROM conversations as c
        JOIN users as u
        ON u.id = CASE
            WHEN c.userid1 = $1 THEN c.userid2
            ELSE c.userid1
        END

        LEFT JOIN LATERAL (
            SELECT content, createdat
            FROM messages
            WHERE convid = c.convid
            ORDER BY createdat DESC
            LIMIT 1
        ) m ON TRUE

        WHERE $1 IN (c.userid1, c.userid2);
    `, [userid]);

  return rows;
}

async function getMessagesByConvid(convid) {
    const { rows } = await pool.query(`
        SELECT msgid, convid, senderid, content, createdat
        FROM messages
        WHERE convid = $1
        ORDER BY createdat DESC
        LIMIT 20;
    `, [convid]);

    return rows;
}

async function addMessage(convid, senderid, content) {
    const { rows } = await pool.query("INSERT INTO messages (convid, senderid, content) VALUES ($1, $2, $3) RETURNING msgid, senderid, content, convid, createdat", [convid, senderid, content]);
    return rows;
}

async function addFriend(reqid, recvid, status) {
    await pool.query("INSERT INTO friends (reqid, recvid, status) VALUES ($1, $2, $3)", [reqid, recvid, status]);
}

async function getUserByUsername(username) {
    const { rows } = await pool.query("SELECT id FROM users WHERE LOWER(username) = LOWER($1)", [username]);
    return rows;
}

async function getAllPending(userid, status) {
    const { rows } = await pool.query(`
            SELECT f.friendid, f.reqid, f.status, f.createdat, u.id, u.username
            FROM friends as f
            JOIN users as u
            ON u.id = CASE
                WHEN f.reqid = $1 THEN f.recvid
                ELSE f.reqid
            END  
            WHERE (reqid = $1 OR recvid = $1) AND status = $2
        `, [userid, status]);
    return rows;
}

async function deleteFriend(friendid, userid) {
    await pool.query("DELETE FROM friends WHERE friendid = $1 AND (reqid = $2 OR recvid = $2)", [friendid, userid]);
}

async function acceptFriend(friendid, userid, status) {
    await pool.query("UPDATE friends SET status = $3, updatedat = NOW() WHERE friendid = $1 AND (reqid = $2 OR recvid = $2)", [friendid, userid, status]);
}

async function getOlderMessages(msgid, convid, userid) {
    const { rows } = await pool.query(`
        SELECT msgid, convid, senderid, content, createdat
        FROM messages
        WHERE convid = $2
        AND msgid < $1
        AND EXISTS (
            SELECT 1 FROM conversations
            WHERE convid = $2
            AND (userid1 = $3 OR userid2 = $3)
        )
        ORDER BY createdat DESC
        LIMIT 20;
    `, [msgid, convid, userid]);

    return rows;
}

async function changeUserPassword(password, userid) {
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [password, userid]);
}

async function getUserPassword(userid) {
    const { rows } = await pool.query("SELECT password FROM users WHERE id = $1", [userid]);
    return rows;
}

async function deleteUserById(userid) {
    await pool.query("DELETE FROM users WHERE id = $1", [userid]);
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
    getAllFriends,
    addConversation,
    getConversationByUserid,
    getMessagesByConvid,
    addMessage,
    addFriend,
    getUserByUsername,
    getAllPending,
    deleteFriend,
    acceptFriend,
    getOlderMessages,
    changeUserPassword,
    getUserPassword,
    deleteUserById
}