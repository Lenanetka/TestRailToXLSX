import TestRailAPI from './TestRailAPI.js';
import FieldReader from './FieldReader.js';
import TestCaseStatus from './TestCaseStatus.js';
export default class TestCaseReader {
    constructor() {
        this.testRailAPI = new TestRailAPI();
        this.fieldReader = new FieldReader();
        this.testCaseStatus = new TestCaseStatus();
    }
    async read(config) {
        let testCases = await this.testRailAPI.getTestCases(config.project_id, config.suite_id, config.filters);
        let sections = await this.testRailAPI.getSections(config.project_id, config.suite_id);
        let fields = await this.fieldReader.getFields();
        testCases = this.addSectionsInfoToTestCases(testCases, sections);
        testCases = await this.setValuesToLabelsInTestCases(testCases, fields);
        testCases = this.testCaseStatus.addStatusToTestCases(testCases);
        testCases = this.groupTestCases(testCases, config.group_by);
        console.log(`${testCases.length} test-cases found for ${config.name} tab`);
        return testCases;
    }
    groupTestCases(testCases, group_by) {
        if (group_by)
            testCases = testCases.sort(
                (a, b) => {
                    const aValue = a[group_by] || "";
                    const bValue = b[group_by] || "";
                    return aValue.toString().localeCompare(bValue.toString());
                }
            );
        return testCases;
    }
    addSectionsInfoToTestCases(testCases, sections) {
        for (let i = 0; i < testCases.length; i++) {
            testCases[i].section = sections.find(x => x.id === testCases[i].section_id);
        }
        return testCases;
    }
    async setValuesToLabelsInTestCases(testCases, fields) {
        for (let i = 0; i < testCases.length; i++) {
            let properties = Object.keys(testCases[i]);
            for (let j = 0; j < properties.length; j++) {
                let field = await fields.find(x => x.system_name === properties[j]);
                if (field && field.options) {
                    let key = testCases[i][properties[j]];
                    let label = field.options[key];
                    testCases[i][properties[j]] = label;
                }
            }
        }
        return testCases;
    }
}