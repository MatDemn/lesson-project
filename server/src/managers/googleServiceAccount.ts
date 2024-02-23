import { google, calendar_v3 } from "googleapis";
import Calendar = calendar_v3.Calendar;
import env from '../utils/validateEnv';

export class GoogleCalendar {
    static _instance: Calendar | null;

    public static get Instance() {
        if(GoogleCalendar._instance == null) {
            const auth = new google.auth.GoogleAuth({
                scopes: [
                    'https://www.googleapis.com/auth/calendar',
                    'https://www.googleapis.com/auth/calendar.events',
                  ],
                  keyFile: env.GOOGLE_SERVICEKEY_PATH
            })
            GoogleCalendar._instance = google.calendar({ version: 'v3', auth: auth });
        }
        return GoogleCalendar._instance;
    }
}