"use strict";
exports.__esModule = true;
exports.read_spreadsheet = void 0;
var xlsx = require("xlsx");
function read_spreadsheet(doc) {
    var workbook = xlsx.readFile(doc);
    var sheetNames = workbook.SheetNames;
    var obj = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    console.log(obj);
}
exports.read_spreadsheet = read_spreadsheet;
read_spreadsheet("test.xlsx");
