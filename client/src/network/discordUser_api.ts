import { DiscordUser } from "../models/discordUser";
import { HTTPError } from "../models/httpError";

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if(response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        throw Error(errorMessage);
    }
}

export async function fetchAuthenticatedUser(): Promise<DiscordUser> {
    const response = await fetchData("/api/auth/discord/user", { method: "GET" });
    return response.json();
}

export async function loginWithDiscord() {
    if(process.env.NODE_ENV === "development") {
        window.location.replace("http://localhost:5000/api/auth/discord");
    }
    else {
        window.location.replace("http://www.lesson-project.pl/api/auth/discord");
    }
}

export async function logoutAuthenticatedUser(): Promise<HTTPError> {
    const reponse = await fetchData("/api/auth/discord/logout", { method: "GET" });
    return reponse.json();
}