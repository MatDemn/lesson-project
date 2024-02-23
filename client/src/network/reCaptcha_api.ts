import { fetchData } from "./networkUtils";

export interface ReCaptchaVerifyResponse {
    "success": true|false,
    "challenge_ts": string,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
    "error-codes": Array<any>        // optional
  }  

export async function verifyReCAPTCHA(token: string): Promise<ReCaptchaVerifyResponse> {
    const response = await fetchData('/api/recaptcha/verify', {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token: token})});
    return response.json();
}