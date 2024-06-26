import TestRailAPI from './TestRailAPI.js';
import Config from '../config/Config.js';
export default class FieldReader {
    constructor() {
        this.testRailAPI = new TestRailAPI();
    }
    async getFields() {
        if (!this.fields) {
            let fields = await this.testRailAPI.getSupportedFields();
            for (let i = 0; i < fields.length; i++) {
                let itemsString = fields[i].configs[0].options.items;
                if (itemsString) fields[i].options = this.parseFieldOptions(itemsString)
            }
            this.fields = this.addFieldOptions(fields);
            this.fields = this.addPriorityOptions(fields);
        }
        return this.fields;
    }
    addFieldOptions(fields) {
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].configs[0] && fields[i].configs[0].options) {
                let itemsString = fields[i].configs[0].options.items;
                if (itemsString) fields[i].options = this.parseFieldOptions(itemsString);
            }
        }
        return fields;
    }
    addPriorityOptions(fields){
        fields.push(Config.testrail.priority);
        return fields;
    }
    parseFieldOptions(itemsString) {
        let fieldOptions = {};
        let items = itemsString.split("\n");
        for (const item of items) {
            let itemSplit = item.split(",");
            let itemKey = itemSplit[0];
            let itemValue = itemSplit[1].trim();
            fieldOptions[itemKey] = itemValue;
        }
        return fieldOptions;
    }
}