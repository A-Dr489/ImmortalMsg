const { Router } = require("express");
const authRouter = Router();
const authController = require("../controller/authController.js");
const OAuthController = require("../controller/OAuthController.js");    //passport

authRouter.post("/register", authController.postRegister);
authRouter.post("/login", authController.postLogin);
authRouter.post("/refresh", authController.postRefresh);
authRouter.post("/logout", authController.postLogout);

authRouter.get('/google', OAuthController.passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
}));
authRouter.get("/google/callback", OAuthController.passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?error=oauth_failed"
}), OAuthController.handleGoogleTokens);

module.exports = authRouter;