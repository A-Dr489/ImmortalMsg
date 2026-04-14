const { SOCKET_EVENT } = require('../utills/Enums.js');
const db = require("../storage/query.js");

module.exports = (io) => {
    io.on("connection", (socket) => {
        //joining and receiving old messages
        socket.on(SOCKET_EVENT.OPEN_CONVERSATION, async (convid, room) => {
            try{
                //const users = room.split('_');
                //make sure the return the other user's id and not the current user (we can get the current user from socket.user)

                socket.join(room);
                const rows = await db.getMessagesByConvid(convid);

                socket.emit(SOCKET_EVENT.RECEIVE_CONVERSATION, rows);
            } catch(e) {
                console.log("Server Error (joining & receiving): " + e);
                socket.disconnect();
                return;
            }
        });

        //sending and receiving messages
        socket.on(SOCKET_EVENT.MESSAGE_SERVER, async (msg, data) => {
            try{
                
                const rows = await db.addMessage(data.convid, socket.user.userid, msg);

                io.to(data.room).emit(SOCKET_EVENT.MESSAGE_CLIENT, rows[0]);
            } catch(e) {
                console.log("Server Error (sending messages): " + e);
                socket.disconnect();
                return;
            }
            
        });
    })
}

/* 
    NOTES:
    1. socket.on(SOCKET_EVENT.OPEN_CONVERSATION) we need to make a security check to make
    sure that the both users are friends before giving all the messages
*/