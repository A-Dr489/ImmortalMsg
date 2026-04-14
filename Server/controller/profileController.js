const db = require("../storage/query.js");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
    try{
        const rows = await db.getUserById(req.user.userid);
        if(rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({user: rows[0]})
    } catch(e) {
        console.log("Server Error (getProfile): " + e);
        res.status(500).json({message: "Internal Server Error"});
    }
}

exports.putChangePassword = async (req, res) => {
    try{
        const current = String(req.body.current);
        const newPassword = String(req.body.newPassword);
        const confirmNewPassword = String(req.body.confirmNewPassword);
        const rows = await db.getUserPassword(req.user.userid);
        if(rows.length === 0) {
            return res.status(404).json({message: "User not found"});
        }
        if(current === newPassword) {  
            return res.status(400).json({message: "This is already your password"});
        }
        if(newPassword !== confirmNewPassword) {
            return res.status(400).json({message: "The password is not the same as Confirm Password"});
        }

        const match = await bcrypt.compare(current, rows[0].password);
        if(match) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.changeUserPassword(hashedPassword, req.user.userid);
            res.json({message: "Done!"});
        } else {
            throw Error("ez");
        }

    } catch(e) {
        console.log("Server Error (putChangePassword): " + e);
        if(e.message == "ez") {
            return res.status(400).json({message: "Your current password doesn't match"});
        }
        res.status(500).json({message: "Internal Server Error"});
    }
}

exports.deleteUser = async (req, res) => {
    try{
        await db.deleteUserById(req.user.userid);

        res.json({message: "Done!"});
    } catch(e) {
        console.log("Server Error (deleteUser): " + e);
        res.status(500).json({message: "Internal Server Error"});
    }
}