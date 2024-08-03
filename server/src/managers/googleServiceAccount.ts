import {calendar_v3, calendar} from "@googleapis/calendar";
import {GoogleAuth} from "google-auth-library";
import Calendar = calendar_v3.Calendar;
import env from "../utils/validateEnv";

export class GoogleCalendar {
    static _instance: Calendar | null;

    public static async Instance() {
        const authOpts = new GoogleAuth({
            scopes: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/calendar.events',
            ],
            keyFile: env.GOOGLE_SERVICEKEY_PATH
        });
        if(GoogleCalendar._instance == null) {
            GoogleCalendar._instance = calendar({ version:'v3', auth: authOpts});
        }
        return GoogleCalendar._instance;
    }
}