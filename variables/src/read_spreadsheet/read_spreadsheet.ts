import { collumns } from "../linearprogramming/linear_programming";

const xlsx = require("xlsx")

function read_spreadsheet(doc: string) {
    const workbook = xlsx.readFile(doc)
    const sheetNames = workbook.SheetNames;
    
    const obj = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    console.log(obj)
    return obj
}

function get_cols(spreadsheet: any): collumns {
    const cols = new Map<string, string[]>()
    
    const first_row = spreadsheet[0]
    
    console.log(first_row)
    for(let key of Object.keys(first_row)) {
        console.log(key)
        if( key == "Empty") continue

        let vals = []

        for(let row of spreadsheet)
            vals.push( row[key] || 0 )
        
        cols.set(key, vals)
    }
    
    return cols
}

function get_index_cols(spreadsheet: any): string[] {
    let index_cols: string[] = []

    const first_row = spreadsheet[0]

    let index: boolean = true

    for(let key of Object.keys(first_row)){
        
        if (index) {
            index_cols.push(key)
            index = false
        }

        if( key == "Empty") index = true
    }

    return index_cols
}

function get_indexes(spreadsheet: any): Map<string,string> {
    
    let col_indexes = new Map<string,string>()

    const cols = new Map<string, string[]>()
    
    const first_row = spreadsheet[0]
    
    let is_index: boolean = true
    let index: string = ""
    console.log(first_row)
    
    for(let key of Object.keys(first_row)) {
        
        if( is_index) {
            index = key
            is_index = false
        }

        else if( key == "Empty") {
            is_index = true
        }

        else {
            col_indexes.set(key, index)
        }

    }
    
    return col_indexes

}

export function get_data(doc: string) {
    const spreadsheet = read_spreadsheet(doc)

    const cols = get_cols(spreadsheet)
    const indexes = get_indexes(spreadsheet)
    const index_cols = get_index_cols(spreadsheet)
}

get_data("test.xlsx")