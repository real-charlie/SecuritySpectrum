export default class Constants {
    public static TOKEN = 'OTQ4OTIyNTIzNjQ5NzI4NTg0.YiC29w.BB-4SXW3hxPqmGZ8brrdae_FeYQ'
    public static PREFIX = 'ss!'
    public static GUILD_CONFIG_FILENAME = './script/actions/config/guilds.json'
    public static ERROR_EMBED_COLOR = '#880000'
    public static INFO_EMBED_COLOR = '#0099FF'
    public static SUCCESS_EMBED_COLOR = '#00FF88'
    public static INVALID_ARGUMENT_MESSAGE = 'Invalid argument has been provided.'
    public static NO_ARGUMENT_MESSAGE = 'No argument has been provided.'
    public static BAN_PUNISHMENT = 'ban'
    public static KICK_PUNISHMENT = 'kick'
    public static TIMEOUT_PUNISHMENT = 'timeout'
    public static NONE_PUNISHMENT = 'timeout'
    public static DEFAULT_PUNISHMENT = Constants.NONE_PUNISHMENT
    public static USER_TYPE = '--usr'
    public static ROLE_TYPE = '--role'
    public static PUNISHMENT_TYPE = ['ban', 'kick', 'timeout', 'none']
    public static TIMEOUT_TIME = 60 * (60 * 1000)
}
