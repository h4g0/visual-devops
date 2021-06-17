export type msymbol = {
    type: string,
    value: string | variable
}

export type formula = msymbol[]

export type my_variable = {
    name: string,
    formula: formula
}

export type my_variables = my_variable[]

export type variable = {
    name: string,
    index: string[],
}

export type variables = Map<[string,string[]],variable>

export type statement = {
    value: string,
    type: string 
}

export type expression = statement[]

export type expressions = expression[]

export type aux_variables =  Map<string, number>

export type collumn = string[]
export type collumns = Map<string, collumn>

/** 
export function execute_operation_col(operation: string,col: collumn): any  {
    
    switch(operation) {
    
        case 'Sum': 
        
        let aux_col: number[] = <number[]> col

        return aux_col.reduce((a:number, b:number) => a + b,0)   
        
        break;

        case "Len":

        return col.length

        break;
        
    }
}
**/

export function gen_permutations(cols: collumns,var_cols : string[]): string[][]{
    let perms: string[][] = []

    if (var_cols.length == 0) return perms
    
    let col_values: collumn = <collumn> cols.get(var_cols[0])
    
    if (var_cols.length == 1) {
        col_values.forEach((cv: string) => 
        {
            perms.push([cv])
        })
        return perms
    }


    let next_perms: string[][] = gen_permutations(cols, var_cols.slice(1))

    col_values.forEach(
        (cel : string) =>
            next_perms.forEach(
                (perm : string[]) => 
                {
                  let new_perm: string[]  = [...perm]
                  new_perm.unshift(cel)
                  perms.push(new_perm)
                }
            )
    )

    return perms
}

export function generate_mul_vars(cols: collumns, name: string, var_cols: string[]): variables{
    let aux_input_variables: variables = new Map<[string, string[]],variable>()   

    if (var_cols.length == 0) return aux_input_variables

    let perms: string[][] = gen_permutations(cols, var_cols)
    perms.forEach(
        (perm: string[]) => {
            aux_input_variables.set([name, perm], {name: name, index: perm} )
        }
    )
    
    return aux_input_variables
} 

export function generate_input_variable(cols: collumns, my_var: my_variable): variables {

    let name: string = my_var.name
    let formula: formula = my_var.formula

    var curr_vars:variables = new Map<[string,string[]],variable>()
    var operations: string[] = []
    var operating_cols: string[] = []

    formula.forEach(
        (ms: msymbol) => {

            switch(ms.type){

                case "Collumn":             
                
                var col_vars = cols.get(<string> ms.value)

                if(col_vars == undefined) {
                    
                    try {
                        throw new Error("Collumn " + ms.value + " is non existing");
                    }
                    catch(e) {
                        console.log(e);
                    }
                }
                
                operating_cols.push(<string> ms.value)

                break;

                case "Operation":
                    
                    var curr_operation = operations.length > 0 ? null : operations[operations.length - 1]
                    
                    switch(curr_operation){
                        
                        case "x":
                        
                        break;
                    }

                break;
            }
        }

    )
    
    return generate_mul_vars(cols , name , operating_cols)
}

export function generate_model_variables(cols: collumns, input_vars: string[]): variables {
    let model_variables: variables = new Map<[string,string[]],variable>()


    input_vars.forEach(
        (my_var_str: string) => {
            
            let equal_division:string[] = my_var_str.split(" = ")
            let var_name:string = equal_division[0]
            let var_value:string = equal_division[1]

            let mul_division:string[] = var_value.split(" x ")
            
            let form: formula = []

            for(let i: number = 0; i < mul_division.length; i++) {
                form.push({type: "Collumn", value: mul_division[i]})
                if(i < mul_division.length - 1)
                    form.push({type: "Operation",value: "x"})
            }
            
            let my_var : my_variable = { name: var_name, formula: form}
            
            let aux_model_variables: variables = generate_input_variable(cols, my_var)
            aux_model_variables.forEach(
                (value: variable,key: [string, string[]]) =>
                {
                    model_variables.set(key,value)
                }
            )
        }

    )
    
    return model_variables
}


export function gen_operation(cols: collumns, model_variables: variables,operation: string, forma: formula,formb: formula): formula {
    let new_form: formula = []
    
    forma.forEach((smb: msymbol) => new_form.push(smb))

    let new_entry: msymbol = {type: "Operation",value: operation}
    new_form.push(new_entry)

    formb.forEach((smb: msymbol) => new_form.push(smb))
    
    return new_form    
}

export function gen_forall(cols:collumns , col: string ,model_variables: variables, form: formula): formula[]  {
    
    let forms: formula[] = []
    
    let aux_val_cols = cols.get(col)
    
    if(aux_val_cols == undefined){
    
        try {
            throw new Error("Collumn " + col + " is non existing");
        }
        catch(e) {
            console.log(e);
        }
    }
   
    let val_cols: collumn = <collumn> aux_val_cols

    val_cols.forEach((cell: string) => 
    {
    let new_form: formula = [...form]
    new_form = new_form.map((a: msymbol) => a.value === col ? {type : a.type,value : cell} : a )
    //let new_form: string = form.replace("/[" + col + "]/g", "[" + cell + "]")
    forms.push(new_form)
    })
    
    return forms
}

