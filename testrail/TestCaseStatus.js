import Config from '../config/Config.js';
export default class TestCaseStatus {
    constructor() {
    }
    addStatusToTestCases(testCases) {
        for (let i = 0; i < testCases.length; i++) {
            let s = this.getStatusOfTestCase(testCases[i]);
            s ? testCases[i].statistics_status = s: testCases[i].statistics_status = Config.statistics.skipped_status;
        }
        return testCases;
    }
    getStatusOfTestCase(testCase) {
        let result;
        let config = Config.statistics.rules;
        let statuses = Object.keys(config);
        for (const status of statuses) {
            let rules = config[status];
            for (const rule of rules) {
                if (this.ruleIsValid(testCase, rule)) result = status;
            }
        }
        return result;
    }
    ruleIsValid(testCase, rule) {
        let isValid = true;
        let fields = Object.keys(rule);
        for (const field of fields)
            if (testCase[field] != rule[field]) isValid = false;
        return isValid;
    }
}