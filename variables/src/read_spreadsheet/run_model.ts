const SimpleSimplex = require('simple-simplex');

function replace_values(statement: string,columns: Map<string,string[]>,indexes: Map<string,string>): string {
    let new_statement = "" + statement
    let elements = statement.match(/[a-zA-Z]+(\[[a-zA-Z]+\])+/g) || []

    for(let element of elements) {
        const col_indexes = get_col_indexes(element)

        if(col_indexes.length > 2) continue

        const col = col_indexes[0]
        const index = col_indexes[1]

        const col_vals = columns.get(col) || []

        if(col_vals.length == 0) continue

        const index_col_name = indexes.get(col) || ""

        if(index_col_name == "") continue

        const index_col = columns.get(index_col_name) || []

        if(index_col.length == 0) continue

        const index_col_pos = index_col.indexOf(index)

        if(index_col_pos == -1 || index_col_pos > col_vals.length) continue

        const value = col_vals[index_col_pos]

        new_statement = new_statement.replace(element,value)
    }

    return new_statement
}

function get_col_indexes(statement: string): string[] {
    let new_statement = "" + statement
    new_statement = statement.replace(/\]/g,"")

    const col_indexes = new_statement.split(/\[/g) || []

    return col_indexes
}

function simplify_subtrs(statement: string): string {
    let new_statement = "" + statement

    const subtrs = statement.match(/\- \(.+\)/g) || []

    for(let subtr of subtrs) {
        let new_subtr = "" + subtr
        new_subtr = new_subtr.slice(3,new_subtr.length - 1)
        new_subtr = new_subtr.replace(/\-/g,"PLUS")
        new_subtr = new_subtr.replace(/\+/g,"-")
        new_subtr = new_subtr.replace(/PLUS/g,"+")

        new_statement = new_statement.replace(subtr,new_subtr)
    }

    return new_statement
}

function simplify_mults(statement: string): string {
    let new_statement = "" + statement

    const mults = statement.match(/\([a-zA-Z0-9 \_\[\]]*\) X ([0-9]*|[a-zA-Z]+(\[[a-zA-Z]*\]))+/g) || []

    for( let mult of mults ) {
        const part1_part2 = mult.split(" X ") 
        if(part1_part2.length < 2) continue

        const part1 = part1_part2[0]
        const part2 = part1_part2[1]

        let elements_string= part1.replace(/[\(\)]/g,"")
        elements_string = elements_string.replace(/[\+\-]/g,"")
        let elements = elements_string.split(" ")
        elements = elements.filter( (x: string) => x != " ")

        for(let element of elements) {
            const col_indexes = get_col_indexes(element)

            if(col_indexes.length > 2) continue

            const col = col_indexes[0]
            const indexes = col_indexes.slice(1)


        }
        
    }

    return new_statement

}

function parse_objective(goal: string,objective: string){

}

export function run_model(indexes: Map<string,string>,index_cols: string[],columns: Map<string,string[]>,goal: string,objective: string): Map<string,string>{
    let solution = new Map<string,string>()


    return solution
}
