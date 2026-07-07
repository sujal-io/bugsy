import passport from "passport";
import generateToken from "../utils/generateToken.js";

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {

    const clientUrl = process.env.CLIENT_URL || req.get("origin") || "http://localhost:5173";

    if (err || !user) {
      return res.redirect(`${clientUrl}/login?error=google_auth_failed`);
    }

    const token = generateToken(user._id);

    return res.redirect(
      `${clientUrl}/oauth-success?` +
        `token=${token}` +
        `&id=${user._id}` +
        `&username=${encodeURIComponent(user.username)}` +
        `&email=${encodeURIComponent(user.email)}` +
        `&team=${user.team || ""}`,
    );
  })(req, res, next);
};
