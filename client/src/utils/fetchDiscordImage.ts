import { DiscordUser } from "../models/discordUser";


export function getDiscordImage(user: DiscordUser|undefined): string {
    return "https://cdn.discordapp.com/avatars/" + user?.discordId + "/" + user?.avatar + ".png";
}