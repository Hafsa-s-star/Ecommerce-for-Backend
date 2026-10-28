import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import usersModel from "../models/users.model.js";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const googleOAuthConfigured = Boolean(clientID && clientSecret);

if (googleOAuthConfigured) {
    passport.use("google", new GoogleStrategy({
        clientID,
        clientSecret,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://ecommerce-for-backend-wjvg.vercel.app/api/auth/google/callback",
        state: true
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value?.trim().toLowerCase();
            if (!email || profile._json?.email_verified !== true) {
                return done(null, false);
            }

            let user = await usersModel.findOne({
                $or: [{ googleId: profile.id }, { email }]
            });

            if (user) {
                if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }
            } else {
                const usernameBase = profile.displayName?.trim() || email.split("@")[0];
                let username = usernameBase;
                let suffix = 1;
                while (await usersModel.exists({ username })) {
                    username = `${usernameBase} ${suffix++}`;
                }

                user = await usersModel.create({
                    username,
                    email,
                    password: await bcrypt.hash(randomBytes(32).toString("hex"), 12),
                    googleId: profile.id,
                    role: "user"
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}
