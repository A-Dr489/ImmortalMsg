const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { AUTHENTICATION_METHOD } = require("../utills/Enum.js");
const db = require("../storage/OauthQuery.js");
const dbOG = require("../storage/query.js");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utills/jwtTools.js");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const googleId = profile.id;
                const email = profile.emails[0].value;
                const displayName = profile.displayName;
                
                //We make sure if that user is new or sign in after expireation date
                const checkGoogleIdExists = await db.checkGoogleIdExsits(googleId);
                let user;

                if(checkGoogleIdExists.length > 0) {
                    user = checkGoogleIdExists[0];
                } else {
                    //We check if the user is new or tries a new authentication method
                    const checkEmail = await db.getUserByEmail(email);

                    if(checkEmail.length > 0) {
                        user = checkEmail[0];
                        await db.updateUserData(googleId, AUTHENTICATION_METHOD.GOOGLE, user.id);
                    } else {
                        const newUser = await db.addUser(displayName, email, AUTHENTICATION_METHOD.GOOGLE, googleId);
                        user = newUser[0];
                    }
                }

                return done(null, user);
            } catch(e) {
                console.log("Server Error (OAuthController.passport): " + e);
                return done(e, null);
            }
        }
    )
)

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const rows = await db.getUserById(id);
    done(null, rows[0]);
  } catch (error) {
    done(error, null);
  }
});

async function handleGoogleTokens(req, res) {
  try {
    const accessToken = generateAccessToken({ userid: req.user.id });
    const refreshToken = generateRefreshToken({ userid: req.user.id });

    await dbOG.addRefreshToken(
      req.user.id,
      refreshToken,
      new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    const frontendURL = process.env.FRONTEND;
    res.redirect(`${frontendURL}/auth/callback?token=${accessToken}`);
    //Cant send json, we need redirect
    // res.json({
    //   accessToken: accessToken,
    //   user: {
    //     id: req.user.id,
    //     username: req.user.username,
    //     email: req.user.email,
    //   },
    // });
  } catch (e) {
    console.log("Server Error (OAuthController.handleGoogleTokens): " + e);
    res.redirect('/login?error=server_error');
  }
}

module.exports = {
    passport,
    handleGoogleTokens
};