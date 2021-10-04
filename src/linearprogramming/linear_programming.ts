import { booleanLiteral } from "@babel/types"

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

function get_inequality_indexes(statement: string): string[] {
    const indexes = statement.match(/each_index_[a-zA-Z0-9]+/g)
    const clean_indexes = indexes == undefined ? [] : indexes.map( (x: string) => x.replace("each_index_","")) 

    return clean_indexes
}

export function generate_mul_operation(statement1: string, statement2: string,cols: collumns): string {
    
    const isNumerical = (x: string) => !isNaN(parseFloat(x))

    if( isNumerical(statement1) && isNumerical(statement2) ) 
            return "" + parseFloat(statement1) * parseFloat(statement2) 
    
    if( isNumerical(statement1) ) return `${statement1} X ( ${statement2} )`
    if( isNumerical(statement2) ) return `( ${statement1} ) X ${statement2} `

    const statement1_removed_sign_spaces = statement1.replace(/\+/g, "").replace(/\- /g,"-")
    const statement2_removed_sign_spaces = statement2.replace(/\+/g, "").replace(/\- /g,"-")

    const statement1_elements = statement1_removed_sign_spaces.split(" ").filter( ( x: string ) => x != " " && x != "" )
    const statement2_elements = statement2_removed_sign_spaces.split(" ").filter( ( x: string ) => x != " " && x != "" )
    
    let expr = ""

    if( statement1_elements.length == 1 || statement2_elements.length == 1) {

    for( let raw_element1 of statement1_elements ) {
        const sign_1 = ( raw_element1.match(/\-/) || [] ).length == 0 ? 1 : -1
        const element1 = raw_element1.replace(/\-/g,"")

        for( let raw_element2 of statement2_elements ) {
            const sign_2 = ( raw_element2.match(/\-/) || [] ).length == 0 ? 1 : -1
            const element2 = raw_element2.replace(/\-/g,"")
            
            const sign = sign_1 * sign_2

            if(sign == -1) expr += ` -  ( ${element1} X ${element2} )`

            if(sign == 1)  expr += ` +  ( ${element1} X ${element2} )`
        }
    }

    }

    else if(statement1_elements.length == statement2_elements.length) {
        for( let i = 0; i < statement1_elements.length; i++ ) {
            const raw_element1 = statement1_elements[i]
            const raw_element2 = statement2_elements[i]

            const sign_1 = ( raw_element1.match(/\-/) || [] ).length == 0 ? 1 : -1
            const element1 = raw_element1.replace(/\-/g,"")
    
            const sign_2 = ( raw_element2.match(/\-/) || [] ).length == 0 ? 1 : -1
            const element2 = raw_element2.replace(/\-/g,"")
                
            const sign = sign_1 * sign_2
    
            if(sign == -1) expr += ` -  ( ${element1} X ${element2} )`
    
            if(sign == 1)  expr += ` +  ( ${element1} X ${element2} )`
            
        }
    }

    else alert("Couldn't compile model do to differents sized columns being multiplied")
   
    expr = expr.replace(/ \+  \+ /g,"+")
    expr = expr.replace(/ \-  \- /g,"+")
    expr = expr.replace(/ \+  \- /g,"-")
    expr = expr.replace(/ \-  \+ /g,"-")

    return expr

}

function get_index(exp: string): string {
    const index_exp = /index_[a-zA-Z0-9]+/
    const index = exp.match(index_exp) || []
    const clean_index = index[0].replace("sum_index_","").replace("each_index_","").replace("index_","")

    return clean_index
}

function get_non_expanded_expr(statement: string): string[] {
    const index_exp = /sum_index_[a-zA-Z0-9\_]+/
    //const non_exp = statement.match(/[a-zA-Z0-9]+(\[index_[a-zA-Z0-9]+\])+/g) || []
    const non_exp = statement.match(/[a-zA-Z0-9\_]+(\[sum_index_[a-zA-Z0-9]+\])+/g) || []

    console.log((non_exp))

    return non_exp
}

function get_vars_cols(statement: string): string[] {
    //const non_exp = statement.match(/[a-zA-Z0-9]+(\[index_[a-zA-Z0-9]+\])+/g) || []
    const vars_cols_exp = statement.match(/[a-zA-Z0-9\_]+(\[[a-zA-Z0-9\_]+\])+/g) || []

    return vars_cols_exp.map( (x: string) => x.replace(/\[.*\]/g,""))
}

