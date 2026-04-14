const bcrypt = require("bcryptjs");
const db = require("../storage/query.js");
const { body, validationResult } = require("express-validator");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utills/jwtTools.js");

const validatorRegister = [
    body("username").trim()
    .notEmpty().withMessage("Username is required")
    .isLength({min: 3, max: 22}).withMessage("Username must be 3 - 22 character")
    .custom( async (value) => {
        const userExist = await db.checkUsernameExist(value);
        if(userExist) {
            return Promise.reject("This Username already exist");
        } else {
            return Promise.resolve(true);
        }
    }),

    body("Remail").trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalide email address")
    .normalizeEmail()
    .custom( async (value) => {
        const emailExist = await db.checkEmailExist(value);
        if(emailExist) {
            return Promise.reject("This Email already exist");
        } else {
            return Promise.resolve(true);
        }
    }),

    body("Rpassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

    body("Cpassword")
    .notEmpty().withMessage("Confirm-Password is required")
    .custom((value, { req }) => {
        if(value !== req.body.Rpassword) {
            throw new Error("Passwords do not match");
        } else {
            return true;
        }
    })
]

const validatorLogin = [
    body("Lemail")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalide email address")
    .normalizeEmail(),
    
    body("Lpassword")
    .notEmpty().withMessage("Password is required")
]

exports.postRegister = [validatorRegister, async (req, res) => {
    //express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach((err) => {
            formattedErrors[err.path] = err.msg;
        });

        return res.status(400).json({ errors: formattedErrors });   //400: bad request
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.Rpassword, 10);

        const rows = await db.addUser(req.body.username, req.body.Remail, hashedPassword);
        res.status(201).json({
            message: "Account created succesfully",
            user: rows[0]
        })
    } catch(e) {
        console.log("Server Error (register): " + e);
        res.status(500).json({message: "Internal server error"});
    }
}]

exports.postLogin = [validatorLogin, async (req, res) => {
    //express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = {};

        errors.array().forEach((err) => {
            formattedErrors[err.path] = err.msg;
        });

        return res.status(400).json({ errors: formattedErrors });
    }
    //login code
    try{
        const rows = await db.getUserByEmail(req.body.Lemail);

        if(rows.length === 0) {
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const match = await bcrypt.compare(req.body.Lpassword, rows[0].password);
        if(!match) {
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const accessToken = generateAccessToken({userid: rows[0].id});
        const refreshToken = generateRefreshToken({userid: rows[0].id});

        await db.addRefreshToken(rows[0].id, refreshToken, new Date(Date.now() + 15 * 24 * 60 * 60 * 1000));

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });

        res.json({
            accessToken: accessToken,
            user: {id: rows[0].id, username: rows[0].username, email: rows[0].email}
        })
    } catch(e) {
        console.log("Server Error (login): " + e);
        res.status(500).json({message: "Internal server error"});
    }
}]

//refreshes the access token
exports.postRefresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const rows = await db.checkForRefreshToken(refreshToken, decoded.userid);
        if (rows.length === 0) {
            return res.status(403).json({ message: 'Refresh token revoked' });
        }

        const accessToken = generateAccessToken({userid: decoded.userid});

        res.json({ accessToken: accessToken });
    } catch(e) {
        console.log("Server Error (refresh): " + e);
        res.status(500).json({message: "Internal server error"});
    }
}

exports.postLogout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if(refreshToken) {
            await db.deleteRefreshToken(refreshToken);
        }

        res.clearCookie("refreshToken");
        res.json({ message: 'Logged out successfully' });
    } catch(e) {
        console.log("Server Error (logout): " + e);
        res.status(500).json({message: "Internal server error"});
    }
}