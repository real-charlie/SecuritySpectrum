import CommandType from "../command_type";
import {Client, Message} from "discord.js";
import Commands from "../commands";
import {createConfig, getConfig} from "./config/config";
import actionConfig from "./config/action_config";
import Utils from "./utils";

const action_parser = (cmd: CommandType, msg: Message) => {
    const guildId = msg.guildId
    let serverConfig = getConfig(guildId)
    if (!serverConfig)
        serverConfig = createConfig(guildId)

    const curr = cmd.get()
    if (curr === undefined)
        msg.reply(Utils.errorEmbedMessage('No arguments provided.'))
    else if (curr === Commands.PING)
        msg.reply('Online 🟢')
    else if (curr === Commands.CONFIG)
        actionConfig(guildId, serverConfig, cmd, msg)
}

export default action_parser
