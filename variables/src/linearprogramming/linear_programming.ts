const single_var = "single"
const col_var = "col"
const mat_var = "mat"

type Operation_type = "X" | "-" | "+" | "<=" | ">=" | "=" | "<" | ">"

type Var_type = "single" | "col" | "mat"

type formula =  string[]

export type my_variable = {
    name: string,
    type: Var_type
    formula: formula
}

export type variables = Map<string, my_variable>

export type statement = {
    value: string,
    type: string 
}

export type expression = statement[]

export type expressions = expression[]

export type aux_variables =  Map<string, number>

export type collumn = string[]
export type collumns = Map<string, collumn>

export function generate_matrix_variable_index(name: string,col1: string, col2: string):  [string,string[]] {
   
    return [name, [col1,col2]]

}


export function generate_matrix_variable(cols: collumns, name: string,col1: string, col2: string): variables {
    let variable: variables = new Map<string,my_variable>()

    const col1_items = cols.get(col1)
    const col2_items = cols.get(col2)

    if( col1_items == undefined || col2_items == undefined ) return variable

    for (let item1 of col1_items) 
        for (let item2 of col2_items)
            variable.set(`${name}[${item1}][${item2}]`,{
                name: name,
                type: mat_var,
                formula: [item1,item2]
            })
        
    

    return variable
}


export function generate_col_variable_index(name: string,col1: string): [string,string[]]{

    return [name, [col1]]

}

export function  generate_col_variable(cols: collumns, name: string, col: string): variables {
    let variable: variables = new Map<string, my_variable>()

    const col_items = cols.get(col)

    if (col_items == undefined) return variable

    for( let item of  col_items)
        variable.set(`${name}[${item}]`,{name: name, type: col_var, formula: [item]})

    return variable
}

export function generate_single_variable_index(name: string): [string,string[]] {

    return [name,[]]

}

export function generate_single_variable(name: string): variables {
    let variable: variables = new Map<string,my_variable>()
    variable.set(name,  {name: name, type: single_var, formula: []})

    return variable
}

function get_indexes(statement: string): string[] {
    const indexes = statement.match(/index_[a-zA-Z0-9]+/g)
    const clean_indexes = indexes == undefined ? [] : indexes.map( (x: string) => x.replace("index_","")) 

    return clean_indexes
}

export function generate_mul_operation(statement1: string, statement2: string,cols: collumns): string {
    
    const indexes_stat1 = get_indexes(statement1)
    const indexes_stat2 = get_indexes(statement2)
    
    const matchs = indexes_stat1.filter( (x: string) => indexes_stat2.includes(x))

    if(matchs.length == 0) return `${statement1} X ${statement2}`

    const match = matchs[0]

    const index_values = ( cols.get(match) as collumn )

    let expr: string = ""

    for (let i = 0; i < index_values.length; i++) {
        const index_value = index_values[i]
        const new_stat1 = statement1.replace(`index_${match}`, index_value)
        const new_stat2 = statement1.replace(`index_${match}`, index_value)
        expr += `${new_stat1} X ${new_stat2}`
        if (i < index_values.length - 1) expr += " + "
         
    }

    return expr

    
}

function get_index(exp: string): string {
    const index_exp = /index_[a-zA-Z0-9]+/
    const index = exp.match(index_exp) || []
    const clean_index = index[0].replace("index_","")

    return clean_index
}

function get_non_expanded_expr(statement: string): string[] {
    const index_exp = /index_[a-zA-Z0-9]+/
    //const non_exp = statement.match(/[a-zA-Z0-9]+(\[index_[a-zA-Z0-9]+\])+/g) || []
    const non_exp = statement.match(/[a-zA-Z]+(\[index_[a-zA-Z0-9]+\])+/g) || []

    console.log((non_exp))

    return non_exp
}

export function fix_expression(expr: string,cols: collumns): string {
    console.log("fix expression")
    const non_exp = get_non_expanded_expr(expr)
    let new_expr: string = expr
    console.log(expr)
    console.log(non_exp)
    for(let exp of non_exp) {
        const index = get_index(expr)
        const vals = cols.get(index) || []

        let new_exp: string = ""

        for(let i = 0; i < vals.length; i++) {
            const val = vals[i]
            if(i > 0) new_exp += " + "
            new_exp += exp.replace(`index_${index}`,val)
        }
            
        

        new_expr = new_expr.replace(exp,new_exp)

    }

    console.log("fix expression")

    return new_expr
}

export function generate_inequality_operation(operation: string,cols: collumns, prev_statement: string, next_statement: string) {
    let constraints: string[] = []
    const indexes_prev = get_indexes(prev_statement)
    const indexes_next = get_indexes(next_statement)

    console.log(`${prev_statement} ${next_statement}`)
    const matchs = indexes_prev.filter( (x: string) => indexes_next.includes(x))
    
    for (let match of matchs) {
        const values = ( cols.get(match) as collumn)
        for (let value of values) {
            const new_prev_statement  = prev_statement.replace(`index_${match}`,value)
            const new_next_statement  = next_statement.replace(`index_${match}`,value)

            constraints.push( `${new_prev_statement} ${operation} ${new_next_statement}` )
        }
    }

    return constraints
}

export function gen_operation(op: string, cols: collumns, prev_statement: string, next_statement: string){
    const indequality_ops= ["<",">","<=",">=","="]

    if (indequality_ops.includes(op)) return generate_inequality_operation(op, cols,prev_statement,next_statement).join("\n")

    if(op == "X") return generate_mul_operation(prev_statement,next_statement,cols)
    if(op == "+") 
    return ""
}

export var model1_cols:collumns = new Map<string , collumn>()

model1_cols.set("Compartment", ["Front", "Center", "Rear"])
model1_cols.set("Weigth_capacity", ["10","16","18"])
model1_cols.set("Space_capacity", ["6800","8700","5300"])
model1_cols.set("Cargo",["C1","C2","C3","C4"])
model1_cols.set("Weigth",["18","15","23","12"])
model1_cols.set("Volume", ["480","650","580","390"])
model1_cols.set("Profit", ["310","380","350","285"])

export var indexes: Map<string,string> = new Map<string,string>()

indexes.set("Compartment", "Compartment")
indexes.set("Weight_capacity", "Compartment")
indexes.set("Space_capacity", "Compartment")
indexes.set("Cargo","Cargo")
indexes.set("Weight","Cargo")
indexes.set("Volume", "Cargo")
indexes.set("Profit", "Cargo")

let input_vars: string[] = [ "Cargo_quantity = Cargo x Compartment" ] 


export let variable_indexs: Map<string, string[]> = new Map<string,string[]>()

variable_indexs.set("CompartmentCargo",["Cargo","Compartment"])


export let model1_variables = generate_matrix_variable(model1_cols, "CompartmentCargo","Compartment","Cargo")

export function stringify_variables(vars: variables): string {
    let vars_str: string[] = []
    let iterator = vars.keys()
    let value = ""

    while( value = iterator.next().value ) 
        vars_str.push( value )
    
    return (vars_str.join("\n"))
}