export function gen_sum(cols:collumns , col: string ,model_variables: variables, form: formula): formula  {

let forms: formula = []

let aux_val_cols = cols.get(col)

if(aux_val_cols == undefined){

    try {
        throw new Error("Collumn " + col + " is non existing");
    }
    catch(e) {
        console.log(e);
    }
}

let val_cols: collumn = <collumn> aux_val_cols
let position: number = 0

val_cols.forEach((cell: string) => 
{
let new_form: formula = [...form]
new_form = new_form.map((a: msymbol) => (a.type == "Operation" && (<variable> a.value).index.includes(cell)) 
                                            ? {type : a.type,
                                                value : {name: (<variable> a.value).name, index: (<variable> a.value).index.map((b: string) => b === col  ? b : cell)} }
                                                : a)

//let new_form: string = form.replace("/[" + col + "]/g", "[" + cell + "]")
forms.push(...new_form)

if(position < col.length - 1)
    forms.push({type: "Operation" , value: "+"})
position++
})

return forms
}

export function gen_equals(cols:collumns , col: string ,model_variables: variables, form: formula): formula  {
    
    let forms: formula = [] 
    
    let aux_val_cols = cols.get(col)
    
    if(aux_val_cols == undefined){
    
        try {
            throw new Error("Collumn " + col + " is non existing");
        }
        catch(e) {
            console.log(e);
        }
    }
   
    let val_cols: collumn = <collumn> aux_val_cols
    let position: number = 0

    val_cols.forEach((cell: string) => 
    {
    let new_form: formula = [...form]
    new_form = new_form.map((a: msymbol) => ((a.type === "Variable" || a.type === "Collumn") && (<variable> a.value).index.includes(cell)) 
            ? {type : a.type,
            value : {name: (<variable> a.value).name, index: (<variable> a.value).index.map((b: string) => b === col  ? b : cell)} }
            : a)
    forms.push(...new_form)
 
    if(position < col.length - 1)
        forms.push({type: "Operation" , value: "="})
    position++
    })
    
    return forms
}


export function create_constraints(cols: collumns,my_constraints: string[]): string[] {
    let constraints: string[] = []

    
    return constraints
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

let model_variables: variables = generate_model_variables(model1_cols,input_vars)

export const variable_indexs: [string, string] = ["Cargo", "Compartment"]

export function stringify_variables(model_variables: variables): string {
    
    return Array.from(model_variables.keys()).map((element: any ,index: any) => {
        return "" + element[0] + element[1].map((e: any,i: any) => {
            return "[" + e + "]"
        }).join("")
    }).join("\n")

}

console.log(stringify_variables(model_variables))


/**
 * Constraints 
 **/

// FORALL( Cargo, SUM( Compartment,Cargo_quantity[Cargo][Compartment] ) <= Weight_capacity[Cargo]  )

// [FORALL, Cargo]([SUM, Compartment] Cargo_quantity[Cargo][Compartment] <= Weight_capacity[Cargo])

// [FORALL, Compartment]([SUM, Cargo] Cargo_quantity[Cargo][Compartment] <= Weight[Compartment])

// [FORALL, Compartment]([SUM, Cargo] Volume[Cargo]*Cargo_quantity[Cargo][Compartment] <= Space[Compartment])

// [EQUAL, Compartment]([SUM, Cargo] Volume[Cargo]  / Weight_capacity[Compartment] )

 /**
 * Objective 
 * 
 **/

// [SUM, Cargo] ([Sum, Compartment] Profit[Cargo]*Cargo_quantity[Cargo][Compartment])


let Cargo:string = "Cargo"
let Compartment:string = "Compartment"

/*
let sum_cargo: formula = gen_sum(cols,Compartment,model_variables,[ {type: "Variable",value: {name: "Cargo_quantity", index: ["Cargo","Compartment"]}}])
let operation_meq: formula = gen_operation(cols,model_variables,"<=",sum_cargo,[ {type: "Collumn", value: {name: "Weight_capacity",index: ["Cargo"]}}] )
let constr_1: formula[] = gen_forall( cols, Cargo, model_variables, operation_meq)


console.log(constr_1)

*/

export function get_index(col: string,index: Map<string,string>): string {
    return ( index.get(col) as string)
}


export function gen_sum_matrix(var_index: string, ): string {
    

    return sum

}

export function sum_matrix(varname: string,  fixed_index: string, variable_index: string[],position: string): string {
    var sum: string = ""
    
    for(var index of variable_index) {

        var first_index: string = position == "first" ? fixed_index : index
        var second_index: string = position == "second" ? index : fixed_index

        sum += ` ${varname}[${first_index}]{${second_index}]` 
    }

    return sum

}

export function forall_sum_matrix(varname: string, colname: string,forall_index: string[], sum_index: string[], position: string,opt: string,next_fun: string): string {
    var forall: string = ""

    for(var index of forall_index) {
        switch(next_fun){
            case "sum":
                forall += ` ${sum_matrix(varname,index,sum_index,position)} ${opt} ${colname}[${index}]\n}`;
                break;
            case "sum_mul":
                forall += ` ${sum_matrix(varname,index,sum_index,position)} ${opt} ${colname}[${index}]\n}`;
                break;
        }
            
    }

    return forall
    
}

export function gen_op(varname: string,  variable_indexs: [string,string],col: string, indexes: Map<string,string>, cols: collumns, op: string): string{
    
    const col_index: string[] = ( cols.get(( indexes.get(col) as string) ) as string[] )

    const forall_index: string = variable_indexs[0] == indexes.get(col) ? variable_indexs[0] : variable_indexs[1]
    const sum_index: string = variable_indexs[0] == indexes.get(col) ? variable_indexs[1] : variable_indexs[0]

    const position: string = variable_indexs[0] == indexes.get(col) ? "first" : "second"

    const forall_indexs: collumn = ( cols.get( forall_index ) as collumn)
    const sum_indexs: collumn = ( cols.get( sum_index) as collumn )

    return forall_sum_matrix(varname, col, forall_indexs, sum_indexs, position, op ,  "sum" )
    
}