export function fix_expression(expr: string,cols: collumns): string {
    console.log("fix expression")
    const non_exp = get_non_expanded_expr(expr)
    
    expr = expr.replace(/ \+  \+ /g,"+")
    expr = expr.replace(/ \-  \- /g,"+")
    expr = expr.replace(/ \+  \- /g,"-")
    expr = expr.replace(/ \-  \+ /g,"-")
    console.log(expr)
    expr = expr.replace(/^[ ]\+/g,"")

    console.log(expr)

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
            new_exp += exp.replace(`sum_index_${index}`,val)
        }
            
        new_expr = new_expr.replace(exp,new_exp)

    }

    console.log("fix expression")
    
    return new_expr
}

function expand_numerical_left_right_side(expr: string,cols: collumns){

    const non_exp = get_non_expanded_expr(expr)
    let exprs = []

    for( let exp of non_exp) {
        const index = get_index(expr)
        const vals = cols.get(index) || []

        let new_exp: string = ""

        for(let i = 0; i < vals.length; i++) {
            const val = vals[i]
            if(i > 0) new_exp += "\n"
            new_exp = exp.replace(`sum_index_${index}`,val)
            exprs.push(expr.replace(exp,new_exp))
        }

    }

    if( exprs.length == 0) exprs.push(expr)

    return exprs
}

export function generate_inequality_operation(operation: string,cols: collumns, prev_statement: string, next_statement: string) {
    let constraints: string[] = []
    const indexes_prev = get_inequality_indexes(prev_statement)
    const indexes_next = get_inequality_indexes(next_statement)

    console.log(`${prev_statement} ${next_statement}`)
    const matchs = indexes_prev

    console.log(prev_statement)
    console.log(next_statement)

    console.log("indexes_prev")
    console.log(indexes_prev)
    console.log("indexes_next")
    console.log(indexes_next)

    console.log(matchs)
    for(let index of indexes_next){
        if(!indexes_prev.includes(index))
            matchs.push(index)
    }

    const expression_numerical = /^[ 0-9]+$/g
    
    if(expression_numerical.test(prev_statement) || expression_numerical.test(next_statement))
        return  expand_numerical_left_right_side(`${prev_statement} ${operation} ${next_statement}`,cols)
    
    let past_statements = [[prev_statement,next_statement]]

    console.log("matchs")
    console.log(matchs)

    for (let match of matchs) {
        const values = ( (cols.get(match) || [] ) as collumn)
        let new_past_statements = []
        for (let value of values) {
            for(let statement of past_statements) {
                const reg_expr = new RegExp(`each\_index\_${match}`,"g")
                const new_prev_statement  = statement[0].replace(reg_expr,value)
                const new_next_statement  = statement[1].replace(reg_expr,value)

                new_past_statements.push([new_prev_statement,new_next_statement])
            }
          
        }
        
        past_statements = new_past_statements

        console.log(past_statements)
    }

 

    if(matchs.length == 0) return [ `${prev_statement} ${operation} ${next_statement}` ]

    for(let statement of past_statements){
        constraints.push( `${statement[0]} ${operation} ${statement[1]}` )
    }

    return constraints
}

export function gen_operation(op: string, cols: collumns, variables: Map<string,string[]>, prev_statement: string, next_statement: string){
    const indequality_ops= ["<",">","<=",">=","="]

    if (indequality_ops.includes(op)) return generate_inequality_operation(op, cols,prev_statement,next_statement).join("\n")

    if(op == "X") {
        const vars_cols = get_vars_cols(prev_statement)
        const is_var_prev_statement = vars_cols.reduce( (acc: boolean,curr: string) => variables.get(curr) != null || acc, false)
        
        console.log("CHECKING STATEMENTS")
        console.log(variables)
        console.log(vars_cols)
        console.log(is_var_prev_statement)
        console.log(prev_statement)
        console.log(next_statement)

        console.log()
        if(is_var_prev_statement)
            return generate_mul_operation(next_statement,prev_statement,cols)
        else
            return generate_mul_operation(prev_statement,next_statement,cols)
    }
    if(op == "+") return prev_statement + " + " + next_statement

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