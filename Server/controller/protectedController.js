const db = require("../storage/query.js");
const { generateRoomId } = require("../utills/functions.js");
const { FRIEND_STATUS, ERROR_CODE } = require("../utills/Enums.js");

exports.getProfile = async (req, res) => {
    try{
        const rows = await db.getUserById(req.user.userid);
        if(rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.send({user: rows[0]})
    } catch(e) {
        console.log("Server Error (getProfile): " + e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

//friends url, gets all the friends for the current user
exports.getContacts = async (req, res) => {
    try {
        const rows = await db.getAllFriends(req.user.userid, FRIEND_STATUS.ACCEPTED);
        if(rows.length === 0) {
            return res.status(404).json({message: "No Friends :("});
        }

        res.json({users: rows});
    } catch(e) {
        console.log("Server Error (getContacts): " + e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

exports.postConversation = async (req, res) => {
    try{
        const roomid = generateRoomId(req.user.userid, req.body.userid)
        await db.addConversation(req.user.userid, req.body.userid, roomid);
        res.json({message: "Done!"});
    } catch(e) {
        console.log("Server Error (postConversation): " + e);
        if(e.code == ERROR_CODE.DUPLICATED_ADDING) {
            return res.status(400).json({message: "You already have conversation with this guy", ok: true});
        } else {
            return res.status(500).json({message: "Internal Server Error", ok: false});
        }
    }
}

exports.getConversations = async (req, res) => {
    try{
        const rows = await db.getConversationByUserid(req.user.userid);
        if(rows.length === 0) {
            return res.status(404).json({message: "No conversation found"});
        }

        res.json({conversations: rows});
    } catch(e) {
        console.log("Server Error (getConversations): " + e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

exports.postOlderMessages = async (req, res) => {
    try {
        const { msgid, convid } = req.body;
        const rows = await db.getOlderMessages(msgid, convid, req.user.userid);
        if(rows.length === 0) {
            return res.status(404).json({message: "No more message", ok: true});
        }

        res.json({olderMsg: rows, ok: true});
    } catch(e) {
        console.log("Server Error (postOlderMessages): " + e);
        res.status(500).json({message: "Internal Server Error", ok: false});
    }
}