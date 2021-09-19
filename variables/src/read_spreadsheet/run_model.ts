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

    let mults = []
    
    const col_expr = `[a-zA-Z]+(\\[.*\\]])+`
    const num_expr = `[0-9]+((\\.)[0-9]+)*`
    
    const mults_rigth = statement.match(new RegExp(`\\([^\\)]*\\) X ${num_expr}`,"g")) || []
    const mults_left = statement.match(new RegExp(`${num_expr} X \\([^\\)]*\\)`,"g")) || []

    console.log(new RegExp(`\\(.*\\) X ${num_expr}`,"g"))
    console.log(mults_rigth)
    console.log(mults_left)

    mults.push(...mults_rigth)
    mults.push(...mults_left)

    console.log(mults)
    for( let el = 0; el < mults.length; el++ ) {
        const mult = mults[el]
        const part1_part2 = mult.split(" X ") 
        if(part1_part2.length < 2) continue

        const part1 = el < mults_rigth.length ? part1_part2[0] : part1_part2[1]
        const part2 = el < mults_rigth.length ? part1_part2[1] : part1_part2[0]

        console.log(part1)
        

        let elements_string= part1.replace(/[\(\)]/g,"")
        let new_elements = "" + elements_string

        elements_string = elements_string.replace(/[\+\-]/g,"")
        let elements = elements_string.split(" ")
        console.log(elements)
        elements = elements.filter( (x: string) => x != " " && x != "")

        console.log(elements)
        for(let element of elements) {
            const numerical_values = element.match(new RegExp(num_expr,"g")) || []

            if( numerical_values.length > 0 ) {
                const new_element = element.replace(numerical_values[0], "" + parseFloat(numerical_values[0]) * parseFloat(part2))
                new_elements = new_elements.replace(element,new_element)
            }

            else {
                const new_element = `${part2}${element}`
                new_elements = new_elements.replace(element,new_element)
            }

        }

        new_statement = new_statement.replace(mult,new_elements)
        
    }

    return new_statement

}

function get_values(statement: string) {
    
    let values = new Map<string,number>()

    let new_statement = statement.replace(/\+[ ]/g,"+")
    new_statement = new_statement.replace(/\-[ ]/g,"-")

    const num_expr = `[0-9]+((\\.)[0-9]+)*`
    const var_expr = `[a-zA-Z]+(\\[[^\\]]*\\])+`
    const val_expr = `([\\+\\-])?(${num_expr})?${var_expr}`

    console.log(new_statement)
    console.log(new RegExp(val_expr,"g"))
    const values_list = new_statement.match(new RegExp(val_expr,"g")) || []
    console.log(values_list)
    for(let value of values_list) {
        new_statement = new_statement.replace(value,"")

        const sign = value[0] == "-" ? -1 : 1
        value = value.replace(/[\+\-]/g,"")

        const numerical_value = parseFloat( (value.match(new RegExp(num_expr)) || ["1"])[0] )

        const variables = ( value.match(new RegExp(var_expr)) || [] )
        if( variables.length == 0) continue
        const variable = variables[0]

        const past_value = values.get(variable) || 0

        values.set(variable, past_value + numerical_value * sign )
    }

    const numerical_expr = `([\\+\\-])?(${num_expr})`
    const numerical_values = new_statement.match(new RegExp(numerical_expr,"g")) || []

    console.log(numerical_values)

    const constant = numerical_values.reduce( (acc: number, curr: string) => {
        const sign = curr[0] == "-" ? -1 : 1
        curr = curr.replace(/[\+\-]/g,"")

        return acc + parseFloat(curr) * sign
    }, 0)

    console.log(values)

    console.log(constant)

    return [values,constant]

}

function parse_objective(indexes: Map<string,string>,index_cols: string[],columns: Map<string,string[]>,goal: string,objective: string){
    const replaced_objective = replace_values(objective, columns,indexes)
    const simpliflid_mult_objective = simplify_mults(replaced_objective)
    
    console.log(simpliflid_mult_objective)

    const values = get_values(simpliflid_mult_objective)

    return simpliflid_mult_objective
}

export function run_model(indexes: Map<string,string>,index_cols: string[],columns: Map<string,string[]>,goal: string,objective: string): Map<string,string>{
    let solution = new Map<string,string>()

    parse_objective(indexes ,index_cols ,columns ,goal ,objective )
    return solution
}
