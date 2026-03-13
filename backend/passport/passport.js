
// Adapted to ES modules and our project's User model (name instead of username)

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../Models/User.js";
import configs from "../configs/config.js";

// Serialize and Deserialize User for session management 
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth Strategy 
passport.use(
    new GoogleStrategy(
        {
            clientID: configs.googleAuthClientId,
            clientSecret: configs.googleAuthClientSecret,
            callbackURL: configs.googleAuthServerCallbackURL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Try to find user by googleId
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // 2. If not found by googleId, check if an account with this email already exists
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // 3. User exists (e.g., signed up manually earlier), link the Google account
                        user.googleId = profile.id;
                        if (!user.profilePicture) {
                            user.profilePicture = profile.photos[0].value;
                        }
                        await user.save();
                    } else {
                        // 4. Create new user completely
                        user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            profilePicture: profile.photos[0].value,
                        });
                        await user.save();
                    }
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;
