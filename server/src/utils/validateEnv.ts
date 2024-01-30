import "dotenv/config";
import { cleanEnv } from "envalid";
import {str, port} from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_DB_CONNECTION_STRING: str(),
    PORT: port(),
    CLIENT_ID: str(),
    CLIENT_SECRET: str(),
    CLIENT_REDIRECT: str(),
    SESSION_SECRET: str(),
    GOOGLE_APIKEY: str(),
    GOOGLE_CALENDARID: str(),
    DISCORD_AUTH_URL: str(),
    AWS_REGION: str(),
    AWS_BUCKETNAME: str(),
    AWS_ACCESS_KEY: str(),
    AWS_ACCESS_SECRET: str(),
});