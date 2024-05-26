import TestRailAPI from './TestRailAPI.js';
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
        }
        return this.fields;
    }
    addFieldOptions(fields) {
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].configs[0] && fields[i].configs[0].options) {
                let itemsString = fields[i].configs[0].options.items;
                if (itemsString) fields[i].options = this.parseFieldOptions(itemsString)
            }
        }
        return fields;
    }
    parseFieldOptions(itemsString) {
        let fieldOptions = {};
        let items = itemsString.split("\n");
        for (const item of items) {
            let itemSplit = item.split(",");
            let itemKey = itemSplit[0];
            let itemValue = itemSplit[1];
            fieldOptions[itemKey] = itemValue;
        }
        return fieldOptions;
    }
}