const single_var = "single"
const col_var = "col"
const mat_var = "mat"

type Operation_type = "X" | "-" | "+" | "<=" | ">=" | "=" | "<" | ">"

type Var_type = "single" | "col" | "mat"

type formula =  string[]

type my_variable = {
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
                formula: [item1,item1]
            })
        
    

    return variable
}

export function  generate_col_variable(cols: collumns, name: string, col: string): variables {
    let variable: variables = new Map<string, my_variable>()

    const col_items = cols.get(col)

    if (col_items == undefined) return variable

    for( let item of  col_items)
        variable.set(`${name}[${item}]`,{name: name, type: col_var, formula: [item]})

    return variable
}

export function generate_single_variable(name: string): variables {
    let variable: variables = new Map<string,my_variable>()
    variable.set(name,  {name: name, type: single_var, formula: []})

    return variable
}

export function generate_inequality_operation(operation: string, prev_statement: string, next_statement: string) {
    
}

export function generate_operation(operation: string,prev_statement: string, next_statement: string, 
            vars: variables, cols: collumns) {

    const inequality_operations = ["<=",">=","=",">","<"]
    
    if(inequality_operations.includes(operation))
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


export const variable_indexs: [string, string] = ["Cargo", "Compartment"]

export function stringify_variables(model_variables: variables): string {
    
    return Array.from(model_variables.keys()).map((element: any ,index: any) => {
        return "" + element[0] + element[1].map((e: any,i: any) => {
            return "[" + e + "]"
        }).join("")
    }).join("\n")

}



