import FileReader from '../file/FileReader.js';

export default class Config {
    static _instanceCache;
    static get instance() {
        if (!this._instanceCache) this._instanceCache = new this();
        return this._instanceCache;
    }
    constructor() { }
    static get report() {
        return JSON.parse(FileReader.readFile('./config/report.json'));
    }
    static get testrail() {
        return JSON.parse(FileReader.readFile('./config/testrail.json'));
    }
}