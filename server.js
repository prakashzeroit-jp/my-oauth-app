require("dotenv").config();

const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const connectDB = require("./config/db.js");
const User = require("./models/user.model");

const app = express();

connectDB();

app.use(express.json());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email:
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null,
          avatar:
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : null,
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

app.use("/api/auth", require("./routes/auth.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
