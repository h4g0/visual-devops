import { constants } from "node-blockly"

export function find_errors_variables(variable: string,cols: Map<string,string[]>): string {
    
    if(cols.get(variable) != null) return `Error: a column with the name ${variable} already exists`
    
    if(variable.replace(/[ ]/g,"").length == 0) return "Error: empty variable name"

    return ""
}

function missing_inequation(constraint: string): boolean{
    const inequation = /(<=|>=)/g

    if(constraint.match(inequation) == null) return true

    return false
}

function has_nulls(constraint: string): boolean{
    const nulls = /null/g

    
    if(constraint.match(nulls) != null)  return true
    

    return false
}

function get_var(expr: string){
    const var_index = expr.split("[")

    return var_index[0]
}

function mult_has_var_multiplication(mult: string,variables: Map<string,string[]>): boolean {
    const var1_var2 = mult.split(" X ")

    const var1 = (var1_var2[0].split("["))[0]
    const var2 = (var1_var2[1].split("["))[0]

    if(variables.get(var1) != null && variables.get(var2) != null) return true

    return false

}

function var_multiplication(constraint: string,variables: Map<string,string[]>): string{
   
    const mults = constraint.match(/[a-zA-Z0-9\_]+(\[[a-zA-Z0-9\_]+\])* X [a-zA-Z0-9\_]+(\[[a-zA-Z0-9\_]+\])*/g) || []
        
    for(let mult of mults){
        if(mult_has_var_multiplication(mult,variables)) return `Error: Constraint has two variable multiplication in ${mult}`
    }        

    return ""
}

function single_value(constraint: string){
    const empty_indexes = /\[\]/g
    const raw_indexes = /index/g
    
    if( constraint.match(empty_indexes) != null) return true
    if( constraint.match(raw_indexes) != null) return true
    

    return false
}

function more_than_one_inequation(constraint: string):boolean{
    const inequation = /(<=|>=)/g

    if( (constraint.match(inequation) || []).length > 1) return true
    

    return false
}

export function find_errors_constraints(constraint: string,variables: Map<string,string[]>): string {
    const ineq =  missing_inequation(constraint)
    if(ineq) return "Error: Missing inequation in constraint"

    const more_than_one_ineq = more_than_one_inequation(constraint)
    if(more_than_one_ineq) return "Error: More than one inequation in constraint"

    const nulls = has_nulls(constraint)
    if(nulls) return "Error: Null values in expression"

    const has_var_multiplication = var_multiplication(constraint,variables)
    if(has_var_multiplication != "") return has_var_multiplication


    if(single_value(constraint)) return "Error: Empty fields"

    return ""
}



function existing_inequation(objective: string){
    return (objective.match(/(<=|>=)/g) == null) ? false : true
}

function each_use(objective: string){
    return (objective.match(/each/g) == null) ? false : true 
}

export function find_errors_objective(objective: string,variables: Map<string,string[]>): string {
    const ineq =  existing_inequation(objective)
    if(ineq) return "Error: Inequation in objective"

    const each_used = each_use(objective)
    if(each_used) return "Error: Each used in objective"

    const nulls = has_nulls(objective)
    if(nulls) return "Error: Has Null values in expression"

    const has_var_multiplication = var_multiplication(objective,variables)
    if(has_var_multiplication != "") return has_var_multiplication

    if(single_value(objective)) return "Error: Empty fields"

    return ""
}