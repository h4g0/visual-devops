import { collumns } from "../linearprogramming/linear_programming";
import { useSelector,useDispatch } from 'react-redux'
import { updateColumns, updateIndexCols, updateIndexes } from "../update_state/Actions";
import { get_spreadsheet_json } from "./get_spreadsheet._json";


async function read_spreadsheet(doc: any) {
    /*const workbook = xlsx.readFile(doc)
    const sheetNames = workbook.SheetNames;
    
    const obj = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);*/

    const obj = await get_spreadsheet_json(doc)

    
    /*const obj =[
        {
          Vegetables: 'Beans',
          Iron: 0.5,
          Phosphorus: 10,
          Calcium: 200,
          Cost_per_pound: 0.2
        },
        {
          Vegetables: 'Corn',
          Iron: 0.5,
          Phosphorus: 20,
          Calcium: 280,
          Cost_per_pound: 0.18
        },
        {
          Vegetables: 'Broccoli',
          Iron: 1.2,
          Phosphorus: 40,
          Calcium: 800,
          Cost_per_pound: 0.32
        },
        {
          Vegetables: 'Cabbage',
          Iron: 0.3,
          Phosphorus: 30,
          Calcium: 420,
          Cost_per_pound: 0.28
        },
        {
          Vegetables: 'Potatoes',
          Iron: 0.4,
          Phosphorus: 50,
          Calcium: 360,
          Cost_per_pound: 0.16
        }
      ]
    console.log(obj)*/

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
            if( row[key] != null ) vals.push( row[key] )
        
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

export async function read_data(doc: any) {
    const spreadsheet = await read_spreadsheet(doc)

    console.log(spreadsheet)
    const cols = get_cols(spreadsheet)
    const indexes = get_indexes(spreadsheet)
    const index_cols = get_index_cols(spreadsheet)

    return [cols,indexes,index_cols]
}