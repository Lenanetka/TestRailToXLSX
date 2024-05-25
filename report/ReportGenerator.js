import Config from '../config/Config.js';
import TestCaseReader from '../testrail/TestCaseReader.js';
import TestRailAPI from '../testrail/TestRailAPI.js';
import Report from './Report.js';
import ReportWriterXLSX from './ReportWriterXLSX.js';
export default class ReportGenerator {
    constructor() {
    }
    async generate(name) {
        this.report = new Report(name);
        let tabConfigs = Config.report;
        for (const tabConfig of tabConfigs) {
            this.report.addTab(tabConfig.name);
            this.report.addResult(await this.generateResult(tabConfig));
        }
    }
    async generateResult(tabConfig) {
        let result = [];
        let testCaseReader = new TestCaseReader()
        let testCases = await testCaseReader.read(tabConfig);
        let fields = await this.getSupportedFields();
        result.push(this.getColumnsNames(tabConfig.columns, fields));
        let groupCurrent;
        let sectionCurrent;
        for (const testCase of testCases) {
            if (tabConfig.show_groups && testCase[tabConfig.group_by] != groupCurrent) {
                groupCurrent = testCase[tabConfig.group_by];
                let groupLine = [null, groupCurrent];
                result.push(groupLine);
            }
            if (testCase.section.depth < tabConfig.sections_max_depth && testCase.section.name != sectionCurrent) {
                sectionCurrent = testCase.section.name;
                let sectionLine = [null, sectionCurrent];
                if (JSON.stringify(result[result.length - 1]) != JSON.stringify(sectionLine)) result.push(sectionLine);
            }
            let line = this.generateLine(testCase, tabConfig.columns);
            result.push(line);
        }
        return result;
    }
    generateLine(testCase, columns) {
        let line = [];
        for (const column of columns) {
            line.push(testCase[column]);
        }
        return line;
    }
    async getSupportedFields() {
        let testRailAPI = new TestRailAPI();
        let fields = await testRailAPI.getSupportedFields();
        return fields;
    }
    getColumnsNames(columns, fields) {
        let columnsNames = [];
        for (const column of columns) {
            let field = fields.find(x => x.system_name === column);
            let columnName = field ? field.label : column[0].toUpperCase() + column.substring(1);
            columnsNames.push(columnName);
        }
        return columnsNames;
    }
    saveToXLSX() {
        let reportWriterXLSX = new ReportWriterXLSX(this.report.name);
        for (const tab of this.report.tabs)
            reportWriterXLSX.addTabToFile(tab.content, tab.name);
    }
}