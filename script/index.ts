import {Client, GuildBan, Intents} from "discord.js";
import Constants from "./constants";
import CommandType from "./command_type";
import action_parser from "./actions/action_parser";
import Utils from "./actions/utils";
import {getConfig} from "./actions/config/config";

const client: Client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS]
})

client.on('messageCreate', event => {
        try {
            if (event.content.startsWith(Constants.PREFIX))
                action_parser(new CommandType(event.content.slice(Constants.PREFIX.length).split(' ')), event)
        } catch (e) {
        }
    }
)


client.on('guildBanAdd',
    async (ban: GuildBan) => {
        try {
            // @ts-ignore
            await Utils.unsafeAction(ban.guild, 'MEMBER_BAN_ADD', 'serverBanPunishment', client.user.id)
        } catch (e) {
        }
    }
)

client.on('guildMemberRemove',
    async (member) => {
        try {
            // @ts-ignore
            await Utils.unsafeAction(member.guild, 'MEMBER_KICK', 'serverKickPunishment', client.user.id)
        } catch (e) {
        }
    }
)

client.on('roleDelete',
    async (role) => {
        try {
            // @ts-ignore
            await Utils.unsafeAction(role.guild, 'ROLE_DELETE', 'roleDeletePunishment', client.user.id)
        } catch (e) {
        }
    }
)

client.on('guildMemberAdd',
    async (member) => {
        try {
            let guildId = member.guild.id
            let serverConfig = getConfig(guildId)
            if (!serverConfig)
                return

            let {defaultRoles} = serverConfig
            if (defaultRoles.length < 1)
                return

            for (let i = 0; i < defaultRoles.length; i++) {
                let role = await member.guild.roles.fetch(defaultRoles[i])
                // @ts-ignore
                await member.roles.add(role)
            }
        } catch (e) {
        }
    }
)

client.login(Constants.TOKEN)
    .then(_ => console.log('Security Spectrum started!'))
