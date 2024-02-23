import env from './utils/validateEnv';
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import exerciseRouter from "./routes/exercise";
import discordAuthRouter from "./routes/discordAuth";
import calendarRouter from "./routes/calendar";
import imageRouter from "./routes/image";
import recaptchaRouter from "./routes/reCaptcha";
import createHttpError, {isHttpError} from "http-errors";
import session from 'express-session';
import passport from 'passport';
import * as discordStrategy from './strategies/discordStrategy';
import MongoStore from 'connect-mongo';

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    cookie: {
        maxAge: 1000*60*60*24
    }, 
    saveUninitialized: false,
    resave: false,
    name: 'discord.oauth2',
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_DB_CONNECTION_STRING
        //client: mongoose.connection.getClient()
    }),
}));

discordStrategy.init();

app.use(passport.initialize());
app.use(passport.session({pauseStream: true}));

// app.use(
//     cors({
//         origin:"http://localhost:3000",
//         methods:"GET,POST,PUT,DELETE",
//         credentials:true
//     })
// );

app.use("/api/exercises", exerciseRouter);
app.use("/auth/discord", discordAuthRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/image", imageRouter);
app.use("/api/recaptcha", recaptchaRouter);

app.use((req,res,next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error ocurred!";
    let statusCode = 500;
    if(isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({error: errorMessage});
});

export default app;