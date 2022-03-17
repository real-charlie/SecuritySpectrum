export default class CommandType {
    index = 0;
    constructor(private message: Array<string>) {}
    get(): string | null {
        return this.message[this.index++] || null
    }
}
