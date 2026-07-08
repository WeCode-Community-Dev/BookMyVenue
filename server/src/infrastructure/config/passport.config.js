import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRepository } from '../repositories/user.repository.js';
import GoogleAuthUseCase from '../../application/user/usecases/GoogleAuthUseCase.js';

const userRepository = new UserRepository();
const googleAuthUseCase = new GoogleAuthUseCase(userRepository);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await googleAuthUseCase.execute(profile);
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;
