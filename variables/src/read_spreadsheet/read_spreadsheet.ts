const xlsx = require("xlsx")

function read_spreadsheet(doc: string) {
    const workbook = xlsx.readFile(doc)
    var sheetNames = workbook.SheetNames;
    
    var obj = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    console.log(obj)
}

function get_cols(spreadsheet: any): Map<string, (number | string)[]>{
    const cols = new Map<string, ( number | string ) []>()

    
    return cols
}

export function get_data(doc: string) {
    const spreadsheet = read_spreadsheet(doc)

}

read_spreadsheet("test.xlsx")