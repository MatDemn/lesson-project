import env from '../utils/validateEnv';
import DiscordStrategy, {Profile} from 'passport-discord';
import passport from 'passport';
import OAuth2Strategy from 'passport-oauth2';
import DiscordUserModel from '../models/discordUser';

export const init = () => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.serializeUser((user, done) => {
        done(null, user.id);
        console.log(user);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await DiscordUserModel.findById(id);
        if(user) {
            done(null, user as Express.User);
        }
    });

    passport.use(new DiscordStrategy({
        clientID: env.CLIENT_ID,
        clientSecret: env.CLIENT_SECRET, 
        callbackURL: env.CLIENT_REDIRECT,
        scope: ['identify']
    },
    async (accessToken: string, refreshToken: string, profile: Profile, cb: OAuth2Strategy.VerifyCallback) => {
        try {
            const user = await DiscordUserModel.findOne({ discordId: profile.id });
            if(user) {
                cb(null, user as Express.User);
            }
            else {
                const newUser = await DiscordUserModel.create({discordId: profile.id, global_name: profile.username+profile.discriminator, avatar: profile.avatar, isAdmin: false});
                const savedUser = await newUser.save();
                cb(null, savedUser as Express.User);
            }
        } catch (error) {
            console.log(error);
            cb(error as Error, undefined);
        }
    })); 
};

