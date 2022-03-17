import {Client, Guild, GuildBan, GuildMember, MessageEmbed} from "discord.js";
import Constants from "../constants";
import {createConfig, getConfig} from "./config/config";

export default class Utils {
    private static embedMessage =
        (desc: string, color: any) => {
            return {embeds: [new MessageEmbed().setColor(color).setDescription(desc)]}
        }
    public static normalEmbedMessage = (desc: string) => Utils.embedMessage(desc, Constants.INFO_EMBED_COLOR)
    public static errorEmbedMessage = (desc: string) => Utils.embedMessage(desc, Constants.ERROR_EMBED_COLOR)
    public static successEmbedMessage = (desc: string) => Utils.embedMessage(desc, Constants.SUCCESS_EMBED_COLOR)
    public static rearrangeString = (str: string) => {
        if (str.includes('acceptedValues'))
            return ''
        let result = ''
        for (let i = 0; i < str.length; i++) {
            if (str[i].match(/[A-Z]/))
                result += ' '
            result += str[i]
            if (i === 0)
                result = result.toUpperCase()
        }
        return result
    }
    public static punishUser = (userId: string, guild: Guild, punishment: string) => {
        const guildMembers = guild.members
        switch (punishment) {
            case Constants.BAN_PUNISHMENT:
                guildMembers.ban(userId)
                break
            case Constants.KICK_PUNISHMENT:
                guildMembers.ban(userId)
                break
            case Constants.TIMEOUT_PUNISHMENT:
                guildMembers.fetch().then(members => members.forEach(
                    (each) => {
                        if (each.id === userId) {
                            each.timeout(Constants.TIMEOUT_TIME)
                            return
                        }
                    }
                ))
                break
        }
    }
    public static unsafeAction =
        async (guild: Guild, type: string, punishmentName: string, clientID: string) => {

            // @ts-ignore
            const authorLog = await guild.fetchAuditLogs({type, limit: 1})
            const author = authorLog.entries.first()
            if (author === undefined)
                return

            let guildId = guild.id
            let serverConfig = getConfig(guildId)
            if (!serverConfig)
                serverConfig = createConfig(guildId)

            // @ts-ignore
            let executor = author.executor.id
            const {exceptions, sensitiveRoles, admins} = serverConfig
            try {
                let member: GuildMember = await guild.members.fetch(executor)
                if (executor !== clientID && (!exceptions.includes(executor) || !admins.includes(executor) || !sensitiveRoles.some(
                    (each: string) => member.roles.cache.some((each2) => each2.id === each))))
                    Utils.punishUser(executor, guild, serverConfig[punishmentName][0])
            } catch (e) {
            }
        }
}
