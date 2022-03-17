import Constants from "../../constants";

const fs = require('fs')
export const getConfig = (guildId: string | null) => {
    if (guildId !== null)
        return JSON.parse(fs.readFileSync(Constants.GUILD_CONFIG_FILENAME, 'utf8'))[guildId]
}

export const setConfig = (guildId: string | null, serverConfigs: any) => {
    if (guildId !== null) {
        const data = JSON.parse(fs.readFileSync(Constants.GUILD_CONFIG_FILENAME, 'utf8'))
        data[guildId] = serverConfigs
        fs.writeFileSync(Constants.GUILD_CONFIG_FILENAME, JSON.stringify(data), 'utf8')
    }
}

export const createConfig = (guildId: string | null) => {
    if (guildId !== null) {
        const data = JSON.parse(fs.readFileSync(Constants.GUILD_CONFIG_FILENAME, 'utf8'))
        data[guildId] = {
            "admins": [],
            "admin_acceptedValues": [Constants.USER_TYPE],
            "exceptions": [],
            "exception_acceptedValues": [Constants.USER_TYPE],
            "sensitiveRoles": [],
            "sensitiveRoles_acceptedValues": [Constants.ROLE_TYPE],
            "serverBanPunishment": [Constants.DEFAULT_PUNISHMENT],
            "serverBanPunishment_acceptedValues": Constants.PUNISHMENT_TYPE,
            "serverKickPunishment": [Constants.DEFAULT_PUNISHMENT],
            "serverKickPunishment_acceptedValues": Constants.PUNISHMENT_TYPE,
            "roleDeletePunishment": [Constants.DEFAULT_PUNISHMENT],
            "roleDeletePunishment_acceptedValues": Constants.PUNISHMENT_TYPE,
            "defaultRoles": [],
            "defaultRoles_acceptedValues": [Constants.ROLE_TYPE]
        }
        fs.writeFileSync(
            Constants.GUILD_CONFIG_FILENAME,
            JSON.stringify(data),
            'utf8'
        )
        return data
    }
}
