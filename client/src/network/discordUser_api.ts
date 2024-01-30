import { DiscordUser } from "../models/discordUser";

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
    const response = await fetchData("/auth/discord/user", { method: "GET" });
    return response.json();
}

export async function loginWithDiscord() {
    window.location.replace("http://localhost:5000/auth/discord");
}

export async function logoutauthenticatedUser() {
    await fetchData("/auth/discord/logout", { method: "GET" });
}

