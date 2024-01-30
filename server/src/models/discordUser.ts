import { InferSchemaType, model,  Schema} from "mongoose";

const discordUserSchema = new Schema({
    discordId: {type: String, require: true, unique: true},
    global_name: {type: String, require: true},
    avatar: {type: String, require: true},
    isAdmin: {type: Boolean, require: true},
});

type DiscordUser = InferSchemaType<typeof discordUserSchema>;

export default model<DiscordUser>('DiscordUser', discordUserSchema);