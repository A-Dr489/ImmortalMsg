const db = require("../storage/query.js");
const { FRIEND_STATUS, ERROR_CODE } = require("../utills/Enums.js");

exports.postAddFreind = async (req, res) => {
    try{
        const { receiver } = req.body;
        const rows = await db.getUserByUsername(receiver);
        if(rows.length === 0) {
            return res.status(404).json({message: "Username Doesn't Exsist"});
        }

        await db.addFriend(req.user.userid, rows[0].id, FRIEND_STATUS.PENDING);
        res.json({message: "Done!"});
    } catch(e) {
        console.log("Server Error (postAddFriend): " + e);
        if(e.code == ERROR_CODE.DUPLICATED_ADDING) {
            return res.status(400).json({message: "You already sent a friend request"});
        } else if(e.code == ERROR_CODE.SELF_ADDING) {
            return res.status(400).json({message: "You can't be friend with yourself (not literally)"})
        } else {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}

exports.getPending = async (req, res) => {
    try {
        const rows = await db.getAllPending(req.user.userid, FRIEND_STATUS.PENDING);
        if(rows.length === 0) {
            return res.status(404).json({message: "No Requests :("});
        }

        res.json({requests: rows});
    } catch(e) {
        console.log("Server Error (getPending): " + e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

exports.acceptFriendRequest = async (req, res) => {
    try{
        const { friendid } = req.body;
        await db.acceptFriend(friendid, req.user.userid, FRIEND_STATUS.ACCEPTED);

        res.json({message: "Done!"});
    } catch(e) {
        console.log("Server Error (deleteFriendRequest): " + e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

exports.deleteFriendRequest = async (req, res) => {
    try{
        const { friendid } = req.body;
        await db.deleteFriend(friendid, req.user.userid);

        res.json({message: "Done!"});
    } catch(e) {
        console.log("Server Error (deleteFriendRequest): " + e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

//make getPending as a socket to you see live request and accept