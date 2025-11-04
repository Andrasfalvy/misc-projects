import ParseError from "./ParseError";

export default class Reader {
    private readonly str: string;
    private index: number;
    constructor(str: string) {
        this.str = str;
        this.index = 0;
    }

    peek(offset: number = 0, length: number = 1): string {
        return this.str.substring(this.index + offset, this.index + offset + length);
    }
    read(length: number = 1): string {
        let result = this.str.substring(this.index, this.index + length);
        this.index += length;
        return result;
    }
    readUntil(predicate: (char: string) => boolean): string;
    readUntil(target: string): string;
    readUntil(predicate: ((char: string) => boolean) | string): string {
        let result = "";
        if (typeof predicate == "string") {
            predicate = c => c == predicate;
        }
        while (!this.isEOF() && !predicate(this.peek())) {
            result += this.read();
        }
        return result;
    }
    readWhile(predicate: (char: string) => boolean): string {
        let result = "";
        while (!this.isEOF() && predicate(this.peek())) {
            result += this.read();
        }
        return result;
    }
    matches(str: string) {
        return this.str.startsWith(str, this.index);
    }
    isEOF() {
        return this.index >= this.str.length;
    }
    skip(amount: number = 1) {
        this.index += amount;
    }
    skipWhitespace() {
        this.skipWhile(c => /^\s*$/.test(c));
    }
    skipWhile(predicate: (char: string) => boolean) {
        while (!this.isEOF() && predicate(this.peek())) {
            this.index++;
        }
    }
    skipUntil(predicate: (char: string) => boolean) {
        while (!this.isEOF() && !predicate(this.peek())) {
            this.index++;
        }
    }
    expectChar<C extends string>(char: C): C;
    expectChar<C extends string[]>(char: C): C[number];
    expectChar(char: string | string[]): string {
        if (this.peek() == char) {
            return this.read();
        }
        this.throwChar(`Expected ${char}, got ${this.peek()}`);
    }
    throwChar(msg: string): never {
        throw new ParseError(msg, this.index, this.index+1);
    }
    throwText(length: number, msg: string) {
        throw new ParseError(msg, this.index, this.index + length);
    }
}