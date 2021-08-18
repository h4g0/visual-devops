"use strict";
exports.__esModule = true;
exports.get_data = void 0;
var xlsx = require("xlsx");
function read_spreadsheet(doc) {
    var workbook = xlsx.readFile(doc);
    var sheetNames = workbook.SheetNames;
    var obj = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    console.log(obj);
    return obj;
}
function get_cols(spreadsheet) {
    var cols = new Map();
    var first_row = spreadsheet[0];
    console.log(first_row);
    for (var _i = 0, _a = Object.keys(first_row); _i < _a.length; _i++) {
        var key = _a[_i];
        console.log(key);
        if (key == "Empty")
            continue;
        var vals = [];
        for (var _b = 0, spreadsheet_1 = spreadsheet; _b < spreadsheet_1.length; _b++) {
            var row = spreadsheet_1[_b];
            vals.push(row[key] || 0);
        }
        cols.set(key, vals);
    }
    return cols;
}
function get_index_cols(spreadsheet) {
    var index_cols = [];
    var first_row = spreadsheet[0];
    var index = true;
    for (var _i = 0, _a = Object.keys(first_row); _i < _a.length; _i++) {
        var key = _a[_i];
        if (index) {
            index_cols.push(key);
            index = false;
        }
        if (key == "Empty")
            index = true;
    }
    return index_cols;
}
function get_indexes(spreadsheet) {
    var col_indexes = new Map();
    var cols = new Map();
    var first_row = spreadsheet[0];
    var is_index = true;
    var index = "";
    console.log(first_row);
    for (var _i = 0, _a = Object.keys(first_row); _i < _a.length; _i++) {
        var key = _a[_i];
        if (is_index) {
            index = key;
            is_index = false;
        }
        else if (key == "Empty") {
            is_index = true;
        }
        else {
            col_indexes.set(key, index);
        }
    }
    return col_indexes;
}
function get_data(doc) {
    var spreadsheet = read_spreadsheet(doc);
    console.log(get_cols(spreadsheet));
    console.log(get_indexes(spreadsheet));
    console.log(get_index_cols(spreadsheet));
}
exports.get_data = get_data;
get_data("test.xlsx");
