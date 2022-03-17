import CommandType from "../../command_type";
import {GuildMember, Message, Permissions} from "discord.js";
import Utils from "../utils";
import Constants from "../../constants";
import {setConfig} from "./config";

class ActionConfigArguments {
    public static VIEW = 'view'
    public static MODIFY = 'set'
    public static ADD = 'add'
}

/**
 * Modifies a setting in the target server configurations.
 * @param serverConfig - target server current configurations.
 * @param guildId - target server guild id
 * @param cmd - rest of arguments as command type
 * @param msg - message event to reply on it
 * @param add - should be added or replaced
 * */
const setAction = async (guildId: string, serverConfig: any, cmd: CommandType, msg: Message, add = false) => {
    // @ts-ignore
    if (!(msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || serverConfig['admins'].includes(msg.author.id))) {
        msg.reply(Utils.errorEmbedMessage('Access Denial.'))
        return
    }
    const curr = cmd.get()
    const next = cmd.get()
    if (curr !== null && next !== null && serverConfig.hasOwnProperty(curr)) {
        const acceptedValues = serverConfig[`${curr}_acceptedValues`]
        if (!acceptedValues) {
            msg.reply(Utils.errorEmbedMessage('Invalid configuration provided.'))
            return
        }
        else if (acceptedValues.length > 1 && add) {
            msg.reply(Utils.errorEmbedMessage(`Configuration ${curr} cannot be added, however it can only be set with 'set' argument.`))
            return
        }
        if (next === 'clear' && acceptedValues.length > 1) {
            serverConfig[curr] = []
        } else if (acceptedValues.includes(Constants.USER_TYPE) || acceptedValues.includes(Constants.ROLE_TYPE)) {
            let mentioned
            if (acceptedValues.includes(Constants.USER_TYPE))
                mentioned = msg.mentions.members
            else
                mentioned = msg.mentions.roles

            // @ts-ignore
            if (mentioned.size < 1) {
                msg.reply(Utils.errorEmbedMessage('You should mention someone with this command or you mentioned an invalid type.'))
                return
            }
            if (!add)
                serverConfig[curr] = []
            // @ts-ignore
            for (let i = 0; i < mentioned.size; i++) {
                // @ts-ignore
                const currMember = mentioned.at(i)
                if (currMember !== undefined) {
                    if (!add)
                        serverConfig[curr][i] = currMember.id
                    else
                        serverConfig[curr].push(currMember.id)
                }
            }
        } else if (acceptedValues.includes(next)) {
            if (!add)
                serverConfig[curr] = [next]
            else
                serverConfig[curr].push(next)
        } else {
            msg.reply(Utils.errorEmbedMessage('Invalid value has been provided.'))
            return
        }
        setConfig(guildId, serverConfig)
        msg.reply(Utils.successEmbedMessage(`Configuration '${curr}' has been updated.`))
    }
}


/**
 * Actions for viewing and modifying bot configs in a specified guild.
 * @param guildId - id of the specified guild to perform actions on it
 * @param serverConfigs - current configurations of the target server
 * @param cmd - rest of arguments as command type
 * @param msg - message event to reply on it
 */
const actionConfig = (guildId: string | null, serverConfigs: any, cmd: CommandType, msg: Message) => {
    if (guildId !== null) {
        const curr = cmd.get()
        if (curr === null)
            msg.reply(Utils.errorEmbedMessage(Constants.NO_ARGUMENT_MESSAGE))
        else if (curr === ActionConfigArguments.VIEW) {
            let result = ''
            for (const each in serverConfigs) {
                let curr = Utils.rearrangeString(each)
                if (curr != '') {
                    let currValue = serverConfigs[each]
                    result += `${curr}: ${(currValue.length < 1 ? 'None' : currValue)}\n`
                }
            }
            msg.reply(
                Utils.successEmbedMessage(
                    result
                )
            )
        } else if (curr == ActionConfigArguments.MODIFY)
            setAction(guildId, serverConfigs, cmd, msg, false)
        else if (curr == ActionConfigArguments.ADD)
            setAction(guildId, serverConfigs, cmd, msg, true)
        else
            msg.reply(Utils.errorEmbedMessage(Constants.INVALID_ARGUMENT_MESSAGE))
    }
}

export default actionConfig
