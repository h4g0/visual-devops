import { collumn, collumns } from "../linearprogramming/linear_programming";

export const DataTypes = {
    Index: "Index",
    Data: "Data"
}

export function get_titles(cols: collumns,index_cols: string[]) {
    let titles = []

    let curr_group: any[] = []

    const col_keys = Array.from(cols.entries()).map( (x: [string,collumn]) => x[0] )

    for( let col of col_keys) {
        if(index_cols.includes(col)) {
            if(curr_group.length > 0) titles.push(curr_group)
            curr_group = []
        }

        curr_group.push(col)
    }

    if(curr_group.length > 0) titles.push(curr_group)

    return titles

}

export function get_types(cols: collumns,index_cols: string[]) {
    let types = []

    let curr_group: any[] = []
   
    const col_keys = Array.from(cols.entries()).map( (x: [string,collumn]) => x[0] )

    for( let col of col_keys ) {
        if(index_cols.includes(col)) {
            if(curr_group.length > 0) types.push(curr_group)
            curr_group = []
        }

        curr_group.push(index_cols.includes(col)  ? DataTypes.Index : DataTypes.Data)
    }

    if(curr_group.length > 0) types.push(curr_group)

    console.log(types)
    return types

}

export function get_data(cols: collumns,index_cols: string[]) {
    let data = []

    let curr_group: any[] = []
    
    const col_keys = Array.from(cols.entries()).map( (x: [string,collumn]) => x[0] )

    for( let col of col_keys) {
        console.log(`${col} ${index_cols}`)
        if(index_cols.includes(col)) {
            if(curr_group.length > 0) data.push(curr_group)
            curr_group = []
        }

        curr_group.push(cols.get(col))
    }

    if(curr_group.length > 0) data.push(curr_group)

    return data

}

